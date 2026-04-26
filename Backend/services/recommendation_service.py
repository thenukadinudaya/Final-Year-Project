import json

# Predefined job roles and required skills
JOB_ROLES = [
    {
        "role": "Frontend Developer",
        "skills": ["react", "javascript", "css", "html", "typescript", "tailwind"]
    },
    {
        "role": "Backend Developer",
        "skills": ["python", "django", "sql", "flask", "postgresql", "docker", "rest api"]
    },
    {
        "role": "Data Analyst",
        "skills": ["python", "sql", "excel", "pandas", "tableau", "statistics"]
    },
    {
        "role": "DevOps Engineer",
        "skills": ["docker", "kubernetes", "aws", "linux", "jenkins", "terraform", "bash"]
    },
    {
        "role": "Full Stack Developer",
        "skills": ["react", "python", "javascript", "sql", "git", "rest api", "css"]
    }
]

# Mock course data
COURSES = {
    "react": "React for Beginners - Coursera",
    "javascript": "Modern JavaScript Mastery - Udemy",
    "python": "Python Data Science Handbook - O'Reilly",
    "django": "Django for Professionals - TestDriven.io",
    "sql": "SQL for Data Science - edX",
    "docker": "Docker Mastery - Udemy",
    "kubernetes": "Certified Kubernetes Administrator (CKA) - Linux Foundation",
    "aws": "AWS Certified Solutions Architect - A Cloud Guru",
    "pandas": "Data Analysis with Pandas - Kaggle",
    "tableau": "Tableau Desktop Specialist - Tableau",
    "typescript": "TypeScript Deep Dive - GitBook",
    "tailwind": "Tailwind CSS from Scratch - Brad Traversy",
    "git": "Git Fundamentals - Pluralsight",
    "rest api": "Designing RESTful APIs - LinkedIn Learning"
}

def get_job_matches(user_skills):
    """
    Compares user skills against job roles and calculates match %.
    Identifies skill gaps.
    """
    matches = []
    user_skills_set = set(user_skills)

    for job in JOB_ROLES:
        role_skills_set = set(job["skills"])
        
        # Intersection of user skills and role skills
        matched_skills = user_skills_set.intersection(role_skills_set)
        
        # Difference: skills required but not in user profile
        gaps = list(role_skills_set - user_skills_set)
        
        match_percentage = (len(matched_skills) / len(job["skills"])) * 100 if job["skills"] else 0
        
        matches.append({
            "role": job["role"],
            "match_percentage": round(match_percentage, 2),
            "matched_skills": list(matched_skills),
            "skill_gaps": gaps
        })
    
    # Sort matches by percentage descending
    matches.sort(key=lambda x: x["match_percentage"], reverse=True)
    return matches

def get_suggested_courses(all_gaps):
    """
    Provides course recommendations for a list of missing skills.
    """
    unique_gaps = list(set(all_gaps))
    recommendations = []
    
    for skill in unique_gaps:
        course = COURSES.get(skill)
        if course:
            recommendations.append({
                "skill": skill,
                "course": course
            })
        else:
            recommendations.append({
                "skill": skill,
                "course": "Search for courses on Coursera or Udemy"
            })
            
    return recommendations

def get_all_courses():
    """Returns the full list of mock courses."""
    return [{"skill": s, "course": c} for s, c in COURSES.items()]
