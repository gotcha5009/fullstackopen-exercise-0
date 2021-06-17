/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  NewPatientEntry,
  Gender,
  EntryWithoutId,
  HealthCheckRating,
  SickLeave,
  Discharge,
  DiagnoseEntry,
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (gender: any): gender is Gender => {
  return Object.values(Gender).includes(gender);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name');
  }

  return name;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }

  return ssn;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }

  return occupation;
};

const parseDescription = (description: unknown): string => {
  if (!description || !isString(description)) {
    throw new Error('Incorrect or missing description');
  }

  return description;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!specialist || !isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};

const isHealthCheckRating = (
  healthCheckRating: any
): healthCheckRating is HealthCheckRating => {
  console.log('healthCheckRating :>> ', healthCheckRating);
  console.log(
    'Object.values(HealthCheckRating) :>> ',
    Object.values(HealthCheckRating)
  );
  return Object.values(HealthCheckRating).includes(healthCheckRating);
};

const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (!isHealthCheckRating(healthCheckRating)) {
    throw new Error('Incorrect or missing healthCheckRating');
  }
  return healthCheckRating;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!employerName || !isString(employerName)) {
    throw new Error('Incorrect or missing employerName');
  }
  return employerName;
};

const isSickLeave = (sickLeave: any): sickLeave is SickLeave => {
  return isDate(sickLeave.startDate) && isDate(sickLeave.endDate);
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (!sickLeave || !isSickLeave(sickLeave)) {
    throw new Error('Incorrect sickLeave');
  }
  return sickLeave;
};

const isDischarge = (discharge: any): discharge is Discharge => {
  return isDate(discharge.date) && isString(discharge.criteria);
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || !isDischarge(discharge)) {
    throw new Error('Incorrect or missing discharge');
  }
  return discharge;
};

type Fields = {
  name: unknown;
  dateOfBirth: unknown;
  ssn: unknown;
  gender: unknown;
  occupation: unknown;
};

const toNewPatientEntry = ({
  name,
  dateOfBirth,
  gender,
  ssn,
  occupation,
}: Fields): NewPatientEntry => {
  const newEntry: NewPatientEntry = {
    name: parseName(name),
    dateOfBirth: parseDate(dateOfBirth),
    gender: parseGender(gender),
    ssn: parseSsn(ssn),
    occupation: parseOccupation(occupation),
    entries: [],
  };

  return newEntry;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewEntry = (entry: any): EntryWithoutId => {
  const diagnosisCodes = entry.diagnosisCodes as Array<DiagnoseEntry['code']>;
  switch (entry.type) {
    case 'HealthCheck':
      const healthEntry: EntryWithoutId = {
        type: 'HealthCheck',
        description: parseDescription(entry.description),
        date: parseDate(entry.date),
        specialist: parseSpecialist(entry.specialist),
        ...(diagnosisCodes && { diagnosisCodes }),
        healthCheckRating: parseHealthCheckRating(entry.healthCheckRating),
      };
      return healthEntry;
    case 'OccupationalHealthcare':
      const occuapationalEntry: EntryWithoutId = {
        type: 'OccupationalHealthcare',
        description: parseDescription(entry.description),
        date: parseDate(entry.date),
        specialist: parseSpecialist(entry.specialist),
        ...(diagnosisCodes && { diagnosisCodes }),
        employerName: parseEmployerName(entry.employerName),
        ...(Boolean(entry.sickLeave) && {
          sickLeave: parseSickLeave(entry.sickLeave),
        }),
      };
      return occuapationalEntry;
    case 'Hospital':
      const hospitalEntry: EntryWithoutId = {
        type: 'Hospital',
        description: parseDescription(entry.description),
        date: parseDate(entry.date),
        specialist: parseSpecialist(entry.specialist),
        ...(diagnosisCodes && { diagnosisCodes }),
        discharge: parseDischarge(entry.discharge),
      };
      return hospitalEntry;
    default:
      throw new Error('Entry type not found');
  }
};

export { toNewPatientEntry, toNewEntry };
