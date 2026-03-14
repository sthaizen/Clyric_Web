import mongoose from "mongoose";

// A single test case: one input, one expected output
const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
});

const problemSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    timeLimit: {
      type: Number,
      default: 5000,
    },

    outputLimit: {
      type: Number,
      default: 65536,
    },

    testCases: {
      type: [testCaseSchema],
      default: [],
    },

    sampleTestCases: {
      type: [testCaseSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Problem =
  mongoose.models.Problem || mongoose.model("Problem", problemSchema);

export default Problem;