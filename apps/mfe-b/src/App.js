import React from 'react';
import { Alert, Menu } from 'antd';
import { getRouteMetadata, resolveRoute } from './routes';

export default function App({ pathname, onNavigate }) {
  const route = resolveRoute(pathname);

  if (!route) {
    return (
      <Alert
        type="error"
        showIcon
        message="Unknown customer route"
        description={`Path "${pathname}" is not supported by MFE B.`}
      />
    );
  }

  const Page = route.component;
  const routes = getRouteMetadata();

  return (
    <div className="mfe-b-root">
      <Menu
        mode="horizontal"
        selectedKeys={[route.id]}
        onClick={({ key }) => {
          const next = routes.find((r) => r.id === key);
          if (next && onNavigate) onNavigate(next.pathname);
        }}
      >
        {routes.map((r) => (
          <Menu.Item key={r.id}>{r.label}</Menu.Item>
        ))}
      </Menu>
      <div className="mfe-b-content">
        <Page />
      </div>
    </div>
  );
}