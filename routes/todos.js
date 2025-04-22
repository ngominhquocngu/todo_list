const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.post('/', async (req, res) => {
    // Convert form values to correct types
    const title = req.body.title;
    const content = req.body.content;
    const user_id = parseInt(req.body.user_id);

    try {
        const result = await db.query(
            "INSERT INTO todos(user_id, title, content) VALUES($1, $2, $3) RETURNING *",
            [user_id, title, content]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/', auth, async (req, res) => {
    const result = await db.query(
        "SELECT * FROM todos WHERE user_id=$1 ORDER BY id DESC LIMIT 3",
        [req.user.userId]
    );
    res.json(result.rows);
});

router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    await db.query("DELETE FROM todos WHERE id=$1 AND user_id=$2", [id, req.user.userId]);
    res.json({ success: true });
});

module.exports = router;
