// /import mongoose, { Schema, Document } from "mongoose";
const mongoose = require("mongoose")
const {Schema} = require("mongoose")


const Merchant = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    certificateLink: {
        type: String,
        required: true,
    },
    location: {
        longetude: String,
        latitude: String,
    },
    stocks: [
        {
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
        },
    ],
});

module.exports = mongoose.model("merchant", Merchant);
