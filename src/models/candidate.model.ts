import mongoose from "mongoose";


const CandidateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    skills: [String],

    experience: {
        type: Number,
        default: 0
    },
    bio: {
        type: String,
        default: ""
    }
}, {timestamps: true});

const Candidate = mongoose.model("Candidate", CandidateSchema);
export default Candidate;
