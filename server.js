const express = require('express');
const path = require('path');
const app = express();

let tasks = [];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Add task
app.post('/api/tasks', (req, res) => {
  const task = { id: Date.now(), ...req.body };
  tasks.push(task);
  res.status(201).json(task);
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== +req.params.id);
  res.status(204).end();
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
