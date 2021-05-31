import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@material-ui/core';

const Menu = ({ name, handleLogout }) => {
  //   const style = {
  //     backgroundColor: '#eeeeee',
  //     padding: 10,
  //   };
  //   const padding = {
  //     paddingRight: 5,
  //   };
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        {name} logged in{' '}
        <Button color="inherit" onClick={handleLogout}>
          logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;
