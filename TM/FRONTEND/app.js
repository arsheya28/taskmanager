import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");

  const loadTasks = async () => {
    const cached = localStorage.getItem('tasks');
    if (cached) {
      setTasks(JSON.parse(cached));
    } else {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
      localStorage.setItem('tasks', JSON.stringify(data));
    }
  };

  const addTask = async (task) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    const updated = await res.json();
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  const deleteTask = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const updated = await res.json();
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  const searchTasks = async () => {
    const res = await fetch('http://localhost:5000/api/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const results = await res.json();
    setTasks(results);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      <h1>Task Manager</h1>
      <input placeholder="Search" onChange={e => setQuery(e.target.value)} />
      <button onClick={searchTasks}>Search Similar</button>
      <ul>
        {tasks.map(([id, title, desc, status]) => (
          <li key={id}>
            <strong>{title}</strong> - {desc} ({status})
            <button onClick={() => deleteTask(id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default App;
