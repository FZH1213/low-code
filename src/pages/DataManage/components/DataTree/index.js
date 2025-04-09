// 左侧 展示 数据库 以及表的树形图
import React, { useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';
import { Button, Form, Tree, Input, Space, Typography, Modal, Spin, message } from 'antd';

import styles from './styles.less';

const { Search } = Input;

// 导入 mock 接口
import { getTreeData } from './service';

// 导入接口
import { fetchDataSources, fetchTablesData, deleteTreeItem } from './service';

// 导入各个图片
import ban_icon_unactive from './image/ban_unactive_small.png';
import ban_icon from './image/ban_icon.png';
import database_icon from './image/database.png';
import hive_icon from './image/hive_icon.png';
import mysql_icon from './image/mysql.png';
import table_unactive_icon from './image/table_unactive_small.png';
import table_icon from './image/table.png';

// 图标图片映射对象
const iconObj = {};

// 搜索关键字展开-按照找到的匹配节点，找到其父节点，以展开
const getParentKey = (key, tree) => {
  let parentKey;
  if (tree != null && tree.length != null && !!tree.length) {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => `${item.key}` === `${key}`)) {
          console.log('parentKey =>', parentKey);
          //   debugger;
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          // debugger;
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    //   parentKey = `${parentKey}`;
    return parentKey != null && parentKey.length != null && !!parentKey.length ? parentKey : '';
  }
};

const dataList = [];
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    node.key = node.id;
    // node.title = node.name;
    node.title = node.name;
    const { key, title } = node;
    dataList.push({ key, title });
    if (node.children) {
      generateList(node.children);
    }
  }
};

