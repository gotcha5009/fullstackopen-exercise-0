import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../utils';

const router = express.Router();

router
  .get('/', (_req, res) => {
    //   res.send('Fetching all diaries!');
    res.json(patientService.getNonSensitiveEntries());
  })
  .post('/', (req, res) => {
    try {
      const newPatientEntry = toNewPatientEntry(req.body);
      const addedEntry = patientService.addPatient(newPatientEntry);
      res.json(addedEntry);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      res.status(400).json({ error: e.message });
    }
  });

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post('/:id/entries', (req, res) => {
  const newEntry = patientService.addEntry(req.params.id, req.body);
  if (newEntry) {
    res.send(newEntry);
  } else {
    res.sendStatus(404);
  }
});

export default router;
