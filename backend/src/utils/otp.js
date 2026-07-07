const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const getOTPExpiry = () => {
    return new Date(Date.now() + 10 * 60 * 1000);
};

module.exports = {
    generateOTP,
    getOTPExpiry,
};
