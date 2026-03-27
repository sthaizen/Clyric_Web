import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userAvatar: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likes: {
      type: [String], // array of userIds who liked
      default: [],
    },
    dislikes: {
      type: [String], // array of userIds who disliked
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound index for efficient problem+parent lookups
commentSchema.index({ problemId: 1, parentId: 1, createdAt: -1 });

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
