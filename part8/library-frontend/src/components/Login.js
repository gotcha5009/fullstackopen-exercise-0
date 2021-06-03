import React, { useState } from 'react';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  if (!props.show) {
    return null;
  }

  const handleLogin = (e) => {
    e.preventDefault();

    props.login({ variables: { username, password } });
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        name
        <input
          required
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <br />
        password
        <input
          required
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;
