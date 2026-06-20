import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" }, // react-icons name or svg url
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);
