import QuestTemplate from "../models/QuestTemplate.js";
import UserQuestProgress from "../models/UserQuestProgress.js";
import UserLevelStats from "../models/UserLevelStats.js";

function getEndOfTodayUTC() {
  const d = new Date();
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

function getEndOfWeekUTC() {
  const d = new Date();
  // Get current day of week (0-6, 0 is Sunday)
  const day = d.getUTCDay();
  // We want to reset on Monday.
  // Calculate days until next Monday (if today is Monday, days = 7)
  const daysUntilMonday = (8 - day) % 7 || 7;
  d.setUTCDate(d.getUTCDate() + daysUntilMonday);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

// Ensure the user has active quests initialized.
async function initializeQuestsIfNeeded(userId) {
  const now = new Date();

  // Find all unexpired quests for the user
  const activeQuests = await UserQuestProgress.find({
    userId,
    $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }]
  });

  const dailyQuests = activeQuests.filter(q => q.questType === "daily");
  const weeklyQuests = activeQuests.filter(q => q.questType === "weekly");
  const milestoneQuests = activeQuests.filter(q => q.questType === "milestone");

  const existingQuestIds = activeQuests.map(q => q.questId);

  const newQuestsToInsert = [];

  // Generate Daily Quests (Target: 4)
  if (dailyQuests.length < 4) {
    const dailyTemplates = await QuestTemplate.aggregate([
      { $match: { type: "daily", isActive: true, questId: { $nin: existingQuestIds } } },
      { $sample: { size: 4 - dailyQuests.length } }
    ]);
    
    const endOfDay = getEndOfTodayUTC();
    dailyTemplates.forEach(t => {
      newQuestsToInsert.push({
        userId,
        questId: t.questId,
        questType: t.type,
        target: t.targetCriteria.count,
        expiresAt: endOfDay
      });
    });
  }

  // Generate Weekly Quests (Target: 8)
  if (weeklyQuests.length < 8) {
    const weeklyTemplates = await QuestTemplate.aggregate([
      { $match: { type: "weekly", isActive: true, questId: { $nin: existingQuestIds } } },
      { $sample: { size: 8 - weeklyQuests.length } }
    ]);

    const endOfWeek = getEndOfWeekUTC();
    weeklyTemplates.forEach(t => {
      newQuestsToInsert.push({
        userId,
        questId: t.questId,
        questType: t.type,
        target: t.targetCriteria.count,
        expiresAt: endOfWeek
      });
    });
  }

  // Generate Milestone Quests (Match all available)
  const milestoneTemplates = await QuestTemplate.find({ 
    type: "milestone", 
    isActive: true, 
    questId: { $nin: existingQuestIds } 
  });
  
  milestoneTemplates.forEach(t => {
    newQuestsToInsert.push({
      userId,
      questId: t.questId,
      questType: t.type,
      target: t.targetCriteria.count,
      expiresAt: null
    });
  });

  if (newQuestsToInsert.length > 0) {
    await UserQuestProgress.insertMany(newQuestsToInsert);
  }
}

// GET /api/quests/:userId
export const getUserQuests = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Lazy initialize quests if missing
    await initializeQuestsIfNeeded(userId);

    // 2. Fetch all active quests and attach template data
    const now = new Date();
    const activeQuests = await UserQuestProgress.aggregate([
      { 
        $match: { 
          userId,
          $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }]
        } 
      },
      {
        $lookup: {
          from: "questtemplates", // Mongoose collection name is lowercase plural
          localField: "questId",
          foreignField: "questId",
          as: "template"
        }
      },
      { $unwind: "$template" }
    ]);

    // 3. Get or create Level Stats
    let userStats = await UserLevelStats.findOne({ userId });
    if (!userStats) {
      userStats = await UserLevelStats.create({ userId });
    }

    res.json({
      success: true,
      stats: userStats,
      quests: activeQuests.map(q => ({
        _id: q._id,
        questId: q.questId,
        questType: q.questType,
        progress: q.progress,
        target: q.target,
        isCompleted: q.isCompleted,
        isClaimed: q.isClaimed,
        expiresAt: q.expiresAt,
        template: {
          title: q.template.title,
          description: q.template.description,
          rewardExp: q.template.rewardExp
        }
      }))
    });

  } catch (error) {
    console.error("Error fetching quests:", error);
    res.status(500).json({ success: false, message: "Failed to fetch quests" });
  }
};

// POST /api/quests/claim
export const claimQuestReward = async (req, res) => {
  try {
    const { userId, userQuestId } = req.body;
    
    if (!userId || !userQuestId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Attempt to mark as claimed, ensuring it's currently completed but unclaimed
    const updatedQuestFn = await UserQuestProgress.findOneAndUpdate(
      { _id: userQuestId, userId, isCompleted: true, isClaimed: false },
      { $set: { isClaimed: true } },
      { new: true }
    );

    if (!updatedQuestFn) {
      return res.status(400).json({ success: false, message: "Quest is not ready to be claimed or already claimed." });
    }

    // Fetch template to know the reward amount
    const template = await QuestTemplate.findOne({ questId: updatedQuestFn.questId });
    if (!template) {
      return res.status(500).json({ success: false, message: "Quest template missing" });
    }

    // Update EXP and calculate leveling
    const xpToAdd = template.rewardExp;
    let userStats = await UserLevelStats.findOne({ userId });
    if (!userStats) {
      userStats = await UserLevelStats.create({ userId });
    }

    userStats.totalExp += xpToAdd;
    
    let leveledUp = false;
    // Simple level curve: required EXP = Level * Level * 100
    // Keep increasing level while totalExp is greater than the required for the *next* level
    while (true) {
      const requiredExpForNextLevel = userStats.currentLevel * userStats.currentLevel * 100;
      if (userStats.totalExp >= requiredExpForNextLevel) {
        userStats.currentLevel += 1;
        userStats.lastLeveledUpAt = new Date();
        leveledUp = true;
      } else {
        break;
      }
    }

    await userStats.save();

    res.json({
      success: true,
      leveledUp,
      xpAdded: xpToAdd,
      stats: userStats,
      quest: {
        _id: updatedQuestFn._id,
        isClaimed: true
      }
    });

  } catch (error) {
    console.error("Error claiming quest:", error);
    res.status(500).json({ success: false, message: "Failed to claim reward" });
  }
};
