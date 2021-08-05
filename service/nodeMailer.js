const nodemailer = require("nodemailer");

async function sandMail(email, topic, message) {

    //--------- Generate test SMTP service account from ethereal.email
    // const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAILER_ACCOUNT,
            pass: process.env.MAILER_PASS,
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"StrikeBall Team" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: topic, // Subject line
        text: message, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = { sandMail }
