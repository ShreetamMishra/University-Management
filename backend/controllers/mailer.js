import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import ENV from '../config.js';


// https://ethereal.email/create
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shreetammishra01@gmail.com',
        pass: 'rsfghymlzapvfbyh'
    }
});

let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "example123",
  "userEmail" : "admin123",
  "text" : "",
  "subject" : "",
}
*/
export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    // body of the email
    var email = {
        body : {
            name: username,
            intro : text || 'Welcome to Daily Tuition! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from : ENV.EMAIL,
        to: userEmail,
        subject : subject || "Signup Successful",
        html : emailBody
    }

    // send mail
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ msg: "You should receive an email from us."})
        })
        .catch(error => res.status(500).send({ error }))

}


// import nodemailer from 'nodemailer';
// import Mailgen from 'mailgen';
// import ENV from '../config.js';
// import otpGenerator from 'otp-generator';

// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'shreetammishra01@gmail.com',
//         pass: 'rsfghymlzapvfbyh'
//     }
// });


// let MailGenerator = new Mailgen({
//     theme: 'default',
//     product: {
//         name: 'Mailgen',
//         link: 'https://mailgen.js/'
//     }
// });

// export const registerMail = async (mailOptions) => {
//     const { username, userEmail, subject, otp } = mailOptions;

//     // Body of the email using Mailgen
//     const email = {
//         body: {
//             name: username,
//             intro: `Your OTP for registration is: ${otp}`,
//             outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
//         }
//     };

//     const emailBody = MailGenerator.generate(email);

//     const message = {
//         from: ENV.EMAIL,
//         to: userEmail,
//         subject: subject || 'Signup Successful',
//         html: emailBody
//     };

//     try {
//         await transporter.sendMail(message);
//         console.log('Email sent successfully.'); // Optional: Log success
//     } catch (error) {
//         console.error('Error sending email:', error); // Optional: Log error
//         throw new Error('Failed to send email');
//     }
// };

// export async function generateOTP() {
//     const otp = otpGenerator.generate(6, { digits: true, alphabets: false, specialChars: false });
//     return otp;
// }
