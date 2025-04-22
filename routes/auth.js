const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { username, password, phone } = req.body;
        
        // Validate input
        if (!username || !password || !phone) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const result = await db.query(
            "INSERT INTO users(username, password, phone) VALUES($1, $2, $3) RETURNING id", 
            [username, hashed, phone]
        );
        
        res.json({ success: true, id: result.rows[0].id });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            res.status(400).json({ error: "Username already exists" });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const result = await db.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const valid = await bcrypt.compare(password, result.rows[0].password);
        if (!valid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: result.rows[0].id },
            "3JwKQnX4O89pL2eqLXYM35WlJ-AzYOpNxn6X4JGCXq0",
            { expiresIn: "10h" }
        );

        res.json({ success: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
