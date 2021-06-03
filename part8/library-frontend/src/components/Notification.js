import React from 'react';

const Notification = ({ message }) => {
  if (!message) {
    return null;
  }
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    borderColor: 'red',
  };
  return <div style={style}>{message}</div>;
};

export default Notification;
