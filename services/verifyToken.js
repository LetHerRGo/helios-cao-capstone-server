import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Token is required for authentication.');
    }
    jwt.verify(token, 'your_jwt_secret', (err, decoded)=> {
        if (err) {
            return res.status(401).send('Invalid or expired token.');
        }
        req.user = decoded;
        next();
    })
}

export default verifyToken;