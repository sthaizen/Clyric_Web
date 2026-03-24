import mongoose from "mongoose";
import dotenv from "dotenv";
import QuestTemplate from "../src/models/QuestTemplate.js";

dotenv.config();

const questTemplates = [
  // DAILY QUESTS (4+)
  {
    questId: "daily_grinder",
    title: "Daily Grinder",
    description: "Solve any 2 problems today.",
    type: "daily",
    targetCriteria: { action: "solve", count: 2, difficulty: "any", category: "any" },
    rewardExp: 150
  },
  {
    questId: "easy_stepping",
    title: "Easy Stepping",
    description: "Solve 1 Easy difficulty problem.",
    type: "daily",
    targetCriteria: { action: "solve", count: 1, difficulty: "Easy", category: "any" },
    rewardExp: 100
  },
  {
    questId: "algo_explorer",
    title: "Algorithm Explorer",
    description: "Solve a problem in the 'Algorithms' category.",
    type: "daily",
    targetCriteria: { action: "solve", count: 1, difficulty: "any", category: "Algorithms" },
    rewardExp: 120
  },
  {
    questId: "daily_warmup",
    title: "Daily Warmup",
    description: "Run code successfully (get an Executed verdict) 3 times.",
    type: "daily",
    targetCriteria: { action: "run", count: 3, difficulty: "any", category: "any" },
    rewardExp: 80
  },
  {
    questId: "daily_medium",
    title: "Medium Challenge",
    description: "Solve 1 Medium difficulty problem.",
    type: "daily",
    targetCriteria: { action: "solve", count: 1, difficulty: "Medium", category: "any" },
    rewardExp: 200
  },

  // WEEKLY QUESTS (8+)
  {
    questId: "weekly_consistency",
    title: "Consistency King",
    description: "Maintain a 3-day solve streak this week.",
    type: "weekly",
    targetCriteria: { action: "streak", count: 3 },
    rewardExp: 500
  },
  {
    questId: "medium_master",
    title: "Medium Master",
    description: "Successfully solve 3 Medium problems.",
    type: "weekly",
    targetCriteria: { action: "solve", count: 3, difficulty: "Medium" },
    rewardExp: 450
  },
  {
    questId: "weekly_grinder",
    title: "Weekly Grinder",
    description: "Solve 10 problems of any difficulty.",
    type: "weekly",
    targetCriteria: { action: "solve", count: 10, difficulty: "any" },
    rewardExp: 800
  },
  {
    questId: "weekly_hard",
    title: "Tough Nut",
    description: "Solve 1 Hard problem.",
    type: "weekly",
    targetCriteria: { action: "solve", count: 1, difficulty: "Hard" },
    rewardExp: 600
  },
  {
    questId: "weekly_ds",
    title: "Data Structures Pro",
    description: "Solve 2 problems in Data Structures.",
    type: "weekly",
    targetCriteria: { action: "solve", count: 2, category: "Data Structures" },
    rewardExp: 400
  },
  {
    questId: "weekly_collaborator",
    title: "Team Player",
    description: "Solve 1 problem in a collaborative session.",
    type: "weekly",
    targetCriteria: { action: "collaborate", count: 1 },
    rewardExp: 350
  },
  {
    questId: "weekly_explorer",
    title: "Diverse Mind",
    description: "Solve problems in 3 different categories.",
    type: "weekly",
    targetCriteria: { action: "unique_categories", count: 3 },
    rewardExp: 500
  },
  {
    questId: "weekly_polyglot",
    title: "Bilingual Developer",
    description: "Solve problems using 2 different languages.",
    type: "weekly",
    targetCriteria: { action: "polyglot", count: 2 },
    rewardExp: 450
  },

  // MILESTONES (15+)
  {
    questId: "milestone_first_blood",
    title: "First Blood",
    description: "Submit your first successful 'Accepted' solution.",
    type: "milestone",
    targetCriteria: { action: "solve", count: 1 },
    rewardExp: 200
  },
  {
    questId: "milestone_polyglot",
    title: "Polyglot",
    description: "Solve problems using at least 3 different programming languages.",
    type: "milestone",
    targetCriteria: { action: "polyglot", count: 3 },
    rewardExp: 1000
  },
  {
    questId: "milestone_10_solved",
    title: "Novice Solver",
    description: "Solve 10 problems in total.",
    type: "milestone",
    targetCriteria: { action: "solve", count: 10 },
    rewardExp: 500
  },
  {
    questId: "milestone_50_solved",
    title: "Dedicated Problem Solver",
    description: "Solve 50 problems in total.",
    type: "milestone",
    targetCriteria: { action: "solve", count: 50 },
    rewardExp: 2000
  },
  {
    questId: "milestone_100_solved",
    title: "Centurion",
    description: "Solve 100 problems in total. A true milestone!",
    type: "milestone",
    targetCriteria: { action: "solve", count: 100 },
    rewardExp: 5000
  },
  {
    questId: "milestone_5_hard",
    title: "Hard Mode Initiated",
    description: "Solve 5 Hard difficulty problems.",
    type: "milestone",
    targetCriteria: { action: "solve", count: 5, difficulty: "Hard" },
    rewardExp: 1500
  },
  {
    questId: "milestone_25_medium",
    title: "Medium Specialist",
    description: "Solve 25 Medium difficulty problems.",
    type: "milestone",
    targetCriteria: { action: "solve", count: 25, difficulty: "Medium" },
    rewardExp: 2500
  },
  {
    questId: "milestone_streak_7",
    title: "One Week Strong",
    description: "Achieve a 7-day solving streak.",
    type: "milestone",
    targetCriteria: { action: "streak", count: 7 },
    rewardExp: 1000
  },
  {
    questId: "milestone_streak_30",
    title: "Unstoppable",
    description: "Achieve a 30-day solving streak. Legendary consistency.",
    type: "milestone",
    targetCriteria: { action: "streak", count: 30 },
    rewardExp: 10000
  },
  {
    questId: "milestone_5_collab",
    title: "Social Butterfly",
    description: "Solve 5 problems while in a collaborative session.",
    type: "milestone",
    targetCriteria: { action: "collaborate", count: 5 },
    rewardExp: 1000
  },
  {
    questId: "milestone_flawless",
    title: "Flawless Execution",
    description: "Get 'Accepted' on the first attempt of a problem 10 times.",
    type: "milestone",
    targetCriteria: { action: "first_try_accept", count: 10 },
    rewardExp: 2000
  },
  {
    questId: "milestone_algo_expert",
    title: "Algorithm Expert",
    description: "Solve 20 problems in the Algorithms category.",
    type: "milestone",
    targetCriteria: { action: "solve", count: 20, category: "Algorithms" },
    rewardExp: 1500
  },
  {
    questId: "milestone_ds_expert",
    title: "Data Structure Expert",
    description: "Solve 20 problems in the Data Structures category.",
    type: "milestone",
    targetCriteria: { action: "solve", count: 20, category: "Data Structures" },
    rewardExp: 1500
  },
  {
    questId: "milestone_100_runs",
    title: "Debugger",
    description: "Execute your code (run without submitting) 100 times.",
    type: "milestone",
    targetCriteria: { action: "run", count: 100 },
    rewardExp: 500
  },
  {
    questId: "milestone_level_10",
    title: "Rising Star",
    description: "Reach Level 10 in the Quest System.",
    type: "milestone",
    targetCriteria: { action: "level", count: 10 },
    rewardExp: 2000
  }
];

const seedQuests = async () => {
  try {
    const DB_URL = process.env.DB_URL;
    if (!DB_URL) {
      throw new Error("DB_URL is not defined in .env file");
    }
    await mongoose.connect(DB_URL);
    
    console.log("Connected to MongoDB for seeding...");

    // Clear existing templates to avoid duplicates during testing
    await QuestTemplate.deleteMany({});
    
    // Insert the new templates
    await QuestTemplate.insertMany(questTemplates);

    console.log("Successfully seeded Quest Templates! ✅");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

seedQuests();
