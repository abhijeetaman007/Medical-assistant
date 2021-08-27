const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");

const {
    Register,
    Login,
    ResetPassword,
    ForgotPassword,
    VerifyEmail,
    GetUser,
} = require("./auth");

router.post("/auth/register", Register);
router.post("/auth/login", Login);
//sends mail
router.post("/auth/forgotpassword", ForgotPassword);

//new password(chk for confirm=new in frontend)
router.post("/auth/resetpassword/:token", ResetPassword);

router.get("/auth/verifyemail/:token", VerifyEmail);
router.get("/auth/getuser", isLoggedIn, GetUser);

module.exports = router;
