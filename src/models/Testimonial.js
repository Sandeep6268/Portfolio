import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" }, // e.g. "CEO, Acme"
    quote: { type: String, default: "" },
    rating: { type: Number, default: 5, min: 0, max: 5 },
    avatar: {
      type: { type: String, enum: ["image", ""], default: "" },
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      alt: { type: String, default: "" },
      title: { type: String, default: "" },
    },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial ||
  mongoose.model("Testimonial", TestimonialSchema);
