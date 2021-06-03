import React, { useState, useEffect } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notification from './components/Notification';
import Login from './components/Login';
import Recommend from './components/Recommend';
import {
  gql,
  useMutation,
  useQuery,
  useLazyQuery,
  useApolloClient,
  useSubscription,
} from '@apollo/client';

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      bookCount
      born
    }
  }
`;

const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      author {
        id
        name
      }
      title
      published
      genres
    }
  }
`;

const BOOKS_BY_GENRE = gql`
  query bookByGenre($genre: String!) {
    allBooks(genre: $genre) {
      id
      author {
        id
        name
      }
      title
      published
    }
  }
`;

const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
      title
      author {
        id
        name
        born
        bookCount
      }
      published
      genres
    }
  }
`;

const EDIT_BIRTHYEAR = gql`
  mutation editBirthyear($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
    }
  }
`;

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const ME = gql`
  query {
    me {
      favoriteGenre
    }
  }
`;

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      id
      title
      author {
        id
        name
        born
        bookCount
      }
      published
      genres
    }
  }
`;

const App = () => {
  const [page, setPage] = useState('authors');
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [userGenre, setUserGenre] = useState(null);

  const notify = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 10000);
  };

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) =>
      set.map((p) => p.id).includes(object.id);

    const dataInStore = client.readQuery({ query: ALL_BOOKS });
    const authorInStore = client.readQuery({ query: ALL_AUTHORS });
    const booksInStore = client.readQuery({ query: BOOKS_BY_GENRE });
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: dataInStore.allBooks.concat(addedBook) },
      });
    }
    if (!includedIn(authorInStore.allAuthors, addedBook.author)) {
      client.writeQuery({
        query: ALL_AUTHORS,
        data: { allAuthors: authorInStore.allAuthors.concat(addedBook.author) },
      });
    }
    if (addedBook.genres.includes(userGenre)) {
      client.writeQuery({
        query: BOOKS_BY_GENRE,
        data: { allBooks: booksInStore.allBooks.concat(addedBook) },
      });
    }
  };

  const client = useApolloClient();
  const authors = useQuery(ALL_AUTHORS);
  const books = useQuery(ALL_BOOKS);
  const [getUserBooks, booksByUser] = useLazyQuery(BOOKS_BY_GENRE);
  const [getUser] = useLazyQuery(ME, {
    onCompleted: (data) => {
      // console.log('data :>> ', data);
      setUserGenre(data.me.favoriteGenre);
    },
  });
  const [addBook] = useMutation(ADD_BOOK, {
    // refetchQueries: [
    //   { query: ALL_BOOKS },
    //   { query: ALL_AUTHORS },
    //   { query: BOOKS_BY_GENRE, variables: { genre: userGenre } },
    // ],
    onError: (err) => {
      console.error(err);
      notify(err.graphQLErrors[0].message);
    },
  });
  const [editBirthyear] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      notify(error.graphQLErrors[0].message);
    },
  });

  const [login, result] = useMutation(LOGIN, {
    refetchQueries: [{ query: ME }],
    onError: (error) => {
      notify(error.graphQLErrors[0].message);
    },
  });

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  if (page === 'recommend') {
    // getUserBooks({
    //   variables: { genre: userGenre },
    // });
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded;
      notify(`${addedBook.title} added`);
      updateCacheWith(addedBook);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem('library-user-token', token);
      setPage('authors');
    }
    const token = localStorage.getItem('library-user-token');
    if (token) {
      getUser();
      setToken(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.data]);

  useEffect(() => {
    if (page === 'recommend') {
      getUserBooks({
        variables: { genre: userGenre },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // const userGenre = user.data ? user.data.me.favoriteGenre : '';
  // const booksByUser = userGenre
  //   ? books.data.allBooks.filter((b) => b.genres.includes(userGenre))
  //   : [];

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button
              onClick={() => {
                setPage('recommend');
              }}
            >
              recommend
            </button>
            <button onClick={() => logout()}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>
      <Notification message={error} />
      <Authors
        show={page === 'authors'}
        authors={!authors.loading ? authors.data.allAuthors : []}
        editBirthyear={editBirthyear}
      />

      <Books
        show={page === 'books'}
        books={!books.loading ? books.data.allBooks : []}
      />

      <NewBook show={page === 'add'} addBook={addBook} />
      <Login show={page === 'login'} login={login} />
      <Recommend
        show={page === 'recommend'}
        books={booksByUser.data ? booksByUser.data.allBooks : []}
        genre={userGenre}
      />
    </div>
  );
};

export default App;
