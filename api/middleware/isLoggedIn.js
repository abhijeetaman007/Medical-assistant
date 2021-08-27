const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
    const token = req.header("x-auth-token");
    // console.log("inside middleweare islogged in token:" + token);
    if (!token) {
        return res.status(401).json({
            success: false,
            msg: "No token found. Please log in again.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({
            success: false,
            msg: "Token is not valid. Please log in again.",
        });
    }
};
