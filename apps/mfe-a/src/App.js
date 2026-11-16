import React from 'react';
import { Alert, Icon, Layout, Menu } from 'antd';
import { Link, Redirect, Route, Router, Switch } from 'react-router-dom';
import { CHILD_MENUS, CHILD_ROUTE_PREFIX, NATIVE_MENUS } from './config/menu';
import WorkspaceOverview from './pages/WorkspaceOverview';
import Reports from './pages/Reports';
import NestedRemotePlaceholder from './pages/NestedRemotePlaceholder';

const { Sider, Content } = Layout;

function selectedKey(pathname, basePath) {
  const rel = pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
  const native = NATIVE_MENUS.find((m) => rel === m.path || rel.startsWith(m.path + '/'));
  if (native) return native.key;
  if (rel === CHILD_ROUTE_PREFIX || rel.startsWith(CHILD_ROUTE_PREFIX + '/')) return CHILD_MENUS[0].id;
  return null;
}

function WorkspaceShell({ basePath }) {
  return (
    <Route
      render={({ location }) => {
        const key = selectedKey(location.pathname, basePath);
        const original = location.pathname.slice(basePath.length) || '/';
        return (
          <Layout className="mfe-a-layout">
            <Sider width={220} theme="light" className="mfe-a-sider">
              <div className="mfe-a-title">Workspace</div>
              <Menu mode="inline" selectedKeys={key ? [key] : []}>
                {NATIVE_MENUS.map((m) => (
                  <Menu.Item key={m.key}>
                    <Link to={basePath + m.path}>
                      <Icon type={m.icon} />
                      <span>{m.label}</span>
                    </Link>
                  </Menu.Item>
                ))}
                {CHILD_MENUS.map((c) => (
                  <Menu.Item key={c.id}>
                    <Link to={basePath + c.pathname}>
                      <Icon type={c.icon} />
                      <span>{c.label}</span>
                    </Link>
                  </Menu.Item>
                ))}
              </Menu>
            </Sider>
            <Content className="mfe-a-content">
              <Switch>
                <Redirect exact from={basePath} to={basePath + NATIVE_MENUS[0].path} />
                <Route path={basePath + '/overview'} component={WorkspaceOverview} />
                <Route path={basePath + '/reports'} component={Reports} />
                <Route
                  path={basePath + CHILD_ROUTE_PREFIX}
                  render={() => <NestedRemotePlaceholder child={CHILD_MENUS[0]} requestedPathname={original} />}
                />
                <Route render={() => <Alert type="warning" showIcon message="Workspace page not found" />} />
              </Switch>
            </Content>
          </Layout>
        );
      }}
    />
  );
}

export default function App({ history, basePath }) {
  return (
    <Router history={history}>
      <WorkspaceShell basePath={basePath} />
    </Router>
  );
}