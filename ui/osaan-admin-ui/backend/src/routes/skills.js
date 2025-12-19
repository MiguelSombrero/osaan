import express from 'express';
import { callDownstream } from '../services/proxyService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get(
  '/v1/skills',
  asyncHandler(async (req, res) => {
    const r = await callDownstream(req, 'GET', '/v1/skills', undefined, req.query);
    res.status(r.status).send(r.data);
  })
);

export default router;
