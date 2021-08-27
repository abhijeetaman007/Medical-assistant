const mongoose = require("mongoose")
const User = require("../models/User")
const Doctor = require("../models/Doctor")
const Merchant = require("../models/Merchant")


// To view user's medical history
async function viewHistory(req,res)
{
    try
    {
        let userId = req.params.userId
        let user = await User.findById({_id : userId})
        if(!user)
        {
            return res.status(404).send({success:false,msg:"User Not found"})
        }
        let history = user.history
        return res.status(200).send({success:true,data:history}) 
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({success:false,msg:"Server Error"})
    }
}

//User adding his own medical record --- unverified documents
async function addToHistory(req,res)
{
    try
    {
        let userId = req.params.userId
        let user = await User.findById({_id : userId})
        user.history.push({
            imageLink:req.body.imageLink,
            description:req.body.description,
            isVerified : false,
            uploadedBy: userId
        })
        await User.updateOne({
            _id : userId
        },{
            $set:{
                history : user.history 
            }
        })
        return res.send({success:true,msg:"History Updated"})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({success:false,msg:"Server Error"})
    }
}

// User applying to become doctor
async function becomeDoctor(req,res)
{
    try
    {
        let userId = req.params.userId
        let doctor = await Doctor.findOne({userId: userId})
        if(doctor)
        {
            return res.status(400).send({success:false,msg:"Already applied for doctor"})   
        }
        let newDoctor = new Doctor({
            userId,
            isVerified : false,
            certificateLink : req.body.certificateLink
        })   
        await newDoctor.save()
        return res.status(200).send({success:true,msg:"Applied for Doctor"})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({success:false,msg:"Server Error"})
    }
}

//User applying to become merchant
async function becomeMerchant(req,res)
{
    try
    {
        let userId = req.params.userId
        let merchant = await Merchant.findOne({userId: userId})
        if(merchant)
        {
            return res.status(400).send({success:false,msg:"Already applied for Merchant"})   
        }
        let newMerchant = new Merchant({
            userId : req.params.userId,
            isVerified : false,
            location:req.body.location,
            certificateLink : req.body.certificateLink
            
        })   
        await newMerchant.save()
        return res.status(200).send({success:true,msg:"Applied for Merchant"})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({success:false,msg:"Server Error"})
    }
}

//Update Profile
async function updateProfile(req,res)
{
    try
    {
        let userId = req.params.userId
        let updateData = req.body
        let user = await User.findById({_id:userId})
        if(!user)
        {
            return res.status(404).send({success:false,msg:"User doesnt exists"})
        }
        console.log("ID is"+userId)
        console.log(updateData)
        let newUser = await User.updateOne({
            _id : userId
        },{
            $set:{
                ...updateData
            }
        })
        console.log(newUser)
        return res.status(200).send({success:true,msg:"Profile Updated"})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({success:false,msg:"Server Error"})
    }
}

// get user profile
async function getUserProfile(req,res)
{
    try
    {
        let userId = req.params.userId
        let user = await User.findById({_id : userId}).populate("isDoctor isMerchant")
        if(!user)
        {
            return res.status(404).send({success:false,msg:"User Not found"})
        }
        console.log(user)
        return res.status(200).send({success:true,data:user})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({success:false,msg:"Server Error"})
    }
}

module.exports = {
    viewHistory,
    addToHistory,
    becomeDoctor,
    becomeMerchant,
    updateProfile,
    getUserProfile
};
