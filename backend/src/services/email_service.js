const sendOTPEmail = async (email, otp) => {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
            sender: {
                name: "Jurassic Explorer 🦖",
                email: process.env.SENDER_EMAIL,
            },

            to: [
                {
                    email,
                },
            ],

            subject: "🦖 Verify Your Jurassic Explorer Account",

            textContent: `Welcome to Jurassic Explorer!

Your OTP is: ${otp}

This code expires in 10 minutes.

If you didn't request this email, simply ignore it.`,

            htmlContent: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:40px 0;background:#f5f3ea;font-family:Arial,sans-serif;">

<table width="100%">
<tr>
<td align="center">

<table
width="600"
style="background:white;border-radius:20px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.15);">

<tr>
<td align="center"
style="background:#264328;padding:40px;color:white;">

<div style="font-size:60px;">🦖</div>

<h1 style="margin:15px 0 5px;color:#d8d19c;">
Jurassic Explorer
</h1>

<p style="color:#d8d19c;">
Journey Back in Time
</p>

</td>
</tr>

<tr>
<td style="padding:45px;text-align:center;">

<h2>Verify Your Email</h2>

<p>
Welcome, Explorer!
<br><br>
Your account is almost ready.
</p>

<div
style="margin:40px auto;background:#f7f3e6;border:2px dashed #b98b43;border-radius:18px;padding:25px;width:300px;">

<p style="margin:0;">YOUR OTP</p>

<div
style="margin-top:15px;font-size:42px;font-weight:bold;letter-spacing:12px;color:#264328;">
${otp}
</div>

</div>

<p>
This OTP expires in <b>10 minutes</b>.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error(data);
        throw new Error(data.message || "Failed to send email");
    }

    console.log("✅ Email sent successfully");
};

module.exports = { sendOTPEmail };
