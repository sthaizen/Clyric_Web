import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    problemId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "Untitled Note",
    },
    content: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound index for fast per-user per-problem queries
noteSchema.index({ userId: 1, problemId: 1 });

const Note = mongoose.model("Note", noteSchema);
export default Note;
