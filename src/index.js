import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router/immutable';

import App from './App';
import { history, persists, store } from './redux';
import * as serviceWorker from './serviceWorker';

import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persists}>
      <ConnectedRouter history={history}>
        <Route component={App}/>
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
