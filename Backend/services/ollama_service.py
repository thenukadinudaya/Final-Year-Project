import requests
import json

OLLAMA_URL = "http://localhost:11434/api/generate"

def extract_skills_from_text(profile_text):
    """
    Sends profile text to Ollama and extracts technical skills.
    """
    prompt = f"""
    Act as a professional career advisor. Extract a comma-separated list of technical skills from the following profile text. 
    Focus on programming languages, frameworks, tools, and platforms.
    Return ONLY the list of skills, nothing else.

    Text:
    {profile_text}
    """

    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=120)
        response.raise_for_status()
        
        result = response.json()
        raw_text = result.get("response", "").strip()
        
        if not raw_text:
            return None
            
        return raw_text
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to Ollama: {e}")
        return None

def generate_guidance_narrative(skills, roles):
    """
    Generates a professional summary/narrative for the guidance results.
    """
    roles_str = ", ".join([r['role'] for r in roles[:2]])
    skills_str = ", ".join(skills)

    prompt = f"""
    Act as a career coach. Based on these skills: {skills_str}, 
    and these top job matches: {roles_str}, 
    write a 2-3 sentence encouraging summary of the user's career path and what they should focus on next.
    Be professional and inspiring.
    """

    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    }

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=120)
        response.raise_for_status()
        return response.json().get("response", "").strip()
    except:
        return "You have a solid foundation! Focus on bridging your skill gaps to land your dream role."
