import React from 'react';
import { Card, Icon } from 'semantic-ui-react';
import { HealthCheckEntry as Health } from '../types';
import HealthRatingBar from './HealthRatingBar';

const HealthCheckEntry: React.FC<{ entry: Health }> = ({ entry }) => {
  return (
    <Card>
      <Card.Content>
        <Card.Header>
          {entry.date} <Icon name="doctor" />
        </Card.Header>
        <Card.Description>{entry.description}</Card.Description>
        <HealthRatingBar rating={entry.healthCheckRating} showText={false} />
      </Card.Content>
    </Card>
  );
};

export default HealthCheckEntry;
