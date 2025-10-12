import { Router } from 'express';
import { callDownstream } from '../proxy.js';
import { requireLogin } from '../auth.js';

const router = Router();
router.use(requireLogin());

router.get('/v1/admin/skills', async (req, res) => {
  const r = await callDownstream(req, 'GET', '/v1/admin/skills');
  res.status(r.status).send(r.data);
});

router.post('/v1/admin/skills', async (req, res) => {
  const r = await callDownstream(req, 'POST', '/v1/admin/skills', req.body);
  res.status(r.status).send(r.data);
});

router.delete('/v1/admin/skills/:id', async (req, res) => {
  const r = await callDownstream(req, 'DELETE', `/v1/admin/skills/${req.params.id}`);
  if (r.status === 204) return res.status(204).end();
  res.status(r.status).send(r.data);
});

export default router;
