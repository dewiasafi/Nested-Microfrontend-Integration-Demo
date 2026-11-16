import React from 'react';
import { Card, Col, Row, Statistic, Table, Tag } from 'antd';
import { customers } from '../data/mock';

const columns = [
  { title: 'Customer', dataIndex: 'name', key: 'name' },
  { title: 'Owner', dataIndex: 'owner', key: 'owner' },
  { title: 'Tier', dataIndex: 'tier', key: 'tier' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (s) => <Tag color={s === 'Active' ? 'green' : 'orange'}>{s}</Tag>,
  },
  { title: 'Customer Since', dataIndex: 'since', key: 'since' },
];

export default function CustomerOverview() {
  const active = customers.filter((c) => c.status === 'Active').length;
  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}><Card><Statistic title="Total Customers" value={customers.length} /></Card></Col>
        <Col span={8}><Card><Statistic title="Active" value={active} /></Card></Col>
        <Col span={8}><Card><Statistic title="Paused" value={customers.length - active} /></Card></Col>
      </Row>
      <Card title="Customer Overview">
        <Table rowKey="id" columns={columns} dataSource={customers} pagination={false} size="middle" />
      </Card>
    </div>
  );
}