import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Typography } from '@material-ui/core';
import { showNoti } from '../reducers/notificationReducer';

const CreateForm = ({ addBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      await addBlog({ title, author, url });
      setTitle('');
      setAuthor('');
      setUrl('');
      dispatch(showNoti(`a new blog ${title} by ${author} added`, 5));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="formDiv">
      <Typography variant="h3">create new</Typography>
      <form onSubmit={handleCreate}>
        <TextField
          label="title"
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        ></TextField>
        <br />
        <TextField
          label="author"
          id="author"
          type="text"
          name="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        ></TextField>
        <br />
        <TextField
          label="url"
          id="url"
          type="text"
          name="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        ></TextField>
        <br />
        <Button type="submit">create</Button>
      </form>
    </div>
  );
};

export default CreateForm;
