import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import App from './App';
import loading from './reducers/loading';

const store = createStore(loading);

const root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default root;