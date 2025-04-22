// middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = "3JwKQnX4O89pL2eqLXYM35WlJ-AzYOpNxn6X4JGCXq0"; // dùng .env là tốt nhất

function auth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { userId: decoded.userId }; // 👈 cực quan trọng
        next();
    } catch {
        res.sendStatus(401);
    }
}

module.exports = auth;
