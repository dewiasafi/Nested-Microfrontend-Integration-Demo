import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import 'antd/dist/antd.css';
import './styles.css';
import App from './App';
import { DEFAULT_PATHNAME } from './routes';
import { registerRemoteApi } from './remoteApi';

registerRemoteApi();

const standaloneRoot = document.getElementById('mfe-b-standalone-root');
if (standaloneRoot) {
  ReactDOM.render(
    <BrowserRouter>
      <div className="mfe-b-standalone-banner">MFE B standalone mode (dev harness)</div>
      <Switch>
        <Redirect exact from="/" to={DEFAULT_PATHNAME} />
        <Route
          render={({ location, history }) => (
            <App pathname={location.pathname} onNavigate={(p) => history.push(p)} />
          )}
        />
      </Switch>
    </BrowserRouter>,
    standaloneRoot
  );
}