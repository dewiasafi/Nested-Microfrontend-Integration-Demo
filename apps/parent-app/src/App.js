import React, { Suspense, lazy } from 'react';
import { Spin } from 'antd';
import { Route, Switch } from 'react-router-dom';
import AppLayout from './layout/AppLayout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const RemoteResolverPage = lazy(() => import('./pages/RemoteResolverPage'));

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
          <Route component={RemoteResolverPage} />
        </Switch>
      </Suspense>
    </AppLayout>
  );
}