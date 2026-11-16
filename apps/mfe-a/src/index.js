import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import 'antd/dist/antd.css';
import './styles.css';
import { DEFAULT_BASE_PATH } from './config/menu';
import { registerRemoteApi } from './remoteApi';
import App from './App';

registerRemoteApi();

const standaloneRoot = document.getElementById('mfe-a-standalone-root');
if (standaloneRoot) {
  const history = createBrowserHistory();
  if (!history.location.pathname.startsWith(DEFAULT_BASE_PATH)) {
    history.replace(DEFAULT_BASE_PATH);
  }
  ReactDOM.render(
    <div>
      <div className="mfe-a-standalone-banner">MFE A standalone mode (dev harness)</div>
      <App history={history} basePath={DEFAULT_BASE_PATH} />
    </div>,
    standaloneRoot
  );
}