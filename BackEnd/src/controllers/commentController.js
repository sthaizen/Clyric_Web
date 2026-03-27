import Comment from "../models/Comment.js";

// GET /api/comments/:problemId - Get top-level comments + replies for a problem
export const getComments = async (req, res) => {
  try {
    const { problemId } = req.params;

    // Fetch top-level comments
    const topLevel = await Comment.find({
      problemId,
      parentId: null,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    // Fetch all replies for this problem
    const replies = await Comment.find({
      problemId,
      parentId: { $ne: null },
      isDeleted: false,
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, comments: topLevel, replies });
  } catch (err) {
    console.error("getComments error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch comments." });
  }
};

// POST /api/comments/:problemId - Add a new comment or reply
export const addComment = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.auth().userId;
    const username = req.auth().username || req.body.username || "Anonymous";
    const userAvatar = req.body.userAvatar || "";

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Comment cannot be empty." });
    }

    const comment = await Comment.create({
      problemId,
      userId,
      username,
      userAvatar,
      content: content.trim(),
      parentId: parentId || null,
    });

    res.status(201).json({ success: true, comment });
  } catch (err) {
    console.error("addComment error:", err);
    res.status(500).json({ success: false, message: "Failed to add comment." });
  }
};

// DELETE /api/comments/:commentId - Delete own comment (hard delete)
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.auth().userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found." });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ success: false, message: "You can only delete your own comments." });
    }

    await Comment.findByIdAndDelete(commentId);
    // Also delete all replies to this comment
    await Comment.deleteMany({ parentId: commentId });

    res.status(200).json({ success: true, message: "Comment deleted." });
  } catch (err) {
    console.error("deleteComment error:", err);
    res.status(500).json({ success: false, message: "Failed to delete comment." });
  }
};

// POST /api/comments/:commentId/like - Toggle like on a comment
export const toggleLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found." });
    }

    const likedIdx = comment.likes.indexOf(userId);
    const dislikedIdx = comment.dislikes.indexOf(userId);

    if (likedIdx > -1) {
      // Already liked → unlike
      comment.likes.splice(likedIdx, 1);
    } else {
      comment.likes.push(userId);
      // Remove from dislikes if present
      if (dislikedIdx > -1) comment.dislikes.splice(dislikedIdx, 1);
    }

    await comment.save();
    res.status(200).json({ success: true, likes: comment.likes, dislikes: comment.dislikes });
  } catch (err) {
    console.error("toggleLike error:", err);
    res.status(500).json({ success: false, message: "Failed to update like." });
  }
};
