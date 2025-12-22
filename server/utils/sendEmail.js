const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Built-in service for Gmail
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'FoodForAll'} <${process.env.FROM_EMAIL || 'no-reply@foodforall.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    try {
        if (process.env.NODE_ENV === 'development') {
            console.log('--- MOCK EMAIL SEND ---');
            console.log(`To: ${options.email}`);
            console.log(`Subject: ${options.subject}`);
            console.log(`Message: ${options.message}`);
            console.log('-----------------------');
            return;
        }
        await transporter.sendMail(message);
    } catch (error) {
        console.error('Email send failed:', error);
        // Don't throw logic error, just log it.
    }
};

module.exports = sendEmail;
