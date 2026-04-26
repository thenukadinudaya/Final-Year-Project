import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect

load_dotenv()
db_url = os.getenv('DATABASE_URL')
print(f"Checking Database: {db_url}")

try:
    engine = create_engine(db_url)
    inspector = inspect(engine)
    columns = [c['name'] for c in inspector.get_columns('users')]
    print(f"Columns in 'users' table: {columns}")
except Exception as e:
    print(f"Error: {e}")
