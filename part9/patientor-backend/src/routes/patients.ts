import express from 'express';
import patientService from '../services/patientService';
import { toNewPatientEntry, toNewEntry } from '../utils';

const router = express.Router();

router
  .get('/', (_req, res) => {
    //   res.send('Fetching all diaries!');
    res.json(patientService.getPublicPatients());
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
  try {
    const newEntry = toNewEntry(req.body);
    const patient = patientService.findById(req.params.id);

    if (patient) {
      const newPatient = patientService.addEntry(patient, newEntry);
      res.send(newPatient);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    res.status(400).json({ error: e.message });
  }
});

export default router;
