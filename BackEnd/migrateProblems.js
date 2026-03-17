import mongoose from "mongoose";
import AdvancedProblem from "./src/models/AdvancedProblem.js";
import { ENV } from "./src/lib/env.js";
import { PROBLEMS } from "../FrontEnd/src/data/problem.js";

const seedDatabase = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("Connected to MongoDB");

    const problemsArray = Object.values(PROBLEMS);
    console.log(`Found ${problemsArray.length} problems to migrate from frontend problem.js`);

    for (const p of problemsArray) {
      // Normalize categories: split by ' • '
      const categoryDisplay = p.category || "Uncategorized";
      const categories = categoryDisplay !== "Uncategorized" 
        ? categoryDisplay.split(' • ').map(c => c.trim()) 
        : ["Uncategorized"];

      const problemData = {
        slug: p.id,
        legacyId: p.id,
        title: p.title,
        difficulty: p.difficulty,
        categoryDisplay: categoryDisplay,
        categories: categories,
        description: {
          text: p.description?.text || "",
          notes: p.description?.notes || []
        },
        examples: p.examples || [],
        constraints: p.constraints || [],
        starterCode: p.starterCode || {},
        expectedOutput: p.expectedOutput || {},
        status: "published",
        visible: true
      };

      await AdvancedProblem.findOneAndUpdate(
        { slug: p.id },
        { $set: problemData },
        { upsert: true, new: true }
      );
    }

    console.log("Migration completed successfully.");

    mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
};

seedDatabase();
