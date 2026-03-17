import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String }
}, { _id: false });

const starterCodeSchema = new mongoose.Schema({
  javascript: { type: String },
  python: { type: String },
  java: { type: String },
  cpp: { type: String }
}, { _id: false });

const expectedOutputSchema = new mongoose.Schema({
  javascript: { type: String },
  python: { type: String },
  java: { type: String },
  cpp: { type: String }
}, { _id: false });

const advancedProblemSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  legacyId: { type: String },
  title: { type: String, required: true, index: true },
  difficulty: { 
    type: String, 
    enum: ["Easy", "Medium", "Hard"], 
    required: true, 
    index: true 
  },
  categoryDisplay: { type: String },
  categories: { type: [String], index: true },
  description: {
    text: { type: String, required: true },
    notes: { type: [String], default: [] }
  },
  examples: [exampleSchema],
  constraints: { type: [String], default: [] },
  starterCode: starterCodeSchema,
  expectedOutput: expectedOutputSchema,
  
  // Advanced fields
  problemNumber: { type: Number, default: null },
  isPremiumLike: { type: Boolean, default: false },
  companies: { type: [String], default: [] },
  hints: { type: [String], default: [] },
  editorialSummary: { type: String },
  relatedTopics: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  status: { 
    type: String, 
    enum: ["draft", "published", "archived"], 
    default: "published",
    index: true 
  },
  visible: { type: Boolean, default: true, index: true },
  order: { type: Number, default: 0 },
  totalAcceptedSubmissions: { type: Number, default: 0 },
  totalSubmissions: { type: Number, default: 0 },
  acceptanceRateCached: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, default: null },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, default: null }
}, {
  timestamps: true
});

const AdvancedProblem = mongoose.model("AdvancedProblem", advancedProblemSchema);

export default AdvancedProblem;
