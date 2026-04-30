import requests
import json
import re
import os

OLLAMA_URL = "http://localhost:11434/api/generate"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def call_ai(prompt, temperature=0.3, max_tokens=300):
    """
    Sends the prompt to Groq API if a key exists, otherwise falls back to local Ollama.
    """
    groq_api_key = os.getenv("GROQ_API_KEY")

    if groq_api_key:
        # Use Groq Cloud API (Extremely Fast & Cloud Compatible)
        headers = {
            "Authorization": f"Bearer {groq_api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama3-8b-8192", # Free and very fast model
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        try:
            print("DEBUG: Sending request to Groq API...")
            response = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=60)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"].strip()
        except Exception as e:
            print(f"Groq API Error: {e}")
            return None
    else:
        # Fallback to local Ollama (Mistral)
        payload = {
            "model": "mistral",
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature,
                "num_predict": max_tokens
            }
        }
        try:
            print("DEBUG: Sending request to local Ollama...")
            response = requests.post(OLLAMA_URL, json=payload, timeout=300)
            response.raise_for_status()
            return response.json().get("response", "").strip()
        except Exception as e:
            print(f"Ollama API Error: {e}")
            return None

def extract_skills_from_text(profile_text):
    prompt = f"List ONLY the technical skills found in this text as a comma-separated list: {profile_text}"
    return call_ai(prompt, temperature=0.1, max_tokens=150)

def get_ai_job_matches(skills_list):
    skills_str = ", ".join(skills_list)
    user_skills_lower = set(s.lower().strip() for s in skills_list)
    
    prompt = f"""
    User Skills: {skills_str}
    
    Task: Suggest the top 2 job roles. 
    For GAPS, identify NEW technologies or tools NOT in the user's list that are essential for the role.
    
    Format exactly like this for each:
    ROLE: [Title] | MATCH: [Percentage] | MATCHED: [Skills from user list] | GAPS: [NEW skills to learn]
    """

    raw_text = call_ai(prompt, temperature=0.3, max_tokens=400)
    if not raw_text:
        return None

    try:
        print(f"DEBUG: AI Response received. Parsing...")
        clean_text = raw_text.replace("\n", " ").replace("  ", " ")
        results = []
        blocks = re.split(r"(?=ROLE:)", clean_text, flags=re.I)
        
        for block in blocks:
            if "ROLE:" not in block.upper(): continue
            
            try:
                role_match = re.search(r"ROLE:\s*(.*?)\s*\|", block, re.I)
                perc_match = re.search(r"MATCH:\s*(\d+)", block, re.I)
                
                matched_str = ""
                gaps_str = ""
                
                m_search = re.search(r"MATCHED:\s*(.*?)\s*\|", block, re.I)
                if m_search:
                    matched_str = m_search.group(1).replace("[", "").replace("]", "")
                
                g_search = re.search(r"GAPS:\s*(.*)", block, re.I)
                if g_search:
                    gaps_str = g_search.group(1).split("Note:")[0].split(".")[0].replace("[", "").replace("]", "")

                if role_match and perc_match:
                    raw_gaps = [s.strip() for s in gaps_str.split(",") if s.strip()]
                    filtered_gaps = [g for g in raw_gaps if g.lower() not in user_skills_lower]

                    results.append({
                        "role": role_match.group(1).strip(),
                        "match_percentage": int(perc_match.group(1)),
                        "matched_skills": [s.strip() for s in matched_str.split(",") if s.strip()],
                        "skill_gaps": filtered_gaps
                    })
            except Exception as e:
                print(f"DEBUG: Parsing block error: {e}")
                continue
        
        return results if results else None
    except Exception as e:
        print(f"AI Match Error: {e}")
        return None

def generate_guidance_narrative(skills, roles):
    roles_str = ", ".join([r.get('role', 'Unknown') for r in (roles or [])[:2]])
    skills_str = ", ".join(skills)

    prompt = f"As a career coach, write 2-3 sentences for a user with these skills: {skills_str} and matches: {roles_str}. Be specific and encouraging."
    
    narrative = call_ai(prompt, temperature=0.5, max_tokens=150)
    return narrative if narrative else "You have a great start! Bridge these gaps to become a top-tier professional."
