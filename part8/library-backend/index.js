require('dotenv').config();
const {
  ApolloServer,
  UserInputError,
  AuthenticationError,
  gql,
  PubSub,
} = require('apollo-server');
// const { v1: uuid } = require('uuid');
const pubsub = new PubSub();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Book = require('./models/Book');
const Author = require('./models/Author');
const User = require('./models/User');

const JWT_SECRET = '<INSERT_SECRET_HERE>';

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
];

/*
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 */

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
];

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }

  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }
`;

const resolvers = {
  Book: {
    author: async (root, args) => {
      return await Author.findById(root.author);
    },
  },
  // Author: {
  //   bookCount: async (root, args) => {
  //     return await Book.countDocuments({ author: root.id });
  //   },
  // },
  Query: {
    bookCount: async () => await Book.countDocuments({}),
    authorCount: async () => await Author.countDocuments({}),
    allBooks: async (root, args) => {
      // if (args) {
      //   let allBooks = [...books];
      //   for (const prop in args) {
      //     allBooks = allBooks.reduce((acc, book) => {
      //       if (book[prop] === args[prop] || book.genres.includes(args[prop])) {
      //         acc.push({ ...book, id: undefined });
      //       }
      //       return acc;
      //     }, []);
      //   }
      //   return allBooks;
      // }
      // return books;
      const authorDoc = await Author.findOne({ name: args.author });
      const author = authorDoc ? authorDoc.id : undefined;
      const genres = args.genre
        ? { $elemMatch: { $all: [args.genre] } }
        : undefined;
      const filter = {
        ...(author && { author }),
        ...(genres && { genres }),
      };
      return await Book.find(filter);
    },
    allAuthors: async () => {
      // const result = authors.map((a) => ({
      //   ...a,
      //   bookCount: books.filter((b) => b.author === a.name).length,
      // }));
      // return result;
      const result = await Author.aggregate([
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: 'author',
            as: 'books',
          },
        },
        {
          $project: {
            _id: '$_id',
            name: '$name',
            born: '$born',
            bookCount: { $size: '$books' },
          },
        },
      ]);
      return result;
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      // if (authors.filter((a) => a.name === args.author).length === 0) {
      //   authors = authors.concat({ name: args.author, id: uuid() });
      // }
      // const book = { ...args, id: uuid() };
      // books = books.concat(book);
      // return book;
      try {
        // console.log('args.genres :>> ', args.genres);
        if (!context.currentUser) {
          throw new AuthenticationError('not authenticated');
        }
        const author = await Author.findOne({ name: args.author });

        if (author) {
          const book = await Book.create({ ...args, author: author.id });
          return book;
        }

        const newAuthor = new Author({ name: args.author });
        const book = new Book({ ...args, author: newAuthor.id });
        await newAuthor.save();
        await book.save();

        pubsub.publish('BOOK_ADDED', { bookAdded: book });

        return book;
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        });
      }
    },
    editAuthor: async (root, args, context) => {
      // if (authors.filter((a) => a.name === args.name).length === 0) {
      //   return null;
      // }
      // const author = authors.find((a) => a.name === args.name);
      // author.born = args.setBornTo;
      // return { ...author, born: args.setBornTo };
      if (!context.currentUser) {
        throw new AuthenticationError('not authenticated');
      }
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      await author.save();
      return author;
    },
    createUser: async (root, args) => {
      const user = await User.create({ ...args, password: 'test1234' });
      return user;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'test1234') {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('connected to MongoDB');
    server.listen().then(({ url, subscriptionsUrl }) => {
      console.log(`Server ready at ${url}`);
      console.log(`Subscriptions ready at ${subscriptionsUrl}`);
    });
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });
