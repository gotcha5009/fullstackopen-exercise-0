import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addComment } from '../reducers/blogReducer';

const BlogDetail = ({ blog, handleLike, handleRemove }) => {
  if (!blog) {
    return null;
  }

  const [comment, setComment] = useState('');
  const dispatch = useDispatch();

  const handleComment = (e) => {
    e.preventDefault();

    dispatch(addComment(blog.id, comment));
  };

  const user = useSelector(({ user }) => user);
  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a> <br />
      likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
      <br />
      added by {blog.user.name}
      <br />
      {blog.user.name === user.name ? (
        <button className="removeButton" onClick={() => handleRemove(blog)}>
          remove
        </button>
      ) : null}
      <h3>comments</h3>
      <form onSubmit={handleComment}>
        <input
          name="comment"
          onChange={({ target }) => setComment(target.value)}
        />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {blog.comments &&
          blog.comments.map((c, index) => <li key={c + index}>{c}</li>)}
      </ul>
    </div>
  );
};

export default BlogDetail;
