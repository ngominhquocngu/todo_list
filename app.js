const express = require('express');
require('dotenv').config();
const path = require('path');
const app = express();


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'null');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(403);
    }
    next();
});

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const profileRoutes = require('./routes/profile');

// Add middleware to handle text/plain as JSON
app.use((req, res, next) => {
    if (req.headers['content-type'] === 'text/plain') {
        let data = '';
        req.setEncoding('utf8');
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            try {
                req.body = JSON.parse(data);
                next();
            } catch(e) {
                res.status(400).send('Invalid JSON');
            }
        });
    } else {
        next();
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, 'public')));

// Add root route handler
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);
app.use('/profile', profileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
