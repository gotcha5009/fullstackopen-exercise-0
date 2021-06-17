import React from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Header, Icon, Card } from 'semantic-ui-react';

import { Patient, Entry } from '../types';
import { apiBaseUrl } from '../constants';
import { useStateValue, updatePatient } from '../state';
import HealthCheckEntry from '../components/HealthCheckEntry';
import HospitalEntry from '../components/HospitalEntry';
import OccupationalEntry from '../components/OccupationalEntry';

const PatientDetailPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  const patient: Patient | undefined = patients[id];

  React.useEffect(() => {
    if (patient && !patient.ssn) {
      // console.log('patient found but got no details');
      axios
        .get<Patient>(`${apiBaseUrl}/patients/${id}`)
        .then((res) => {
          dispatch(updatePatient(res.data));
        })
        .catch((e) => console.error(e));
    }
  });

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case 'Hospital':
        return <HospitalEntry entry={entry} />;
      case 'OccupationalHealthcare':
        return <OccupationalEntry entry={entry} />;
      case 'HealthCheck':
        return <HealthCheckEntry entry={entry} />;
      default:
        return assertNever(entry);
    }
  };

  if (!patient) {
    return <div className="App">Not found</div>;
  }

  return (
    <div className="App">
      <Header as="h1">
        {patient.name}{' '}
        <Icon
          name={
            patient.gender === 'male'
              ? 'man'
              : patient.gender === 'female'
              ? 'woman'
              : 'genderless'
          }
        />
      </Header>
      <p>
        ssn: {patient.ssn} <br />
        occupation: {patient.occupation} <br />
      </p>
      <Header as="h2">entries</Header>
      <Card.Group>
        {patient.entries?.map((e) => (
          <EntryDetails key={e.id} entry={e} />
        ))}
      </Card.Group>
    </div>
  );
};

export default PatientDetailPage;
