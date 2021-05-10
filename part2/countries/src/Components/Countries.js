import React from 'react';
import Country from './Country';
// import axios from 'axios';

const Countries = ({ countries, weather }) => {
  // console.log('countries :>> ', countries);
  console.log('weather :>> ', weather);
  if (countries.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    );
  } else if (countries.length === 1) {
    const country = countries.pop();
    return (
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
        {weather !== null && (
          <div>
            <h3>Weather in {country.capital}</h3>
            <p>
              <b>temperature:</b> {weather.temperature} Celcius
            </p>
            <img
              src={weather.weather_icons[0]}
              alt="weather"
              style={{ maxWidth: '10%', height: 'auto' }}
            />
            <p>
              <b>wind:</b> {weather.wind_speed} km/hr direction{' '}
              {weather.wind_dir}
            </p>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        {countries.map((country) => {
          return <Country key={country.alpha2Code} country={country} />;
        })}
      </div>
    );
  }
};

export default Countries;
