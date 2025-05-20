export function authenticateToken(req, res, next) {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Authentication token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user_id = decoded.user_id;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}