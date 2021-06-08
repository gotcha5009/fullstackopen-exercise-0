import React from 'react';

const Header = ({ name }: { name: string }): JSX.Element => (
  <div>
    <h1>{name}</h1>
  </div>
);

export default Header;
