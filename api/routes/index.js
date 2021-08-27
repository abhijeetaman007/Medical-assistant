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

const {
    viewHistory,
    addToHistory,
    becomeDoctor,
    becomeMerchant,
    updateProfile,
    getUserProfile
} = require("./user")

const {
    viewPatientHistory,
    viewPatients
} = require("./doctor")

const {
    verifyDoctor,
    verifyMerchant
} = require("./admin")


router.post("/auth/register", Register);
router.post("/auth/login", Login);
//sends mail
router.post("/auth/forgotpassword", ForgotPassword);

//new password(chk for confirm=new in frontend)
router.post("/auth/resetpassword/:token", ResetPassword);

router.get("/auth/verifyemail/:token", VerifyEmail);
router.get("/auth/getuser", isLoggedIn, GetUser);



//User Routes
router.get("/user/viewhistory/:userId",viewHistory)
router.post("/user/updatehistory/:userId",addToHistory)
router.post("/user/applydoctor/:userId",becomeDoctor)
router.post("/user/applymerchant/:userId",becomeMerchant)
router.post("/user/updateprofile/:userId",updateProfile)
router.get("/user/viewprofile/:userId",getUserProfile)

//Doctor Routes
// (:userId is userID of Doctor, pass patient userId in body)
router.post("/user/doctor/viewhistory/:userId",viewPatientHistory)
router.get("/user/doctor/viewpatients/:userId",viewPatients)

//Admin Routes
router.get("/user/admin/verifydoctor/:doctorId",verifyDoctor)
router.get("/user/admin/verifydoctor/:merchantId",verifyMerchant)







module.exports = router;
