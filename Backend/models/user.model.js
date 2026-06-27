import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
    fullname: {
        type: String,
        required: true
    },
     email: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Student", "Recruiter"],
        default: "Student",
        required: true
    },
    profile: {
        bio: {
          type: String  
        },
        skills:[{
            type: String
        }],
        resume:{ //URL to the resume file
            type: String
        },
        resumeOriginalname: {
            type: String
        },
        company:{
            type:mongoose.Schema.Types.ObjectId,
        },
        profilePhoto: {
            type: String,
            default:"",
        },
        phoneNumber: { type: Number } 
    },
},
{timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;


