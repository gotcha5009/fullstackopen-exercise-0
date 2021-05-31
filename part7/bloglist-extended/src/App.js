import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import { TextField, Button, Typography } from '@material-ui/core';
import Blog from './components/Blog';
import Notification from './components/Notification';
// import loginService from './services/login';
import Toggleable from './components/Toggleable';
import BlogForm from './components/CreateForm';
import UserList from './components/UserList';
import User from './components/User';
import BlogDetail from './components/BlogDetail';
import Menu from './components/Menu';

import userService from './services/users';

import { showNoti } from './reducers/notificationReducer';
import { setUser, login, logout } from './reducers/userReducer';
import {
  initBlog,
  createBlog,
  likeBlog,
  removeBlog,
} from './reducers/blogReducer';

import './index.css';

const App = () => {
  // const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();

  const blogFormRef = useRef();

  const blogs = useSelector(({ blogs }) => blogs);
  const user = useSelector(({ user }) => user);

  // useEffect(() => {
  //   blogService.getAll().then((blogs) => setBlogs(blogs));
  // }, []);

  useEffect(() => {
    dispatch(initBlog());
    dispatch(setUser());
  }, [dispatch]);

  useEffect(() => {
    userService.getAll().then((data) => setUsers(data));
  }, []);

  const matchUser = useRouteMatch('/users/:id');
  const userById = matchUser
    ? users.find((u) => u.id === matchUser.params.id)
    : null;

  const matchBlog = useRouteMatch('/blogs/:id');
  const blogById = matchBlog
    ? blogs.find((b) => b.id === matchBlog.params.id)
    : null;
  const sortedBlogs = blogs.sort((a, b) => {
    return b.likes - a.likes;
  });

  // useEffect(() => {
  // const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
  // if (loggedUserJSON) {
  //   const user = JSON.parse(loggedUserJSON);
  // setUser(user);
  //     dispatch(setUser());
  // blogService.setToken(user.token);
  //   }
  // }, []);

  const addBlog = async (blogObject) => {
    try {
      // const blog = await blogService.create(blogObject);

      blogFormRef.current.toggleVisibility();
      // setBlogs(blogs.concat(blog));
      dispatch(createBlog(blogObject));
      // setErrorMessage(`a new blog ${blog.title} by ${blog.author} added`);
      // setTimeout(() => {
      //   setErrorMessage(null);
      // }, 5000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logout());
    // setUser(null);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // const loggedInUser = await loginService.login({
      //   username,
      //   password,
      // });

      await dispatch(
        login({
          username,
          password,
        })
      );

      // window.localStorage.setItem(
      //   'loggedBlogappUser',
      //   JSON.stringify(loggedInUser)
      // );

      // blogService.setToken(loggedInUser.token);
      // setUser(loggedInUser);
      setUsername('');
      setPassword('');
    } catch (err) {
      // setErrorMessage('Error: Wrong credentials');
      // setTimeout(() => {
      //   setErrorMessage(null);
      // }, 5000);
      dispatch(showNoti('Error: Wrong credentials', 5));
      console.log(err);
    }
  };

  const handleLike = async (blog) => {
    try {
      // const res = await blogService.update(blog.id, {
      //   ...blog,
      //   likes: blog.likes + 1,
      //   user: blog.user.id,
      // });
      // setBlogs(
      //   blogs.map((b) => (b.id === blog.id ? { ...b, likes: res.likes } : b))
      // );
      dispatch(
        likeBlog({
          ...blog,
          likes: blog.likes + 1,
          user: blog.user.id,
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (blog) => {
    try {
      if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        // await blogService.remove(blog.id);
        dispatch(removeBlog(blog.id));
        history.push('/');
        // setBlogs(blogs.filter((b) => b.id !== blog.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification />
        <form onSubmit={handleLogin}>
          <div>
            <TextField
              label="username"
              id="username"
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <TextField
              label="password"
              id="password"
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <Button variant="contained" id="login-button" type="submit">
            login
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <Menu name={user.name} handleLogout={handleLogout} />
      <Typography variant="h2">blog app</Typography>
      <Notification />
      {/* <p>
        {user.name} logged in{' '}
        <button type="submit" onClick={handleLogout}>
          logout
        </button>
      </p> */}
      <Switch>
        <Route path="/users/:id">
          <User user={userById} />
        </Route>
        <Route path="/users">
          <UserList users={users} />
        </Route>
        <Route path="/blogs/:id">
          <BlogDetail
            blog={blogById}
            handleLike={handleLike}
            handleRemove={handleRemove}
          />
        </Route>
        <Route path="/">
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
        </Route>
      </Switch>
    </div>
  );
};

export default App;
