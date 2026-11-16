import React from 'react';
import { Card, Col, Progress, Row, Statistic } from 'antd';

export default function WorkspaceOverview() {
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}><Card><Statistic title="Projects" value={9} /></Card></Col>
        <Col span={8}><Card><Statistic title="Open Items" value={31} /></Card></Col>
        <Col span={8}><Card><Statistic title="Members" value={14} /></Card></Col>
      </Row>
      <Card title="Sprint Progress">
        <p>Platform Revamp</p>
        <Progress percent={72} />
        <p>Billing Cleanup</p>
        <Progress percent={45} status="active" />
        <p>Onboarding Flow</p>
        <Progress percent={90} />
      </Card>
    </div>
  );
}