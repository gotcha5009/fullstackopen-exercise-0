import React, { useState, useEffect } from 'react';
import PersonForm from './Components/PersonForm';
import Persons from './Components/Persons';
import Filter from './Components/Filter';
import personService from './services/persons';
// import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filterPersons, setFilterPersons] = useState(persons);
  const [newName, setNewName] = useState('');
  const [newNum, setNewNum] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    let exist = false;
    let id;
    for (const person of persons) {
      if (person.name === newName) {
        exist = true;
        id = person.id;
      }
    }
    if (exist) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        personService
          .update(id, {
            name: newName,
            number: newNum,
          })
          .then((res) => {
            console.log('res :>> ', res);
            setPersons(
              persons.map((person) => (person.id !== id ? person : res))
            );
            setFilterPersons(
              filterPersons.map((person) => (person.id !== id ? person : res))
            );
          });
      }
    } else {
      const personObject = {
        name: newName,
        number: newNum,
      };
      personService.create(personObject).then((res) => {
        console.log(res);
        setPersons(persons.concat(res));
        setFilterPersons(persons.concat(res));
        setNewName('');
        setNewNum('');
      });
    }
  };

  const handleName = (e) => {
    setNewName(e.target.value);
  };

  const handleNum = (e) => {
    setNewNum(e.target.value);
  };

  const handleFilter = (e) => {
    if (e.target.value === '') {
      setFilterPersons(persons);
    } else {
      const regex = new RegExp(`^${e.target.value}`, 'i');
      const newFilterPersons = filterPersons.filter((person) =>
        regex.test(person.name)
      );
      setFilterPersons(newFilterPersons);
    }
  };

  useEffect(() => {
    personService.getAll().then((res) => {
      setPersons(res);
      setFilterPersons(res);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleFilter={handleFilter} />
      <h2>add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        handleName={handleName}
        newNum={newNum}
        handleNum={handleNum}
      />
      <h2>Numbers</h2>
      <Persons
        filterPersons={filterPersons}
        persons={persons}
        setPersons={setPersons}
        setFilterPersons={setFilterPersons}
      />
    </div>
  );
};

export default App;
