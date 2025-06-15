#!/bin/sh

# Function to test if postgres is ready
postgres_ready() {
    python << END
import sys
import psycopg2
try:
    psycopg2.connect(
        dbname="sewalk",
        user="postgres",
        password="postgres-pw",
        host="db"
    )
except psycopg2.OperationalError:
    sys.exit(1)
sys.exit(0)
END
}

# Wait for postgres to become ready
until postgres_ready; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"

# Initialize the database
python init_db.py

# Start the application
uvicorn main:app --host 0.0.0.0 --port 8000 --reload