const DataTree = React.forwardRef((props, ref) => {
  const [initialTreeData, setInitialTreeData] = useState(null);

  const [renderTreeData, setRenderTreeData] = useState(null);

  const [expandedKeys, setExpandedKeys] = useState([]); // 可控的展开key值

  const [searchValue, setSearchValue] = useState(''); // 搜索关键字

  const [selectedKeys, setSelectedKeys] = useState([]); // 受控的选中key值

  const [treeLoading, setTreeLoading] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      refresh: () => {
        refreshTree();
      },
    };
  });

  // 暴露给外界的刷新树形图的方法
  const refreshTree = () => {
    console.log('刷新树形图');
    const getData = async () => {
      setTreeLoading(true);

      setTimeout(() => {
        setTreeLoading(false);
      }, 5000);

      fetchDataSources().then((res) => {
        console.log('接口获取树形数据 =>', res);
        setTreeLoading(false);

        if (res.code === 0) {
          setInitialTreeData(res.data);
        }
      });
    };

    getData();
  };

  const onInputSearch = (e) => {
    console.log('e =>', e);
    // setSearchValue(e);
    let expandedKeyArr = [];

    let oriArr = [];

    setSearchValue(e);

    let value = e;

    if (value) {
      oriArr = dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1) {
            console.log('匹配到的item', item);

            let indexOfKey = getParentKey(item.key, renderTreeData);

            console.log('找到的父节点key值', indexOfKey);

            if (
              getParentKey(item.key, renderTreeData) &&
              expandedKeyArr.indexOf(indexOfKey) === -1
            ) {
              expandedKeyArr.push(indexOfKey);
            }

            return indexOfKey;
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
    }

    console.log('获取的一级父节点数组 =>', oriArr);

    let resArr = [];

    // 找到全部的相关联父节点
    oriArr.forEach((item) => {
      const getPKey = (i) => {
        let pKey = getParentKey(i, props.treeData);
        console.log('pKey =>', pKey);
        if (pKey != null && pKey.length != null && !!pKey.length) {
          resArr.push(pKey);
          getPKey(pKey);
        }
      };
      getPKey(item);
    });

    resArr = resArr.concat(oriArr).filter((item, i, self) => item && self.indexOf(item) === i);
    console.log('找到的所有相关联keys =>', resArr);

    // 模糊搜索的key传入数组
    // setExpandedKeys(expandedKeyArr); // 原代码
    setExpandedKeys(resArr);
  };

  // useEffect(() => {
  //   const fetchTreeData = async () => {
  //     let res = await getTreeData();

  //     console.log('res =>', res);

  //     if (res.code === 0) {
  //       console.log('data =>', res.data);
  //       setInitialTreeData(res.data);
  //     }
  //   };
  //   fetchTreeData();
  // }, []);

  // 获取树形数据
  useEffect(() => {
    const getData = async () => {
      setTreeLoading(true);

      setTimeout(() => {
        setTreeLoading(false);
      }, 5000);
      fetchDataSources().then((res) => {
        console.log('接口获取树形数据 =>', res);
        setTreeLoading(false);
        if (res.code === 0) {
          // 测试，记得注释
          // res.data[0] = {
          //   children: [],
          //   dbType: '1',
          //   id: '3000009',
          //   name: '修改12',
          //   pid: 0,
          // };

          setInitialTreeData(res.data);
        }
      });
    };

    getData();
  }, []);

  // 测试根据id，获取其下的表数据

  // useEffect(() => {
  //   const getTablesData = async () => {
  //     fetchTablesData('1').then((res) => {
  //       console.log('根据id获取其下表数据 =>', res);
  //     });
  //   };

  //   getTablesData();
  // }, []);

  //   将获取的初始树状数据，转为渲染数据
  useEffect(() => {
    if (initialTreeData != null && initialTreeData.length != null && !!initialTreeData.length) {
      console.log(initialTreeData);
      generateList(initialTreeData);

      const getRenderTreeData = (data) => {
        // debugger;
        if (data != null && data.length != null && !!data.length) {
          return data.map((item) => {
            item.title = `${item.name}`;
            // item.title = `${item.name}`;
            item.key = `${item.id}`;
            return {
              ...item,
              children: getRenderTreeData(item.children),
            };
          });
        } else {
          return null;
        }
      };

      let resData = getRenderTreeData(initialTreeData);

      console.log('resData =>', resData);

      console.log('平摊后的树状图数据 =>', dataList);
      setRenderTreeData(resData);

      // 初始派发一次选中第一项
      props.onSelect && resData[0].id && props.onSelect(resData[0].id);
      setSelectedKeys(resData[0].id);
    }
  }, [initialTreeData]);

  // 展开跟收起树状
  const onExpand = (expandedKeys) => {
    console.log(expandedKeys);
    setExpandedKeys(expandedKeys);
  };

  const onSelect = (selectedKeys, e) => {
    console.log('组件中的keys => ', selectedKeys);
    setSelectedKeys(selectedKeys);

    props.onSelect != null && props.onSelect(selectedKeys, e);
  };

  //   获取渲染图标
  const getIcon = (item) => {
    if (item.dbType != null) {
      if (item.dbType === '2') {
        return hive_icon;
      }
      if (item.dbType === '1') {
        return mysql_icon;
      }
    }

    // 判断禁用、启用状态，渲染相应图标
    if (item.status != null) {
      if (item.status !== 1) {
        // 禁用状态,展示 ban 图标
        if (item.ifExists != null && item.ifExists === 1) {
          // 展示 红色 ban
          return ban_icon;
        } else {
          // 展示 灰色 ban
          return ban_icon_unactive;
        }
      } else {
        // 启用状态,展示 table 图标
        if (item.ifExists != null && item.ifExists === 1) {
          // 展示 蓝色 table
          return table_icon;
        } else {
          // 展示 灰色 table
          return table_unactive_icon;
        }
      }
    }
    return table_icon;
  };

  // 删除项方法
  const deleteItem = (item) => {
    console.log('删除项 =>', item);

    // 弹出 确认弹框
    Modal.confirm({
      title: '删除',
      // content: `确定要删除${item.title}吗?`,
      content: (
        <>
          <div>
            <span>确认要删除</span>
            <div
              style={{
                fontSize: '16px',
                color: 'red',
                marginTop: '6px',
                marginBottom: '6px',
              }}
            >
              {item.title}
            </div>
            <span>吗？</span>
          </div>
        </>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: () => handleItemDelete(item),
    });
  };

  const handleItemDelete = (item) => {
    console.log('调用接口删除 item =>', item);
    deleteTreeItem({ id: item.id }).then((res) => {
      if (res.code === 0) {
        message.success('删除成功！');
        // 刷新列表
        refreshTree();
      } else {
        message.error('服务器繁忙，请稍后再试！');
      }
    });
  };

  // 循环变换搜索的到的数据值
  const loop = (data) =>
    data.map((item) => {
      //   debugger;
      const index = item.title.indexOf(searchValue); //从每一个搜索项返回索引的位置
      const beforeStr = item.title.substr(0, index); //开始截取的位置和截取的数量
      const afterStr = item.title.substr(index + searchValue.length); //开始截取的位置
      const title =
        index > -1 ? (
          <Typography.Text>
            <div
              style={{
                width: item.key === selectedKeys[0] ? '225px' : '270px',
                maxWidth: item.key === selectedKeys[0] ? '225px' : '270px',
                // width: '210px',
                // maxWidth: '210px',
                // width: '270px',
                // maxWidth: '270px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                // marginRight: item.key === selectedKeys[0] ? '45px' : '0px',
              }}
            >
              <span
                style={{
                  position: 'relative',
                  bottom: '2px',
                  marginRight: '3px',
                }}
              >
                {item != null && (
                  <>
                    <span>
                      <img src={getIcon(item)}></img>
                    </span>
                  </>
                )}
              </span>
              <span
                style={{
                  color:
                    item.ifExists != null && item.ifExists === 0 ? '#ccc' : 'rgb(24, 144, 255)',
                }}
              >
                {beforeStr}
                <span style={{ color: '#f50' }}>{searchValue}</span>
                {afterStr}
              </span>

              {/* 选中某项的时候展示的删除按钮 */}
              <span>
                {item.key === selectedKeys[0] && (
                  <>
                    <div
                      style={{
                        display: 'inline-block',
                        position: 'absolute',
                        color: '#B2B2B2',
                        backgroundColor: 'ddd',
                        width: '40px',
                        right: '-45px',
                        height: '20px',
                      }}
                      onClick={() => {
                        deleteItem(item);
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#f1f2f4',
                        }}
                      >
                        删除
                      </div>
                    </div>
                  </>
                )}
              </span>
            </div>
          </Typography.Text>
        ) : (
          <Typography.Text>
            <div
              style={{
                width: item.key === selectedKeys[0] ? '225px' : '270px',
                maxWidth: item.key === selectedKeys[0] ? '225px' : '270px',
                // width: '210px',
                // maxWidth: '210px',
                // width: '270px',
                // maxWidth: '270px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                position: 'relative',
                // marginRight: item.key === selectedKeys[0] ? '45px' : '0px',
              }}
            >
              <span
                style={{
                  position: 'relative',
                  bottom: '2px',
                  marginRight: '3px',
                }}
              >
                {item != null && (
                  <>
                    <span>
                      <img src={getIcon(item)}></img>
                    </span>
                  </>
                )}
              </span>
              <span
                style={{
                  color:
                    item.ifExists != null && item.ifExists === 0 ? '#ccc' : 'rgb(24, 144, 255)',
                }}
              >
                {item.title}
              </span>

              {/* 选中某项的时候展示的删除按钮 */}
              <span>
                {item.key === selectedKeys[0] && (
                  <>
                    <div
                      style={{
                        display: 'inline-block',
                        position: 'absolute',
                        color: '#B2B2B2',
                        backgroundColor: 'ddd',
                        width: '40px',
                        right: '-45px',
                        height: '20px',
                      }}
                      onClick={() => {
                        deleteItem(item);
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#f1f2f4',
                        }}
                      >
                        删除
                      </div>
                    </div>
                  </>
                )}
              </span>
            </div>
          </Typography.Text>
        );
      if (item.children) {
        return { title, key: item.key, children: loop(item.children) };
      }
      return {
        title,
        key: item.key,
      };
    });

  return (
    <div>
      {/* 搜索框 */}
      <div
        style={{
          padding: '16px 16px',
        }}
      >
        <Search
          placeholder="搜索数据源"
          allowClear
          onSearch={onInputSearch}
          style={{ width: '100%' }}
        />
      </div>

      {/* 树状图 */}
      {renderTreeData != null && (
        <div
          style={{
            backgroundColor: '#fff',
            // border: '1px solid red',
            height: 'calc(100vh - 226px)',
            // paddingLeft: '16px',
            // paddingRight: '16px',
            // overflow: 'scroll',
            marginLeft: '6px',
            marginRight: '6px',
          }}
        >
          <div className={styles.left_tree_wrapper}>
            <div
              style={{
                paddingLeft: '10px',
                paddingRight: '10px',
              }}
            >
              {treeLoading ? (
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Spin spinning={true}></Spin>
                </div>
              ) : (
                <Tree
                  // showLine={{ showLeafIcon: false }}
                  showLeafIcon={false}
                  treeData={loop(renderTreeData)}
                  onExpand={onExpand}
                  expandedKeys={expandedKeys}
                  onSelect={onSelect}
                  selectedKeys={selectedKeys}
                ></Tree>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default DataTree;
