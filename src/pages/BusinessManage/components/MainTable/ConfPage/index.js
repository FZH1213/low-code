// 执行配置 抽屉 页面
import React, { useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';
import { Button, Form, Tree, Input, Space, Typography, Modal, Spin, Drawer } from 'antd';

const ConfPage = (props) => {
  useEffect(() => {
    console.log('重渲染 =>', props);
  }, []);

  return (
    <>
      {
        <div
          style={{
            height: '300px',
            width: '300px',
          }}
        >
          <Button
            onClick={() => {
              props.onClose && props.onClose();
            }}
          >
            关闭
          </Button>
        </div>
      }
    </>
    // <div>
    //   <Drawer placement={'right'} onClose={props.onClose} visible={props.visible}>
    //     执行配置页面
    //   </Drawer>
    // </div>
  );
};

export default ConfPage;
