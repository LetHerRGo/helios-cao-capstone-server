const verifyRole = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).send('Permission denied: You do not have the required role.');
        }
        next();
    }
}

export default verifyRole;