import AdvancedProblem from "../models/AdvancedProblem.js";

// GET /api/problems
export const getProblems = async (req, res) => {
  try {
    const { search, difficulty, category, page = 1, limit = 50, sort = 'asc' } = req.query;

    const query = { visible: true, status: "published" };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    
    // Ignore "All" as a difficulty filter
    if (difficulty && difficulty !== "All") {
      query.difficulty = difficulty;
    }

    if (category && category !== "All Topics") {
      query.categories = category;
    }

    const sortOpt = sort === 'desc' ? { title: -1 } : { title: 1 };
    
    // Fallback: we should ensure older UI mapping expects array of problems directly 
    // but pagination implies total count. We will send both.
    const problems = await AdvancedProblem.find(query)
      .sort(sortOpt)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('slug legacyId title difficulty categoryDisplay categories description constraints expectedOutput examples status');

    const total = await AdvancedProblem.countDocuments(query);

    // To maintain old structure compatibility for frontend arrays, the frontend will map this data
    res.json({
      problems: problems.map(p => ({
        id: p.slug, // mapping slug to id for frontend compatibility
        title: p.title,
        difficulty: p.difficulty,
        category: p.categoryDisplay, // backward compatibility text
        categories: p.categories,
        description: p.description,
        constraints: p.constraints,
        expectedOutput: p.expectedOutput,
        examples: p.examples
      })),
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Server error fetching problems." });
  }
};

// GET /api/problems/:slug
export const getProblemBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const problem = await AdvancedProblem.findOne({ slug, visible: true, status: "published" });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Return exact matching shape for frontend
    res.json({
      id: problem.slug,
      slug: problem.slug,
      title: problem.title,
      difficulty: problem.difficulty,
      category: problem.categoryDisplay,
      categories: problem.categories,
      description: problem.description,
      examples: problem.examples,
      constraints: problem.constraints,
      starterCode: problem.starterCode,
      expectedOutput: problem.expectedOutput
    });
  } catch (error) {
    console.error("Error fetching problem details:", error);
    res.status(500).json({ message: "Server error fetching problem details." });
  }
};

// GET /api/problems/meta/topics
export const getTopicMetadata = async (req, res) => {
  try {
    const topics = await AdvancedProblem.aggregate([
      { $match: { visible: true, status: "published" } },
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
    res.json({ topics });
  } catch (error) {
    console.error("Error fetching topic metadata:", error);
    res.status(500).json({ message: "Server error fetching topic metadata." });
  }
};
