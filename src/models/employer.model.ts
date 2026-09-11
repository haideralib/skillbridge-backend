import mongoose from "mongoose";


const Employeer = new mongoose.Schema({
     user: {
        type: mongoose.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },
    company: {
        type: String,
        required: [true, "Name is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    company_size: {
        type: String,
        required: [true, "Company size is required"],
    },
    founded_year: {
        type: Number,
        required: [true, "Founded year is required"],
    },
    industry: {
        type: String,
        required: [true, "Industry is required"],
    }
    
}, {timestamps: true});

const Employer = mongoose.model("Employer", Employeer);
export default Employer;