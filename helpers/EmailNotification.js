const nodeMailer = require('nodemailer');
// const HBS = require('nodemailer-express-handlebars');

const MailConfig = require('../configs/Mail');
const CONFIGS = require('../configs/config');

const mailProvider = MailConfig.provider;

let mailTransPorter = {};
mailTransPorter = {
    // sendmail: true,
    // newline: MailConfig.sendMailNewline,
    // path: MailConfig.sendMailPath

    host: MailConfig.hostName,
    port: MailConfig.port, // Port number for your mail server (usually 587 for TLS, 465 for SSL, or 25 for non-encrypted)
    secure: MailConfig.isSecure, // Set to true if you are using SSL
    auth: {
        user: MailConfig.username, // Your email address
        pass: MailConfig.password // Your email password
    },
    timeout: 10000
};

let transporter = nodeMailer.createTransport(mailTransPorter);

const options = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: './views/emails',
        layoutsDir: './views/emails',
        defaultLayout: 'layout.hbs',
    },
    viewPath: './views/emails',
    extName: '.hbs'
};

function sendMail(subject, template, mailContent) {
    return new Promise(function (resolve, reject) {
        transporter.use('compile', HBS(options));

        transporter.sendMail({
            from: MailConfig.fromEmail,
            to: MailConfig.adminEmail,
            subject: subject,
            // text: "Test mail."
            template: template,
            context: mailContent
        }).then(response => {
            resolve(response);
        }).catch(err => {
            reject(err);
        });
    });
}

let mailCall = {
    testMail: async (email) => {
        try {
            let mailContent = {
                APP_NAME: CONFIGS.APP_NAME,
                APP_URL: CONFIGS.BASE_URL,
                SUPPORT_EMAIL: CONFIGS.SUPPORT_EMAIL,
            };

            await sendMail(MailConfig.userInquiry, 'temp', mailContent)
                .then(response => {
                    console.log('test mail success');
                }).catch(err => {
                    console.log('test mail error : ', err);
                });
        } catch (e) {
            console.log('test mail : ', e);
        }
    },
};

module.exports = mailCall;
