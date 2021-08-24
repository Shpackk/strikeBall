const nodemailer = require("nodemailer");

async function sandMail(email, topic, description) {
    const msg = generateMessage(topic, description)

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAILER_ACCOUNT,
            pass: process.env.MAILER_PASS,
        },
    });

    const info = await transporter.sendMail({
        from: '"StrikeBall Team" <foo@example.com>', // sender address
        to: email, // list of receivers
        subject: topic, // Subject line
        html: msg, // plain text body
    });
    if (process.env.NODE_ENV !== 'test') {
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
}

function generateMessage(topic, description) {
    if (topic == 'ban') {
        return `We're sorry. You have been banned due to ${description}`
    }
    if (topic == "unban") {
        return `Dear player! Your account has been unbanned due to ${description}`
    }
    if (topic == "TeamLeave") {
        if (description == true) {
            return `Dear player! You sucessfully left your team`
        } else {
            return `Dear player! Sorry but we declined your request to leave`
        }
    }
    if (topic == "TeamJoin") {
        if (description == true) {
            return `Dear player, You joined a new team! Good Luck and Have Fun!`
        }
        if (description == false) {
            return `Dear player, we're sorry but your request to join team was declined :(`
        }
    }
    if (topic == "Kicked from Team") {
        return `Dear player, we're sorry but you we're kicked from team due to ${description}`
    }
    if (topic == "Password Reset") {
        return `Follow this link to reset your password - ${description}`
    }
    if (topic == "Registration") {
        const msg = description ? "Your registration was approved" : "Your registration was declined"
        return msg
    }
}



module.exports = { sandMail }


