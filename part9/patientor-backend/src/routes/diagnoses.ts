import express from 'express';
import diagService from '../services/diagnoseService';

const router = express.Router();

router
  .get('/', (_req, res) => {
    //   res.send('Fetching all diaries!');
    res.json(diagService.getEntries());
  })
  .post('/', (_req, res) => {
    res.send('Saving a diary!');
  });

export default router;
