import React, { useState } from 'react';

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const [visible, setVisible] = useState(false);

  // const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <div className="blog" style={blogStyle}>
      <div className="alwaysShowBlog">
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={showWhenVisible} className="detailBlog">
        {blog.url} <br />
        likes {blog.likes}{' '}
        <button onClick={() => handleLike(blog)}>like</button>
        <br />
        {blog.user.name}
        <br />
        {blog.user.name === user.name ? (
          <button className="removeButton" onClick={() => handleRemove(blog)}>
            remove
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Blog;
