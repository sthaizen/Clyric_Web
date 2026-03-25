import mongoose from "mongoose";

const userQuestProgressSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    index: true 
  },
  questId: { 
    type: String, 
    required: true,
    index: true // Reference to QuestTemplate.questId
  },
  questType: {
    type: String,
    enum: ["daily", "weekly", "milestone"],
    required: true,
    index: true
  },
  progress: { 
    type: Number, 
    default: 0 
  },
  target: {
    type: Number,
    required: true
  },
  isCompleted: { 
    type: Boolean, 
    default: false 
  },
  isClaimed: { 
    type: Boolean, 
    default: false 
  },
  assignedAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date, 
    default: null, // Null for milestones
    index: true
  }
}, {
  timestamps: true
});

// Compound index to quickly find a user's unexpired active quests or prevent duplicate milestones
userQuestProgressSchema.index({ userId: 1, questId: 1, expiresAt: 1 });

const UserQuestProgress = mongoose.model("UserQuestProgress", userQuestProgressSchema);

export default UserQuestProgress;
