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
        let merchants = await Merchant.findMany({
            isVerified: true,
        }).exec();
        return res.status(200).send({ success: false, data: merchants });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}
async function getAllDoctorsToBeVerified(req, res) {
    try {
        let doctors = await Doctor.findMany({
            isVerified: true,
        }).exec();
        return res.status(200).send({ success: false, data: doctors });
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
