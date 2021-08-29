const mongoose = require("mongoose");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Merchant = require("../models/Merchant");
const Item = require("../models/Item");

async function getAllItems (req,res ) {
   const data = await Item.find({merchantId:req.user.isMerchant.merchantId})
    res.status(200).json(data)
}

async function addItem(req, res) {
    try {
        let { itemName, quantity, cost, description, tags } = req.body;
        let merchant = await Merchant.findOne({ userId: req.user.id });
        if (!merchant) {
            return res.send({ success: false, msg: "Merchant doesnt exist" });
        }
        let item = new Item({
            merchantId: merchant._id,
            itemName: itemName,
            quantity: quantity,
            cost: cost,
            description: description,
            tags: tags, //Send array here
        });
        item.save();
        return res.send({
            success: true,
            msg: "Added item",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}
async function deleteItem(req, res) {
    try {
        let { itemId } = req.body;
        let item = await Item.findOne({ _id: itemId });
        if (!item) {
            return res.send({ success: false, msg: "Item doesnt exist" });
        }
        let merchant = await Merchant.findOne({ userId: req.user.id });

        if (!merchant) {
            return res.send({ success: false, msg: "Merchant doesnt exist" });
        }
        console.log(item.merchantId);
        console.log(merchant._id);

        await Item.deleteOne({ _id: itemId });
        return res.send({
            success: true,
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
        let merchant = Merchant.findOne({ userId: req.user.id });
        if (!merchant) {
            return res.send({ success: false, msg: "Merchant doesnt exist" });
        }
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
    deleteItem,
    editAddress,
    getAllItems
};
