const mongoose = require("mongoose");
const User = require("../models/User");

// To view history of particular patient
async function viewPatientHistory(req, res) {
    try {
        let userId = req.user.id; //UserId of doctor or family member
        let patientId = req.body.patientId; //UserId of patient
        let patient = await User.findById({ _id: patientId });
        if (!patient) {
            return res
                .status(404)
                .send({ success: false, msg: "User doesn't exists" });
        }
        for (let i = 0; patient.friends.length; i++) {
            if (patient.friends[i].userId == userId) {
                return res
                    .status(200)
                    .send({ success: true, data: patient.history });
            }
        }
        return res.status(404).send({
            success: false,
            msg: "You dont have access to patient's medical history",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

module.exports = {
    viewPatientHistory,
};
