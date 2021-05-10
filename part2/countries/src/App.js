import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Filter from './Components/Filter.js';
import Countries from './Components/Countries.js';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filterCountries, setFilterCountries] = useState([]);
  const [weather, setWeather] = useState(null);

  const handleFilter = async (e) => {
    if (e.target.value !== '') {
      const regex = new RegExp(`^${e.target.value}`, 'i');
      const newFilter = countries.filter((country) => regex.test(country.name));

      if (newFilter.length === 1 && newFilter[0].capital !== '') {
        const weather = await axios.get(
          `http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${newFilter[0].capital}`
        );
        const { current } = weather.data;
        console.log('current :>> ', weather.data);
        setWeather(current);
        setFilterCountries(newFilter);
      } else if (newFilter.length === 1) {
        setWeather(null);
        setFilterCountries(newFilter);
      } else {
        setFilterCountries(newFilter);
      }
    }
  };

  useEffect(() => {
    axios.get('https://restcountries.eu/rest/v2/all').then((response) => {
      console.log('res length', response.data.length);
      setCountries(response.data);
      setFilterCountries(response.data);
    });
  }, []);

  return (
    <div>
      <Filter handleFilter={handleFilter} />
      <Countries countries={filterCountries} weather={weather} />
    </div>
  );
};

export default App;
