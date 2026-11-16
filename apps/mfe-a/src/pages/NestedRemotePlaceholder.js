import React from 'react';
import { Alert } from 'antd';

export default function NestedRemotePlaceholder({ child, requestedPathname }) {
  return (
    <div>
      <Alert
        type="info"
        showIcon
        message={`${child.label}: nested remote container (placeholder)`}
        description={`Akan di-load dari ${child.remoteId} (${child.host}) pada Phase 4. Original pathname: ${requestedPathname}`}
        style={{ marginBottom: 16 }}
      />
      <div id="mfe-a-nested-container" className="mfe-a-nested-container" />
    </div>
  );
}