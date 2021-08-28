const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const geocoder = require("../utils/geoCoder");

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
    address: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
            index: "2dsphere",
        },
        formattedAddress: String,
        city: {
            type: String,
        },
    },
    stocks: [
        {
            itemId: {
                type: String,
                unique: true,
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
        },
    ],
});

//GeoCoder create Location
Merchant.pre("save", async function (next) {
    const loc = await geocoder.geocode(this.address);
    // console.log(loc)
    this.location = {
        type: "Point",
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        city: loc[0].city,
    };

    //Not saving user entered address rather storing formatted address
    this.address = undefined;
    next();
});

module.exports = mongoose.model("merchant", Merchant);
