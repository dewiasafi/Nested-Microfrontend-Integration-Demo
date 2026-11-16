import React, { Suspense, lazy } from 'react';
import { Alert, Spin } from 'antd';
import { Route, Switch } from 'react-router-dom';
import AppLayout from './layout/AppLayout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const RemotePlaceholder = lazy(() => import('./pages/RemotePlaceholder'));

function PageLoading() {
  return (
    <div style={{ textAlign: 'center', padding: 48 }}>
      <Spin tip="Loading page..." />
    </div>
  );
}

export default function App() {
  return (
    <AppLayout>
      <Suspense fallback={<PageLoading />}>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route
            path="/workspace"
            render={() => (
              <RemotePlaceholder title="Workspace" remote="MFE A" origin="http://localhost:5002" />
            )}
          />
          <Route
            path="/customers"
            render={() => (
              <RemotePlaceholder title="Customer Management" remote="MFE B" origin="http://localhost:5003" />
            )}
          />
          <Route render={() => <Alert type="warning" showIcon message="Page not found" />} />
        </Switch>
      </Suspense>
    </AppLayout>
  );
}