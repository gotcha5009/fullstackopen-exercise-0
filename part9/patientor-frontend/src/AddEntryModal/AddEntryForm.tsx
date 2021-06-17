import React from 'react';
import { Grid, Button, Form as UIForm } from 'semantic-ui-react';
import { Field, Formik, Form } from 'formik';

import {
  TextField,
  SelectField,
  EntryOption,
  NumberField,
  DiagnosisSelection,
  PatientOption,
} from './FormField';
// import { Patient, HealthCheckRating } from '../types';
import {
  Diagnosis,
  EntryWithoutId,
  HealthCheckRating,
  Patient,
} from '../types';
import { useStateValue } from '../state';

/*
 * use type Patient, but omit id and entries,
 * because those are irrelevant for new patient object.
 */
// export type PatientFormValues = Omit<Patient, 'id' | 'entries'>;

// interface Props {
//   onSubmit: (values: PatientFormValues) => void;
//   onCancel: () => void;
// }

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  onCancel: () => void;
}

export type EntryFormValues = {
  patient: Patient['id'];
  type: EntryWithoutId['type'];
  description: string;
  date: string;
  specialist: string;
  employerName: string;
  startDate: string;
  endDate: string;
  dischargeDate: string;
  criteria: string;
  healthCheckRating: HealthCheckRating;
  diagnosisCodes: Array<Diagnosis['code']>;
};

// export interface EntryFormValues extends EntryWithoutId = {
//   patient: string
// }

// const genderOptions: GenderOption[] = [
//   { value: Gender.Male, label: 'Male' },
//   { value: Gender.Female, label: 'Female' },
//   { value: Gender.Other, label: 'Other' },
// ];

const entryTypeOptions: EntryOption[] = [
  { value: 'HealthCheck', label: 'Health Check' },
  { value: 'OccupationalHealthcare', label: 'Occupational Healthcare' },
  { value: 'Hospital', label: 'Hospital' },
];

export const AddEntryForm = ({ onSubmit, onCancel }: Props) => {
  const [{ patients, diagnoses }] = useStateValue();

  const patientLists: PatientOption[] = Object.keys(patients).map((id) => ({
    value: id,
    label: patients[id].name,
  }));
  return (
    <Formik
      initialValues={{
        patient: patientLists[0].value,
        type: 'HealthCheck',
        description: '',
        date: '',
        specialist: '',
        employerName: '',
        startDate: '',
        endDate: '',
        dischargeDate: '',
        criteria: '',
        healthCheckRating: HealthCheckRating.Healthy,
        diagnosisCodes: [],
      }}
      onSubmit={onSubmit}
      validate={(values) => {
        const requiredError = 'Field is required';
        const errors: { [field: string]: string } = {};
        if (!values.description) {
          errors.description = requiredError;
        }
        if (!values.specialist) {
          errors.ssn = requiredError;
        }
        if (!values.date) {
          errors.date = requiredError;
        }
        if (values.type === 'OccupationalHealthcare') {
          if (!values.employerName) {
            errors.employerName = requiredError;
          }
          if (
            !(
              (values.startDate && values.endDate) ||
              (!values.startDate && !values.endDate)
            )
          ) {
            errors.startDate = requiredError;
            errors.endDate = requiredError;
          }
        }
        if (values.type === 'Hospital') {
          if (!values.criteria) {
            errors.criteria = requiredError;
          }
          if (!values.dischargeDate) {
            errors.dischargeDate = requiredError;
          }
        }
        return errors;
      }}
    >
      {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
        return (
          <Form className="form ui">
            <UIForm.Field>
              <label>Patient</label>
              <Field as="select" name="patient" className="ui dropdown">
                {patientLists.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label || option.value}
                  </option>
                ))}
              </Field>
            </UIForm.Field>

            <SelectField
              label="Entry Type"
              name="type"
              options={entryTypeOptions}
            />
            <Field
              label="Description"
              placeholder="Description"
              name="description"
              component={TextField}
            />
            <Field
              label="Date"
              placeholder="YYYY-MM-DD"
              name="date"
              component={TextField}
            />
            <Field
              label="Specialist"
              placeholder="Specialist"
              name="specialist"
              component={TextField}
            />
            <DiagnosisSelection
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              diagnoses={Object.values(diagnoses)}
            />
            {values.type === 'HealthCheck' && (
              <Field
                label="healthCheckRating"
                name="healthCheckRating"
                component={NumberField}
                min={0}
                max={3}
              />
            )}
            {values.type === 'OccupationalHealthcare' && (
              <>
                <Field
                  label="Employer Name"
                  placeholder="Employer Name"
                  name="employerName"
                  component={TextField}
                />
                <Field
                  label="Start Date"
                  placeholder="YYYY-MM-DD"
                  name="startDate"
                  component={TextField}
                />
                <Field
                  label="End Date"
                  placeholder="YYYY-MM-DD"
                  name="endDate"
                  component={TextField}
                />
              </>
            )}
            {values.type === 'Hospital' && (
              <>
                <Field
                  label="Discharge Date"
                  placeholder="YYYY-MM-DD"
                  name="dischargeDate"
                  component={TextField}
                />
                <Field
                  label="Criteria"
                  placeholder="Criteria"
                  name="criteria"
                  component={TextField}
                />
              </>
            )}
            <Grid>
              <Grid.Column floated="left" width={5}>
                <Button type="button" onClick={onCancel} color="red">
                  Cancel
                </Button>
              </Grid.Column>
              <Grid.Column floated="right" width={5}>
                <Button
                  type="submit"
                  floated="right"
                  color="green"
                  disabled={!dirty || !isValid}
                >
                  Add
                </Button>
              </Grid.Column>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddEntryForm;
