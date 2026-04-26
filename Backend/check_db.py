from app import app, db, User
import json

with app.app_context():
    users = User.query.all()
    print(f"Total users: {len(users)}")
    for user in users:
        print(f"ID: {user.id}, Email: {user.email}, Full Name: {user.full_name}")
        print(f"Qualifications (Raw): {user.qualifications}")
        try:
            if user.qualifications:
                quals = json.loads(user.qualifications)
                print(f"Qualifications (Parsed): {quals}")
            else:
                print("Qualifications: None")
        except Exception as e:
            print(f"Qualifications (Parse Error): {e}")
        print("-" * 20)
