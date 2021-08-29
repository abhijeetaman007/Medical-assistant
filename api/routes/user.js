const mongoose = require("mongoose");
const User = require("../models/User");
const Doctor = require("../models/Doctor");
const Merchant = require("../models/Merchant");
const Item = require("../models/Item");
const geocoder = require("../utils/geoCoder");

// To view user's medical history
async function viewHistory(req, res) {
    try {
        let userId = req.user.id;
        let user = await User.findById({ _id: userId });
        if (!user) {
            return res
                .status(404)
                .send({ success: false, msg: "User Not found" });
        }
        let history = user.history;
        return res.status(200).send({ success: true, data: history });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

//User adding his own medical record --- unverified documents
async function addToHistory(req, res) {
    try {
        //console.log("History : " + req.user);
        let userId = req.params.userid;
        console.log(req.user);
        let user = await User.findById({ _id: userId });

        user.history.push({
            imageLink: req.body.imageLink,
            description: req.body.description,
            isVerified: false,
            uploadedBy: userId,
        });
        await User.updateOne(
            {
                _id: userId,
            },
            {
                $set: {
                    history: user.history,
                },
            }
        );
        return res.send({ success: true, msg: "History Updated" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

//User adding friends medical records --- verified/unverified documents
async function addToFriendHistory(req, res) {
    try {
        let friendId = req.params.friendId;
        let friend = await User.findById({ _id: friendId });
        let userId = req.user.id; //current user logged in
        let access = 0;
        for (let i = 0; i < friend.friends.length; i++) {
            if (friend.friends[i]._id.toString() === userId) {
                //if my id is in friends array then only give access
                access = 1;
                break;
            }
        }
        if (access == 1) {
            let user = await User.findOne({ userId: req.user.id });
            if (user.isDoctor) {
                friend.history.push({
                    imageLink: req.body.imageLink,
                    description: req.body.description,
                    isVerified: true,
                    uploadedBy: userId,
                });
            } else {
                friend.history.push({
                    imageLink: req.body.imageLink,
                    description: req.body.description,
                    isVerified: false,
                    uploadedBy: userId,
                });
            }
            await User.updateOne(
                {
                    _id: userId,
                },
                {
                    $set: {
                        history: user.history,
                    },
                }
            );
            return res.send({
                success: true,
                msg: "History Updated by friend",
            });
        } else {
            return res.send({
                success: true,
                msg: "You dont have access to edit history of so called friend who isnt you're friend",
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}
// User applying to become doctor
async function becomeDoctor(req, res) {
    try {
        let userId = req.user.id;
        let doctor = await Doctor.findOne({ userId: userId });
        if (doctor) {
            return res
                .status(400)
                .send({ success: false, msg: "Already applied for doctor" });
        }
        let newDoctor = new Doctor({
            userId,
            certificateLink: req.body.certificateLink,
            isVerified: false,
        });
        await newDoctor.save();
        return res
            .status(200)
            .send({ success: true, msg: "Applied for Doctor" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

//User applying to become merchant
async function becomeMerchant(req, res) {
    console.log(req.body);
    try {
        console.log("Applying for merchant");
        let userId = req.user.id;
        console.log(userId);
        let merchant = await Merchant.findOne({ userId: userId });
        if (merchant) {
            return res
                .status(400)
                .send({ success: false, msg: "Already applied for Merchant" });
        }
        let newMerchant = new Merchant({
            userId: userId,
            address: req.body.address,
            certificateLink: req.body.certificateLink,
            isVerified: false,
        });
        console.log(newMerchant);
        await newMerchant.save();
        return res
            .status(200)
            .send({ success: true, msg: "Applied for Merchant" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

//Update Profile
async function updateProfile(req, res) {
    try {
        let userId = req.user.id;
        let updateData = req.body;
        let user = await User.findById({ _id: userId });
        if (!user) {
            return res
                .status(404)
                .send({ success: false, msg: "User doesnt exists" });
        }
        console.log("ID is" + userId);
        console.log(updateData);
        let newUser = await User.updateOne(
            {
                _id: userId,
            },
            {
                $set: {
                    ...updateData,
                },
            }
        );
        console.log(newUser);
        return res.status(200).send({ success: true, msg: "Profile Updated" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

// get user profile
async function getUserProfile(req, res) {
    try {
        let userId = req.params.userid;
        let user = await User.findById({ _id: userId }).populate(
            "isDoctor isMerchant"
        );
        if (!user) {
            return res
                .status(404)
                .send({ success: false, msg: "User Not found" });
        }
        console.log(user);
        return res.status(200).send({ success: true, data: user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function addFriend(req, res) {
    try {
        let friendEmail = req.body.friendEmail;

        let myEmail = req.user.email;
        let user = await User.findOne({ email: myEmail });

        let friend = await User.findOne({ email: friendEmail });
        if (!friend) {
            return res.status(200).send({
                success: false,
                data: "Friend not registered",
            });
        }
        //if friends request already sent by me, send msg already sent request
        for (let i = 0; i < friend.requests.length; i++) {
            if (friend.requests[i].email == myEmail) {
                return res.status(200).send({
                    success: false,
                    data: "Friend Request Already sent",
                });
            }
        }
        friend.requests.push({
            email: myEmail,
            firstName: user.firstName,
            lastName: user.lastName,
        });
        await friend.save();
        return res
            .status(200)
            .send({ success: true, data: "Friend Request sent" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function acceptFriendRequest(req, res) {
    try {
        let userEmail = req.user.email;
        let requestEmail = req.body.requestEmail;
        //inside the requests array remove the requestEmail and put in friends array
        const user = await User.findOne({ email: userEmail });
        //remove the object from requests
        await User.update(
            { _id: userId },
            { $pull: { requests: { email: requestEmail } } }
        );

        for (let i = 0; i < user.friends.length; i++) {
            if (user.friends[i].email == requestEmail) {
                return res
                    .status(200)
                    .send({ success: true, data: "Already a friend" });
            }
        }
        //add object in friends if not friend already
        let accepteduser = await User.findOne({ email: requestEmail });
        user.friends.push({
            email: requestEmail,
            firstName: accepteduser.firstName,
            lastName: accepteduser.lastName,
        });
        await user.save();
        return res.status(200).send({ success: true, data: "Friend Added" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function removeFriend(req, res) {
    try {
        let userEmail = req.user.email;
        let friendEmail = req.body.friendEmail;
        let user = await User.findOne({ email: userEmail });
        await User.update(
            { _id: userId },
            { $pull: { friends: { email: friendEmail } } }
        );
        return res.status(200).send({ success: true, data: "Friend Removed" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function rejectFriendRequest(req, res) {
    try {
        let userEmail = req.user.email;
        let requestEmail = req.body.requestEmail;
        //inside the requests array remove the requestId and put in friends array
        await User.update(
            { _id: userId },
            { $pull: { requests: { email: requestEmail } } }
        );
        return res
            .status(200)
            .send({ success: true, data: "Friend Request Rejected" });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function getFriendRequests(req, res) {
    try {
        let userId = req.user.id;
        let user = await User.findOne({ _id: userId });
        return res.status(200).send({ success: true, data: user.requests });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function getFriends(req, res) {
    try {
        let userId = req.user.id;
        let user = await User.findOne({ _id: userId });
        let friends = [];
        for (let i = 0; i < user.friends.length; i++) {
            let friendId = user.friends[i].userId;
            let friend = await User.findOne({ _id: friendId });
            let firstName = friend.firstName;
            let lastName = friend.lastName;
            friends.push({
                firstName: firstName,
                lastName: lastName,
                friendId: friendId,
                userId: userId, //curr user
            });
        }
        return res.status(200).send({ success: true, data: friends });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function getNearestStore(req, res) {
    let currentloc = req.body.location;
    // let currentloc = await geocoder.geocode(loc);
    console.log("Curr location " + currentloc);

    let merchants = await Merchant.find({
        location: {
            $near: {
                $maxDistance: 15000000000000000000000000000000000000000000, //Searching in a range of 15 kms
                $geometry: {
                    type: "Point",
                    coordinates: [currentloc[0], currentloc[1]],
                },
            },
        },
    }).select("_id");
    // console.log("merchant")
    // console.log(merchants)

    let merchantWithStock = await Item.find({
        merchantId: {
            $in: [...merchants],
        },
    }).populate("merchantId");

    // console.log("Merchants : ");
    // console.log(merchants);
    // console.log("Final")
    // console.log(merchantWithStock)

    if (merchantWithStock) {
        return res.status(200).send({ success: true, data: merchantWithStock });
    }
    return res.status(400).send({ success: false, msg: "No Store found" });
}

async function viewMerchants(req, res) {
    try {
        let merchants = await Merchant.find({}).exec();
        return res.status(200).send({ success: true, data: merchants });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

async function viewDoctors(req, res) {
    try {
        let doctors = await Doctor.find({}).exec();
        return res.status(200).send({ success: true, data: doctors });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ success: false, msg: "Server Error" });
    }
}

module.exports = {
    viewHistory,
    addToHistory,
    addToFriendHistory,
    becomeDoctor,
    becomeMerchant,
    updateProfile,
    getUserProfile,
    addFriend,
    removeFriend,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    getFriends,
    viewDoctors,
    viewMerchants,
    getNearestStore,
};
