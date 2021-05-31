import blogService from '../services/blogs';

// const getId = () => (100000 * Math.random()).toFixed(0);

// const asObject = (blog) => {
//   return {
//     content: blog,
//     id: getId(),
//     likes: 0,
//   };
// };

const reducer = (state = [], action) => {
  // console.log('state now: ', state);
  // console.log('action', action);

  switch (action.type) {
    case 'LIKE':
      return state.map((obj) =>
        obj.id === action.id ? { ...obj, likes: obj.likes + 1 } : obj
      );
    case 'COMMENT':
      return state.map((obj) =>
        obj.id === action.id
          ? { ...obj, comments: obj.comments.concat(action.comment) }
          : obj
      );
    case 'ADD':
      return state.concat(action.data);
    case 'INIT':
      return action.data;
    case 'REMOVE':
      return state.filter((b) => b.id !== action.id);
    default:
      return state;
  }
};

export default reducer;

export const initBlog = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch({
      type: 'INIT',
      data: blogs,
    });
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    // const newObj = asObject(blog);
    const newBlog = await blogService.create(blog);
    console.log('newBlog :>> ', newBlog);
    dispatch({
      type: 'ADD',
      data: newBlog,
    });
  };
};

export const likeBlog = (blog) => {
  return async (dispatch) => {
    // const blog = await blogService.get(id);
    await blogService.update(blog.id, {
      ...blog,
      votes: blog.votes + 1,
    });
    dispatch({
      type: 'LIKE',
      id: blog.id,
    });
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch({
      type: 'REMOVE',
      id,
    });
  };
};

export const addComment = (id, comment) => {
  return async (dispatch) => {
    await blogService.addComment(id, comment);
    dispatch({
      type: 'COMMENT',
      id,
      comment,
    });
  };
};
