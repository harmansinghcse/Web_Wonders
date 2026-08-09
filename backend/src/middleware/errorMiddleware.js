const errorHandler = (err, req, res, next) => {
    console.error("SERVER ERROR:", err);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message,
    });
};

module.exports = errorHandler;

// improve later
