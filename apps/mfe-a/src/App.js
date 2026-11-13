import React from 'react';
import {Button} from 'antd';
import 'antd/dist/antd.css';

const APP_NAME = 'MFE A - Workspace';
const APP_PORT = '5002';


export default function App() {
  return (
   <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>{APP_NAME}</h1>
      <p>Running independently on port {APP_PORT}.</p>
      <Button type="primary">Ant Design v3 loaded</Button>
    </div>
  );
}