import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { getDecisions } from '../services/decisionService';

const router = Router();
router.use(authMiddleware);

router.get('/json', async (req, res, next) => {
  try {
    const decisions = await getDecisions(req.user!.uid);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=decision_vault_export.json');
    res.send(JSON.stringify(decisions, null, 2));
  } catch (error) {
    next(error);
  }
});

router.get('/csv', async (req, res, next) => {
  try {
    const decisions = await getDecisions(req.user!.uid);
    
    const headers = ['id', 'title', 'category', 'status', 'created_at', 'selected_option'];
    
    if (decisions.length === 0) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=decision_vault_export.csv');
      return res.send(headers.join(',') + '\n');
    }

    let csv = headers.join(',') + '\n';

    for (const d of decisions) {
      const row = headers.map(h => {
        let val = String((d as any)[h] || '');
        // Escape quotes and wrap in quotes if contains comma or newline
        val = val.replace(/"/g, '""');
        if (val.includes(',') || val.includes('\n') || val.includes('"')) {
          val = `"${val}"`;
        }
        return val;
      });
      csv += row.join(',') + '\n';
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=decision_vault_export.csv');
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

export default router;
