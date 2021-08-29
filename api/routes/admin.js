const mongoose = require("mongoose");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Merchant = require("../models/Merchant");

async function verifyDoctor(req, res) {
    try {
        let doctorId = req.params.doctorId;
        let doctor = await Doctor.findById({ _id: doctorId });
        if (!doctor) {
            return res
                .status(400)
                .send({ success: false, msg: "No doctor application found" });
        }
        await User.updateOne(
            { _id: doctor.userId },
            {
                $set: {
                    "isDoctor.isVerified": true,
                    "isDoctor.doctorId": doctorId,
                },
            }
        );
        doctor.isVerified = true;
        await doctor.save();
        return res.status(200).send({ success: true, msg: "Doctor Verified" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function verifyMerchant(req, res) {
    try {
        let merchantId = req.params.merchantId;
        let merchant = await Merchant.findById({ _id: merchantId });
        if (!merchant) {
            return res
                .status(400)
                .send({ success: false, msg: "No Merchant application found" });
        }
        await User.updateOne(
            { _id: merchant.userId },
            {
                $set: {
                    "isMerchant.isVerified": true,
                    "isMerchant.merchantId": merchantId,
                },
            }
        );
        merchant.isVerified = true;
        await merchant.save();
        return res
            .status(200)
            .send({ success: true, msg: "Merchant Verified" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function getAllMerchantsToBeVerified(req, res) {
    try {
        let merchants = await Merchant.find({
            isVerified: false,
        }).exec();
        let obj = [];
        for (let i = 0; i < merchants.length; i++) {
            let merchantuserId = merchants[i].userId;
            let user = await User.findOne({ _id: merchantuserId });
            obj.push({
                firstName: user.firstName,
                lastName: user.lastName,
                userId: user._id,
                merchantId: merchants[i]._id,
                certificateLink: merchants[i].certificateLink,
            });
        }
        return res.status(200).send({ success: true, data: obj });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}
async function getAllDoctorsToBeVerified(req, res) {
    try {
        let doctors = await Doctor.find({
            isVerified: false,
        }).exec();
        let obj = [];
        for (let i = 0; i < doctors.length; i++) {
            let doctoruserId = doctors[i].userId;
            let user = await User.findOne({ _id: doctoruserId });
            obj.push({
                firstName: user.firstName,
                lastName: user.lastName,
                userId: user._id,
                doctorId: doctors[i]._id,
                certificateLink: doctors[i].certificateLink,
            });
        }
        return res.status(200).send({ success: true, data: obj });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}
module.exports = {
    verifyDoctor,
    verifyMerchant,
    getAllMerchantsToBeVerified,
    getAllDoctorsToBeVerified,
};
