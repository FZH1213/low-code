// 左侧规则列表组件
import React, { useEffect, useMemo, useRef, useState, useImperativeHandle, useCallback } from 'react';
import { Button, Input, message, Radio, Modal, Form, Popconfirm, Tree, TreeSelect } from 'antd';

import { PlusCircleOutlined, CalendarOutlined } from '@ant-design/icons';

const { Search } = Input;

import {
  // 获取规则列表数据
  fetchRulesData,
  //   新增规则接口
  addRule,
} from './service';
import { reject } from 'lodash';

const RulesList = React.forwardRef((props, ref) => {
  // const toTree = useCallback((data) => {
  //   let obj = {}, // 使用对象重新存储数据
  //     res = [], // 存储最后结果
  //     len = data.length

  //   // 遍历原始数据data，构造obj数据，键名为id，值为数据
  //   for (let i = 0; i < len; i++) {
  //     data[i]["ruleDefId"] = data[i]["value"]
  //     data[i]["name"] = data[i]["title"]
  //     obj[data[i]['id']] = data[i]
  //   }

  //   // 遍历原始数据
  //   for (let j = 0; j < len; j++) {
  //     let list = data[j]
  //     data[j]['title'] = `${data[j]['title']}(${data[j]['ruleDefId']})`
  //     data[j]['value'] = data[j]['id']
  //     // 通过每条数据的 pid 去obj中查询
  //     let parentList = obj[list['pid']]

  //     if (parentList) {
  //       // 根据 pid 找到的是父节点，list是子节点，
  //       if (!parentList['children']) {
  //         parentList['children'] = []
  //       }
  //       // 将子节点插入 父节点的 children 字段中
  //       parentList['children'].push(list)
  //     } else {
  //       // pid 找不到对应值，说明是根结点，直接插到根数组中
  //       res.push(list)
  //     }
  //   }
  //   return new Promise((reslove, reject) => {
  //     reslove(res)
  //   })
  // }, [])
  useImperativeHandle(ref, () => {
    return {
      refresh: (selectKey) => {
        fetchRulesData().then((res) => {
          console.log('res =>', res);
          if (res.code === 0) {
            if (res.data.length != null && !!res.data.length) {
              TreeChange(JSON.parse(JSON.stringify(res.data))).then((arr) => {
                setSelectData(arr)
                props.getTreeData && props.getTreeData(arr);
              })
            }
    
            setInitData(res.data)
            setRenderData(res.data);


            // 一开始的时候，渲染数据和全数据一样

            // 第一次的时候默认选中第一项，并派发选中事件
            if (res.data.length != null && !!res.data.length) {
              // 如果有指定选中的key值，那么就回填选择
              if (selectKey != null && selectKey.length != null && !!selectKey.length) {
                // 如果数据中存在 指定 key 值，且存在key值对应的数据
                let flag = false;

                let setKey = null;

                let setData = null;
               
                res.data.forEach((item) => {
                  if (item.id === selectKey) {
                    flag = true;
                    setKey = item.id;
                    setData = item;
                  }
                  if(item.children) {
                    item.children.forEach(item => {
                      if (item.key === selectKey) {
                        flag = true;
                        setKey = item.key;
                        setData = item;
                      }
                    })
                  }
                });
                
                if (flag === true && setKey != null && setData != null) {
                  setSelectValue(setKey);
                  props.getSelectKey && props.getSelectKey(setKey, setData);
                } else {
                  setSelectValue(res.data[0].id);

                  props.getSelectKey && props.getSelectKey(res.data[0].id, res.data[0]);
                }
              } else {
                setSelectValue(res.data[0].id);

                props.getSelectKey && props.getSelectKey(res.data[0].id, res.data[0]);
              }
            }
          } else {
            message.error('服务器繁忙，请稍后再试！');
          }
        });
      },
    };
  });

  const formRef = useRef(null);

  const [searchValue, setSearchValue] = useState('');

  //   完整版的列表数据
  const [initData, setInitData] = useState(null);


  //   通过筛选后的渲染列表数据
  const [renderData, setRenderData] = useState(null);

  const [selectValue, setSelectValue] = useState(null);

  const [visible, setVisible] = useState(false);
  const [expressKeys, setExpressKeys] = useState([])
  const [selectData, setSelectData] = useState([]);

  const TreeChange = useCallback((data) => {
    let arr = data.map((item) => {
      let value = item["value"];
      item.code = value;
      item["value"] = item["key"];
      item["title"] += `(${value})`;
      if (item.children.length > 0) {
        item.children.map(item => {
          let value = item["value"];
          item.code = value;
          item["value"] = item["key"];
        })

      }
      return item
    }

    )
    return new Promise((resolve) => {
      resolve(arr)
    })
  }, [])

  // 当前选中key
  // const [key, setKey] = useState(null)

  // 筛选
  // useEffect(() => {
  //   if (searchValue != null) {
  //     let res = [];
  //     initData != null &&
  //       initData.length != null &&
  //       initData.forEach((item) => {
  //         console.log(item);

  //         // {item.ruleDefId}（{item.name}）
  //         if (`${item.ruleDefId}（${item.name}）`.indexOf(searchValue) >= 0) {
  //           res.push(item);
  //         }
  //       });

  //     setRenderData(res);
  //   }
  // }, [searchValue]);
  // 2022-7-28 搜索筛选
  useEffect(() => {
    if (
      searchValue != null &&
      searchValue.length != null &&
      !!searchValue.length &&
      initData != null
    ) {
      let key = [...expressKeys];
      let onRecursionData = (arr, val) => {
        let newarr = [];
        arr.forEach(item => {
          if (item.children && item.children.length) {
            let children = onRecursionData(item.children, val)
            let obj = {
              ...item,
              children
            }
            if (children && children.length) {
              //  key值增加
              newarr.push(obj)
              key.push(obj.key);
            } else if (item.value.includes(val) || item.title.includes(val)) {
              newarr.push(obj)
            }
   
          } else {

            if (item.value.includes(val) || item.title.includes(val)) {
              newarr.push(item)
      
            }
          }
        })

        return newarr
      }
      setExpressKeys(key);
      let res = onRecursionData(initData, searchValue)
      setRenderData(res);
    }
    if (
      searchValue != null &&
      searchValue.length != null &&
      !!!searchValue.length &&
      initData != null
    ) {

      setRenderData(initData);
    }
  }, [searchValue]);
  // 2022-7-28 搜索筛选---end
  const closeModal = () => {
    setVisible(false);
  };

  useEffect(() => {
    // 2022-7-28 初始渲染赋值
    fetchRulesData().then((res) => {
      console.log('res =>', res);
      if (res.code === 0) {
        // console.log(TreeChange(res.data))
        if (res.data.length != null && !!res.data.length) {
          TreeChange(JSON.parse(JSON.stringify(res.data))).then((arr) => {
            setSelectData(arr)
            props.getTreeData && props.getTreeData(arr);
          })
        }

        setInitData(res.data)
        setRenderData(res.data);

        // 第一次的时候默认选中第一项，并派发选中事件
        if (res.data.length != null && !!res.data.length) {
          setSelectValue(res.data[0].id);
          props.getSelectKey && props.getSelectKey(res.data[0].id, res.data[0]);
        }
      } else {
        message.error('服务器繁忙，请稍后再试！');
      }
    });
  }, []);
  // 2022-7-28 树形列表遍历数据方法
  const getSearchRenderItem = (title, item) => {
    const index = title.indexOf(searchValue);
    const beforeStr = title.substr(0, index);
    const afterStr = title.substr(index + searchValue.length);
    //  console.log(index)
    return (
      <>
        {index > -1 ? (
          <>
            <div
              style={{
                position: 'relative',
              }}
              key={item.key}

            >
              <div
                style={{
                  // padding: '1px 18px',
                  // backgroundColor: item.id === selectKey ? '#E8F3FF' : '',
                  cursor: 'pointer',
                  // marginLeft: '16px',
                  marginRight: '16px',
                  marginTop: '3px',
                  marginBottom: '3px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  // position: 'relative',
                }}
                onClick={() => {
                  console.log(item)
                  selectChange(item);
                }}

              >
                {/* 图标 */}
                <span
                  style={{
                    color: 'rgb(24, 144, 255)',
                    marginRight: '3px',
                  }}
                >
                  <CalendarOutlined />
                </span>
                <span
                  style={{
                    color: 'rgb(24, 144, 255)',
                  }}
                >
                  {beforeStr}
                  <span style={{ color: '#f50' }}>{searchValue}</span>
                  {afterStr}
                </span>
              </div>
              {item.key === selectValue && (
                <div
                  style={{
                    borderRadius: '3px',
                    paddingLeft: '6px',
                    paddingRight: '6px',
                    // back,
                    width: '60px',
                    position: 'absolute',
                    right: '14px',
                    top: '0px',
                    backgroundColor: '#f1f2f4',
                    textAlign: 'center',
                    color: '#999',
                  }}
                >
                  <>
                    {/* <Popconfirm
                      title={`确定要删除该接口吗?`}
                      okText="确认"
                      cancelText="关闭"
                      onConfirm={() => {
                        // deleteBus(item);

                        props.deleteItem && props.deleteItem(item);
                      }}
                    >
                      删除
                    </Popconfirm> */}
                  </>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                position: 'relative',
              }}

            >
              <div
                style={{
                  // padding: '1px 18px',
                  // backgroundColor: item.id === selectKey ? '#E8F3FF' : '',
                  cursor: 'pointer',
                  marginRight:  '16px',
                  // marginRight: '16px',
                  marginTop: '3px',
                  marginBottom: '3px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  // position: 'relative',
                }}
                key={item.key}
                onClick={() => {
                  selectChange(item);
                }}
              >
                {/* 图标 */}
                <span
                  style={{
                    color: 'rgb(24, 144, 255)',
                    marginRight: '3px',
                  }}
                >
                  <CalendarOutlined />
                </span>
                <span
                  style={{
                    color: 'rgb(24, 144, 255)',
                  }}
                >
                  {title}
                </span>
              </div>
              {/* 删除按钮 */}
              {/* {item.key === selectValue && (
                <div
                  style={{
                    borderRadius: '3px',
                    paddingLeft: '6px',
                    paddingRight: '6px',
                    // back,
                    width: '60px',
                    position: 'absolute',
                    right: '14px',
                    top: '0px',
                    backgroundColor: '#f1f2f4',
                    textAlign: 'center',
                    color: '#999',
                  }}
                >
                  <>
                    <Popconfirm
                      title={`确定要删除该接口吗?`}
                      okText="确认"
                      cancelText="关闭"
                      onConfirm={() => {
                        // deleteBus(item);

                        props.deleteItem && props.deleteItem(item);
                      }}
                    >
                      删除
                    </Popconfirm>
                  </>
                </div>
              )} */}
            </div>
          </>
        )}
      </>
    );
  }
  // 2022-7-28 树形列表遍历数据方法---end
  // 2022-7-28 树形列表添加
  const [value, setValue] = useState(undefined);
  const onChange = (newValue) => {

    setValue(newValue);
  };
  // 2022-7-28 树形列表添加---end

  const onInputSearch = (e) => {
    console.log('e =>', e);
    setSearchValue(e);
  };
  const selectChange = (item) => {
    
    setSelectValue(item.key);
    
    props.getSelectKey && props.getSelectKey(item.key, item);
  };

  //   刷新列表
  const refreshList = () => {
    fetchRulesData().then((res) => {
      console.log('res =>', res);
      if (res.code === 0) {
        if (res.data.length != null && !!res.data.length) {
          TreeChange(JSON.parse(JSON.stringify(res.data))).then((arr) => {
            setSelectData(arr)
            props.getTreeData && props.getTreeData(arr);
          })
        }

        setInitData(res.data)
        setRenderData(res.data);


        // 第一次的时候默认选中第一项，并派发选中事件
        if (res.data.length != null && !!res.data.length) {
          setSelectValue(res.data[0].id);

          props.getSelectKey && props.getSelectKey(res.data[0].id, res.data[0]);

        }
      } else {
        message.error('服务器繁忙，请稍后再试！');
      }
    });
  };
  // console.log(RenderData);
  return (
    <div>
      {/* 新增弹框 */}
      <>
        {visible && (
          <Modal
            visible={visible}
            onCancel={() => {
              closeModal();
            }}
            width={'520px'}
            title={'新增能力'}
            onOk={() => {
              formRef.current.validateFields().then((value) => {
                if (!value.pid) {

                  value.pid = "0"
                }

                let params = Object.assign({}, value, { ruleNodeJson: '[]', paramsJson: '[]' });
                // 提交接口
                // addRule
                const addApi = async () => {
                  addRule(params).then((res) => {
                    if (res.code === 0) {
                      message.success('新增成功！');
                      refreshList();
                      // 关闭弹框，刷新列表
                      closeModal();
                    } else {
                      message.error('服务器繁忙，请稍后再试！');
                    }
                  });
                };

                addApi();
              });
            }}
            maskClosable={false}  //点击蒙层是否允许关闭
          >
            {/* 名称 描述 标识 */}

            {selectData && selectData.length != null && (<Form ref={formRef}>
              <Form.Item
                name="pid"
                // rules={[{ required: true, message: '请输入业务code' }]}
                label={'归属父类'}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <TreeSelect value={value} showSearch treeData={selectData} onChange={onChange} allowClear
                  treeNodeFilterProp="title"
                ></TreeSelect>
              </Form.Item>
              <Form.Item
                name="name"
                label={'能力名称'}
                rules={[{ required: true, message: '请输入能力名称' }]}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                name="description"
                // label={<span style={{ marginLeft: '11px' }}>能力描述</span>}
                label={'能力描述'}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
              >
                <Input.TextArea></Input.TextArea>
              </Form.Item>
              <Form.Item
                name="ruleDefId"
                label={'能力标识'}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                rules={[{ required: true, message: '请输入能力标识' }]}
              >
                <Input></Input>
              </Form.Item>
            </Form>)}
          </Modal>
        )}
      </>
      {/* 头部标题 */}
      <div
        style={{
          height: '48px',
          lineHeight: '48px',
          fontSize: '18px',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f1f2f4',
        }}
      >
        <div
          style={{
            paddingLeft: '16px',
          }}
        >
          能力管理
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
              // console.log('打开规则添加弹框1');
              setVisible(true);
            }}
          >
            添加能力
          </span>
        </div>
      </div>
      {/* 下方内容 */}
      <div>
        {/* 搜索框 */}
        <div
          style={{
            padding: '16px 16px 12px 16px',
          }}
        >
          <Search
            placeholder="请输入能力关键词"
            allowClear
            onSearch={onInputSearch}
            style={{ width: '100%' }}
          ></Search>
        </div>
        {/* 规则列表 */}
        <div>
          {/* {renderData != null && renderData.length != null && !!renderData.length && (
            <>
              <Radio.Group onChange={selectChange} value={selectValue}>
                {renderData.map((item, index) => {
                  return (
                    <div
                      style={{
                        padding: '6px 16px',
                        color: 'rgb(24, 144, 255)',
                      }}
                    >
                      <Radio value={item.id}>
                        <span
                          style={{
                            color: `${item.id}` === `${selectValue}` ? 'rgb(24, 144, 255)' : '#333',
                          }}
                        >
                          {item.ruleDefId}（{item.name}）
                        </span>
                      </Radio>
                    </div>
                  );
                })}
              </Radio.Group>
            </>
          )} */}

          {initData != null && renderData != null && renderData.length != null && !!renderData.length && (
            <>
              {/* 2022-7-28修改成树形结构 */}
              <div style={{ overflow: "auto", width: "350px" }} >
                <Tree

                  onExpand={(newExpandedKeys) => {
                    setExpressKeys(newExpandedKeys);
                  }}
                  expandedKeys={expressKeys} treeData={renderData} titleRender={(node) => {

                    return (
                      <>
                        {searchValue != null && searchValue.length != null && !!searchValue.length ? (
                          <>

                            <div>{getSearchRenderItem(`${node.value}（${node.title}）`, node)}</div>
                          </>
                        ) : (
                          <>

                            <div>{getSearchRenderItem(`${node.value}（${node.title}）`, node)}</div>

                          </>
                        )}
                      </>
                    );

                  }}>

                </Tree>


              </div>
              {/* 2022-7-28修改成树形结构---end */}

              {/* 未做树形结构渲染列表 */}
              {/* {renderData.map((item, index) => {
                return (
                  <div
                    style={{
                      height: '24px',
                      lineHeight: '24px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      marginTop: '4px',
                      marginBlock: '4px',
                      position: 'relative',
                      color: 'rgb(24, 144, 255)',
                      // marginRight: item.id === selectValue ? '60px' : '0px',
                      // pointerEvents: ''
                    }}
                  >
                    <div
                      style={{
                        backgroundColor:
                          item.id === selectValue ? 'rgb(232, 243, 255)' : 'transparent',
                        borderRadius: '3px',
                        paddingLeft: '12px',
                        paddingRight: '12px',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        width: item.id === selectValue ? '300px' : '366px',
                      }}
                      onClick={() => {
                        selectChange({ target: { value: item.id } });
                      }}
                    >
                      <span>
                        {item.ruleDefId}（{item.name}）
                      </span>
                    </div>

                    {item.id === selectValue && (
                      <div
                        style={{
                          borderRadius: '3px',
                          paddingLeft: '6px',
                          paddingRight: '6px',
                          // back,
                          width: '60px',
                          position: 'absolute',
                          right: '14px',
                          top: '0px',
                          backgroundColor: '#f1f2f4',
                          textAlign: 'center',
                          color: '#999',
                        }}
                      >
                        <>
                          <Popconfirm
                            title={`确定要删除该接口吗?`}
                            okText="确认"
                            cancelText="关闭"
                            onConfirm={() => {
                              // deleteBus(item);

                              props.deleteItem && props.deleteItem(item);
                            }}
                          >
                            删除
                          </Popconfirm>
                        </>
                      </div>
                    )}
                  </div>
                );
              })} */}
              {/* 未做树形结构渲染列表end */}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default RulesList;
