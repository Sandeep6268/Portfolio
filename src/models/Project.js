import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, default: "" },
    tech: { type: [String], default: [] },
    features: { type: [String], default: [] },
    github: { type: String, default: "" },
    live: { type: String, default: "" },
    // cover media: image OR video (optimized via Cloudinary) shown on the card
    media: {
      type: { type: String, enum: ["image", "video", ""], default: "" },
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      alt: { type: String, default: "" },
      title: { type: String, default: "" },
    },
    // gallery: multiple images/videos shown in the project popup
    gallery: {
      type: [
        {
          type: { type: String, enum: ["image", "video", ""], default: "" },
          url: { type: String, default: "" },
          publicId: { type: String, default: "" },
          caption: { type: String, default: "" },
          alt: { type: String, default: "" },
          title: { type: String, default: "" },
        },
      ],
      default: [],
    },
    featured: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", ProjectSchema);
