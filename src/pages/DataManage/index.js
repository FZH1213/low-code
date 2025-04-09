// 模拟页面，用于占位
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button, Tree } from 'antd';

import { PlusCircleOutlined } from '@ant-design/icons';
('@ant-design/icons');

// 导入数据源树形图组件
import DataTree from './components/DataTree';

// 导入数据库添加弹框组件
import AddDataSourceModal from './components/AddDataSourceModal';

// 导入右侧主体内容组件
import Main from './components/Main';

const DataSourceManage = (props) => {
  const treeRef = useRef(null);

  // 新增数据库库弹框显示标志位
  const [AddDataSourceModalVisible, setAddDataSourceModalVisible] = useState(false);

  // 左侧树状图选中项key值
  const [selectedKeys, setSelectedKeys] = useState(null);

  // 关闭新增数据库弹框方法
  const closeAddDataSourceModal = () => {
    setAddDataSourceModalVisible(false);
  };

  const onDataTreeSelect = (selectedKeys, e) => {
    console.log('父组件接收 =>', e);
    console.log('父组件接收 =>', selectedKeys[0]);
    setSelectedKeys(selectedKeys[0]);
  };
  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100%',
          //   border: '1px solid red',
          display: 'flex',
        }}
      >
        {/* 左侧树形图 */}
        <div
          style={{
            flex: '0 0 360px',
            // height: '100%',

            height: 'calc(100vh - 96px)',

            // minWidth: '360px',
            // maxWidth: '420px',
            width: '360px',
            backgroundColor: '#fff',
            marginRight: '16px',
          }}
        >
          {/* 头部标题, 右侧添加按钮 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              height: '48px',
              lineHeight: '48px',
              borderBottom: '1px solid #f1f2f4',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginLeft: '16px',
                }}
              >
                数据源
              </span>
            </div>
            <div
              style={{
                height: '48px',
                lineHeight: '48px',
              }}
            >
              <PlusCircleOutlined
                style={{
                  fontSize: '14px',
                  color: '#1890ff',
                  position: 'relative',
                  cursor: 'pointer',
                  marginRight: '4px',
                }}
                onClick={() => {
                  setAddDataSourceModalVisible(true);
                }}
              ></PlusCircleOutlined>
              <span
                style={{
                  fontSize: '12px',
                  color: '#1890ff',
                  marginRight: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setAddDataSourceModalVisible(true);

                  // 测试刷新树形图
                  // if (treeRef != null && treeRef.current != null) {
                  //   console.log('treeRef =>', treeRef);
                  //   treeRef.current.refresh();
                  // }
                }}
              >
                添加数据库
              </span>
            </div>
          </div>

          {/* 左侧数据源 树形图 */}
          <div>
            <DataTree
              ref={treeRef}
              // 派发选中事件的入参方法
              onSelect={onDataTreeSelect}
            ></DataTree>
          </div>
        </div>
        {/* 右侧内容，包括上部搜索栏，中部操作按钮，以及下部主体内容 */}
        <div
          style={{
            flex: '2',
            height: '100%',
            minWidth: '500px',
            backgroundColor: '#fff',
          }}
        >
          <Main
            selectedKeys={selectedKeys}
            refreshTree={() => {
              // 刷新树形图
              if (treeRef != null && treeRef.current != null) {
                console.log('treeRef =>', treeRef);
                treeRef.current.refresh();
              }
            }}
          ></Main>
        </div>
      </div>

      {/* 新增数据库弹框 */}
      <AddDataSourceModal
        visible={AddDataSourceModalVisible}
        close={closeAddDataSourceModal}
        refreshTree={() => {
          // 刷新树形图
          if (treeRef != null && treeRef.current != null) {
            console.log('treeRef =>', treeRef);
            treeRef.current.refresh();
          }
        }}
      ></AddDataSourceModal>
    </>
  );
};

export default DataSourceManage;
