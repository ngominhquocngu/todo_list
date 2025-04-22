// routes/todos.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/', async (req, res) => {
    const { title, content } = req.body;
    const result = await db.query(
        "INSERT INTO todos(user_id, title, content) VALUES($1, $2, $3) RETURNING *",
        [req.user.userId, title, content]
    );
    res.json(result.rows[0]);
});

router.get('/', async (req, res) => {
    const result = await db.query(
        "SELECT * FROM todos WHERE user_id=$1",
        [req.user.userId]
    );
    res.json(result.rows);
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await db.query("DELETE FROM todos WHERE id=$1 AND user_id=$2", [id, req.user.userId]);
    res.json({ success: true });
});

module.exports = router;
