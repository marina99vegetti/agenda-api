const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const FILE = 'tasks.json';

let tasks = [];

if (fs.existsSync(FILE)) {
    try {
        const data = fs.readFileSync(FILE, 'utf-8');
        tasks = data ? JSON.parse(data) : [];
    } catch (e) {
        tasks = [];
    }
}

function saveTasks() {
    fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2), 'utf-8');
}

// LISTAR
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// CRIAR (ESSA É A ÚNICA!)
app.post('/tasks', (req, res) => {
    try {
        console.log("BODY:", req.body);

        const newTask = {
            id: Date.now(),
            title: req.body.title,
            date: req.body.date,
            priority: req.body.priority || "normal",
            done: false
        };

        tasks.push(newTask);
        saveTasks();

        res.json(newTask);

    } catch (error) {
        console.error("ERRO REAL:", error); // AQUI
        res.status(500).json({ error: "Erro interno" });
    }
});

// TOGGLE
app.put('/tasks/:id', (req, res) => {
    tasks = tasks.map(task =>
        task.id == req.params.id ? { ...task, done: !task.done } : task
    );

    saveTasks();
    res.json({ ok: true });
});

// DELETE
app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(task => task.id != req.params.id);
    saveTasks();
    res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("rodando");
});