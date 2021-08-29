const express = require("express");
const router = express.Router();

//Patients=Friends

const isLoggedIn = require("../middleware/isLoggedIn");
const isAdmin = require("../middleware/isAdmin");
const isDoctor = require("../middleware/isDoctor");
const isMerchant = require("../middleware/isMerchant");

const {
    Register,
    Login,
    ResetPassword,
    ForgotPassword,
    VerifyEmail,
    ReVerify,
    getUserFromToken,
} = require("./auth");

const {
    viewHistory,
    addToHistory,
    addToFriendHistory,
    becomeDoctor,
    becomeMerchant,
    updateProfile,
    getUserProfile,
    addFriend,
    removeFriend,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    getFriends,
    viewDoctors,
    viewMerchants,
    getNearestStore,
} = require("./user");

const { viewPatientHistory } = require("./doctor");

const { verifyDoctor, verifyMerchant ,getAllMerchantsToBeVerified,getAllDoctorsToBeVerified } = require("./admin");

const {  getAllItems, addItem, deleteItem, editAddress} = require("./merchant");

//Auth Routes ->Rhea
router.post("/auth/register", Register);
router.post("/auth/login", Login);
router.get("/auth/user/:token", getUserFromToken);
router.post("/auth/forgotpassword", ForgotPassword);
router.post("/auth/resetpassword/:token", ResetPassword);
router.get("/auth/verifyemail/:token", VerifyEmail);
router.post("/auth/reverify", ReVerify);

//User Routes ->Abhijeet
router.get("/user/viewhistory", isLoggedIn, viewHistory);
router.post("/user/updatehistory", isLoggedIn, addToHistory);
router.post("/user/applydoctor", isLoggedIn, becomeDoctor);
router.post("/user/applymerchant", isLoggedIn, becomeMerchant);
router.post("/user/updateprofile", isLoggedIn, updateProfile);
router.get("/user/viewprofile", isLoggedIn, getUserProfile);
router.post("/user/getnearestmerchant", getNearestStore);

//Doctor Routes ->Abhijeet
// (:req.user.id is userID of Doctor, pass patient userId in body)
router.post(
    "/user/doctor/viewhistory",
    isLoggedIn,
    isDoctor,
    viewPatientHistory
);

//Admin Routes ->Abhijeet
router.get(
    "/user/admin/verifydoctor/:doctorId",
    isLoggedIn,
    isAdmin,
    verifyDoctor
);
router.get(
    "/user/admin/verifydoctor/:merchantId",
    isLoggedIn,
    isAdmin,
    verifyMerchant
);

router.get(
    "/user/admin/merchants",
    isLoggedIn,
    isAdmin,
    getAllMerchantsToBeVerified
);

router.get(
    "/user/admin/doctors",
    isLoggedIn,
    isAdmin,
    getAllDoctorsToBeVerified
);


//User Routes ->Rhea
router.post("/user/addfriend", isLoggedIn, addFriend);
router.post("/user/removefriend", isLoggedIn, removeFriend);
router.post(
    "/user/updatefriendhistory/:friendId",
    isLoggedIn,
    addToFriendHistory
);
router.post("/user/acceptfriendrequest", isLoggedIn, acceptFriendRequest);
router.post("/user/rejectfriendrequest", isLoggedIn, rejectFriendRequest);
router.get("/user/getfriendrequests", isLoggedIn, getFriendRequests);
router.get("/user/getfriends", isLoggedIn, getFriends);
router.get("/user/viewmerchants", isLoggedIn, viewDoctors);
router.get("/user/viewdoctors", isLoggedIn, viewMerchants);

//Merchant Routes ->Rhea
router.get("/user/merchant/items", isLoggedIn, isMerchant, getAllItems);
router.post("/user/merchant/additem", isLoggedIn, isMerchant, addItem);
router.delete("/user/merchant/deleteitem/:itemId", isLoggedIn, isMerchant, deleteItem);
router.post("/user/merchant/editaddress", isLoggedIn, isMerchant, editAddress);

module.exports = router;
