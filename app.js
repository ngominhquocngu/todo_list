const express = require('express');
require('dotenv').config();
const path = require('path');
const app = express();

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const profileRoutes = require('./routes/profile');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // <-- phục vụ HTML

// API
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);
app.use('/profile', profileRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
