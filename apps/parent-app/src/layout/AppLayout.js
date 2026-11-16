import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon, Layout, Menu } from 'antd';
import { MENU_ITEMS, findMenuKey } from '../config/menu';

const { Header, Sider, Content } = Layout;

export default function AppLayout({ children }) {
  const location = useLocation();
  const selected = findMenuKey(location.pathname);

  return (
    <Layout className="parent-layout">
      <Header className="parent-header">
        <span className="parent-logo">Nimbus Console</span>
        <span className="parent-header-note">Parent Application · Global Shell</span>
      </Header>
      <Layout>
        <Sider width={220} theme="light" className="parent-sider">
          <Menu mode="inline" selectedKeys={selected ? [selected] : []} style={{ height: '100%' }}>
            {MENU_ITEMS.map((m) => (
              <Menu.Item key={m.key}>
                <Link to={m.path}>
                  <Icon type={m.icon} />
                  <span>{m.label}</span>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Content className="parent-content">{children}</Content>
      </Layout>
    </Layout>
  );
}