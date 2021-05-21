import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';
import Toggleable from './components/Toggleable';
import BlogForm from './components/CreateForm';

import './index.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const sortedBlogs = blogs.sort((a, b) => {
    return b.likes - a.likes;
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (blogObject) => {
    try {
      const blog = await blogService.create(blogObject);

      blogFormRef.current.toggleVisibility();
      setBlogs(blogs.concat(blog));
      setErrorMessage(`a new blog ${blog.title} by ${blog.author} added`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const loggedInUser = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedInUser)
      );

      blogService.setToken(loggedInUser.token);
      setUser(loggedInUser);
      setUsername('');
      setPassword('');
    } catch (err) {
      setErrorMessage('Error: Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      console.log(err);
    }
  };

  const handleLike = async (blog) => {
    try {
      const res = await blogService.update(blog.id, {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id,
      });

      setBlogs(
        blogs.map((b) => (b.id === blog.id ? { ...b, likes: res.likes } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        await blogService.remove(blog.id);

        setBlogs(blogs.filter((b) => b.id !== blog.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">
            login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <p>
        {user.name} logged in{' '}
        <button type="submit" onClick={handleLogout}>
          logout
        </button>
      </p>
      <Toggleable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Toggleable>
      <div className="blogs">
        {sortedBlogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleRemove={handleRemove}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
