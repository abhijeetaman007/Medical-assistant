const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");
const isMerchant = require("../middleware/isMerchant");
const isDoctor = require("../middleware/isDoctor");

const {
    Register,
    Login,
    ResetPassword,
    ForgotPassword,
    VerifyEmail,
    ReVerify,
} = require("./auth");

const {
    viewHistory,
    addToHistory,
    becomeDoctor,
    becomeMerchant,
    updateProfile,
    getUserProfile,
} = require("./user");

const { viewPatientHistory, viewPatients } = require("./doctor");

const { verifyDoctor, verifyMerchant } = require("./admin");

//Auth Routes ->Rhea
router.post("/auth/register", Register);
router.post("/auth/login", Login);
router.post("/auth/forgotpassword", ForgotPassword);
router.post("/auth/resetpassword/:token", ResetPassword);
router.get("/auth/verifyemail/:token", VerifyEmail);
router.post("/auth/reverify", ReVerify);

//User Routes ->Abhijeet
router.get("/user/viewhistory/:userId", viewHistory);
router.post("/user/updatehistory/:userId", addToHistory);
router.post("/user/applydoctor/:userId", becomeDoctor);
router.post("/user/applymerchant/:userId", becomeMerchant);
router.post("/user/updateprofile/:userId", updateProfile);
router.get("/user/viewprofile/:userId", getUserProfile);

//Doctor Routes ->Abhijeet
// (:userId is userID of Doctor, pass patient userId in body)
router.post("/user/doctor/viewhistory/:userId", viewPatientHistory);
router.get("/user/doctor/viewpatients/:userId", viewPatients);

//Admin Routes ->Abhijeet
router.get("/user/admin/verifydoctor/:doctorId", verifyDoctor);
router.get("/user/admin/verifydoctor/:merchantId", verifyMerchant);

module.exports = router;
