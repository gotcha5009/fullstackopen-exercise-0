import React from 'react';
import personService from '../services/persons';

const Persons = ({ filterPersons, persons, setPersons, setFilterPersons }) => {
  const handleDelete = (e) => {
    if (window.confirm(`Delete ${e.target.name}?`)) {
      personService.remove(e.target.id).then((res) => {
        console.log(res);
        setPersons(
          persons.filter((person) => person.id !== Number(e.target.id))
        );
        setFilterPersons(
          filterPersons.filter((person) => person.id !== Number(e.target.id))
        );
      });
    }
    // console.log('e :>> ', e);
  };

  return (
    <div>
      {filterPersons.map((person) => (
        <div key={person.id}>
          <label>
            {person.name} {person.number}
          </label>
          <button id={person.id} name={person.name} onClick={handleDelete}>
            delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default Persons;
