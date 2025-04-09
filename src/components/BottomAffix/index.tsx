import React, { useState } from 'react';
import { Affix } from 'antd';
import styles from './style.less';

export interface ComponentProps { }

const FunctionComponent: React.FC<ComponentProps> = ({ children }) => {
  const [width, setWidth] = useState<number>(document.body.clientWidth);

  window.onresize = () => {
    setWidth(document.body.clientWidth);
  };

  if (!children) {
    return null;
  }

  return (
    <Affix
      offsetBottom={0}
      style={{
        textAlign: 'left',
        width,
        position: 'fixed',
        bottom: 0,
        left: "0",
        zIndex: 99
      }}
    >
      <div
        style={{
          borderTop: '1px solid #d9d9d9',
          backgroundColor: 'white',
          padding: 10,
          paddingRight: 20,
          paddingLeft: "18%",
        }}
      >
        {children}
      </div>
    </Affix>
  );
};

export default FunctionComponent;
