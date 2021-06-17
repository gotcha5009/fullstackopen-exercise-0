import patientData from '../../data/patients';
import {
  PublicPatient,
  Patient,
  NewPatientEntry,
  EntryWithoutId,
  Entry,
} from '../types';
import { v1 as uuid } from 'uuid';

const patients = patientData;

const getEntries = (): Patient[] => {
  return patients;
};

const findById = (id: string): Patient | undefined => {
  const patient = patients.find((d) => d.id === id);
  return patient;
};

const getPublicPatients = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatientEntry): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...patient,
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patient: Patient, entry: EntryWithoutId): Entry | null => {
  const newEntry = {
    id: uuid(),
    ...entry,
  };
  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  addPatient,
  getPublicPatients,
  findById,
  addEntry,
};
