def clean_skills(skills_input):
    """
    Cleans and normalizes a list or string of skills.
    - If input is a string, splits by comma.
    - Lowercases all items.
    - Removes whitespace.
    - Removes duplicates.
    """
    if isinstance(skills_input, str):
        # Split by comma if it's a string
        raw_skills = [s.strip() for s in skills_input.split(',')]
    elif isinstance(skills_input, list):
        raw_skills = [str(s).strip() for s in skills_input]
    else:
        return []

    # Filter out empty strings, lowercase, and unique
    cleaned = sorted(list(set(s.lower() for s in raw_skills if s.strip())))
    return cleaned
