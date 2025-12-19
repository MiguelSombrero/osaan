import express from 'express';
import { callDownstream } from '../services/proxyService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post(
  '/v1/admin/skills',
  asyncHandler(async (req, res) => {
    const r = await callDownstream(req, 'POST', '/v1/admin/skills', req.body);
    res.status(r.status).send(r.data);
  })
);

router.delete(
  '/v1/admin/skills/:id',
  asyncHandler(async (req, res) => {
    const r = await callDownstream(req, 'DELETE', `/v1/admin/skills/${req.params.id}`);
    if (r.status === 204) return res.status(204).end();
    res.status(r.status).send(r.data);
  })
);

export default router;
