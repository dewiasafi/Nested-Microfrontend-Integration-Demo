import React from 'react';
import { Alert } from 'antd';

export default function RemotePlaceholder({ title, remote, origin }) {
  return (
    <div>
      <Alert
        type="info"
        showIcon
        message={`${title}: remote container (placeholder)`}
        description={`Akan di-load dari ${remote} (${origin}) pada Phase 3. Belum ada remote integration.`}
        style={{ marginBottom: 16 }}
      />
      <div id="parent-remote-container" className="parent-remote-container" />
    </div>
  );
}