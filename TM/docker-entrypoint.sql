CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    status TEXT,
    embedding VECTOR(384)
);
