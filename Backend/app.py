from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os
import json
from dotenv import load_dotenv

from services.ollama_service import extract_skills_from_text, generate_guidance_narrative
from services.recommendation_service import get_job_matches, get_suggested_courses, get_all_courses
from utils.skill_cleaner import clean_skills

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/career_guidance')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key-change-me')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --- Models ---
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(20))
    qualifications = db.Column(db.Text)

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "age": self.age,
            "gender": self.gender,
            "qualifications": self.qualifications
        }

# --- Routes ---

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Email and password required"}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "User already exists"}), 400
    
    quals = data.get('qualifications')
    if quals and not isinstance(quals, str):
        quals = json.dumps(quals)

    new_user = User(
        email=data['email'],
        full_name=data.get('fullName') or data.get('full_name'),
        age=data.get('age'),
        gender=data.get('gender'),
        qualifications=quals
    )
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()

    access_token = create_access_token(identity=str(new_user.id))
    user_data = new_user.to_dict()
    user_data['access_token'] = access_token
    return jsonify({"message": "User registered successfully", "user": user_data}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"message": "Email and password required"}), 400
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=str(user.id))
        user_data = user.to_dict()
        user_data['access_token'] = access_token
        return jsonify({"message": "Login successful", "user": user_data}), 200
    return jsonify({"message": "Invalid email or password"}), 401

@app.route('/api/user/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if request.method == 'GET':
        return jsonify(user.to_dict()), 200
    
    data = request.get_json()
    user.full_name = data.get('full_name', user.full_name)
    user.age = data.get('age', user.age)
    user.gender = data.get('gender', user.gender)
    quals = data.get('qualifications')
    if quals is not None:
        user.qualifications = json.dumps(quals) if not isinstance(quals, str) else quals
    db.session.commit()
    return jsonify({"message": "Profile updated", "user": user.to_dict()}), 200

@app.route('/api/user/generate-guidance', methods=['POST'])
@jwt_required()
def generate_user_guidance():
    user_id = get_jwt_identity()
    user = db.session.get(User, int(user_id))
    if not user.qualifications:
        return jsonify({"error": "No qualifications found."}), 400
    
    try:
        quals = json.loads(user.qualifications) if isinstance(user.qualifications, str) else user.qualifications
        structured_skills = quals.get('all_skills', [])
        if structured_skills:
            cleaned_skills = clean_skills(", ".join(structured_skills))
            # Even with structured skills, we use Ollama to generate a narrative summary
            return perform_analysis_from_skills(cleaned_skills, user.full_name)
    except:
        pass
        
    formatted_text = format_qualifications_for_ai(user.qualifications)
    return perform_analysis(formatted_text, user.full_name)

def format_qualifications_for_ai(qual_data):
    if not qual_data: return ""
    try:
        data = json.loads(qual_data) if isinstance(qual_data, str) else qual_data
        parts = []
        for ed in data.get('education', []):
            parts.append(f"Education: {ed.get('level')}. Expertise in {', '.join(ed.get('skills', []))}.")
        for cert in data.get('certifications', []):
            parts.append(f"Certified in: {cert.get('name')} with focus on {cert.get('skill')}.")
        return " ".join(parts) if parts else str(qual_data)
    except:
        return str(qual_data)

@app.route('/api/analyze-profile', methods=['POST'])
def analyze_profile():
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({"error": "Missing 'text' in request body"}), 400
    return perform_analysis(data['text'])

def perform_analysis(text, user_name=None):
    # Extract skills using Ollama
    raw_skills = extract_skills_from_text(text)
    
    # If extraction fails, we return a friendly AI response instead of a 400 error
    if not raw_skills:
        return jsonify({
            "extracted_skills": [],
            "recommended_roles": [],
            "suggested_courses": [],
            "narrative": "I couldn't quite identify specific technical skills from your message. Could you please provide more details about your background, tools you've used, or certifications you've earned?"
        }), 200
    
    cleaned_user_skills = clean_skills(raw_skills)
    return perform_analysis_from_skills(cleaned_user_skills, user_name)

def perform_analysis_from_skills(skills_list, user_name=None):
    job_matches = get_job_matches(skills_list)
    top_gaps = []
    if job_matches:
        for match in job_matches[:2]:
            top_gaps.extend(match['skill_gaps'])
    suggested_courses = get_suggested_courses(top_gaps)

    # Generate a personalized narrative using Ollama
    narrative = generate_guidance_narrative(skills_list, job_matches)
    if user_name:
        narrative = f"Hello {user_name}! {narrative}"

    return jsonify({
        "extracted_skills": skills_list,
        "recommended_roles": job_matches,
        "suggested_courses": suggested_courses,
        "narrative": narrative
    }), 200

@app.route('/api/match-jobs', methods=['POST'])
def match_jobs():
    data = request.get_json()
    if not data or 'skills' not in data:
        return jsonify({"error": "Missing 'skills' in request body"}), 400
    user_skills = clean_skills(data['skills'])
    job_matches = get_job_matches(user_skills)
    return jsonify(job_matches), 200

@app.route('/api/courses', methods=['GET'])
def get_courses():
    return jsonify(get_all_courses()), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    print("AI Career Guidance Backend starting...")
    app.run(host='0.0.0.0', port=5000, debug=True)
