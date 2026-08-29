import { generateContentWithFallback, SYSTEM_PROMPT, formatUserPrompt } from './geminiService';
import { z } from 'zod';

const decisionAnalysisSchema = z.object({
  summary: z.string(),
  recommendation: z.string(),
  confidence: z.number().min(0).max(100),
  keyFactors: z.array(z.string()),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  risks: z.array(z.string()),
  unknowns: z.array(z.string()),
  questionsToConsider: z.array(z.string()),
  bestCase: z.string(),
  worstCase: z.string(),
  reversibility: z.string(),
  recommendedNextStep: z.string()
});

export const analyzeDecision = async (decision: any) => {
  const options = Array.isArray(decision.options)
    ? decision.options.map((o: any) => typeof o === 'string' ? o : o.label).join(', ')
    : String(decision.options);

  const priorities = Array.isArray(decision.priorities)
    ? decision.priorities.join(', ')
    : String(decision.priorities);

  const promptData = `
Title: ${decision.title}
Category: ${decision.category}
Question: ${decision.question}
Options: ${options}
Priorities: ${priorities}
Constraints: ${decision.constraints || 'None specified'}
Expected Outcome: ${decision.expected_outcome || 'Not specified'}
Notes: ${decision.notes || 'None'}

Based on this decision, provide a detailed analysis in JSON format exactly matching this schema:
{
  "summary": "brief summary of the decision",
  "recommendation": "your recommendation (e.g. 'Wait', 'Proceed', 'Option A', etc.)",
  "confidence": 0-100,
  "keyFactors": ["factor1", "factor2"],
  "pros": ["advantage1", "advantage2"],
  "cons": ["disadvantage1", "disadvantage2"],
  "risks": ["risk1", "risk2"],
  "unknowns": ["unknown1", "unknown2"],
  "questionsToConsider": ["question1", "question2"],
  "bestCase": "best case scenario description",
  "worstCase": "worst case scenario description",
  "reversibility": "description of how reversible this decision is",
  "recommendedNextStep": "what the user should do next"
}

Return ONLY valid JSON, no additional text.`;

  const result = await generateContentWithFallback(SYSTEM_PROMPT, formatUserPrompt(promptData));
  
  const validated = decisionAnalysisSchema.parse(result);
  return validated;
};
