const mongoose = require("mongoose");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Merchant = require("../models/Merchant");
const Item = require("../models/Item");

async function addItem(req, res) {
    try {
        let { itemName, quantity, cost, description, tags } = req.body;
        let item = new Item({
            itemName: itemName,
            quantity: quantity,
            cost: cost,
            description: description,
            tags: tags, //Send array here
        });
        item.save();
        return res.send({
            success: false,
            msg: "Added item",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}
async function removeItem(req, res) {
    try {
        let { itemId } = req.body;
        await Item.deleteOne({ _id: itemId });
        return res.send({
            success: false,
            msg: "Deleted item",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function editAddress(req, res) {
    try {
        let { address } = req.body;
        let merchant = User.findOne({ userId: req.user.id });
        merchant.address = address;
        merchant.save();
        return res.send({
            success: false,
            msg: "Updated address",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

module.exports = {
    addItem,
    removeItem,
    editAddress,
};
