const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const Doctor = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    isVerified: { type: Boolean, default: false },
    certificateLink: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("doctor", Doctor);
