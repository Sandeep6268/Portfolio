import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true }, // e.g. "Full Stack Developer"
    company: { type: String, default: "" },
    location: { type: String, default: "" },
    startDate: { type: String, default: "" }, // free text e.g. "Jan 2024"
    endDate: { type: String, default: "" }, // "Present" allowed
    description: { type: String, default: "" },
    type: { type: String, default: "work" }, // work | education
    icon: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Experience ||
  mongoose.model("Experience", ExperienceSchema);
