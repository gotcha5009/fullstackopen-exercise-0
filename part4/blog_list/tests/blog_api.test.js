const app = require('../app.js');
const { agent: supertest } = require('supertest');
const mongoose = require('mongoose');
const Blog = require('../models/Blog.js');
const User = require('../models/User.js');
const api = supertest(app);

const blogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
];

const listWithOneBlog = {
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
  likes: 5,
};

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const userObject = {
    username: 'test8333',
    password: 'test1234',
    name: 'validOne',
  };
  await api.post('/api/users').send(userObject);

  const user = await User.findOne({});

  const res = await api.post('/api/login').send(userObject);
  api.auth(res.body.token, { type: 'bearer' });

  const blogObjects = blogs.map((blog) => new Blog({ ...blog, user: user.id }));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe('endpoint test: GET /api/blogs', () => {
  test('has the expected result', async () => {
    const res = await api.get('/api/blogs');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toHaveLength(blogs.length);
  });

  test('has the unique identifier property "id"', async () => {
    const res = await api.get('/api/blogs');
    expect(res.body[0].id).toBeDefined();
  });
});

describe('endpoint test: POST /api/blogs', () => {
  test('return the expected result', async () => {
    const res = await api.post('/api/blogs').send(listWithOneBlog);
    const count = await Blog.countDocuments({});
    expect(res.status).toBe(201);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(count).toBe(blogs.length + 1);
    expect(res.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      })
    );
  });

  test("if req.body doesn't have likes, then set it to 0", async () => {
    const body = { ...listWithOneBlog, likes: undefined };
    const res = await api.post('/api/blogs').send(body);
    expect(res.body.likes).toBe(0);
  });

  test("if req.body doesn't have title and url, return error", async () => {
    const body = {
      ...listWithOneBlog,
      likes: undefined,
      title: undefined,
      url: undefined,
    };
    await api.post('/api/blogs').send(body).expect(400);
  });

  test('if token is not provided, return error with proper status', async () => {
    api.auth('', { type: 'bearer' });
    const res = await api.post('/api/blogs').send(listWithOneBlog).expect(401);
  });
});

test('endpoint test: DELETE /api/blogs', async () => {
  const req = await Blog.findOne({});
  await api.delete(`/api/blogs/${req._id}`).expect(204);
});

test('endpoint test: PUT /api/blogs', async () => {
  const req = await Blog.findOne({});
  const body = {
    author: 'test',
    url: 'https://test.com',
  };
  const res = await api.put(`/api/blogs/${req._id}`).send(body);
  expect(res.body).toEqual(
    expect.objectContaining({
      author: 'test',
      url: 'https://test.com',
    })
  );
});

afterAll(() => {
  mongoose.connection.close();
});
