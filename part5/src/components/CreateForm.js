import React, { useState } from 'react';

const CreateForm = ({ addBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      await addBlog({ title, author, url });
      setTitle('');
      setAuthor('');
      setUrl('');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="formDiv">
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <label>title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        ></input>
        <br />
        <label>author</label>
        <input
          id="author"
          type="text"
          name="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        ></input>
        <br />
        <label>url</label>
        <input
          id="url"
          type="text"
          name="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        ></input>
        <br />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default CreateForm;
