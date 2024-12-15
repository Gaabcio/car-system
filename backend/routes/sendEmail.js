const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Możesz użyć innego dostawcy, np. 'hotmail', 'yahoo', itp.
    auth: {
        user: 'gabol5217@gmail.com', // Twój email
        pass: 'ffjjwdatfywggqtn' // Twoje hasło
    }
});

const sendEmail = (to, subject, text, newPassword) => {
    const mailOptions = {
        from: 'gabol5217@gmail.com',
        to: to,
        subject: subject,
        text: `${text}\n\nTwoje nowe hasło: ${newPassword}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};

module.exports = sendEmail;