import React from 'react';
import { Card, Tag, Timeline } from 'antd';
import { activities } from '../data/mock';

const colorByStatus = { Done: 'green', Pending: 'blue', Open: 'red' };

export default function CustomerActivity() {
  return (
    <Card title="Customer Activity">
      <Timeline>
        {activities.map((a) => (
          <Timeline.Item key={a.id} color={colorByStatus[a.status]}>
            <strong>{a.customer}</strong> · {a.type} · {a.date}{' '}
            <Tag color={colorByStatus[a.status]}>{a.status}</Tag>
            <div>{a.note}</div>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
}