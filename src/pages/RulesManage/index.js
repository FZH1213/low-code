// 规则管理页面
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';

import { Button, message, Modal, Form, Input, Spin, TreeSelect, Pagination } from 'antd';

// 导入左侧规则列表
import RulesList from './components/RulesList';

import {
  deleteRuleApi,
  updataApi,
  updataNameApi,
  getTableData,
  ruleApplyApi,
  updateData,
} from './service';
import { addRule } from './components/RulesList/service';

import RuleDetailCard from './components/RuleDetailCard';
import MainTable from './components/MainTable';
import ApplyModalTable from './components/ApplyModalTable';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

import styles from './styles.less';

import wait from './images/wait.png';
import { filterJson } from '@/utils/utils';

// 新增拖拽功能
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
// import { updateData } from '../ReportForm/ServiceMgr/service';

// 新增拖拽功能---end
const RulesManage = (props) => {
  const listRef = useRef(null);

  const [selectKey, setSelectKey] = useState(null);

  const [data, setData] = useState(null);

  const [showModel, setShowModal] = useState(false);

  const [showTableModel, setShowTableModal] = useState(false);
  const [applyTables, setApplyTable] = useState(null);
  // 删除大规则
  const deleteRuleItem = () => {
    Modal.confirm({
      title: '删除',
      content: <div>确认删除吗？</div>,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        deleteRuleApi({
          id: selectKey,
        }).then((res) => {
          if (res.code === 0) {
            // 刷新列表数据
            message.success('删除成功');
            listRef.current != null && listRef.current.refresh(selectKey);
          }
        });
      },
    });
  };

  const mockData = [
    {
      // 规则名称
      name: '规则名称呀',
      // 规则描述
      description: '规则描述呀test',
      // 处理事件
      dealEvent: '${baseUserServiceClient.superiorUserIdsByComAndRoles(companyId,signRoles)}',
      // 返回结果
      resultName: 'resultName',
      expend: 1,
      // 是否处于编辑状态(编辑必展开，展开不一定编辑)
      editing: 1,
    },
    {
      // 规则名称
      name: '规则名称2呀',
      // 规则描述
      description: '规则描述123呀test',
      // 处理事件
      dealEvent: '${baseUserServiceClient.superiorUserIdsByComAndRoles(companyId,signRoles)}',
      // 返回结果
      resultName: 'resultName222222',
      // mock id
      // id: '897574688622391292',
      // 是否展开
      expend: 0,
      // 是否处于编辑状态
      editing: 0,
    },
    {
      // 规则名称
      name: '规则名称3呀',
      // 规则描述
      description: '规则描述123呀test',
      // 处理事件
      dealEvent: '121212${baseUserServiceClient.superiorUserIdsByComAndRoles(companyId,signRoles)}',
      // 返回结果
      resultName: 'resultName222222',
      // mock id
      // id: '897574688622391292',
      // 是否展开
      expend: 0,
      // 是否处于编辑状态
      editing: 0,
    },
  ];

  // 选中的 规则 （selectKey 下 对应的规则数据）
  // const [RulesData, setRulesData] = useState([
  //   {
  //     // 规则名称
  //     name: '规则名称呀',
  //     // 规则描述
  //     description: '规则描述呀test',
  //     // 处理事件
  //     dealEvent: '${baseUserServiceClient.superiorUserIdsByComAndRoles(companyId,signRoles)}',
  //     // 返回结果
  //     resultName: 'resultName',
  //     expend: 1,
  //     // 是否处于编辑状态(编辑必展开，展开不一定编辑)
  //     editing: 1,
  //   },
  //   {
  //     // 规则名称
  //     name: '规则名称2呀',
  //     // 规则描述
  //     description: '规则描述123呀test',
  //     // 处理事件
  //     dealEvent: '${baseUserServiceClient.superiorUserIdsByComAndRoles(companyId,signRoles)}',
  //     // 返回结果
  //     resultName: 'resultName222222',
  //     // mock id
  //     // id: '897574688622391292',
  //     // 是否展开
  //     expend: 0,
  //     // 是否处于编辑状态
  //     editing: 0,
  //   },
  //   {
  //     // 规则名称
  //     name: '规则名称3呀',
  //     // 规则描述
  //     description: '规则描述123呀test',
  //     // 处理事件
  //     dealEvent: '121212${baseUserServiceClient.superiorUserIdsByComAndRoles(companyId,signRoles)}',
  //     // 返回结果
  //     resultName: 'resultName222222',
  //     // mock id
  //     // id: '897574688622391292',
  //     // 是否展开
  //     expend: 0,
  //     // 是否处于编辑状态
  //     editing: 0,
  //   },
  // ]);

  const [RulesData, setRulesData] = useState([]);
  const [RulesShowData, setRulesShowData] = useState([]);

  // 大规则修改弹框显示标志位
  const [updataVisible, setUpdataVisible] = useState(false);

  const updataFormRef = useRef(null);

  // 点击保存的时候的loading标志位
  const [saveLoading, setSaveLoading] = useState(false);

  // 2022-07-28 下拉框
  const [treeData, setTreeData] = useState([]);
  // 2022-07-28 复制的data数据
  const [copyData, setCopyData] = useState({});
  const [copyFlag, setCopyFlag] = useState(false);
  const [configData, setConfigData] = useState(null);
  //   请求表格数据的方法
  const fetchTablesData = (limit, page) => {
    setLoadings(true);
    console.log(props.selectItem);
    if (props.selectItem.children.length > 0) {
      getTableData({ pid: `${props.selectItem.key}`, limit, page }).then((res) => {
        console.log('获取分页数据 =>', res);
        if (res.code === 0) {
          setTableData(res.data.records);
          setTotal(res.data.total);
          setPage(res.data.page);
          setLoadings(false);
        }
      });
    } else {
      getTableData({ id: `${props.selectItem.key}`, limit, page }).then((res) => {
        console.log('获取分页数据 =>', res);
        if (res.code === 0) {
          setTableData(res.data.records);
          setTotal(res.data.total);
          setPage(res.data.page);
          setLoadings(false);
        }
      });
    }
  };
  // 解析json，获取规则s 数据
  useEffect(() => {
    if (configData != null) {
      if (configData.ruleNodeJson != null) {
        // 进行json字符串过来
        let jsonStr = filterJson(configData.ruleNodeJson);

        console.log('json解析 =>', JSON.parse(`${jsonStr}`));

        let res = null;

        res = JSON.parse(`${jsonStr}`);

        if (res != null && res.length != null && !!res.length) {
          setRulesData(res);
          setRulesShowData(res);
        } else {
          setRulesData([]);
          setRulesShowData([]);
        }
      }
    }
  }, [configData]);

  const getSelectKey = (key, data) => {
    console.log('父组件获取选中key =>', key);
    console.log('父组件获取数据 =>', data);
    setData(data);
    setSelectKey(key);
  };
  // 2022-07-28 加下拉框
  const getTreeData = (data) => {
    console.log('父组件获取下拉框 =>', data);
    setTreeData(data);
  };
  const [value, setValue] = useState(undefined);
  const onChange = (newValue) => {
    setValue(newValue);
  };
  // 2022-07-28 加复制弹框功能
  const openCopyPage = (row) => {
    setCopyData(row);
  };
  const getCopeFlag = (flag) => {
    setCopyFlag(flag);
    setUpdataVisible(true);
  };

  // 2022-07-28 加复制弹框功能---end
  // 2022-07-28 修改配置功能

  const openConfigPage = (data) => {
    setConfigData(data);
    setShowModal(true);
  };
  // 2022-07-28 加复制弹框功能---end
  // 2022-07-28 添加删除功能
  const openDeletePage = (row) => {
    deleteRuleApi({ id: row.id }).then((res) => {
      if (res.code === 0) {
        // 刷新列表数据
        message.success('删除成功');
        listRef.current != null && listRef.current.refresh(selectKey);
      } else {
        message.error('服务器响应失败，请重试');
      }
    });
  };
  // 2022-07-28 添加删除功能---end
  // 2022--8--5 添加查看应用功能
  const [rowData, setRowData] = useState(null);
  const openApplyPage = (row, limit = 10, page = 1) => {
    ruleApplyApi({ rule_json_like: row.ruleDefId, limit, page }).then((res) => {
      if (res.code === 0) {
        // 查看列表数据
        setRowData(row);
        setApplyTable(res.data);
        setShowTableModal(true);
      } else {
        message.error('服务器响应失败，请重试');
      }
    });
  };
  const closeCancel = (flag) => {
    setShowTableModal(flag);
  };
  const getApiData = (rule_json_like, limit, page, name_like = '', selectKey = '1') => {
    let params = { rule_json_like, limit, page };

    if (selectKey == '1' && name_like != '') {
      params.name_like = name_like;
    }
    if (selectKey == '0' && name_like != '') {
      params.code_like = name_like;
    }
    ruleApplyApi(params).then((res) => {
      if (res.code === 0) {
        setApplyTable(res.data);
      } else {
        message.error('服务器响应失败，请重试');
      }
    });
  };
  // 2022--8--5 添加查看应用功能---end
  useEffect(() => {
    if (
      (copyFlag === false && data != null,
      updataFormRef != null && updataVisible != null && updataVisible === true)
    ) {
      let datas = JSON.parse(JSON.stringify({ ...data }));
      if (datas.pid === '0') {
        datas.pid = '';
      }
      datas['name'] = data.title;
      datas['ruleDefId'] = data.value;
      datas['reqParam'] = data.objBusi.reqParam;
      updataFormRef.current.setFieldsValue({
        ...datas,
      });
    }
  }, [data, updataFormRef, updataVisible, copyFlag]);
  useEffect(() => {
    if (copyData != null && copyFlag === true && updataFormRef != null && updataVisible === true) {
      let datas = JSON.parse(JSON.stringify({ ...copyData }));
      if (datas.pid === '0') {
        datas.pid = '';
      }

      updataFormRef.current.setFieldsValue({
        ...datas,
      });
    }
  }, [copyData, copyFlag, updataFormRef, updataVisible]);
  const changeExpendStatus = (index) => {
    let copyData = [...RulesData];
    copyData[index].expend === 1 ? (copyData[index].expend = 0) : (copyData[index].expend = 1);
    setRulesData(copyData);
    setRulesShowData(copyData);
  };

  const closeEditStatus = (index) => {
    let copyData = [...RulesData];
    copyData[index].editing = 0;
    setRulesData(copyData);
    setRulesShowData(copyData);
  };

  const startEdit = (index) => {
    let copyData = [...RulesData];
    copyData[index].editing = 1;
    copyData[index].expend = 1;
    setRulesData(copyData);
    setRulesShowData(copyData);
  };

  const saveData = (index, formData) => {
    // 保存
    console.log('保存的数据 =>', formData);
    // 本地数据先存一份
    let copyData = [...RulesData];

    let resData = Object.assign({}, copyData[index], { ...formData }, { editing: 0 });

    copyData[index] = resData;

    // 调用接口，修改数据，如果修改成功，那么就同步本地数据，控制视图，
    // 如果失败，那么就还原原始数据，提示保存失败

    // 构造参数
    let params = Object.assign(
      {},
      { ...configData },
      { id: configData.id },
      { ruleNodeJson: JSON.stringify(copyData) },
      { paramsJson: '[]' },
    );

    console.log('构造参数 =>', params);

    setSaveLoading(true);

    setTimeout(() => {
      setSaveLoading(false);
    }, 10000);

    updataApi(params).then((res) => {
      console.log(res);
      setSaveLoading(false);
      if (res.code === 0) {
        message.success('保存成功！');
        listRef.current != null && listRef.current.refresh(selectKey);
        copyData[index].editing = -1;
        copyData[index].expend = 1;
        setRulesData(copyData);
        setRulesShowData(copyData);
      } else {
        // 在这里要还原数据（等于刷新数据）
        message.error('服务器繁忙，请稍后再试！');
        setSaveLoading(false);
        listRef.current != null && listRef.current.refresh(selectKey);
      }
    });

    // setRulesData(copyData);

    // 然后这里调用接口，进行全部数据的保存
  };

  // 2022-08-08 保存功能修改 （保存后不调用修改接口，统一由确定去做提交代码）
  // const saveData = (index, formData) => {
  //   console.log('保存的数据 =>', formData);
  //   let copyData = [...RulesData];
  //   let resData = Object.assign({}, copyData[index], { ...formData }, { editing: 0 });
  //   copyData[index] = resData;
  //   console.log(copyData)
  //   copyData[index].editing = 0;
  //   copyData[index].expend = 1;
  //   setRulesData(copyData);
  //   setRulesShowData(copyData);
  // }
  // 2022-08-08 保存功能修改-----end
  // 2022-08-08 拖拽功能
  const moveCard = useCallback(
    (dragData, dragIndex, dropData, hoverIndex) => {
      let copyData = [...RulesData];
      copyData = copyData.map((item, index) => {
        if (dragIndex == index) {
          return dragData;
        }
        if (hoverIndex == index) {
          return dropData;
        }
        return item;
      });
      console.log(copyData);
      setRulesData(copyData);
      setRulesData((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        }),
      );
      setRulesShowData((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        }),
      );
    },
    [RulesData],
  );
  // 2022-08-08 拖拽功能-----end

  // 删除
  const deleteItem = (index) => {
    let copyData = [...RulesData];

    copyData[index] = null;

    let resData = copyData.filter((item) => {
      return item != null;
    });

    // 调用修改接口，如果成功，那么在回调中，同步本地数据，控制视图展示
    // let params = Object.assign({}, )
    console.log('提交数据', configData);
    let params = Object.assign(
      {},
      { ...configData },
      { id: configData.id },
      { ruleNodeJson: JSON.stringify(resData) },
    );

    console.log('提交删除的时候的参数 =>', params);

    updataApi(params).then((res) => {
      console.log('删除res =>', res);
      if (res.code === 0) {
        // 如果接口改变成功，那么就同步视图
        message.success('删除成功！');
        setRulesData(resData);
        setRulesShowData(resData);

        // 且刷新 左侧 规则列表 数据
        listRef.current != null && listRef.current.refresh(selectKey);
      } else {
        message.success('服务器繁忙，请稍后再试！');
      }
    });
  };
  // 不发送接口的删除规则方法，仅用于本地新增后，点击取消，删除第一项规则
  const deleteItemSelf = (index) => {
    let copyData = [...RulesData];

    copyData[index] = null;

    let resData = copyData.filter((item) => {
      return item != null;
    });

    setRulesData(resData);
    setRulesShowData(resData);
  };

  // 新增规则
  const addRules = () => {
    let copyData = [...RulesData];
    copyData.push({
      // 规则名称
      name: '',
      // 规则描述
      description: '',
      // 处理事件
      dealEvent: '',
      // 返回结果
      resultName: '',
      // 是否展开
      expend: 1,
      // 是否处于编辑状态
      editing: 1,
    });
    console.log(copyData);
    setRulesData(copyData);
    setRulesShowData(copyData);

    // 延时滚动到底部
    setTimeout(() => {
      let dom = document.getElementById('rules_end');
      dom.scrollIntoView();
    }, 200);
  };

  // 来自列表的删除
  const deleteItemfromList = (item) => {
    console.log('item =>', item);

    deleteRuleApi({
      id: selectKey,
    }).then((res) => {
      if (res.code === 0) {
        // 刷新列表数据
        message.success('删除成功');
        listRef.current != null && listRef.current.refresh(selectKey);
      } else {
        message.error('服务器响应失败，请重试');
      }
    });
  };
  // 2020 -8 16 能力提交 api 接口

  const updateData = () => {
    let copyData = [...RulesData];
    let flag = true;
    for (let i = 0; i < copyData.length; i++) {
      if (copyData[i].editing == 1) {
        message.error('请确保保存所有数据');
        flag = false;
        return;
      }
    }
    console.log(copyData);
    if (flag) {
      let params = Object.assign(
        {},
        { ...configData },
        { id: configData.id },
        { ruleNodeJson: JSON.stringify(copyData) },
        { paramsJson: '[]' },
      );

      console.log('提交删除的时候的参数 =>', params);

      updataApi(params).then((res) => {
        console.log('删除res =>', res);
        if (res.code === 0) {
          // 如果接口改变成功，那么就同步视图
          message.success('修改成功！');

          copyData = copyData.map((item) => {
            item.editing = 0;
            item.expend = 1;
            return item;
          });
          console.log(copyData);
          setRulesData(copyData);
          setRulesShowData(copyData);
          setShowModal(false);
          // 且刷新 左侧 规则列表 数据
          listRef.current != null && listRef.current.refresh(selectKey);
        } else {
          message.success('服务器繁忙，请稍后再试！');
        }
      });
    }
  };
  // 2020 -8 16
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        // border: '1px solid #fff',
        display: 'flex',
      }}
    >
      {/* 大规则修改弹框 */}
      {updataVisible && (
        <Modal
          visible={updataVisible}
          onCancel={() => {
            setUpdataVisible(false);
          }}
          width={'520px'}
          title={'修改能力'}
          onOk={() => {
            updataFormRef.current.validateFields().then((value) => {
              console.log('value ===>', value);
              if (!value.pid) {
                value.pid = '0';
              }
              console.log('当前key =>', selectKey);

              if (!copyFlag) {
                // 构造参数
                let params = Object.assign(
                  {},
                  { ...value },
                  { id: selectKey },
                  // { paramsJson: '' },
                );

                // 提交接口
                updataNameApi(params)
                  .then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                      message.success('修改成功！');
                      listRef.current != null && listRef.current.refresh(selectKey);
                      // 关闭弹框
                      setUpdataVisible(false);
                    } else {
                      message.error('服务器繁忙，请稍后再试！');
                      listRef.current != null && listRef.current.refresh(selectKey);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              } else {
                let params = Object.assign(
                  {},
                  { ...value },
                  { ruleNodeJson: copyData.ruleNodeJson, paramsJson: '[]' },
                  // { paramsJson: '' },
                );
                addRule(params)
                  .then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                      message.success('修改成功！');
                      listRef.current != null && listRef.current.refresh(selectKey);
                      // 关闭弹框
                      setUpdataVisible(false);
                    } else {
                      message.error('服务器繁忙，请稍后再试！');
                      listRef.current != null && listRef.current.refresh(selectKey);
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }
              setCopyFlag(false);
              listRef.current != null && listRef.current.refresh();
            });
          }}
          maskClosable={false} //点击蒙层是否允许关闭
        >
          {/* 名称 描述 标识 */}
          <Form ref={updataFormRef}>
            <Form.Item
              name="pid"
              // rules={[{ required: true, message: '请输入业务code' }]}
              label={'归属父类'}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <TreeSelect
                value={value}
                showSearch
                treeData={treeData}
                onChange={onChange}
                allowClear
                treeNodeFilterProp="title"
              ></TreeSelect>
            </Form.Item>
            <Form.Item
              name="name"
              label={'能力名称'}
              rules={[{ required: true, message: '请输入能力名称' }]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
              name="description"
              label={<span style={{ marginLeft: '11px' }}>能力描述</span>}
            >
              <Input.TextArea></Input.TextArea>
            </Form.Item>
            <Form.Item
              name="ruleDefId"
              label={'能力标识'}
              rules={[{ required: true, message: '请输入能力标识' }]}
            >
              <Input></Input>
            </Form.Item>
            <Form.Item
                name="reqParam"
                label={
                  <span style={{ marginLeft: '18px' }}>
                    API参数
                  </span>
                }
              >
                <Input.TextArea></Input.TextArea>
              </Form.Item>
          </Form>
        </Modal>
      )}

      {/* 左侧选择列表 */}
      <div
        style={{
          flex: '0 0 360px',
          marginRight: '16px',
          backgroundColor: '#fff',
        }}
      >
        <RulesList
          ref={listRef}
          getSelectKey={getSelectKey}
          getTreeData={getTreeData}
          deleteItem={deleteItemfromList}
        ></RulesList>
      </div>

      {/* 右侧内容 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1',
        }}
      >
        {/* 右侧顶部规则描述 */}
        <div
          style={{
            flex: '0 0 130px',
            marginBottom: '16px',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* 头部，包含名称标题，业务标识，以及修改，删除按钮 */}
          <div
            style={{
              flex: '0 0 48px',
              height: '48px',
              lineHeight: '48px',
              display: 'flex',
              borderBottom: '1px solid #f1f2f4',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginLeft: '16px',
                  marginRight: '2px',
                }}
              >
                {data != null && data.title}
              </span>
              <span
                style={{
                  fontSize: '12px',
                  color: '#777',
                  position: 'relative',
                  top: '2px',
                }}
              >
                （业务标识：{data != null && data.value}）
              </span>
            </div>
            {/* 删除，修改按钮 */}
            <div
              style={{
                width: '200px',
                textAlign: 'right',
              }}
            >
              <Button
                type="primary"
                style={{
                  marginRight: '12px',
                  width: '80px',
                }}
                icon={<EditOutlined />}
                onClick={() => {
                  setUpdataVisible(true);
                  setCopyFlag(false);
                }}
              >
                修改
              </Button>
              <Button
                type="ghost"
                style={{
                  marginRight: '16px',
                  width: '80px',
                }}
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  deleteRuleItem();
                }}
              >
                删除
              </Button>
            </div>
          </div>

          {/* 规则描述 */}
          <div
            style={{
              flex: '1',
              // border: '1px solid red',
              padding: '16px',
              fontSize: '14px',
              overflow: 'hidden',
            }}
          >
            <span>步骤描述：</span>
            <span>
              {data != null && data.description != null && !!data.description.length ? (
                data.description
              ) : (
                <span style={{ color: '#888' }}>无</span>
              )}
            </span>
          </div>
          {/* 规则描述--end */}
        </div>
        {/* 右侧顶部规则描述----end */}
        {/* 右侧下方规则卡片集合模块 */}
        <div
          style={{
            flex: '1',
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* <button onClick={() => {

            setShowModal(true);
          }}> 点击显示弹窗内容</button> */}
          {/* MainTable */}
          {data != null && selectKey != null && (
            <MainTable
              data={data}
              openCopyPage={openCopyPage}
              openConfigPage={openConfigPage}
              openApplyPage={openApplyPage}
              openDeletePage={openDeletePage}
              copeFlag={getCopeFlag}
            ></MainTable>
          )}
          {/* MainTable----end */}

          <div>
            {showModel && configData != null && (
              <Modal
                width={'60%'}
                bodyStyle={{ minHeight: 'calc(100vh - 54px)' }}
                style={{ top: '0', height: '100vh', display: 'block', boxSizing: 'border-box' }}
                visible={showModel}
                onCancel={() => {
                  setShowModal(false);
                }}
                onOk={() => {
                  updateData();
                }}
              >
                {/* 头部 */}
                <div
                  style={{
                    height: '54px',
                    lineHeight: '54px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    borderBottom: '1px solid #f1f2f4',
                    marginTop: '30px',
                    marginBottom: '30px',
                  }}
                >
                  <div>能力详情</div>
                  <div>
                    {/* <Button
                onClick={() => {
                  console.log(JSON.stringify(mockData));
                }}
              >
                test
              </Button> */}
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      style={{
                        position: 'relative',
                        bottom: '2px',
                      }}
                      onClick={() => {
                        addRules();
                      }}
                    >
                      新增能力
                    </Button>
                  </div>
                </div>
                {/* 头部---end */}
                {/* 规则列表 */}
                <div
                  style={{
                    // border: '1px solid red',
                    // height: 'calc(100vh - 350px)',
                    // overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  {
                    // 加载标志蒙层
                    saveLoading && (
                      <>
                        <div
                          style={{
                            position: 'absolute',
                            left: '0px',
                            right: '0px',
                            top: '0px',
                            bottom: '0px',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 500,
                          }}
                        >
                          <Spin spinning={true}></Spin>
                        </div>
                      </>
                    )
                  }

                  <div className={styles.rule_wrapper}>
                    {/* 这个就变成maint */}
                    <div>
                      <div>
                        {RulesData.length != null && !!!RulesData.length ? (
                          <>
                            <div
                              style={{
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
                        ) : (
                          <>
                            {/* 2022-08-08 新增拖拽功能 */}
                            <DndProvider backend={HTML5Backend}>
                              {RulesData.map((item, index) => {
                                return (
                                  <div key={index}>
                                    <RuleDetailCard
                                      data={item}
                                      cancelData={RulesShowData[index]}
                                      id={index}
                                      index={index}
                                      forKey={index}
                                      changeExpendStatus={changeExpendStatus}
                                      // 关闭编辑状态
                                      closeEditStatus={closeEditStatus}
                                      // 开始编辑
                                      startEdit={startEdit}
                                      // 保存数据
                                      saveData={saveData}
                                      //2022-07-28
                                      // 删除某项
                                      deleteItem={deleteItem}
                                      // 本地删除
                                      deleteItemSelf={deleteItemSelf}
                                      moveCard={moveCard}
                                    ></RuleDetailCard>
                                  </div>
                                );
                              })}
                            </DndProvider>
                            {/* 2022-08-08 新增拖拽功能  ---- end*/}
                            {/* 添加一个锚点，用于新增的时候，滚动到底部 */}
                            <>
                              <a id="rules_end"></a>
                            </>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* 规则列表----end */}
              </Modal>
            )}
          </div>
          {/* 2022-08-05 新增应用场景列表 */}

          {/* 2022-08-05 新增应用场景列表----end */}

          {/* 头部 */}
          {/* <div
            style={{
              height: '54px',
              lineHeight: '54px',
              fontSize: '18px',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'space-between',
              paddingLeft: '16px',
              paddingRight: '16px',
              borderBottom: '1px solid #f1f2f4',
            }}
          >
            <div>能力详情</div>
            <div>
             
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  position: 'relative',
                  bottom: '2px',
                }}
                onClick={() => {
                  addRules();
                }}
              >
                新增能力
              </Button>
            </div>
          </div> */}
          {/* 头部---end */}
          {/* 规则列表 */}
          {/* <div
            style={{
              // border: '1px solid red',
              height: 'calc(100vh - 300px)',
              // overflow: 'hidden',
              position: 'relative',
            }}
          >
            {
              // 加载标志蒙层
              saveLoading && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      left: '0px',
                      right: '0px',
                      top: '0px',
                      bottom: '0px',
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      zIndex: 500,
                    }}
                  >
                    <Spin spinning={true}></Spin>
                  </div>
                </>
              )
            }

            <div className={styles.rule_wrapper}>
             
              <div>
                <div>
                  {RulesData.length != null && !!!RulesData.length ? (
                    <>
                      <div
                        style={{
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
                  ) : (
                    <>
                      {RulesData.map((item, index) => {
                        return (
                          <div key={index}>
                            <RuleDetailCard
                              data={item}

                              forKey={index}
                              changeExpendStatus={changeExpendStatus}
                              // 关闭编辑状态
                              closeEditStatus={closeEditStatus}
                              // 开始编辑
                              startEdit={startEdit}
                              // 保存数据
                              saveData={saveData}
                              // 删除某项
                              deleteItem={deleteItem}
                              // 本地删除
                              deleteItemSelf={deleteItemSelf}
                            ></RuleDetailCard>
                          </div>
                        );
                      })}
                     
                      <>
                        <a id="rules_end"></a>
                      </>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div> */}
          {/* 规则列表----end */}
        </div>
        {/* 右侧下方规则卡片集合模块---end */}
        {showTableModel && applyTables != null && rowData != null && (
          <ApplyModalTable
            showTableModel={showTableModel}
            applyTables={applyTables}
            closeCancel={closeCancel}
            rowData={rowData}
            getApiData={getApiData}
          ></ApplyModalTable>
        )}
      </div>
    </div>
  );
};

export default RulesManage;
