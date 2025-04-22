const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        const result = await db.query("INSERT INTO users(username, password) VALUES($1, $2) RETURNING id", [username, hashed]);
        res.json({ id: result.rows[0].id });
    } catch (err) {
        res.status(400).json({ error: "Username already exists" });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await db.query("SELECT * FROM users WHERE username=$1", [username]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, result.rows[0].password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: result.rows[0].id }, "3JwKQnX4O89pL2eqLXYM35WlJ-AzYOpNxn6X4JGCXq0", { expiresIn: "10h" });
    res.json({ token });
});

module.exports = router;
