const nodemailer = require("nodemailer");

module.exports = async (token, receiver, purpose) => {
    try {
        console.log(receiver.email);
        console.log(receiver.username);
        const subject1 = "Reset Password";
        const subject2 = "Verify Email";

        // for now this works http://localhost:5000/api/auth/forgotpassword/9d0b0b59-4f27-4b0d-892d-26c1311fd1f7
        const output1 = `<p>Hello ${receiver.username}</p>Link for reset password: <a href ="http://localhost:3000/forgotpassword/${token}">http://localhost:3000/forgotpassword/${token}</a><p>Regards,<br>Alpha Team</p>`;

        // for now this works http://localhost:5000/api/auth/verifyemail/9d0b0b59-4f27-4b0d-892d-26c1311fd1f7
        const output2 = `<p>Hello ${receiver.username}</p>Link for email verification: <a href ="http://localhost:3000/verifyemail/${token}">http://localhost:3000/verifyemail/${token}</a><p>Regards,<br>Alpha Team</p>`;

        let output;
        let subject;

        switch (purpose) {
            case 1:
                output = output1;
                subject = subject1;
                break;
            case 2:
                output = output2;
                subject = subject2;
                break;
        }

        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.ADMIN_EMAIL, // generated ethereal user
                pass: process.env.ADMIN_EMAIL_PASSWORD, // generated ethereal password
            },
            tls: {
                rejectUnathorized: false,
            },
        });

        // send mail with defined transport object
        try {
            let info = await transporter.sendMail({
                from: `"Admin" <${process.env.ADMIN_EMAIL}>`, // sender address
                to: `${receiver.email}`, // list of receivers
                subject: subject, // Subject line
                text: subject, // plain text body
                html: output, // html body
            });
        } catch (err) {
            console.log(err);
        }
    } catch (err) {
        console.log(err);
    }
};
