import React from 'react';
import { Typography, List, ListItem } from '@material-ui/core';

const User = ({ user }) => {
  if (!user) {
    return null;
  }
  return (
    <div>
      <Typography variant="h3">{user.name}</Typography>
      <Typography variant="h4">added blogs</Typography>
      <List>
        {user.blogs.map((blog) => {
          return <ListItem key={blog.id}>{blog.title}</ListItem>;
        })}
      </List>
    </div>
  );
};

export default User;
