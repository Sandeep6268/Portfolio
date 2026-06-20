import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // icon: either a react-icons name (e.g. "FaGithub" / "SiReact") OR an svg/image URL
    icon: { type: String, default: "" },
    level: { type: Number, default: 80, min: 0, max: 100 },
    category: { type: String, default: "" }, // optional grouping e.g. "Frontend"
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
