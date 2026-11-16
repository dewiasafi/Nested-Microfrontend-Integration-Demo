import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { DEFAULT_PATHNAME, getRouteMetadata } from './routes';

// containerId -> container element that currently owns a React tree
const instances = new Map();

function unmount(containerId) {
  const el = instances.get(containerId);
  if (!el) return false; // safe to call repeatedly
  try {
    ReactDOM.unmountComponentAtNode(el);
  } finally {
    instances.delete(containerId);
  }
  return true;
}

function render(containerId, props = {}) {
  const el = document.getElementById(containerId);
  if (!el) throw new Error(`[MfeB] Container "${containerId}" not found`);

  // Same id but a different DOM node (host re-created it): clean the stale tree first.
  const existing = instances.get(containerId);
  if (existing && existing !== el) unmount(containerId);

  // Same container: ReactDOM.render updates the existing tree, so no duplicate root.
  ReactDOM.render(
    <App pathname={props.pathname || DEFAULT_PATHNAME} onNavigate={props.onNavigate} />,
    el
  );
  instances.set(containerId, el);
  return true;
}

export function registerRemoteApi() {
  window.NestedMfeDemo = window.NestedMfeDemo || {};
  window.NestedMfeDemo.MfeB = { getRoutes: getRouteMetadata, render, unmount };
}