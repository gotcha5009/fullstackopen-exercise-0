const initialMsg = {
  display: 'none',
  message: '',
  timeoutId: 0,
};

const notificationReducer = (state = initialMsg, action) => {
  switch (action.type) {
    case 'hide':
      return initialMsg;
    case 'show':
      if (state.timeoutId) {
        clearTimeout(state.timeoutId);
      }
      return {
        display: '',
        message: action.message,
        timeoutId: action.timeoutId,
      };
    default:
      return state;
  }
};

export default notificationReducer;

// export const showNoti = (anecdote) => {
//   return {
//     type: 'show',
//     anecdote,
//   };
// };

export const showNoti = (message, sec) => {
  return async (dispatch) => {
    const timeoutId = setTimeout(() => dispatch({ type: 'hide' }), sec * 1000);
    dispatch({
      type: 'show',
      message,
      timeoutId,
    });
  };
};

export const hideNoti = () => {
  //   console.log('called hideNoti');
  return {
    type: 'hide',
  };
};
