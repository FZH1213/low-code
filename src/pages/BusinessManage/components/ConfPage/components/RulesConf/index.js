// 参数配置模块
import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
  PlusCircleOutlined,
  DeleteOutlined,
  CloseOutlined,
  EditOutlined,
  FormOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import { Form, Input, Tree, Table } from 'antd';

import styles from './styles.less';

let newKey = -1;

import ParamsDetailCard from './components/RuleDetailCard';

import wait from '../../../../images/wait.png';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
const ParamsConf = (props) => {
  useEffect(() => {
    console.log('props.initdata => ' + props.initData);
  }, []);
  // 给表单数据对象中的每个添加一个key值的数据
  const [data, setData] = useState(null);

  // 初次渲染标志位
  const [firstFlag, setFirstFlag] = useState(true);

  // 移动修改状态符
  const [flag, setFlag] = useState(false);

  //   子组件派发的改变数据方法
  const changeItem = (changeData) => {
    let copyData = [...data].map((item) => {
      if (item.key == changeData.key) {
        return changeData;
      } else {
        return item;
      }
    });

    setData(copyData);

    props.changeData && props.changeData(JSON.stringify(copyData));
    // changeSourceData(copyData);
  };

  //   剔除 非必要字段 ，改变父组件数据的方法
  const changeSourceData = (data) => {
    let copyData = data.map((item) => item);
    if (data != null && data.length != null && !!data.length) {
      let resData = copyData.map((item) => {
        delete item.key;
        delete item.disable;
        return item;
      });
      console.log('resData =>', resData);

      props.changeData && props.changeData(JSON.stringify(resData));
    }
  };

  //   新增
  const addItem = () => {
    let key = newKey + 1;
    newKey += 1;
    let copyData = [...data].map((item) => item);
    copyData.push({
      params: '',
      ruleDefId: '',
      resultName: '',
      key: key,
      edit: true,
    });
    console.log('copyData =>', copyData);
    setData(copyData);
  };

  useEffect(() => {
    console.log('props =>', props);

    let jsonObj = null;

    jsonObj = JSON.parse(props.initData);

    if (jsonObj != null) {
      setData(
        jsonObj.map((item, index) => {
          let key = newKey + 1;
          newKey += 1;
          item.params = JSON.stringify(item.params); //json转string展示
          return {
            ...item,
            key: key,
            edit: false,
          };
        }),
      );
    } else {
      setData([]);
    }
  }, []);

  const deleteItem = (dItem) => {
    let copyData = [...data].filter((item) => item.key !== dItem.key);

    console.log(copyData);

    setData(copyData);

    props.changeData && props.changeData(JSON.stringify(copyData));

    // changeSourceData(copyData);
  };

  const moveCard = useCallback(
    (dragIndex, hoverIndex, changeData) => {
      if (changeData.params != '') {
        setData(
          [...data].map((item) => {
            if (item.key == changeData.key) {
              return changeData;
            } else {
              return item;
            }
          }),
        );
      }

      setData((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        }),
      );
      setFlag(true);
      // props.changeData && props.changeData(JSON.stringify(copyData));
    },
    [data],
  );
  useEffect(() => {
    if (flag) {
      console.log(data);
      props.changeData && props.changeData(JSON.stringify(data));
    }
  }, [data, flag]);
  return (
    <div>
      {/* 头部 */}
      <div
        style={{
          height: '48px',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          执行能力
        </div>
        <div
          style={{
            color: '#1C6DE8',
            position: 'relative',
            top: '3px',
            cursor: 'pointer',
          }}
          onClick={() => {
            addItem();
          }}
        >
          <span
            style={{
              marginRight: '3px',
            }}
          >
            <PlusCircleOutlined />
          </span>
          <span>新增能力</span>
        </div>
      </div>

      {/* 底部参数编辑 */}
      <div
        style={{
          height: 'calc(100vh - 236px)',
          overflow: 'hidden',
        }}
      >
        <div className={styles.wrapper}>
          <div>
            {data != null && data.length != null && !!data.length ? (
              // <DndProvider backend={HTML5Backend}>
              <div>
                <div>
                  {/* <Tree
                    className="draggable-tree"
                    // defaultExpandedKeys={expandedKeys}
                    // draggable
                    // blockNode
                    // onDragEnter={onDragEnter}
                    // onDrop={onDrop}
                    draggable
                    onDragEnter={onDragEnter}
                    onDrop={onDrop}
                    treeData={data}
                    showIcon={true}
                    titleRender={(item) => {
                      return (<ParamsDetailCard
                        key={item.key}
                        index={item.key}
                        editBoolean={item.params ? false : true}
                        deleteItem={deleteItem}
                        changeItem={changeItem}
                        itemData={item}
                      ></ParamsDetailCard>
                      )
                    }} 
                  />*/}
                  {/* 循环数据在这里面 */}
                  {/* {data.map((item, index) => {
                  return (
                    <ParamsDetailCard
                      key={index}
                      index={index}
                      editBoolean={item.params ? false : true}
                      deleteItem={deleteItem}
                      changeItem={changeItem}
                      itemData={item}
                      moveCard={moveCard}
                    ></ParamsDetailCard>
                  );
                })} */}
                </div>
                <div>
                  {/* table 方案 */}
                  <DndProvider backend={HTML5Backend}>
                    {/*                  
                    <Table pagination={false} dataSource={data} columns={[{
                      dataIndex: "key", key: "key", render: (text,item) => {
                        return (<ParamsDetailCard
                          key={item.key}
                          index={item.key}
                          editBoolean={item.params ? false : true}
                          deleteItem={deleteItem}
                          changeItem={changeItem}
                          itemData={item}
                          components={components}
                          onRow={(_, index) => {
                            const attr = {
                              index,
                              moveRow,
                            };
                            return attr;
                          }}
                        ></ParamsDetailCard>
                        )
                      }
                    }]}></Table> */}

                    {data.map((item, index) => {
                      return (
                        <ParamsDetailCard
                          key={index}
                          index={index}
                          deleteItem={deleteItem}
                          changeItem={changeItem}
                          itemData={item}
                          moveCard={moveCard}
                          treeSelectOptions={props.treeSelectOptions}
                        ></ParamsDetailCard>
                      );
                    })}
                  </DndProvider>
                </div>
              </div>
            ) : (
              // </DndProvider>
              // b方案

              <>
                <div
                  style={{
                    height: '360px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <img
                      src={wait}
                      style={{
                        height: '200px',
                        width: '260px',
                        marginTop: '80px',
                        marginBottom: '20px',
                      }}
                    ></img>
                    <div
                      style={{
                        textAlign: 'center',
                        fontSize: '16px',
                        color: '#999',
                      }}
                    >
                      暂无数据
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParamsConf;
