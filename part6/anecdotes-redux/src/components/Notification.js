import React from 'react';
// import { useSelector } from 'react-redux';
import { connect } from 'react-redux';

const Notification = (props) => {
  // const notification = useSelector((state) => state.notification);
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
  };
  return (
    <div style={{ ...style, display: props.notification.display }}>
      {props.notification.message}
    </div>
  );
};

const mapDispatchToProps = (state) => {
  return {
    notification: state.notification,
  };
};

export default connect(mapDispatchToProps)(Notification);
