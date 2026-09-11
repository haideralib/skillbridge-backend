import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    employer: {
      type: Schema.Types.ObjectId,
      ref: "Employer",
      required: true,
    },

    location: {
      latitude: {
        type: Number,
        required: false,
      },

      longitude: {
        type: Number,
        required: false,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
      },
    },

    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      required: true,
    },

    workplace: {
      type: String,
      enum: ["On-site", "Hybrid", "Remote"],
      required: true,
    },

    salary: {
      min: {
        type: Number,
        min: 0,
      },

      max: {
        type: Number,
        min: 0,
      },

      currency: {
        type: String,
        default: "PKR",
        trim: true,
      },
    },

    skills: {
      type: [String],
      default: [],
    },

    experienceLevel: {
      type: String,
      enum: ["Entry-level", "Mid-level", "Senior-level"],
      required: true,
    },

    experienceYears: {
      type: Number,
      min: 0,
      default: 0,
    },

    education: {
      type: String,
      trim: true,
    },

    responsibilities: {
      type: [String],
      default: [],
    },

    requirements: {
      type: [String],
      default: [],
    },

    benefits: {
      type: [String],
      default: [],
    },

    applicationDeadline: {
      type: Date,
    },

    vacancies: {
      type: Number,
      min: 1,
      default: 1,
    },

    openingDate: {
      type: Date,
    },

    closingDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["draft", "active", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({
  title: "text",
  description: "text",
  skills: "text",
});

jobSchema.index({ "location.city": 1 });
jobSchema.index({
  "location.latitude": 1,
  "location.longitude": 1,
});
jobSchema.index({ jobType: 1 });
jobSchema.index({ workplace: 1 });
jobSchema.index({ status: 1 });

export const Job = mongoose.model("Job", jobSchema);