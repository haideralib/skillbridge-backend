import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    candidate: {
        type: mongoose.Types.ObjectId,
        ref: "Candidate",
        required: true,
    },
    coverLetter: {
        type: String,
        required: [true, "Cover letter is required"],
        trim: true,
        minlength: 20,
        maxlength: 5000,
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "rejected", "accepted"],
        default: "pending",
    },
}, { timestamps: true });

ApplicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

const Application = mongoose.model("Application", ApplicationSchema);
export default Application;