import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import { HospitalEntry as Hospital } from '../types';

const HospitalEntry: React.FC<{ entry: Hospital }> = ({ entry }) => {
  return (
    <Card>
      <Card.Content>
        <Card.Header>
          {entry.date} <Icon name="hospital outline" />
        </Card.Header>
        <Card.Description>{entry.description}</Card.Description>
      </Card.Content>
    </Card>
  );
};

export default HospitalEntry;
