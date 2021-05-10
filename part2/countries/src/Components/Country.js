import React, { useState } from 'react';

const Country = ({ country }) => {
  const [show, setShow] = useState(false);
  const handleShow = (e) => {
    setShow(!show);
  };
  return (
    <div key={country.alpha2Code}>
      <label>{country.name}</label>
      <button onClick={handleShow}>show</button>
      {show && (
        <div>
          <h2>{country.name}</h2>
          <p>capital {country.capital}</p>
          <p>population {country.population}</p>
          <h3>Spoken languages</h3>
          <ul>
            {country.languages.map((lang) => (
              <li key={lang.name}>{lang.name}</li>
            ))}
          </ul>
          <img
            src={country.flag}
            alt="country's flag"
            style={{ maxWidth: '15%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
};

export default Country;
