const nodemailer = require("nodemailer");

async function sendemail(to, subject, html) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMILSENDER,
            pass: process.env.EMAILPASSWORD,
        },
    });
    
    const info = await transporter.sendMail({
        from: `GreeNatik website <${process.env.EMILSENDER}>`,
        to,
        subject,
        html,
    });

    return info;
}

module.exports = sendemail;
