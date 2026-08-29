import { generateContentWithFallback, SYSTEM_PROMPT, formatUserPrompt } from './geminiService';
import { getDb } from '../db/connection';
import { z } from 'zod';

const personalInsightSchema = z.array(z.object({
  type: z.enum(['STRENGTH', 'WEAKNESS', 'PATTERN', 'BIAS']),
  title: z.string(),
  description: z.string(),
  actionableAdvice: z.string()
}));

export const generateInsights = async (userId: string) => {
  const db = getDb();
  
  const snapshot = await db.collection('decisions')
    .where('user_id', '==', userId)
    .where('status', 'in', ['COMPLETED', 'OUTCOME_RECORDED'])
    .get();

  if (snapshot.docs.length < 3) {
    return {
      message: 'Complete at least 3 decisions to unlock your personal decision patterns.',
      insights: []
    };
  }

  // Anonymize and map data — only send aggregated patterns, not full text
  const summaries = snapshot.docs.map(doc => {
    const d = doc.data();
    return {
      category: d.category,
      initialConfidence: d.initialConfidence,
      finalConfidence: d.final_confidence,
      outcomeSatisfaction: d.outcome?.satisfaction,
      replayQuality: d.replay?.decisionQuality
    };
  });

  const promptData = `
User's completed decisions summary (anonymized — no personal details included):
${JSON.stringify(summaries, null, 2)}

Analyze these decisions to identify recurring patterns in the user's decision-making process.
Look for patterns like:
- Confidence calibration (do they over/under-estimate?)
- Category-specific tendencies
- Quality trends over time
- Risk assessment accuracy

Return a JSON array of insight objects exactly matching this schema:
[
  {
    "type": "STRENGTH" | "WEAKNESS" | "PATTERN" | "BIAS",
    "title": "short pattern title",
    "description": "2-3 sentence description of the pattern",
    "actionableAdvice": "specific advice based on this pattern"
  }
]

Return 3-5 insights. Return ONLY valid JSON, no additional text.`;

  const result = await generateContentWithFallback(SYSTEM_PROMPT, formatUserPrompt(promptData));
  
  const validated = personalInsightSchema.parse(result);
  return { insights: validated };
};
