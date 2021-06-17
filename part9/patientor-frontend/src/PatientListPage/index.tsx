import React from 'react';
import axios from 'axios';
import { Container, Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { PatientFormValues } from '../AddPatientModal/AddPatientForm';
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';
import AddPatientModal from '../AddPatientModal';
import { Entry, Patient } from '../types';
import { apiBaseUrl } from '../constants';
import HealthRatingBar from '../components/HealthRatingBar';
import { useStateValue, addPatient, addEntry } from '../state';

import AddEntryModal from '../AddEntryModal';

const PatientListPage = () => {
  const [{ patients }, dispatch] = useStateValue();

  const [modalPatient, setModalPatient] = React.useState<boolean>(false);
  const [modalEntry, setModalEntry] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModalPatient = (): void => setModalPatient(true);

  const closeModalPatient = (): void => {
    setModalPatient(false);
    setError(undefined);
  };

  const openModalEntry = (): void => setModalEntry(true);

  const closeModalEntry = (): void => {
    setModalEntry(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: PatientFormValues) => {
    try {
      const { data: newPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients`,
        values
      );
      dispatch(addPatient(newPatient));
      closeModalPatient();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      console.log('values :>> ', values);
      let entryForm = {};
      switch (values.type) {
        case 'HealthCheck':
          entryForm = {
            type: 'HealthCheck',
            description: values.description,
            date: values.date,
            specialist: values.specialist,
            diagnosesCode: values.diagnosisCodes,
            healthCheckRating: values.healthCheckRating,
          };
          break;
        case 'OccupationalHealthcare':
          entryForm = {
            type: 'OccupationalHealthcare',
            description: values.description,
            date: values.date,
            specialist: values.specialist,
            diagnosesCode: values.diagnosisCodes,
            employerName: values.employerName,
            ...(values.startDate &&
              values.endDate && {
                sickLeave: {
                  startDate: values.startDate,
                  endDate: values.endDate,
                },
              }),
          };
          break;
        case 'Hospital':
          entryForm = {
            type: 'Hospital',
            description: values.description,
            date: values.date,
            specialist: values.specialist,
            diagnosesCode: values.diagnosisCodes,
            discharge: {
              criteria: values.criteria,
              date: values.dischargeDate,
            },
          };
          break;
      }
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${values.patient}/entries`,
        entryForm
      );
      console.log('newEntry :>> ', newEntry);
      dispatch(
        addEntry({
          patient: values.patient,
          entry: newEntry,
        })
      );
      closeModalEntry();
    } catch (e) {
      console.error(e.response?.data || 'Unknown Error');
      setError(e.response?.data?.error || 'Unknown error');
    }
  };

  return (
    <div className="App">
      <Container textAlign="center">
        <h3>Patient list</h3>
      </Container>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Gender</Table.HeaderCell>
            <Table.HeaderCell>Occupation</Table.HeaderCell>
            <Table.HeaderCell>Health Rating</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Object.values(patients).map((patient: Patient) => (
            <Table.Row key={patient.id}>
              <Table.Cell>
                <Link to={`/patients/${patient.id}`}>{patient.name}</Link>
              </Table.Cell>
              <Table.Cell>{patient.gender}</Table.Cell>
              <Table.Cell>{patient.occupation}</Table.Cell>
              <Table.Cell>
                <HealthRatingBar showText={false} rating={1} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <AddPatientModal
        modalOpen={modalPatient}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModalPatient}
      />
      <AddEntryModal
        modalOpen={modalEntry}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModalEntry}
      />
      <Button onClick={() => openModalPatient()}>Add New Patient</Button>
      <Button onClick={() => openModalEntry()}>Add New Entry</Button>
    </div>
  );
};

export default PatientListPage;
