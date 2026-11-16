import React from 'react';
import ReactDOM from 'react-dom';
import { createMemoryHistory } from 'history';
import { DEFAULT_BASE_PATH } from './config/menu';
import App from './App';

const instances = new Map();

function unmount(containerId) {
  const inst = instances.get(containerId);
  if (!inst) return false; 
  try {
    ReactDOM.unmountComponentAtNode(inst.el);
  } finally {
    instances.delete(containerId);
  }
  return true;
}

function render(containerId, props = {}) {
  const el = document.getElementById(containerId);
  if (!el) throw new Error(`[MfeA] Container "${containerId}" not found`);

  // Container node replaced, or host handed over a different history: rebuild the tree.
  const existing = instances.get(containerId);
  if (existing && (existing.el !== el || (props.history && existing.history !== props.history))) {
    unmount(containerId);
  }

  const basePath = props.basePath || DEFAULT_BASE_PATH;
  const current = instances.get(containerId);
  const history =
    props.history ||
    (current && current.history) ||
    createMemoryHistory({ initialEntries: [props.pathname || basePath] });

  ReactDOM.render(<App history={history} basePath={basePath} />, el);
  instances.set(containerId, { el, history });
  return true;
}

export function registerRemoteApi() {
  window.NestedMfeDemo = window.NestedMfeDemo || {};
  window.NestedMfeDemo.MfeA = { render, unmount };
}