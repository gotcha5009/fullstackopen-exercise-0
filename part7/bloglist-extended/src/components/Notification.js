import React from 'react';
import { useSelector } from 'react-redux';
import { Alert } from '@material-ui/lab';

const Notification = () => {
  // if (message === null) {
  //   return null;
  // }

  const notification = useSelector(({ notification }) => notification);
  // console.log('notification', notification);

  // return (

  //   <div
  //     className={notification.message.includes('Error') ? 'error' : 'success'}
  //     style={{ display: notification.display }}
  //   >
  //     {notification.message}
  //   </div>
  // );

  return notification.message.includes('Error') ? (
    <Alert severity="error" style={{ display: notification.display }}>
      {notification.message}
    </Alert>
  ) : (
    <Alert severity="success" style={{ display: notification.display }}>
      {notification.message}
    </Alert>
  );
};

export default Notification;
