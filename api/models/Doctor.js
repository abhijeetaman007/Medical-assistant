const mongoose = require("mongoose")
const {Schema} = require("mongoose")
const Doctor = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    certificateLink: {
        type: String,
        required: true,
    },
    patients:[{
        type: mongoose.Schema.Types.ObjectId, ref: "user" 
    }]
});

module.exports = mongoose.model("doctor", Doctor);
