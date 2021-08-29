const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const Item = mongoose.Schema({
    merchantId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "merchant",
    },
    itemName: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 0,
    },
    description: {
        type: String,
    },
    tags: [
        {
            type: String,
        },
    ],
    cost: {
        type: Number,
    },
});

module.exports = mongoose.model("item", Item);
