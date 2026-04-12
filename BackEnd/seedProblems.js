import mongoose from "mongoose";
import Problem from "./src/models/Problem.js";
import { ENV } from "./src/lib/env.js";

const seedDatabase = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("Connected to MongoDB");

    // Clear existing dummy problems to ensure clean state
    await Problem.deleteMany({});

    const stockProblem = new Problem({
      problemId: "best-time-to-buy-and-sell-stock",
      title: "Best Time to Buy and Sell Stock",
      description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Return the maximum profit.",
      difficulty: "easy",
      timeLimit: 5000,
      outputLimit: 65536,

      // Sample test cases
      sampleTestCases: [
        {
          input: "prices = [7,1,5,3,6,4]",
          expectedOutput: "5"
        },
        {
          input: "prices = [7,6,4,3,1]",
          expectedOutput: "0"
        }
      ],

      testCases: [
        {
          input: "prices = [7,1,5,3,6,4]",
          expectedOutput: "5\n0"
        }
      ]
    });

    await stockProblem.save();
    console.log("Successfully seeded 'best-time-to-buy-and-sell-stock' problem with hidden test cases.");

    mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedDatabase();
