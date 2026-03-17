import mongoose from "mongoose";

const attemptHistorySchema = new mongoose.Schema({
  attemptedAt: { type: Date, default: Date.now },
  language: { type: String },
  mode: { type: String, enum: ["practice", "interview"], default: "practice" },
  actionType: { type: String, enum: ["run", "submit", "hint", "ai_help", "note_saved", "code_reset"], required: true },
  verdict: { type: String },
  runtimeMs: { type: Number, default: null },
  memoryKb: { type: Number, default: null },
  timeSpentSeconds: { type: Number, default: null },
  usedHint: { type: Boolean, default: false },
  usedAiHelp: { type: Boolean, default: false },
  codeReset: { type: Boolean, default: false }
}, { _id: false });

const acceptedHistorySchema = new mongoose.Schema({
  acceptedAt: { type: Date, default: Date.now },
  language: { type: String },
  runtimeMs: { type: Number, default: null },
  memoryKb: { type: Number, default: null },
  timeSpentSeconds: { type: Number, default: null },
  mode: { type: String, enum: ["practice", "interview"], default: "practice" }
}, { _id: false });

const problemAnalyticsSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  problemId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, ref: 'AdvancedProblem' },
  problemSlug: { type: String, index: true },
  titleSnapshot: { type: String },
  difficultySnapshot: { type: String },
  categoriesSnapshot: { type: [String] },
  categoryDisplaySnapshot: { type: String },

  // Attempt/submission counts
  totalAttempts: { type: Number, default: 0 },
  totalRuns: { type: Number, default: 0 },
  totalSubmissions: { type: Number, default: 0 },
  acceptedSubmissions: { type: Number, default: 0 },
  wrongAnswerCount: { type: Number, default: 0 },
  timeLimitExceededCount: { type: Number, default: 0 },
  runtimeErrorCount: { type: Number, default: 0 },
  compilationErrorCount: { type: Number, default: 0 },
  memoryLimitExceededCount: { type: Number, default: 0 },
  otherErrorCount: { type: Number, default: 0 },

  // Status / solve tracking
  isSolved: { type: Boolean, default: false },
  firstSolvedAt: { type: Date, default: null },
  lastSolvedAt: { type: Date, default: null },
  lastAttemptAt: { type: Date, default: null },
  solvedWithoutHints: { type: Boolean, default: false },
  solvedInInterviewMode: { type: Boolean, default: false },
  solvedInPracticeMode: { type: Boolean, default: false },
  firstAttemptAccepted: { type: Boolean, default: false },

  // Time-based metrics
  totalTimeSpentSeconds: { type: Number, default: 0 },
  averageSolveTimeSeconds: { type: Number, default: 0 },
  fastestAcceptedTimeSeconds: { type: Number, default: null },
  slowestAcceptedTimeSeconds: { type: Number, default: null },
  currentActiveSessionStart: { type: Date, default: null },

  // Code/editor usage metrics
  preferredLanguage: { type: String, default: null },
  languageUsage: {
    javascript: { type: Number, default: 0 },
    python: { type: Number, default: 0 },
    java: { type: Number, default: 0 },
    cpp: { type: Number, default: 0 }
  },
  starterCodeResetCount: { type: Number, default: 0 },
  codeRunWithoutSubmitCount: { type: Number, default: 0 },
  debugIterationCount: { type: Number, default: 0 },
  codeExecutionSuccessCount: { type: Number, default: 0 },
  codeExecutionFailureCount: { type: Number, default: 0 },

  // Hint/learning metrics
  hintsOpenedCount: { type: Number, default: 0 },
  editorialViewedCount: { type: Number, default: 0 },
  aiHelpUsedCount: { type: Number, default: 0 },
  notesCreatedCount: { type: Number, default: 0 },
  notesUpdatedCount: { type: Number, default: 0 },

  // Accuracy and progress metrics
  acceptanceRate: { type: Number, default: 0 },
  runToSubmitRatio: { type: Number, default: 0 },
  successAfterMultipleAttempts: { type: Number, default: 0 },
  averageAttemptsBeforeAccept: { type: Number, default: 0 },
  improvementScore: { type: Number, default: 0 },

  // Streak/activity snapshots
  activityDates: { type: [Date], default: [] },
  lastPracticedAt: { type: Date, default: null },
  streakSnapshot: {
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 }
  },

  // Session/interview metrics
  interviewSessionsJoined: { type: Number, default: 0 },
  interviewSessionsHosted: { type: Number, default: 0 },
  collaborativeEditsCount: { type: Number, default: 0 },
  whiteboardOrDiscussionInteractions: { type: Number, default: 0 },

  // History arrays
  attemptHistory: [attemptHistorySchema],
  acceptedHistory: [acceptedHistorySchema]

}, {
  timestamps: true
});


problemAnalyticsSchema.index({ userId: 1, problemId: 1 }, { unique: true });

const ProblemAnalytics = mongoose.model("ProblemAnalytics", problemAnalyticsSchema);

export default ProblemAnalytics;
