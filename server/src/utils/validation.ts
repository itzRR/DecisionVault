import { z } from 'zod';

const decisionOptionSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  description: z.string().optional()
});

export const createDecisionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  category: z.enum(['Career', 'Education', 'Technology', 'Money', 'Business', 'Travel', 'Personal', 'Other']),
  question: z.string().min(1, 'Question is required').max(5000, 'Question too long'),
  options: z.array(decisionOptionSchema).min(2, 'At least 2 options required').max(10, 'Maximum 10 options'),
  priorities: z.array(z.string()).min(1, 'At least 1 priority required'),
  constraints: z.string().max(2000).optional().default(''),
  decisionDate: z.string().optional().default(''),
  initialConfidence: z.number().min(0).max(100).optional().default(50),
  notes: z.string().max(5000).optional().default(''),
  expectedOutcome: z.string().max(5000).optional().default(''),
});

export const makeDecisionSchema = z.object({
  selectedOption: z.string().min(1, 'Selection is required'),
  finalConfidence: z.number().min(0).max(100),
  decisionRationale: z.string().max(5000).optional().default(''),
});

export const recordOutcomeSchema = z.object({
  description: z.string().min(1, 'Description is required').max(5000),
  expectationMatch: z.enum(['Much better', 'Better', 'About the same', 'Worse', 'Much worse']),
  satisfaction: z.number().min(1).max(5),
  surprises: z.string().max(5000).optional().default(''),
  wouldDoDifferently: z.string().max(5000).optional().default(''),
  notes: z.string().max(5000).optional().default(''),
});

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  defaultCategory: z.enum(['Career', 'Education', 'Technology', 'Money', 'Business', 'Travel', 'Personal', 'Other']).optional(),
});
