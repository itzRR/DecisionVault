import { getDb } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '../middleware/errorHandler';

export const createDecision = async (userId: string, input: any) => {
  const db = getDb();
  const id = uuidv4();
  
  const now = new Date().toISOString();
  
  const decisionData = {
    id,
    user_id: userId,
    title: input.title,
    category: input.category,
    question: input.question,
    options: input.options,
    priorities: input.priorities,
    constraints: input.constraints || '',
    decisionDate: input.decisionDate || null,
    initialConfidence: input.initialConfidence || 50,
    notes: input.notes || '',
    expectedOutcome: input.expectedOutcome || '',
    status: 'DRAFT',
    created_at: now,
    updated_at: now,
    analysis: null,
    selected_option: null,
    final_confidence: null,
    decision_rationale: null,
    decided_at: null,
    outcome: null,
    outcome_recorded_at: null,
    replay: null,
    replay_generated_at: null
  };

  await db.collection('decisions').doc(id).set(decisionData);
  return mapToClientDecision(decisionData);
};

export const getDecision = async (userId: string, decisionId: string) => {
  const db = getDb();
  const doc = await db.collection('decisions').doc(decisionId).get();
  
  if (!doc.exists) throw new NotFoundError('Decision not found');
  
  const data = doc.data()!;
  if (data.user_id !== userId) throw new NotFoundError('Decision not found');
  
  return mapToClientDecision(data);
};

export const getDecisions = async (userId: string, filters?: { category?: string, status?: string, search?: string, sort?: string }) => {
  const db = getDb();
  let query: FirebaseFirestore.Query = db.collection('decisions').where('user_id', '==', userId);

  if (filters?.category) {
    query = query.where('category', '==', filters.category);
  }
  if (filters?.status) {
    query = query.where('status', '==', filters.status);
  }

  const snapshot = await query.get();
  let decisions = snapshot.docs.map(doc => mapToClientDecision(doc.data()));

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    decisions = decisions.filter(d => d.title.toLowerCase().includes(searchLower));
  }

  // Sort
  decisions.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    
    if (filters?.sort === 'oldest') return dateA - dateB;
    if (filters?.sort === 'quality_high') {
      const qA = a.replay?.decisionQuality || 0;
      const qB = b.replay?.decisionQuality || 0;
      return qB - qA;
    }
    if (filters?.sort === 'quality_low') {
      const qA = a.replay?.decisionQuality || 0;
      const qB = b.replay?.decisionQuality || 0;
      return qA - qB;
    }
    // Default newest
    return dateB - dateA;
  });

  return decisions;
};

export const updateDecision = async (userId: string, decisionId: string, updates: Record<string, any>) => {
  const db = getDb();
  const decisionRef = db.collection('decisions').doc(decisionId);
  
  // Verify ownership
  await getDecision(userId, decisionId);

  const allowedFields = [
    'title', 'category', 'question', 'options', 'priorities', 'constraints',
    'decisionDate', 'initialConfidence', 'notes', 'expectedOutcome',
    'analysis', 'selected_option', 'final_confidence', 'decision_rationale',
    'decided_at', 'outcome', 'outcome_recorded_at', 'replay', 'replay_generated_at', 'status'
  ];

  const updateData: Record<string, any> = {};

  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined && allowedFields.includes(key)) {
      updateData[key] = value;
    }
  }

  if (Object.keys(updateData).length === 0) return getDecision(userId, decisionId);

  updateData.updated_at = new Date().toISOString();

  await decisionRef.update(updateData);
  return getDecision(userId, decisionId);
};

export const deleteDecision = async (userId: string, decisionId: string) => {
  const db = getDb();
  
  // Verify ownership
  await getDecision(userId, decisionId);
  
  await db.collection('decisions').doc(decisionId).delete();
  return true;
};

export const getStats = async (userId: string) => {
  const db = getDb();
  const snapshot = await db.collection('decisions').where('user_id', '==', userId).get();
  
  let totalDecisions = 0;
  let pendingDecisions = 0;
  let completedDecisions = 0;
  let totalQuality = 0;
  let qualityCount = 0;
  
  snapshot.forEach(doc => {
    totalDecisions++;
    const data = doc.data();
    
    if (['DRAFT', 'ANALYZING', 'ANALYZED', 'DECISION_MADE', 'AWAITING_OUTCOME'].includes(data.status)) {
      pendingDecisions++;
    } else if (['COMPLETED', 'OUTCOME_RECORDED', 'REPLAY_READY'].includes(data.status)) {
      completedDecisions++;
    }
    
    if (data.replay && typeof data.replay.decisionQuality === 'number') {
      totalQuality += data.replay.decisionQuality;
      qualityCount++;
    }
  });

  return {
    totalDecisions,
    pendingDecisions,
    completedDecisions,
    averageQuality: qualityCount > 0 ? Math.round(totalQuality / qualityCount) : null
  };
};

const mapToClientDecision = (data: any) => {
  if (!data) return data;
  
  // Map snake_case to camelCase for the client
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    category: data.category,
    question: data.question,
    options: data.options,
    priorities: data.priorities,
    constraints: data.constraints,
    decisionDate: data.decisionDate,
    initialConfidence: data.initialConfidence,
    notes: data.notes,
    expectedOutcome: data.expectedOutcome,
    analysis: data.analysis,
    selectedOption: data.selected_option,
    finalConfidence: data.final_confidence,
    decisionRationale: data.decision_rationale,
    decidedAt: data.decided_at,
    outcome: data.outcome,
    outcomeRecordedAt: data.outcome_recorded_at,
    replay: data.replay,
    replayGeneratedAt: data.replay_generated_at,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};
