import React from 'react';
import { Card, Col, List, Row, Statistic, Tag } from 'antd';

const announcements = [
  { id: 1, text: 'Maintenance window scheduled for Sunday 02:00', tag: 'Info', color: 'blue' },
  { id: 2, text: 'New reporting module enabled for all workspaces', tag: 'New', color: 'green' },
  { id: 3, text: 'Quarterly access review is due this week', tag: 'Action', color: 'orange' },
];

export default function Dashboard() {
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}><Card><Statistic title="Active Workspaces" value={12} /></Card></Col>
        <Col span={8}><Card><Statistic title="Open Tasks" value={48} /></Card></Col>
        <Col span={8}><Card><Statistic title="Team Members" value={27} /></Card></Col>
      </Row>
      <Card title="Announcements">
        <List
          dataSource={announcements}
          renderItem={(a) => (
            <List.Item>
              <Tag color={a.color}>{a.tag}</Tag> {a.text}
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}