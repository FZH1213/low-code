// 左侧数据列表组件（带搜索框）
// 需要入参 派发选中时间方法
import React, { useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';

import { Button, message, Modal, Form, Input, Spin, Popconfirm } from 'antd';

import { PlusCircleOutlined, CalendarOutlined } from '@ant-design/icons';

import { getDataList, add, deleteItem } from './service';

import styles from './styles.less';

const { Search } = Input;

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

  // 关闭新增弹框方法
  const closeAddModal = () => {
    setAddModalVisible(false);
  };

  // 向外界暴露刷新列表方法
  useImperativeHandle(ref, () => {
    return {
      refresh: (id) => {
        refreshList(id);
      },
    };
  });

  // 刷新列表
  const refreshList = (id) => {
    getDataList().then((res) => {
      // console.log('res =>', res);
      if (res.code === 0) {
        setListData(res.data);

        // 初始设置一次渲染数据
        setRenderListData(res.data);

        // 默认选中一次第一项，且派发选中事件
        if (res.data.length != null && !!res.data.length) {
          // 如果外面有id传入则选中传入的id
          if (!!id) {
            setSelectKey(id);
            res.data.map((ite) => {
              if (ite.id == id) {
                setSelectItem(ite);
              }
            });
          } else {
            setSelectKey(res.data[0].id);
            setSelectItem(res.data[0]);
          }
        }
      } else {
        message.error('服务器繁忙，请稍后再试！');
      }
    });
  };

  // 触发过滤，获取渲染列表数据
  useEffect(() => {
    if (
      searchValue != null &&
      searchValue.length != null &&
      !!searchValue.length &&
      listData != null
    ) {
      // 进行过滤，货量区渲染列表数据
      let resList = [];
      resList = listData.filter((item) => {
        return item.title ? item.title.indexOf(searchValue) >= 0 : false;
      });

      // console.log('搜索筛选得到的数据 =>', resList);

      setRenderListData(resList);
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
  useEffect(() => {
    getDataList().then((res) => {
      // console.log('res =>', res);
      if (res.code === 0) {
        setListData(res.data);

        // 初始设置一次渲染数据
        setRenderListData(res.data);

        // 默认选中一次第一项，且派发选中事件
        if (res.data.length != null && !!res.data.length) {
          setSelectKey(res.data[0].id);
          setSelectItem(res.data[0]);
        }
      } else {
        message.error('服务器繁忙，请稍后再试！');
      }
    });
  }, []);

  // 选中的key值改变的时候触发，向父组件派发id
  useEffect(() => {
    if (selectKey != null && selectKey.length != null && !!selectKey.length && selectItem != null) {
      // console.log('selectKey =>', selectKey);
      // console.log('selectItem =>', selectItem);
      props.getSelectKey && props.getSelectKey(selectKey);
      props.getSelectItem && props.getSelectItem(selectItem);
    }
  }, [selectKey, selectItem]);

  // 点击搜索触发
  const onInputSearch = (e) => {
    // console.log('e =>', e);

    setSearchValue(e);
  };

  // 新建业务提交
  const handleAddSubmit = () => {
    if (
      addFormRef != null &&
      addFormRef.current != null &&
      addFormRef.current.getFieldsValue != null
    ) {
      addFormRef.current.validateFields().then((formData) => {
        console.log('提交参数 =>', formData);

        add({ ...formData, paramsJson: '', ruleJson: '', contentJson: '' }).then((res) => {
          if (res.code === 0) {
            message.success('新增成功！');
            // 刷新列表
            refreshList();
            setAddModalVisible(false);
          } else {
            message.error('服务器繁忙，请稍后再试！');
          }
        });
      });
    }
  };

  // 删除业务
  const deleteBus = (item) => {
    console.log(item);

    deleteItem({ id: item.id }).then((res) => {
      if (res.code === 0) {
        message.success('删除成功！');
        // 刷新列表
        refreshList();
        setAddModalVisible(false);
      } else {
        message.error('服务器繁忙，请稍后再试！');
      }
    });
  };

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
            >
              <div
                style={{
                  padding: '1px 18px',
                  backgroundColor: item.id === selectKey ? '#E8F3FF' : '#fff',
                  cursor: 'pointer',
                  marginLeft: '16px',
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
                  setSelectKey(item.id);
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
              {item.id === selectKey && (
                <>
                  <Popconfirm
                    title={`确定要删除该业务吗?`}
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
                  padding: '1px 18px',
                  backgroundColor: item.id === selectKey ? '#E8F3FF' : '#fff',
                  cursor: 'pointer',
                  marginLeft: item.id === selectKey ? '70px' : '16px',
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
                  setSelectKey(item.id);
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
              {item.id === selectKey && (
                <>
                  <Popconfirm
                    title={`确定要删除该业务吗?`}
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
              )}
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
          业务树
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
            placeholder="请输入业务code"
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
            title="新建业务"
            onOk={() => {
              handleAddSubmit();
            }}
          >
            <Form ref={addFormRef}>
              <Form.Item
                name="code"
                rules={[{ required: true, message: '请输入业务code' }]}
                label={'业务code'}
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                name="name"
                rules={[{ required: true, message: '请输入业务名称' }]}
                label={'业务名称'}
              >
                <Input></Input>
              </Form.Item>
              {/* <Form.Item
                name="contentJson"
                rules={[{ required: false, message: '请输入业务内容定义' }]}
                label={
                  <span
                    style={{
                      marginLeft: '11px',
                    }}
                  >
                    内容定义
                  </span>
                }
              >
                <Input></Input>
              </Form.Item> */}
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
        <div className={styles.left_wrapper}>
          <div>
            {/* 修改name为code getSearchRenderItem(item.name, item) */}
            {renderListData.map((item) => {
              return (
                <>
                  {searchValue != null && searchValue.length != null && !!searchValue.length ? (
                    <>
                      <div>{getSearchRenderItem(`${item.code}（${item.name}）`, item)}</div>
                    </>
                  ) : (
                    <>
                      <div>{getSearchRenderItem(`${item.code}（${item.name}）`, item)}</div>
                    </>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default LeftDataList;
