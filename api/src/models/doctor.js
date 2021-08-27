import mongoose, { Schema, Document } from "mongoose"

const Doctor = mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    certificateLink:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("doctor",Doctor)
