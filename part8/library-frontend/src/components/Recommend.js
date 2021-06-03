import React from 'react';

const Recommend = (props) => {
  if (!props.show) {
    return null;
  }

  const books = props.books;

  return (
    <div>
      <h2>recommendations</h2>
      books in your favourite genre <b>{props.genre}</b>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
