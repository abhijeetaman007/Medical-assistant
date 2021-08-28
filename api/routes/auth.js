const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

const Register = async (req, res) => {
    console.log("in register");
    try {
        const { firstName, lastName, email, confirmPassword } = req.body;
        //Errors handled in frontend

        var user = await User.findOne({ email: email });

        if (!user) {
            const hashpwd = await bcrypt.hash(req.body.password, 10);
            let newtoken = uuidv4();
            user = new User({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashpwd,
                token: newtoken,
            });
            await user.save();
            // On register verification mail sent
            sendEmail(newtoken, user, 2);
            return res.send({
                success: true,
                data: "User successfully registered",
            });
        } else {
            return res.send({ success: false, data: "User already exists" });
        }
    } catch (err) {
        console.log("err:");
        console.log(err);
        return res.send({ success: false, data: "Server error" });
    }
};

const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email });

        if (!user) {
            return res.send({
                success: false,
                data: "User is not registered.",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.send({ success: false, data: "Incorrect Password" });
        }

        //IMP
        const payload = {
            user: { firstName:user.firstName, id: user._id, email: user.email },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "720h",
        });

        console.log(token);

        return res.send({
            success: true,
            data: "User successfully logged in!",
            token: token,
            user: user,
        });
    } catch (err) {
        console.log(`Error : ${err.message}`);
        res.send({ success: false, data: "Server Error" });
    }
};

const ResetPassword = async (req, res) => {
    try {
        let urltoken = req.params.token;
        const hashpwd = await bcrypt.hash(req.body.password, 10);
        let user = await User.findOne({ token: urltoken });
        if (user) {
            //reset token and take in new password and set new password in db
            user.token = uuidv4();
            user.password = hashpwd;

            await user.save();

            return res.send({
                success: true,
                data: "Password Reset successful",
            });
        } else {
            return res.send({
                success: false,
                data: "Something went wrong on your end",
            });
        }
    } catch (err) {
        console.log(err);
        return res.send({ success: false, data: "Server Error" });
    }
};

//send email for req for forgot password (purpose:1)
const ForgotPassword = async (req, res) => {
    try {
        let { email } = req.body;
        let user = await User.findOne({ email: email });
        if (user) {
            sendEmail(user.token, user, 1);

            return res.send({
                success: true,
                data: "Check email for reset link",
            });
        } else {
            return res.send({
                success: false,
                data: "Email not registered with us",
            });
        }
    } catch (err) {
        console.log(`Error : ${err.message}`);
        res.status(500).json({ success: false, msg: "Server Error." });
    }
};
// http://localhost:5000/api/auth/verifyemail/88d40df8-2dd7-4d78-a243-cc204b99c757
const VerifyEmail = async (req, res) => {
    console.log("verify email");
    try {
        let compareToken = req.params.token;
        console.log(compareToken);

        let user = await User.findOne({ token: compareToken });
        console.log(user);

        if (user) {
            await User.updateOne(
                { token: compareToken },
                { $set: { isVerified: true, token: uuidv4() } }
            );

            console.log("User Verified and token reset");

            return res.send({
                success: true,
                data: "Email Verified, Redirect to Login",
            });
        } else {
            return res.send({ success: false, data: "Invalid Token" });
        }
    } catch (err) {
        console.log(err);
        return res.send({ success: false, msg: "Server Error" });
    }
};

const ReVerify = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            if (user.isVerified) {
                return res.send({
                    success: true,
                    data: "You are already verified!",
                });
            } else {
                sendEmail(user.token, user, 2);
                return res.send({
                    success: true,
                    data: "Check Inbox",
                });
            }
        } else {
            return res.send({
                success: true,
                data: "User isnt registered",
            });
        }
    } catch (err) {
        console.log(`Error : ${err.message}`);
        res.status(500).json({ success: false, msg: "Server Error." });
    }
};
module.exports = {
    Register,
    Login,
    ResetPassword,
    VerifyEmail,
    ForgotPassword,
    ReVerify,
};
