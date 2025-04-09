// 业务管理页面
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, message, Modal, Form, Input, Spin, Select, TreeSelect } from 'antd';

import { EditOutlined } from '@ant-design/icons';

// 导入 左侧数据列表组件
import LeftDataList from './components/LeftDataList';

import MainTable from './components/MainTable';

import ConfPage from './components/ConfPage';

import { updateJson, deleteItem } from './service';
import { add, getDataList, } from './components/LeftDataList/service';
import { getTableData } from './components/MainTable/service';
const { Option } = Select;
const BusinessManage = (props) => {
  const editFormRef = useRef(null);
  const copyFormRef = useRef(null);
  const leftRef = useRef(null);

  const [selectKey, setSelectKey] = useState(null);

  const [selectItem, setSelectItem] = useState(null);
  // const [selectGroup, setSelectGroup] = useState(null);
  const [selectGroup1, setSelectGroup1] = useState(null);
  // 执行配置页面初始数据
  const [initData, setInitData] = useState(null);

  // 执行配置页面显示标志位
  const [visible, setVisible] = useState(false);

  // 编辑弹框显示标志位
  const [editModalVisible, setEditModalVisible] = useState(false);

  // 复制弹窗标志
  const [openVisible, setOpenCopyVisible] = useState(false);

  // 复制配置页面初始化数据
  const [copyInitData, setCopyInitData] = useState(null);

  // 复制成功后的那条数据
  const [copyDataflag, setCopyDataFlag] = useState(false);

  // 删除按钮显示key数组
  const [showDelete, setShowDelete] = useState([])
  const [deleteChange, setDeleteChange] = useState(true)
  // 关闭编辑弹框
  const closeEditModal = () => {
    setEditModalVisible(false);
  };
  const [editConfirmLoading, setEditConfirmLoading] = useState(false);

  // 设置类型选项列表
  const [optypeTree, setOptypeTree] = useState([])

  const tableRef = useRef();

  // useEffect(() => {
  //   if (leftRef != null && leftRef.current != null && leftRef.current.splitLastDataOne != null) {
  //     leftRef.current.splitLastDataOne();
  //     console.log(copyData, '222222');
  //   }
  // }, [leftRef]);
  // useEffect(() => {
  //   if (initData != null) {
  //     setVisible(true);
  //   }
  // }, [initData]);

  const onClose = () => {
    setVisible(false);
    setInitData(null);
  };

  const getSelectKey = (key) => {
    console.log('父组件获取选中key ', key);
    setSelectKey(key);
  };

  const getSelectItem = (item) => {
    console.log('父组件获取选中item ', item);
    setSelectItem(item);

  };
  // const getAPiSelect = (item) => {
  //   console.log("父组件获取列表", item)
  //   setSelectGroup(item);
  // }
  const getAPiSelect1 = (item) => {
    console.log("父组件获取列表", item)
    setSelectGroup1(item);
  }
  const getOptypeTree = (item) => {
    setOptypeTree(item)
  }
  // 打开执行配置页面方法
  const openConfPage = (initData) => {
    console.log('initdata', initData);
    setInitData(initData);
    setVisible(true);
  };

  // 打开复制弹窗
  const openCopyPage = (row) => {
    setOpenCopyVisible(true);
    setEditModalVisible(true);
    console.log(row, 'rrrooowww');
    setCopyInitData(row);
  };
  // 打开删除内容
  const openDeletePage = (row) => {
    deleteItem({ id: row.id }).then(res => {
      if (res.code === 0) {
        message.success('操作成功')
        setDeleteChange(!deleteChange)
        refresh()
        leftRef.current.refresh();
      } else {
        message.error(res.message);
      }
    })
  }
  // 刷新列表数据方法
  const refresh = () => {
    if (tableRef != null && tableRef.current != null && tableRef.current.refresh != null) {
      tableRef.current.refresh();
    }
  };

  // useEffect(() => {
  //   // debugger;
  //   if (
  //     editModalVisible != null &&
  //     editModalVisible === true &&
  //     editFormRef != null &&
  //     editFormRef.current != null &&
  //     editFormRef.current.setFieldsValue != null
  //   ) {
  //     if (selectItem.pid != "0") {
  //       editFormRef.current.setFieldsValue({
  //         pid: selectItem.pid,
  //       });
  //     }
  //     editFormRef.current.setFieldsValue({
  //       code: selectItem.value,
  //     });

  //     editFormRef.current.setFieldsValue({
  //       name: selectItem.title,
  //     });

  //     editFormRef.current.setFieldsValue({
  //       apiType: selectItem.apiType,
  //     });
  //   }
  // }, [editModalVisible]);
  useEffect(() => {
    if (openVisible === true &&
      editModalVisible != null &&
      editModalVisible === true &&
      copyInitData != null &&
      editFormRef != null &&
      editFormRef.current != null &&
      editFormRef.current.setFieldsValue != null
    ) {
      if (copyInitData.pid != "0") {
        editFormRef.current.setFieldsValue({
          pid: copyInitData.pid,
        });
      }
      editFormRef.current.setFieldsValue({
        code: copyInitData.code,
      });

      editFormRef.current.setFieldsValue({
        name: copyInitData.name,
      });

      editFormRef.current.setFieldsValue({
        apiType: copyInitData.apiType,
      });
    }
  }, [openVisible, editModalVisible, copyInitData])
  useEffect(() => {
    if (selectItem != null && selectItem.children.length > 0) {
      const arr = [];
      selectItem.children.forEach((item, index) => {
        if (item.children.length == 0) {
          arr.push(item.key)
        }
      })
      setShowDelete(arr)
    } else if (selectItem != null && selectItem.children.length == 0) {

      setShowDelete(selectItem.key)
    }
  }, [selectItem, deleteChange]
  )
  // 编辑功能
  const getEdittValue = useCallback(() => {
    let id = selectKey;
    setOpenCopyVisible(false);
    setEditModalVisible(true);
    getTableData({ id, limit: 10, page: 1 }).then(res => {
      if (res.code === 0 &&
        res.data.records[0] &&
        editFormRef != null &&
        editFormRef.current != null &&
        editFormRef.current.setFieldsValue != null
      ) {
        let data = res.data.records[0];
        let { pid, code, name, apiType } = data;
        if (selectItem.pid != "0") {
          editFormRef.current.setFieldsValue({
            pid,
          });
        }
        editFormRef.current.setFieldsValue({
          code,
        });

        editFormRef.current.setFieldsValue({
          name,
        });

        editFormRef.current.setFieldsValue({
          apiType,
        });
      }
    })
  }, [selectKey])
  // 编辑提交
  const handleDditSubmit = () => {
    setEditConfirmLoading(true);
    let params = Object.assign({}, { id: selectItem.key }, editFormRef.current.getFieldsValue());
    console.log("params", params)
    if (!openVisible) {
      if (!params.pid) {
        params.pid = "0";
      }
      if (params.id == params.pid) {
        message.error("归属父类不能选择自身，请重新选择")
        setEditConfirmLoading(false)
        return;
      }
      updateJson(params).then((res) => {
        if (res.code === 0) {
          message.success('更新成功！');
          // tableRef.current.refresh();
          let p = new Promise((resolve, reject) => {
            resolve(leftRef.current.refresh())
          })
          p.then(() => {
            refresh();
          })
          setEditConfirmLoading(false)
          setEditModalVisible(false);
        } else {
          message.error('更新失败，请注意内容格式或内容重复，请重试');
          setEditConfirmLoading(false)
        }
      });
    }
    // openVisible 为true 则为复制弹窗
    if (openVisible) {
      editFormRef?.current.validateFields().then((formData) => {
        console.log(!formData.pid)
        if (!formData.pid) {
          formData.pid = "0";
        }
        add({ ...formData, paramsJson: copyInitData.paramsJson, ruleJson: copyInitData.ruleJson, contentJson: copyInitData.contentJson }).then((res) => {
          if (res.code === 0) {
            message.success('复制成功！');
            // 触发刷新列表数据

            // 复制标志置为true
            setCopyDataFlag(true);
            // 刷新列表
            let p = new Promise((resolve, reject) => {
              resolve(leftRef.current.refresh(copyInitData))
            })
            p.then(() => {
              refresh();
            })

            setEditConfirmLoading(false)
            setEditModalVisible(false);
          } else {
            message.error("内容重复");
            setEditConfirmLoading(false)
          }
        });
      });
    }
  };
  const [value, setValue] = useState(undefined);
  const onChange = (newValue) => {

    setValue(newValue);
  };
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'relative',
        // border: '1px solid red',
      }}
    >
      {/* 执行配置页面 */}
      {visible && initData != null && (
        <ConfPage refresh={refresh} initData={initData} onClose={onClose}></ConfPage>
      )}

      {
        //   openVisible && copyInitData != null && (
        //   <ConfPage refresh={refresh} initData={copyInitData} onClose={onClose}></ConfPage>
        // )
      }
      {/* 左侧树形图 */}
      <div
        style={{
          width: '420px',
          flex: '0 0 420px',
          height: '100%',
          marginRight: '16px',
          backgroundColor: '#fff',
        }}
      >
        <LeftDataList
          ref={leftRef}
          getSelectKey={getSelectKey}
          getSelectItem={getSelectItem}
          // getAPiSelect={getAPiSelect}
          getAPiSelect1={getAPiSelect1}
          setCopyFlag={copyDataflag}

          setCopyDataFlag={setCopyDataFlag}
          getOptypeTree={getOptypeTree}
        ></LeftDataList>
      </div>

      {/* 编辑弹框 */}
      <div
        style={{
          display: 'flex',
          flex: '1',
          backgroundColor: '#fff',
          flexDirection: 'column',
        }}
      >
        {editModalVisible && (
          <Modal
            visible={editModalVisible}
            onCancel={closeEditModal}
            title={openVisible ? '复制业务' : '编辑业务'}
            confirmLoading={editConfirmLoading}
            onOk={() => {
              // handleAddSubmit();
              console.log('initData', selectItem);
              handleDditSubmit();
            }}
            maskClosable={false}  //点击蒙层是否允许关闭
          >
            <Form ref={editFormRef}>
              <Form.Item
                name="pid"
                // rules={[{ required: true, message: '请输入业务code' }]}
                label={'归属父类'}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}

              >
                <TreeSelect value={value} showSearch treeData={selectGroup1} onChange={onChange} allowClear
                  treeNodeFilterProp="title"
                ></TreeSelect>
              </Form.Item>
              {/* <Form.Item
                name="pid"
                // rules={[{ required: true, message: '请输入业务code' }]}
                label={'归属父类'}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}

              >
                <Select
                  placeholder="请选择归属类型"
                  allowClear
                  showSearch
                  filterOption={(input, option) => {

                    return option.children.includes(input)
                  }}
                >
                  {
                    selectGroup && selectGroup.length > 0 && selectGroup.map((item) => (
                      <Option key={item.id} value={item.id} >{item.name}</Option>
                    ))
                  }

                </Select>
              </Form.Item> */}
              <Form.Item
                name="code"
                rules={[{ required: true, message: '请输入接口编码' }]}
                label={'接口编码'}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                name="name"
                rules={[{ required: true, message: '请输入接口名称' }]}
                label={'接口名称'}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Input></Input>
              </Form.Item>
              <Form.Item
                name="apiType"
                label={'类型选项'}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                <Select
                  placeholder="请选择类型选项"
                  allowClear
                >
                  {optypeTree.length > 0 && optypeTree.map(item => {
                    return (
                      <Option key={item.code} value={item.name} >{item.name}</Option>
                    )
                  })}
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        )}
        <div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              height: '48px',
              lineHeight: '48px',
              borderBottom: '1px solid #f1f2f4',
            }}
          >
            <span
              style={{
                paddingLeft: '16px',
              }}
            >
              接口详情
            </span>
            <span
              style={{
                fontSize: '12px',
                color: 'rgb(24, 144, 255)',
                fontWeight: 'bold',
                marginLeft: '16px',
              }}
            >
              <EditOutlined
                style={{
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  console.log('打开编辑弹框');
                }}
              />
              <span
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  console.log('打开编辑弹框');
                  getEdittValue();

                }}
              >
                编辑
              </span>
            </span>
          </div>
          <div
            style={{
              minHeight: '54px',
              lineHeight: '54px',
              display: 'flex',
            }}
          >
            <div
              style={{
                flex: '1',
                paddingLeft: '16px',
                paddingRight: '16px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '14px',
              }}
            >
              <span
                style={{
                  color: '#888',
                }}
              >
                接口编码：
              </span>
              <span style={{ fontWeight: '500' }}>{selectItem != null ? selectItem.value : ''}</span>
            </div>
            <div
              style={{
                flex: '1',
                paddingLeft: '16px',
                paddingRight: '16px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '14px',
              }}
            >
              <span
                style={{
                  color: '#888',
                }}
              >
                接口名称：
              </span>
              <span style={{ fontWeight: '500', width: "200px", overflow: "hidden", textOverflow: "ellipsis", }}>{selectItem != null ? selectItem.title : ''}</span>
            </div>
          </div>
        </div>
        <div
          style={{
            height: '16px',
            backgroundColor: '#f1f2f4',
          }}
        ></div>
        <div>
          <MainTable
            ref={tableRef}
            selectItem={selectItem}
            selectKey={selectKey}
            showDelete={showDelete}
            openConfPage={openConfPage}
            openCopyPage={openCopyPage}
            openDeletePage={openDeletePage}
          ></MainTable>
        </div>
      </div>
    </div>
  );
};

export default BusinessManage;
