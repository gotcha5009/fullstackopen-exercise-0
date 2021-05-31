import React from 'react';
import { Link } from 'react-router-dom';
import { Paper } from '@material-ui/core';

const Blog = ({ blog }) => {
  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5,
  // };

  const paperStyle = {
    padding: 15,
  };

  // const [visible, setVisible] = useState(false);

  // const hideWhenVisible = { display: visible ? 'none' : '' };
  // const showWhenVisible = { display: visible ? '' : 'none' };

  // const toggleVisibility = () => {
  //   setVisible(!visible);
  // };

  return (
    <Paper variant="outlined" style={paperStyle}>
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}{' '}
        {/* <button onClick={toggleVisibility}>
            {visible ? 'hide' : 'view'}
          </button> */}
      </Link>

      {/* <div style={showWhenVisible} className="detailBlog">
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
      </div> */}
    </Paper>
  );
};

export default Blog;
