// 左侧数据列表组件（带搜索框）
// 需要入参 派发选中时间方法
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  useCallback,
} from 'react';

import {
  Button,
  message,
  Modal,
  Form,
  Input,
  Spin,
  Popconfirm,
  Tree,
  Select,
  TreeSelect,
} from 'antd';

import { PlusCircleOutlined, CalendarOutlined, RestFilled } from '@ant-design/icons';

import { getDataList, addPage, EditPage, execByCode } from './service';
import { updateJson } from '../../service';
import styles from './styles.less';
import { includes } from 'lodash';

const { Search } = Input;
const { TreeNode } = Tree;
const { Option } = Select;
const LeftDataList = React.forwardRef((props, ref) => {
  const addFormRef = useRef(null);

  // 列表渲染数据（初始数据）
  const [listData, setListData] = useState(null);

  // 渲染数据，点击搜索的时候前台进行筛选，然后过滤得到这个渲染数据
  const [renderListData, setRenderListData] = useState([]);

  // 点击搜索的时候，更新这个输入的值，用来触发过滤
  const [searchValue, setSearchValue] = useState('');

  // 选中的项的标志值
  const [selectKey, setSelectKey] = useState(null);
  const [selectItem, setSelectItem] = useState(null);

  // 新增弹框显示标志位
  const [addModalVisible, setAddModalVisible] = useState(false);
  // const [select,setSelect] = useState([]);
  const [addConfirmLoading, setAddConfirmLoading] = useState(false);
  const [expressKeys, setExpressKeys] = useState([]);
  // const [pidOptions, setPidOptions] = useState([]);
  const [pidOptions1, setPidOptions1] = useState([]);
  const [optypeTree, setOptypeTree] = useState([]);
  // 关闭新增弹框方法
  const closeAddModal = () => {
    setAddModalVisible(false);
  };

  const TreeChange = useCallback((data) => {
    let arr = data.map((item) => {
      let value = item['value'];
      item.code = value;
      item['value'] = item['key'];
      item['title'] += `(${value})`;
      const childMap = (i) => {
        i.map((it) => {
          let value = it['value'];
          it.code = value;
          it['value'] = it['key'];
          if (it.children.length > 0) childMap(it.children);
        });
      };
      if (item.children.length > 0) {
        childMap(item.children);
        // 改为递归 ↑
        // item.children.map((ite) => {
        //   let value = ite['value'];
        //   ite.code = value;
        //   ite['value'] = ite['key'];
        //   if (ite.children.length > 0) {
        //     ite.children.map((it) => {
        //       let value = it['value'];
        //       it.code = value;
        //       it['value'] = it['key'];
        //       if (it.children.length > 0) {
        //         it.children.map((i) => {
        //           let value = i['value'];
        //           i.code = value;
        //           i['value'] = i['key'];
        //         });
        //       }
        //     });
        //   }
        // });
      }
      return item;
    });
    return new Promise((resolve) => {
      resolve(arr);
    });
  }, []);

  // 向外界暴露刷新列表方法
  useImperativeHandle(ref, () => {
    return {
      refresh: (data) => {
        refreshList(data);
      },
      // splitLastDataOne: () => {
      //   splitLastData();
      // },
    };
  });

  // 截取列表的最新一项数据
  const splitLastData = (data, value) => {
    // id 复制数据的id，name 复制数据的name，code 复制数据中的code；
    // 而配置数据则用被复制的数据中的 paramsJson ruleJson 从而达到复制的数据的配置与被复制的相同
    updateJson({
      id: data[0].id,
      pid: data[0].pid,
      // paramsJson: value.paramsJson,
      // ruleJson: value.ruleJson,
      code: data[0].code,
      // contentJson: '',
      name: data[0].name,
      pageUrl: `/page-preview/${data[0].code}`,
    }).then((res) => {
      console.log(res);
      if (res.code === 0) {
        // message.success('保存成功');
        console.log('保存成功');
        // 把复制标志置成 false
        if (props.setCopyDataFlag) {
          props.setCopyDataFlag(false);
        }
      } else {
        message.error('服务器繁忙，请稍后再试！');
      }
    });
  };
  // 刷新列表
  // key值赋值回调

  const refreshList = (value) => {
    // getDataList().then((res) => {
    //   if (res.code === 0) {
    //     setListData(res.data);

    //     // 初始设置一次渲染数据
    //     setRenderListData(res.data);
    //     // 如果是复制的功能，则在新增成功重新刷新时获取最新一条数据即复制的那条数据
    //     // props.setCopyDataFlag 为true 则是复制功能刷新
    //     // if (props.setCopyFlag == true) {
    //     //   splitLastData(res.data.slice(-1), value);
    //     // }
    //     // 默认选中一次第一项，且派发选中事件
    //     if (res.data.length != null && !!res.data.length) {
    //       //   // if (selectKey != null && selectItem != null) {
    //       //   //   setSelectItem(selectItem);
    //       //   //   setSelectKey(selectKey);
    //       //   //   props.getSelectKey && props.getSelectKey(selectKey);
    //       //   //   props.getSelectItem && props.getSelectItem(selectItem);
    //       //   // } else {
    //       setSelectKey(res.data[0].key);
    //       setSelectItem(res.data[0]);
    //       setExpressKeys([res.data[0].key])
    //       // setExpressKeys(res.data[0].id)
    //       // }
    //     }
    //   } else {
    //     message.error('服务器繁忙，请稍后再试！');
    //   }
    // });
    getAPiGroup();
  };
  // 获取选择的类型选项列表
  useEffect(() => {
    const getOptypeTree = async () => {
      const res = await execByCode(JSON.stringify({}), 'biz.system.api.optype.select');
      // console.log("rewerwjdofhsdfhsdlfshdlfslidfjdlslkjsljkdsfsd",res)
      if (res.response.code == 0) {
        setOptypeTree(res.response.data);
        props.getOptypeTree(res.response.data);
      } else {
        message.error('获取类型选项失败');
      }
    };
    getOptypeTree();
  }, []);
  // 触发过滤，获取渲染列表数据
  useEffect(() => {
    // if (
    //   searchValue != null &&
    //   searchValue.length != null &&
    //   !!searchValue.length &&
    //   listData != null
    // ) {
    //   // 进行过滤，货量区渲染列表数据
    //   let resList = [];
    //   resList = listData.filter((item) => {
    //     return item.name && item.code
    //       ? `${item.code}（${item.name}）`.indexOf(searchValue) >= 0
    //       : false;
    //   });

    //   // console.log('搜索筛选得到的数据 =>', resList);

    //   setRenderListData(resList);
    // }
    // 搜索
    if (
      searchValue != null &&
      searchValue.length != null &&
      !!searchValue.length &&
      listData != null
    ) {
      let key = [...expressKeys];
      let onRecursionData = (arr, val) => {
        let newarr = [];
        arr.forEach((item) => {
          if (item.children && item.children.length) {
            let children = onRecursionData(item.children, val);
            let obj = {
              ...item,
              children,
            };
            if (children && children.length) {
              //  key值增加
              newarr.push(obj);
              key.push(obj.key);
            } else if (item.title.includes(val) || item.value.includes(val)) {
              newarr.push(obj);
            }
          } else {
            if (item.title.includes(val) || item.value.includes(val)) {
              newarr.push(item);
            }
          }
        });
        return newarr;
      };
      setExpressKeys(key);
      let result = onRecursionData(listData, searchValue);
      setRenderListData(result);
    }
    // 而如果是空值搜索，那么就还原数据
    if (
      searchValue != null &&
      searchValue.length != null &&
      !!!searchValue.length &&
      listData != null
    ) {
      setRenderListData(listData);
    }
  }, [searchValue, listData]);

  useEffect(() => {
    console.log('renderListData =>', renderListData);
  }, [renderListData]);

  // 初始获取列表数
  // useEffect(() => {
  //   getDataList().then((res) => {
  //     // console.log('res =>', res);
  //     if (res.code === 0) {
  //       setListData(res.data);
  //       // 初始设置一次渲染数据
  //       setRenderListData(res.data);

  //       // 默认选中一次第一项，且派发选中事件
  //       if (res.data.length != null && !!res.data.length) {
  //         setSelectKey(res.data[0].key);
  //         setSelectItem(res.data[0])

  //       }

  //       if (res.data.length != null && !!res.data.length) {
  //         TreeChange(JSON.parse(JSON.stringify(res.data))).then((arr) => {
  //           setPidOptions1(arr);
  //           props.getAPiSelect1(arr);
  //           props.getTreeData && props.getTreeData(arr);
  //         })
  //       }

  //     } else {
  //       message.error('服务器繁忙，请稍后再试！');
  //     }
  //   });
  // }, []);

  // 选中的key值改变的时候触发，向父组件派发id
  useEffect(() => {
    console.log('selectKey =>', selectKey);
    console.log('selectItem =>', selectItem);
    if (selectKey != null && selectKey.length != null && !!selectKey.length && selectItem != null) {
      props.getSelectKey && props.getSelectKey(selectKey);
      props.getSelectItem && props.getSelectItem(selectItem);
    }
  }, [selectKey, selectItem]);

  // 点击搜索触发
  const onInputSearch = (e) => {
    setSearchValue(e);
  };

  // 下拉框数据
  const getAPiGroup = async () => {
    getDataList().then((res) => {
      // console.log('res =>', res);
      if (res.code === 0) {
        setListData(res.data);
        // 初始设置一次渲染数据
        setRenderListData(res.data);

        // 默认选中一次第一项，且派发选中事件
        if (res.data.length != null && !!res.data.length) {
          setSelectKey(res.data[0].key);
          setSelectItem(res.data[0]);
          setExpressKeys([res.data[0].key]);
        }

        if (res.data.length != null && !!res.data.length) {
          TreeChange(JSON.parse(JSON.stringify(res.data))).then((arr) => {
            setPidOptions1(arr);
            props.getAPiSelect1(arr);
            props.getTreeData && props.getTreeData(arr);
          });
        }
      } else {
        message.error('服务器繁忙，请稍后再试！');
      }
    });
  };

  useEffect(() => {
    getAPiGroup();
  }, []);
  const [value, setValue] = useState(undefined);
  const onChange = (newValue) => {
    console.log('newValue', newValue);
    setValue(newValue);
  };
  // 新建业务提交
  const handleAddSubmit = () => {
    if (
      addFormRef != null &&
      addFormRef.current != null &&
      addFormRef.current.getFieldsValue != null
    ) {
      addFormRef.current.validateFields().then((formData) => {
        setAddConfirmLoading(true);
        console.log('提交参数 =>', formData?.pid);
        let obj = {};

        if (formData.pid) {
          obj = {
            ...formData,
            pageUrl: `/page-preview/${formData.code}`,
          };
          addPage({
            ...obj,
          }).then((res) => {
            if (res.code === 0) {
              message.success('新增成功！');
              // 刷新列表
              refreshList();
              setAddConfirmLoading(false);
              setAddModalVisible(false);
            } else {
              message.error('无效请求');
              setAddConfirmLoading(false);
            }
          });
        } else {
          obj = {
            ...formData,
            pageUrl: `/page-preview/${formData.code}`,
            pid: '0',
          };
          addPage({
            ...obj,
          }).then((res) => {
            if (res.code === 0) {
              message.success('新增成功！');
              // 刷新列表
              refreshList();
              setAddConfirmLoading(false);
              setAddModalVisible(false);
            } else {
              message.error('无效请求');
              setAddConfirmLoading(false);
            }
          });
        }
      });
    }
  };

  // 删除业务
  // const deleteBus = (item) => {
  //   deleteItem({ id: item.id }).then((res) => {
  //     if (res.code === 0) {
  //       message.success('删除成功！');
  //       // 刷新列表
  //       refreshList();
  //       setAddModalVisible(false);
  //       getAPiGroup();
  //     } else {
  //       message.error('服务器繁忙，请稍后再试！');
  //     }
  //   });
  // };

  const getSearchRenderItem = (title, item) => {
    const index = title.indexOf(searchValue);
    const beforeStr = title.substr(0, index);
    const afterStr = title.substr(index + searchValue.length);

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
                  marginRight: item.id === selectKey ? '70px' : '16px',
                  marginTop: '3px',
                  marginBottom: '3px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  // position: 'relative',
                }}
                onClick={() => {
                  setSelectKey(item.key);
                  setSelectItem(item);
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
              {/* 删除按钮 */}
              {/* {item.key === selectKey  && (

                <>
                  <Popconfirm
                    title={`确定要删除该接口吗?`}
                    okText="确认"
                    cancelText="关闭"
                    onConfirm={() => {
                      deleteBus(item);
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        right: '20px',
                        bottom: '0px',
                        zIndex: 50,
                        display: 'inline-block',
                        padding: '1px 8px',
                        backgroundColor: '#F6F6F6',
                        color: '#B2B2B2',
                        cursor: 'pointer',
                      }}
                    // onClick={() => {
                    //   deleteBus(item);
                    // }}
                    >
                      删除
                    </div>
                  </Popconfirm>
                </>
              )} */}
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
                  // marginLeft: item.id === selectKey ? '70px' : '16px',
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
                  setSelectKey(item.key);
                  setSelectItem(item);
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
              {/* {item.id === selectKey && (
                <>
                  <Popconfirm
                    title={`确定要删除该接口吗?`}
                    okText="确认"
                    cancelText="关闭"
                    onConfirm={() => {
                      deleteBus(item);
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        right: '20px',
                        bottom: '0px',
                        zIndex: 50,
                        display: 'inline-block',
                        padding: '1px 8px',
                        // backgroundColor: '#F6F6F6',
                        color: '#B2B2B2',
                        cursor: 'pointer',
                      }}
                    // onClick={() => {
                    //   deleteBus(item);
                    // }}
                    >
                      删除
                    </div>
                  </Popconfirm>
                </>
              )} */}
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div>
      {/* 头部标题，包含右侧添加数据按钮 */}
      <div
        style={{
          height: '48px',
          lineHeight: '48px',
          fontSize: '16px',
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
          页面管理
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
              //   setAddDataSourceModalVisible(true);
              // console.log('打开业务新建弹框');
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
              // console.log('打开规则添加弹框2');
              //   setVisible(true);

              setAddModalVisible(true);
            }}
          >
            新增页面
          </span>
        </div>
      </div>
      {/* 搜索栏 */}
      <div>
        <div
          style={{
            padding: '16px 16px 12px 16px',
          }}
        >
          <Search
            placeholder="请输入接口编码"
            allowClear
            onSearch={onInputSearch}
            style={{ width: '100%' }}
          ></Search>
        </div>
      </div>
      {/* 新增规则弹框 */}
      <>
        {addModalVisible && (
          <Modal
            visible={addModalVisible}
            onCancel={closeAddModal}
            title="新增页面"
            confirmLoading={addConfirmLoading}
            onOk={() => {
              handleAddSubmit();
            }}
            maskTransitionName=""
            maskClosable={false} //点击蒙层是否允许关闭
          >
            <Form ref={addFormRef}>
              <Form.Item
                name="pid"
                // rules={[{ required: true, message: '请输入业务code' }]}
                label={'归属父类'}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                {console.log('TreeSelect-pidOptions1', pidOptions1)}
                <TreeSelect
                  value={value}
                  showSearch
                  treeData={pidOptions1}
                  onChange={onChange}
                  allowClear
                  treeNodeFilterProp="title"
                  treeLine
                ></TreeSelect>
              </Form.Item>
              <Form.Item
                name="code"
                rules={[{ required: true, message: '请输入页面code' }]}
                label={'页面code'}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                name="name"
                rules={[{ required: true, message: '请输入标题' }]}
                label={'标题'}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Input></Input>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </>

      {/* 下方列表 */}
      <div
        style={{
          height: 'calc(100vh - 220px)',
          overflow: 'hidden',
        }}
      >
        {/* 20220218 修改列表显示为名称 getSearchRenderItem(item.code, item)*/}
        <div className={styles.left_wrapper} style={{ overflow: 'auto' }}>
          <Tree
            onLoad={() => {
              console.log('加载完成');
            }}
            onExpand={(newExpandedKeys) => {
              setExpressKeys(newExpandedKeys);
            }}
            expandedKeys={expressKeys}
            treeData={renderListData}
            titleRender={(node) => {
              return (
                <>
                  {searchValue != null && searchValue.length != null && !!searchValue.length ? (
                    <>
                      {node.children.length != 0 && (
                        <div>{getSearchRenderItem(node.title, node)}</div>
                      )}
                      {node.children.length == 0 && (
                        <div>{getSearchRenderItem(`${node.title}（${node.value}）`, node)}</div>
                      )}
                    </>
                  ) : (
                    <>
                      {node.children.length != 0 && (
                        <div>{getSearchRenderItem(node.title, node)}</div>
                      )}
                      {node.children.length == 0 && (
                        <div>{getSearchRenderItem(`${node.title}（${node.value}）`, node)}</div>
                      )}
                    </>
                  )}
                </>
              );
            }}
          ></Tree>
        </div>
      </div>
    </div>
  );
});

export default LeftDataList;
