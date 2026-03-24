import mongoose from "mongoose";

const questTemplateSchema = new mongoose.Schema({
  questId: { 
    type: String, 
    required: true, 
    unique: true, 
    index: true // e.g., 'daily_grinder', 'weekly_strategist'
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["daily", "weekly", "milestone"], 
    required: true,
    index: true
  },
  targetCriteria: {
    action: { type: String, required: true }, // e.g., 'solve', 'study_plan', 'collaborate'
    count: { type: Number, required: true, default: 1 },
    difficulty: { type: String, default: "any" }, // 'Easy', 'Medium', 'Hard', 'Medium/Hard', 'any'
    category: { type: String, default: "any" }, // e.g., 'Algorithms', 'any'
    languageType: { type: String, default: "any" } // e.g., 'unique_3', 'any'
  },
  rewardExp: { 
    type: Number, 
    required: true,
    default: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const QuestTemplate = mongoose.model("QuestTemplate", questTemplateSchema);

export default QuestTemplate;
