// JSON web token
const jwt = require("jsonwebtoken");

module.exports = function (req, resp, next) {
    // Try to parse username from JSON web token
    try {
        const token = req.cookies.authorisationToken;
        req.user = jwt.verify(token, process.env.JWT_KEY);
        next();
    }
    
    // Notify user of authorisation error
    catch (error) {
        resp.status(401).json("Authorisation error");
    }
};