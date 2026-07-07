const nodemailer = require("nodemailer");

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"Jurassic Explorer 🦖" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "🦖 Verify Your Jurassic Explorer Account",

        text: `Welcome to Jurassic Explorer!

Your OTP is: ${otp}

This code expires in 10 minutes.

If you didn't request this, simply ignore this email.`,

        html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8" />
    </head>

    <body style="
        margin:0;
        padding:40px 0;
        background:#f5f3ea;
        font-family:Arial, Helvetica, sans-serif;
    ">

        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center">

                    <table
                        width="600"
                        cellpadding="0"
                        cellspacing="0"
                        style="
                            background:#ffffff;
                            border-radius:20px;
                            overflow:hidden;
                            box-shadow:0 10px 30px rgba(0,0,0,.15);
                        "
                    >

                        <!-- Header -->
                        <tr>
                            <td
                                align="center"
                                style="
                                    background:#264328;
                                    padding:40px;
                                    color:white;
                                "
                            >

                                <div style="font-size:60px;">
                                    🦖
                                </div>

                                <h1 style="
                                    margin:15px 0 5px;
                                    font-size:34px;
                                    color:#d8d19c;
                                ">
                                    Jurassic Explorer
                                </h1>

                                <p style="
                                    color:#d8d19c;
                                    margin:0;
                                    font-size:16px;
                                ">
                                    Journey Back in Time
                                </p>

                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td
                                style="
                                    padding:45px;
                                    color:#333333;
                                    text-align:center;
                                "
                            >

                                <h2 style="
                                    margin-top:0;
                                    font-size:28px;
                                ">
                                    Verify Your Email
                                </h2>

                                <p style="
                                    font-size:17px;
                                    color:#666;
                                    line-height:1.8;
                                ">
                                    Welcome, Explorer!
                                    <br><br>
                                    Your account is almost ready.
                                    Enter the verification code below to
                                    begin your journey into the prehistoric world.
                                </p>

                                <!-- OTP BOX -->
                                <div style="
                                    margin:40px auto;
                                    background:#f7f3e6;
                                    border:2px dashed #b98b43;
                                    border-radius:18px;
                                    padding:25px;
                                    width:300px;
                                ">

                                    <p style="
                                        margin:0;
                                        color:#666;
                                        font-size:14px;
                                        letter-spacing:2px;
                                    ">
                                        YOUR OTP
                                    </p>

                                    <div style="
                                        margin-top:15px;
                                        font-size:42px;
                                        letter-spacing:12px;
                                        font-weight:bold;
                                        color:#264328;
                                    ">
                                        ${otp}
                                    </div>

                                </div>

                                <p style="
                                    color:#777;
                                    font-size:15px;
                                ">
                                    ⏳ This code expires in
                                    <strong>10 minutes</strong>.
                                </p>

                            </td>
                        </tr>

                        <!-- Divider -->
                        <tr>
                            <td>
                                <hr style="
                                    border:none;
                                    border-top:1px solid #ececec;
                                ">
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td
                                style="
                                    padding:30px;
                                    text-align:center;
                                    color:#888;
                                    font-size:14px;
                                    line-height:1.7;
                                "
                            >

                                If you didn't create a Jurassic Explorer account,
                                you can safely ignore this email.

                                <br><br>

                                <strong style="color:#264328;">
                                    Jurassic Explorer
                                </strong>

                                <br>

                                Discover • Learn • Explore

                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info);
    } catch (error) {
        console.error("Email Error:", error);
        throw error;
    }
};

module.exports = { sendOTPEmail };
