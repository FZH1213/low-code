// 参数配置模块
import React, { useState, useEffect, useRef } from 'react';
import {
  PlusCircleOutlined,
  DeleteOutlined,
  CloseOutlined,
  EditOutlined,
  FormOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import { Form, Input } from 'antd';

import styles from './styles.less';

let newKey = -1;

import ParamsDetailCard from './components/ParamDetailCard';

import wait from '../../../../images/wait.png';

const ParamsConf = (props) => {
  // 给表单数据对象中的每个添加一个key值的数据
  const [data, setData] = useState(null);

  // 初次渲染标志位
  const [firstFlag, setFirstFlag] = useState(true);

  //   子组件派发的改变数据方法
  const changeItem = (changeData) => {
    let copyData = [...data].map((item) => {
      if (item.key === changeData.key) {
        return changeData;
      } else {
        return item;
      }
    });

    setData(copyData);
    props.changeData && props.changeData(JSON.stringify(copyData));
  };

  //   新增
  const addItem = () => {
    let key = newKey + 1;
    newKey += 1;

    let copyData = [...data].map((item) => item);

    copyData.unshift({
      param: '',
      type: '',
      default: '',
      key: key,
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
          if ('json' == item.type) item.default = JSON.stringify(item.default); //json转string展示
          return {
            ...item,
            key: key,
          };
        }),
      );
    } else {
      setData([]);
    }
  }, []);

  const deleteItem = (dItem) => {
    let copyData = [...data].filter((item) => item.key !== dItem.key);
    setData(copyData);

    props.changeData && props.changeData(JSON.stringify(copyData));
  };

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
          参数配置
        </div>
        <div
          style={{
            color: '#1C6DE8',
            position: 'relative',
            top: '3px',
            cursor: 'pointer',
          }}
          onClick={() => {
            console.log('新增参数');
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
          <span>新增参数</span>
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
              <>
                {data.map((item, index) => {
                  return (
                    <ParamsDetailCard
                      key={index}
                      deleteItem={deleteItem}
                      changeItem={changeItem}
                      itemData={item}
                      treeSelectOptions={props.treeSelectOptions}
                    ></ParamsDetailCard>
                  );
                })}
              </>
            ) : (
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
