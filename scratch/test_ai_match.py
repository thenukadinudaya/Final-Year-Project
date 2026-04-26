import requests
import json

skills = "android development, c++, java, javascript, mysql, numpy, pandas, php, postgresql, python"
prompt = f"""
Analyze the following technical skills: {skills}

Suggest the top 3 most relevant job roles for this person.
For each role, provide:
1. Role title
2. Match percentage (0-100)
3. List of matched skills
4. List of skill gaps

IMPORTANT: Return the response as a VALID JSON array of objects. 
Format:
[
  {{
    "role": "Role Name",
    "match_percentage": 85,
    "matched_skills": ["skill1", "skill2"],
    "skill_gaps": ["skill3", "skill4"]
  }}
]
Do not include any other text in your response.
"""

payload = {
    "model": "mistral",
    "prompt": prompt,
    "stream": False
}

try:
    print("Connecting to Ollama...")
    response = requests.post("http://localhost:11434/api/generate", json=payload, timeout=180)
    response.raise_for_status()
    print("\n--- AI OUTPUT ---")
    print(response.json().get("response", ""))
    print("-----------------\n")
except Exception as e:
    print(f"Error: {e}")
