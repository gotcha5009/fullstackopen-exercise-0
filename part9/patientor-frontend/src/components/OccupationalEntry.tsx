import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import { OccupationalHealthcareEntry } from '../types';

const OccupationalEntry = ({
  entry,
}: {
  entry: OccupationalHealthcareEntry;
}) => {
  return (
    <Card>
      <Card.Content>
        <Card.Header>
          {entry.date} <Icon name="stethoscope" /> {entry.employerName}
        </Card.Header>
        <Card.Description>{entry.description}</Card.Description>
      </Card.Content>
    </Card>
  );
};

export default OccupationalEntry;
