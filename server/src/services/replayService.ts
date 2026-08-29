import { generateContentWithFallback, SYSTEM_PROMPT, formatUserPrompt } from './geminiService';
import { z } from 'zod';

const decisionReplaySchema = z.object({
  gotRight: z.array(z.string()),
  misjudged: z.array(z.string()),
  whatChanged: z.string(),
  reflection: z.string(),
  decisionQuality: z.number().min(0).max(100),
  qualityReasons: z.array(z.string())
});

export const generateReplay = async (decision: any) => {
  const analysis = typeof decision.analysis === 'string' ? JSON.parse(decision.analysis) : decision.analysis;
  const outcome = typeof decision.outcome === 'string' ? JSON.parse(decision.outcome) : decision.outcome;

  const promptData = `
Title: ${decision.title}
Question: ${decision.question}
Original Analysis Summary: ${analysis?.summary || 'N/A'}
AI Recommendation: ${analysis?.recommendation || 'N/A'}
AI Confidence: ${analysis?.confidence || 'N/A'}
Key Risks Identified: ${(analysis?.risks || []).join(', ') || 'None'}
Initial Confidence: ${decision.initial_confidence}%
Expected Outcome: ${decision.expected_outcome || 'Not specified'}

Selected Option: ${decision.selected_option}
Final Confidence: ${decision.final_confidence}%
Decision Rationale: ${decision.decision_rationale || 'Not provided'}

Actual Outcome Description: ${outcome?.description || 'N/A'}
Expectation Match: ${outcome?.expectationMatch || 'N/A'}
Satisfaction: ${outcome?.satisfaction || 'N/A'}/5
Surprises: ${outcome?.surprises || 'None'}
Would Do Differently: ${outcome?.wouldDoDifferently || 'Nothing'}

Analyze this decision's lifecycle from initial thoughts to actual outcome.
IMPORTANT: The quality score (decisionQuality 0-100) evaluates REASONING quality, NOT outcome quality.
A good decision with bad luck should still score well. Consider:
- Were alternatives properly considered?
- Were risks identified accurately?
- Were assumptions made explicit?
- Was confidence well-calibrated?
- Was important information ignored?

Return a JSON object exactly matching this schema:
{
  "gotRight": ["things the user correctly predicted or assessed"],
  "misjudged": ["things the user got wrong or underestimated"],
  "whatChanged": "key factors that changed between decision and outcome",
  "reflection": "thoughtful AI observation about the decision process (2-3 sentences)",
  "decisionQuality": 0-100,
  "qualityReasons": ["reason1 for the quality score", "reason2"]
}

Return ONLY valid JSON, no additional text.`;

  const result = await generateContentWithFallback(SYSTEM_PROMPT, formatUserPrompt(promptData));
  
  const validated = decisionReplaySchema.parse(result);
  return validated;
};
