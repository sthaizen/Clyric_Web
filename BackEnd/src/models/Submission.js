import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "AdvancedProblem",
    },
    problemSlug: { type: String, required: true, index: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    verdict: { type: String, required: true },
    testCasesPassed: { type: Number, required: true },
    totalTestCases: { type: Number, required: true },
    runtimeMs: { type: Number, default: null },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;
