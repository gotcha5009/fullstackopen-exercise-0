import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import store from './store';

ReactDOM.render(
  <Container>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </Container>,
  document.getElementById('root')
);
