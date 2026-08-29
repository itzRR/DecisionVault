import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { 
  createDecision, getDecision, getDecisions, updateDecision, 
  deleteDecision, getStats 
} from '../services/decisionService';
import { analyzeDecision } from '../services/analysisService';
import { generateReplay } from '../services/replayService';
import { createDecisionSchema, makeDecisionSchema, recordOutcomeSchema } from '../utils/validation';

const router = Router();
router.use(authMiddleware);

router.post('/', async (req, res, next) => {
  try {
    const validated = createDecisionSchema.parse(req.body);
    const decision = createDecision(req.user!.uid, validated);
    res.json({ success: true, data: decision });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { category, status, search, sort } = req.query;
    const decisions = getDecisions(req.user!.uid, {
      category: category as string,
      status: status as string,
      search: search as string,
      sort: sort as string
    });
    res.json({ success: true, data: decisions });
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const stats = getStats(req.user!.uid);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const decision = getDecision(req.user!.uid, req.params.id);
    res.json({ success: true, data: decision });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    // In a full implementation, validate updates too
    const updated = updateDecision(req.user!.uid, req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    deleteDecision(req.user!.uid, req.params.id);
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/analyze', async (req, res, next) => {
  try {
    const decision = getDecision(req.user!.uid, req.params.id);
    const analysis = await analyzeDecision(decision);
    const updated = updateDecision(req.user!.uid, req.params.id, {
      analysis,
      status: 'ANALYZED'
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/decide', async (req, res, next) => {
  try {
    const validated = makeDecisionSchema.parse(req.body);
    const updated = updateDecision(req.user!.uid, req.params.id, {
      selected_option: validated.selectedOption,
      final_confidence: validated.finalConfidence,
      decision_rationale: validated.decisionRationale,
      decided_at: new Date().toISOString(),
      status: 'AWAITING_OUTCOME'
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/outcome', async (req, res, next) => {
  try {
    const validated = recordOutcomeSchema.parse(req.body);
    const updated = updateDecision(req.user!.uid, req.params.id, {
      outcome: validated,
      outcome_recorded_at: new Date().toISOString(),
      status: 'OUTCOME_RECORDED'
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/replay', async (req, res, next) => {
  try {
    const decision = getDecision(req.user!.uid, req.params.id);
    const replay = await generateReplay(decision);
    const updated = updateDecision(req.user!.uid, req.params.id, {
      replay,
      replay_generated_at: new Date().toISOString(),
      status: 'COMPLETED'
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
