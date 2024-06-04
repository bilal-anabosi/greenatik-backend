const jwt = require('jsonwebtoken');
const userModel = require('../models/usermodel.js'); 


//اذا داخل اليوزر
function authenticateToken(req, res, next) {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith(process.env.BEARERTOKEN)) {
        return res.status(401).json({ message: "Invalid token" });
    }
    const token = authorization.split(process.env.BEARERTOKEN)[1];

    try {
        const decoded = jwt.verify(token, process.env.LOGINSIG);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports.authenticateToken = authenticateToken;


// authorizationMiddleware.js
//اذا اله صلاحيات
function authorizeRoles(accessRole) {
    return function(req, res, next) {
        const { user } = req;
        if (!user || !accessRole.includes(user.role)) {
            return res.status(403).json({ message: "Not authorized" });
        }
        next();
    };
}

module.exports.authorizeRoles = authorizeRoles;