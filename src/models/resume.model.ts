import mongoose from "mongoose";



const ResumeSchema = new mongoose.Schema({
    candidate:{
        type: mongoose.Types.ObjectId,
        ref:"Candidate",
        required: [true, "Candidate Key is required"]
    },
    filename:{
        type: String,
        required: [true, "Resume filename is required"]
    },
    url:{
        type: String,
        required: [true, "Resume URL is required"]
    },
    filesize:{
        type: Number,
        required: [true, "Resume size is required"]
    },
    filetype:{
        type: String,
        required: [true, "Resume type is required"]
    },
    
}, {timestamps: true});


const Resume = mongoose.model("Resume", ResumeSchema);
export default Resume;