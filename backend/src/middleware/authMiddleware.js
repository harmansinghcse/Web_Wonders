const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    console.log("Cookies:", req.cookies);

    const token = req.cookies.token;

    console.log("Token:", token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorised",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded:", decoded);

        req.user = decoded;

        next();
    } catch (error) {
        console.log(error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access Denied",
            });
        }

        next();
    };
};

module.exports = {
    protect,
    authorize,
};
