import React, { useState } from 'react';

const Books = (props) => {
  const [genre, setGenre] = useState('');
  if (!props.show) {
    return null;
  }

  const books = props.books;

  const genres = books.length
    ? new Set(
        books.reduce((acc, book) => {
          acc = acc.concat(...book.genres);
          return acc;
        }, [])
      )
    : [];

  const booksByGenre = genre
    ? books.filter((b) => b.genres.includes(genre))
    : books;

  // console.log('genres :>> ', genres);

  return (
    <div>
      <h2>books</h2>
      {genre && (
        <div>
          in genre <b>{genre}</b>
        </div>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksByGenre.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {[...genres].map((g) => (
        <button key={g} onClick={() => setGenre(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setGenre('')}>all genres</button>
    </div>
  );
};

export default Books;
