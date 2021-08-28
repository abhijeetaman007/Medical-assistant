const User = require("../models/User");

module.exports = async function (req, res, next) {
    try {
        let user = await User.findOne({ _id: req.user.id });
        if (user.isMerchant) {
            next();
        } else {
            return res.send({
                success: false,
                msg: "Not a Merchant",
            });
        }
    } catch (err) {
        return res.send({
            success: false,
            msg: "Server Error",
        });
    }
};
