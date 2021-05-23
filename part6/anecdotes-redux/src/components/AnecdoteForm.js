import React from 'react';
// import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { addAnecdote } from '../reducers/anecdoteReducer';
import { showNoti } from '../reducers/notificationReducer';

const AnecdoteForm = (props) => {
  //   const dispatch = useDispatch();

  const create = async (e) => {
    e.preventDefault();
    const content = e.target.newAnecdote.value;
    e.target.newAnecdote.value = '';

    // dispatch(addAnecdote(content));
    // dispatch(showNoti(`new anecdote ${content}`, 5));
    props.addAnecdote(content);
    props.showNoti(`new anecdote ${content}`, 5);
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={create}>
        <div>
          <input name="newAnecdote" />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};

export default connect(null, { addAnecdote, showNoti })(AnecdoteForm);
