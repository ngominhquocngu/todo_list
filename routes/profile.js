// routes/profile.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

router.use(auth); // xác thực mọi route dưới đây

router.put('/username', async (req, res) => {
    const { newUsername } = req.body;
    try {
        await db.query("UPDATE users SET username=$1 WHERE id=$2", [newUsername, req.user.userId]);
        res.json({ success: true });
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ error: "Username already exists" });
        } else {
            res.status(500).json({ error: "Server error" });
        }
    }
});

router.put('/password', async (req, res) => {
    const { newPassword } = req.body;
    const hashed = await bcrypt.hash(newPassword, 10);
    try {
        await db.query("UPDATE users SET password=$1 WHERE id=$2", [hashed, req.user.userId]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/info', async (req, res) => {
    try {
        const result = await db.query("SELECT username FROM users WHERE id = $1", [req.user.userId]);
        res.json({ username: result.rows[0]?.username });
    } catch (err) {
        res.status(500).json({ error: 'Failed to load user info' });
    }
});

module.exports = router;
