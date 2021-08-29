const mongoose = require("mongoose");

const User = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
    },
    height: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    age: {
        type: Number,
    },
    bloodGroup: {
        type: String,
        enum: ["A+", "B+", "AB+", "O+", "A-", "B-", "AB-", "O-"],
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
    },
    address: {
        type: String,
    },
    phoneNumber: {
        type: Number,
    },
    motherName: {
        type: String,
    },
    fatherName: {
        type: String,
    },
    pointOfContact: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isDoctor: {
        isVerified: { type: Boolean, default: false },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "doctor",
            default: null,
        },
    },
    isMerchant: {
        isVerified: { type: Boolean, default: false },
        merchantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "merchant",
            default: null,
        },
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    history: [
        {
            imageLink: { type: String },
            isVerified: { type: Boolean, default: false },
            uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            description: { type: String },
        },
    ],
    //Stores userId who can view user's history
    //On acception of a friend request by X ,the userID of X will be put in friends
    friends: [
        {
            email: { type: String },
        },
    ],
    //Stores userId of people who have requested current user to be a friend->after user has decided to accept or reject we remove the userID from the array
    requests: [
        {
            email: { type: String },
        },
    ],
    token: {
        type: String,
    },
});

module.exports = mongoose.model("user", User);
