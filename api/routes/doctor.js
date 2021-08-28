const mongoose = require("mongoose")
const User = require("../models/User")
const Doctor = require("../models/Doctor")
const Merchant = require("../models/Merchant")

// To view history of particular patient
async function viewPatientHistory(req,res)
{
    try
    {
        let userId = req.params.userId      //UserId of doctor or family member
        let patientId = req.body.patientId  //UserId of patient
        let patient = await User.findById({_id:patientId})
        if(!patient)
        {
            return res.status(404).send({success:false,msg:"User doesn't exists"})
        }
        for(let i=0;patient.friends.length;i++)
        {
            if(patient.friends.userId == userId)
            {
                return res.status(200).send({success:true,data:patient.history})
            }
        }
        return res.status(404).send({success:false,msg:"You dont have access to patient's medical history"})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({success:false,msg:"Server Error"})
    }
    
}

// To view all patients of a doctor
async function viewPatients(req,res)
{
    try
    {
        let userId = req.params.userId
        let user = await User.findById({_id: userId})
        if(!user)
        {
            return res.status(404).send({success:false,msg:"User doesn't exists"})
        }
        if(!user.isDoctor.isVerified)
        {
            return res.status(404).send({success:false,msg:"You are not a doctor"})
        }
        let doctor = await Doctor.findOne({userId:userId}).populate("patients")
        return res.status(200).send({success:true,data:doctor.patients})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send({success:false,msg:"Server Error"})
    }
}


module.exports = {
    viewPatientHistory,
    viewPatients
};
