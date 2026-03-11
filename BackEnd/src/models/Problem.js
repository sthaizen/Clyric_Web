/**
 * Problem Model
 * 
 * Stores programming contest problems and their test cases.
 * Hidden test cases are stored here and loaded during submission judging.
 * 
 * The `problemId` field (e.g. "two-sum") is used to look up problems
 * from the frontend's submit request.
 */

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
    // URL-friendly identifier, e.g. "two-sum", "reverse-linked-list"
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

    // Time limit in milliseconds (default 5 seconds)
    timeLimit: {
      type: Number,
      default: 5000,
    },

    // Judge compares output up to this many bytes (default 64KB)
    outputLimit: {
      type: Number,
      default: 65536,
    },

    // The hidden test cases used during submission judging
    testCases: {
      type: [testCaseSchema],
      default: [],
    },

    // Optional sample test cases shown to the user in the problem description
    sampleTestCases: {
      type: [testCaseSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
