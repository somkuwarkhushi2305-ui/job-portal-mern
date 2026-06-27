import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",//creating a realtionship between job and application
        required:true,
    },
        applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",//creating a realtionship between user and application
        required:true,
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending",
    },
},
    {
        timestamps:true,
});

export const Application = mongoose.model("Application", applicationSchema);    