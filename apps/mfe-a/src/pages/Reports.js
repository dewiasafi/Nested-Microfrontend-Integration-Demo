import React from 'react';
import { Card, Table, Tag } from 'antd';

const data = [
  { id: 'r-1', name: 'Weekly Summary', owner: 'Maya Putri', updated: '2026-11-12', status: 'Ready' },
  { id: 'r-2', name: 'Usage Trends', owner: 'Raka Pratama', updated: '2026-11-10', status: 'Ready' },
  { id: 'r-3', name: 'Quarterly Review', owner: 'Dian Lestari', updated: '2026-11-08', status: 'Draft' },
];

const columns = [
  { title: 'Report', dataIndex: 'name', key: 'name' },
  { title: 'Owner', dataIndex: 'owner', key: 'owner' },
  { title: 'Last Updated', dataIndex: 'updated', key: 'updated' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (s) => <Tag color={s === 'Ready' ? 'green' : 'gold'}>{s}</Tag>,
  },
];

export default function Reports() {
  return (
    <Card title="Reports">
      <Table rowKey="id" columns={columns} dataSource={data} pagination={false} size="middle" />
    </Card>
  );
}