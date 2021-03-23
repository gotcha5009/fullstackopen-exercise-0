import React, { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
  ];
  const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleNext = () => {
    const rndInt = getRndInteger(0, anecdotes.length - 1);
    console.log(rndInt);
    setSelected(rndInt);
  };

  const handleVote = () => {
    const copy = [...score];
    copy[selected]++;
    setScore(copy);
  };

  const findMostVote = (anecdotes, score) => {
    const maxScore = Math.max(...score);
    return anecdotes[score.indexOf(maxScore)];
  };

  const [selected, setSelected] = useState(0);
  const [score, setScore] = useState(new Uint8Array(anecdotes.length));

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {score[selected]} votes</p>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleNext}>next anecdote</button>
      <br />
      <h2>Anecdote with most votes</h2>
      <p>{findMostVote(anecdotes, score)}</p>
    </div>
  );
};

export default App;
