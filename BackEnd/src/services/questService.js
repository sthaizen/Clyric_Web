import UserQuestProgress from "../models/UserQuestProgress.js";
import QuestTemplate from "../models/QuestTemplate.js";
import ProblemAnalytics from "../models/ProblemAnalytics.js";

/**
 * Evaluates active quests for a user and increments progress based on an event.
 * @param {string} userId - The user ID
 * @param {object} eventPayload - { problemSlug, difficulty, categories, isFirstTimeSolved, language, mode, isCollaborative }
 */
export async function evaluateQuestProgress(userId, eventPayload) {
  try {
    const now = new Date();
    console.log(`[Quest] Evaluating quests for ${userId} with payload:`, JSON.stringify(eventPayload));

    // 1. Fetch only active, incomplete quests
    const activeQuests = await UserQuestProgress.find({
      userId,
      isCompleted: false,
      $or: [{ expiresAt: { $gt: now } }, { expiresAt: null }]
    }).populate({ path: 'questId', model: QuestTemplate, localField: 'questId', foreignField: 'questId' });

    if (!activeQuests || activeQuests.length === 0) return;

    for (const userQuest of activeQuests) {
      let template = userQuest.questId; 
      
      // Fallback: If populate failed (since questId is a string), fetch manually
      if (typeof template === 'string') {
        template = await QuestTemplate.findOne({ questId: template });
      }

      if (!template) {
        console.warn(`[Quest] Template not found for questId: ${userQuest.questId}`);
        continue;
      }

      const criteria = template.targetCriteria;
      let shouldIncrement = false;

      // Rule: Solve a problem
      if (criteria.action === "solve") {
        
        // Prevent duplicate farming: Most quests only trigger if solving a new problem, 
        // OR we just accept any solve if the rule is relaxed. Let's enforce that 
        // they only get credit on the first time they solve it, or we just trust the system.
        // For 'daily_grinder', we might want them to solve any new problem.
        if (!eventPayload.isFirstTimeSolved && template.questId !== 'daily_grinder') continue;

        // Check difficulty constraints
        const matchDifficulty = criteria.difficulty === "any" || 
          criteria.difficulty.includes(eventPayload.difficulty);

        // Check category constraints (with fallbacks for older problem data)
        const allCategories = [
          ...(eventPayload.categories || []),
          ...(eventPayload.tags || []),
          ...(eventPayload.relatedTopics || [])
        ];

        const matchCategory = criteria.category === "any" || 
          allCategories.some(cat => 
            cat.toLowerCase() === criteria.category.toLowerCase()
          );

        console.log(`[Quest] Evaluating ${template.questId}: matchDiff=${matchDifficulty}, matchCat=${matchCategory}, isFirst=${eventPayload.isFirstTimeSolved}`);

        if (matchDifficulty && matchCategory) {
          shouldIncrement = true;
        }

      } 
      // Rule: Collaborative Solve
      else if (criteria.action === "collaborate") {
        if (eventPayload.isCollaborative) {
          shouldIncrement = true;
        }
      }

      // If requirements met, update progress
      if (shouldIncrement) {
        userQuest.progress += 1;
        if (userQuest.progress >= userQuest.target) {
          userQuest.isCompleted = true;
        }
        await userQuest.save();
      }
    }

    // Special Quests: Streak or Polyglot that depend on aggregate data rather than single events
    // We can evaluate them lazily here
    const aggregateQuests = activeQuests.filter(q => 
      q.questId && (q.questId.questId === 'weekly_consistency' || q.questId.questId === 'milestone_polyglot')
    );
    
    if (aggregateQuests.length > 0) {
      const analyticsDoc = await ProblemAnalytics.findOne({ userId }).sort({ "streakSnapshot.currentStreak": -1 });
      if (analyticsDoc) {
        for (const aq of aggregateQuests) {
          if (aq.questId.questId === 'weekly_consistency' && analyticsDoc.streakSnapshot) {
            if (analyticsDoc.streakSnapshot.currentStreak >= aq.target) {
               aq.progress = aq.target;
               aq.isCompleted = true;
               await aq.save();
            } else {
               aq.progress = analyticsDoc.streakSnapshot.currentStreak;
               await aq.save();
            }
          }
          if (aq.questId.questId === 'milestone_polyglot' && analyticsDoc.languageUsage) {
            // Count keys in language usage that are > 0
            let uniqueLangs = 0;
            if (analyticsDoc.languageUsage.javascript > 0) uniqueLangs++;
            if (analyticsDoc.languageUsage.python > 0) uniqueLangs++;
            if (analyticsDoc.languageUsage.java > 0) uniqueLangs++;
            if (analyticsDoc.languageUsage.cpp > 0) uniqueLangs++;
            
            if (uniqueLangs >= aq.target && !aq.isCompleted) {
              aq.progress = aq.target;
              aq.isCompleted = true;
              await aq.save();
            } else if (uniqueLangs !== aq.progress) {
              aq.progress = uniqueLangs;
              await aq.save();
            }
          }
        }
      }
    }

  } catch (err) {
    console.error("Error evaluating quest progress:", err);
  }
}
