import mongoose from "mongoose";

const botSchema = new mongoose.Schema({
   
    text:{
        type:String,
        required:true
    },
    timeStamp:{
        type:Date,
        default:Date.now
    }
})

const Bot = mongoose.model("Bot",botSchema)
export default Bot;