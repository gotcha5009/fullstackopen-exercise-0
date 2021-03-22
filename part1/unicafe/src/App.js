import React, { useState } from "react";

const Statistic = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ feedbacks }) => {
  if (feedbacks.all === 0) {
    return <p>No feedback given</p>;
  }
  return (
    <div>
      <table>
        <tbody>
          <Statistic text="good" value={feedbacks.good} />
          <Statistic text="neutral" value={feedbacks.neutral} />
          <Statistic text="bad" value={feedbacks.bad} />
          <Statistic text="all" value={feedbacks.all} />
          <Statistic text="average" value={feedbacks.average} />
          <Statistic text="positive" value={feedbacks.positive} />
        </tbody>
      </table>
    </div>
  );
};

const Button = ({ text, handleClick }) => (
  <button onClick={handleClick}>{text}</button>
);

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const average = (good * 1 + bad * -1) / (good + bad + neutral);
  const all = good + bad + neutral;
  const positive = (good / all) * 100;
  return (
    <div>
      <h2>give feedback</h2>
      <br />
      <Button text="good" handleClick={() => setGood(good + 1)} />
      <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button text="bad" handleClick={() => setBad(bad + 1)} />
      <br />
      <h2>statistics</h2>
      <Statistics
        feedbacks={{
          good: good,
          neutral: neutral,
          bad: bad,
          all: all,
          average: average,
          positive: `${positive} %`,
        }}
      />
    </div>
  );
};

export default App;
