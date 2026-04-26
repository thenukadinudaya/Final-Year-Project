import requests
import json
import re

OLLAMA_URL = "http://localhost:11434/api/generate"

def extract_skills_from_text(profile_text):
    """
    Sends profile text to Ollama and extracts technical skills.
    """
    prompt = f"List ONLY the technical skills found in this text as a comma-separated list: {profile_text}"
    payload = {"model": "mistral", "prompt": prompt, "stream": False}

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=120)
        return response.json().get("response", "").strip()
    except:
        return None

def get_ai_job_matches(skills_list):
    """
    ROBUST VERSION: Handles AI formatting variations and multi-line responses.
    """
    skills_str = ", ".join(skills_list)
    
    prompt = f"""
    Analyze these skills: {skills_str}
    Suggest the top 2 job roles. Format exactly like this for each:
    ROLE: [Title] | MATCH: [Percentage] | MATCHED: [Skills] | GAPS: [Skills]
    """

    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 300 
        }
    }

    try:
        print("DEBUG: Sending AI request...")
        response = requests.post(OLLAMA_URL, json=payload, timeout=300)
        response.raise_for_status()
        raw_text = response.json().get("response", "").strip()
        print(f"DEBUG: AI responded. Parsing results...")

        # 1. Clean up multi-line formatting (combine wrapped lines)
        clean_text = raw_text.replace("\n", " ").replace("  ", " ")
        
        # 2. Find all "ROLE:" blocks
        results = []
        # Split by "ROLE:" but keep the delimiter
        blocks = re.split(r"(?=ROLE:)", clean_text, flags=re.I)
        
        for block in blocks:
            if "ROLE:" not in block.upper(): continue
            
            try:
                # Use flexible regex that doesn't strictly require brackets
                role_match = re.search(r"ROLE:\s*(.*?)\s*\|", block, re.I)
                perc_match = re.search(r"MATCH:\s*(\d+)", block, re.I)
                
                # Extract skills by looking between delimiters
                # We handle both "MATCHED: [a, b]" and "MATCHED: a, b"
                matched_str = ""
                gaps_str = ""
                
                m_search = re.search(r"MATCHED:\s*(.*?)\s*\|", block, re.I)
                if m_search:
                    matched_str = m_search.group(1).replace("[", "").replace("]", "")
                
                g_search = re.search(r"GAPS:\s*(.*)", block, re.I)
                if g_search:
                    # Clean up the end of the string (remove AI notes)
                    gaps_str = g_search.group(1).split("Note:")[0].split(".")[0].replace("[", "").replace("]", "")

                if role_match and perc_match:
                    results.append({
                        "role": role_match.group(1).strip(),
                        "match_percentage": int(perc_match.group(1)),
                        "matched_skills": [s.strip() for s in matched_str.split(",") if s.strip()],
                        "skill_gaps": [s.strip() for s in gaps_str.split(",") if s.strip()]
                    })
            except Exception as e:
                print(f"DEBUG: Parsing block error: {e}")
                continue
        
        return results if results else None
    except Exception as e:
        print(f"AI Match Error: {e}")
        return None

def generate_guidance_narrative(skills, roles):
    """
    Generates a professional summary/narrative.
    """
    roles_str = ", ".join([r.get('role', 'Unknown') for r in (roles or [])[:2]])
    skills_str = ", ".join(skills)

    prompt = f"As a career coach, write 2 sentences for a user with these skills: {skills_str} and matches: {roles_str}."
    payload = {"model": "mistral", "prompt": prompt, "stream": False, "options": {"num_predict": 100}}

    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=120)
        return response.json().get("response", "").strip()
    except:
        return "Keep going! You're on the right track."
