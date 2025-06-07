from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from sentence_transformers import SentenceTransformer

app = Flask(__name__)
CORS(app)

# Vector model
model = SentenceTransformer('all-MiniLM-L6-v2')

# PostgreSQL Connection
conn = psycopg2.connect(
    dbname="tasks",
    user="postgres",
    password="postgres",
    host="db",
    port="5432"
)
cur = conn.cursor()

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    cur.execute("SELECT id, title, description, status FROM tasks")
    return jsonify(cur.fetchall())

@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.json
    embedding = model.encode(data['description']).tolist()
    cur.execute("""
        INSERT INTO tasks (title, description, status, embedding)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    """, (data['title'], data['description'], data['status'], embedding))
    conn.commit()
    return get_tasks()

@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    cur.execute("DELETE FROM tasks WHERE id = %s", (id,))
    conn.commit()
    return get_tasks()

@app.route('/api/search', methods=['POST'])
def vector_search():
    query = request.json.get('query')
    query_embedding = model.encode(query).tolist()
    cur.execute("""
        SELECT id, title, description, status
        FROM tasks
        ORDER BY embedding <-> %s
        LIMIT 3
    """, (query_embedding,))
    return jsonify(cur.fetchall())
