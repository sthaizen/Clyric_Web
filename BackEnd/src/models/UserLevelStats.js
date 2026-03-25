import mongoose from "mongoose";

const userLevelStatsSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true 
  },
  totalExp: { 
    type: Number, 
    default: 0 
  },
  currentLevel: { 
    type: Number, 
    default: 1 
  },
  lastLeveledUpAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const UserLevelStats = mongoose.model("UserLevelStats", userLevelStatsSchema);

export default UserLevelStats;
