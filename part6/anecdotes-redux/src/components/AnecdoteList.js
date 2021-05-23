import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { voteAnecdote } from '../reducers/anecdoteReducer';
import { showNoti } from '../reducers/notificationReducer';
import Notification from './Notification';

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    return filter.length < 3
      ? anecdotes
      : anecdotes.filter((anecdote) =>
          new RegExp(filter, 'g').test(anecdote.content)
        );
  });
  const sortedAnecdotes = anecdotes.sort((a, b) => b.votes - a.votes);
  const dispatch = useDispatch();

  const vote = (id, content) => {
    dispatch(voteAnecdote(id));
    dispatch(showNoti(`you voted ${content}`, 5));
  };

  return (
    <div>
      <Notification />
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
