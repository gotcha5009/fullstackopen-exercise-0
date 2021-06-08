import React from 'react';

const Total = ({ total }: { total: number }): JSX.Element => (
  <div>
    <p>Number of exercises {total}</p>
  </div>
);

export default Total;
