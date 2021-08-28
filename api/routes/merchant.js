const mongoose = require("mongoose");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Merchant = require("../models/Merchant");



//Update Profile
async function updateMerchantStocks(req, res) {
    try {
        let userId = req.user.id;
        let merchant = await Merchant.findOne({ userId: userId });
        let updateData = req.body;
        if (!merchant) {
            return res
                .status(404)
                .send({ success: false, msg: "Merchant doesnt exists" });
        }
        console.log("ID is" + userId);
        console.log(updateData);
        let newMerchant = await Merchant.updateOne(
            {
                userId: userId,
            },
            {
                $set: {
                    ...updateData,
                },
            }
        );
        console.log(newMerchant);
        return res.status(200).send({ success: true, msg: "Merchant Profile Updated" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

module.exports = {
    updateMerchantStocks
};
