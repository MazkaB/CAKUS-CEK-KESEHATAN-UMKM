
// frontend/src/components/common/Loading.jsx
import React from 'react';
import { Spin } from 'antd';

const Loading = ({ size = 'large', tip = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px'
    }}>
      <Spin size={size} />
      <p style={{ marginTop: '16px', color: '#666' }}>{tip}</p>
    </div>
  );
};

export default Loading;
