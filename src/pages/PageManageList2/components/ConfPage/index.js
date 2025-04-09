// 业务配置页面
import React, { useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';
import {
  Button,
  Form,
  Tree,
  Input,
  Space,
  Typography,
  Modal,
  Spin,
  message,
  Row,
  Col,
  Card,
  Divider,
} from 'antd';
// import '@/theme/default/common.less';
import { EditOutlined, RollbackOutlined } from '@ant-design/icons';
// import styles from './styles.less';
// 导入规则配置模块
import RulesConf from './components/RulesConf';
// 导入参数配置模块
import ParamsConf from './components/ParamsConf';
import { updateJson, validateDataApi, generateExposeJson, getTreeSelectOptions } from './service';
import EditTable from './components/EditTable';

const ConfPage = (props) => {
  useEffect(() => {
    // console.log('重渲染 =>', props);
  }, []);

  const [paramsConfData, setParamsConfData] = useState(null);
  // 初始 执行规则 数据-json
  const [rulesJsonData, setRulesJsonData] = useState(null);
  // 验证弹框显示标志位
  const [validateModalVisible, setValidateModalVisible] = useState(false);
  const [valiLoading, setValiLoading] = useState(false);
  const validateFormRef = useRef(null);
  const [resValue, setResValue] = useState(null);

  //生成exposejson弹窗
  const [expjsonModalVisible, setExpjsonModalVisible] = useState(false);
  const [expjsonLoading, setExpjsonLoading] = useState(false);
  const [saveEJsonLoading, setSaveEJsonLoading] = useState(false);
  const expjsonFormRef = useRef(null);
  const [exposeJson, setExposeJson] = useState(undefined);
  const [expTableName, setExpTableName] = useState('');
  const [initDataAPI, setInitDataAPI] = useState('');
  const [requestData, setRequestData] = useState([]);
  const [responseData, setResponseData] = useState([]);

  const [updateJsonLoading, setUpdateJsonLoading] = useState(false);

  // 选项数据
  const [treeSelectOptions, setTreeSelectOptions] = useState([]);

  // 获取树形选项数据
  useEffect(() => {
    getTreeSelectOptions().then((res) => {
      if (res.code === 0) {
        console.log('res.data', res.data);
        let data = res.data;
        setTreeSelectOptions(data);
      }
    });
  }, []);

  useEffect(() => {
    // if (props.initData != null) {
    //   if (props.initData.paramsJson != null && props.initData.paramsJson.length != null) {
    //     if (JSON.parse(props.initData.paramsJson).length != null) {
    //       //   debugger;
    //       setParamsConfData(`${props.initData.paramsJson}`);
    //     } else {
    //       //   debugger;
    //       setParamsConfData('[]');
    //     }
    //   }

    //   if (props.initData.ruleJson != null && props.initData.ruleJson.length != null) {
    //     if (JSON.parse(props.initData.ruleJson).length != null) {
    //       //   debugger;
    //       setRulesJsonData(`${props.initData.ruleJson}`);
    //     } else {
    //       //   debugger;
    //       setRulesJsonData('[]');
    //     }
    //   }
    // }

    if (props.initData != null) {
      if (props.initData.paramsJson != null && props.initData.paramsJson.length != null) {
        if (!!props.initData.paramsJson.length) {
          //   debugger;
          setParamsConfData(`${props.initData.paramsJson}`);
        } else {
          //   debugger;
          setParamsConfData('[]');
        }
      }

      if (props.initData.ruleJson != null && props.initData.ruleJson.length != null) {
        if (!!props.initData.ruleJson.length) {
          //   debugger;
          setRulesJsonData(`${props.initData.ruleJson}`);
        } else {
          //   debugger;
          setRulesJsonData('[]');
        }
      }

      if (props.initData.exposeJson && props.initData.exposeJson.length != null) {
        if (!!props.initData.exposeJson.length) {
          let obj = { ...JSON.parse(props.initData.exposeJson) };
          setExposeJson(obj);
          setInitDataAPI(obj?.initDataApi);
          setExpTableName(obj?.tableName);
          setRequestData(obj?.request?.parameters);
          setResponseData(obj?.response?.parameters);
        }
      }
    }
  }, [props.initData]);

  const changeParamsConfData = (data) => {
    // console.log('父组件数据改变 =>', data);
    let resData = '[]';
    // 去除多余字段
    if (JSON.parse(data) != null && JSON.parse(data).length != null) {
      let res = JSON.parse(data).map((item) => {
        if ('json' == item.type) item.default = JSON.parse(item.default); //转json入库
        delete item.key;
        delete item.disabled;
        return item;
      });
      resData = JSON.stringify(res);
    }
    // console.log(resData);
    setParamsConfData(resData);
  };
  const changeRulesJsonData = (data) => {
    // console.log('父组件数据改变 =>', data);
    let resData = '[]';
    // 去除多余字段
    if (JSON.parse(data) != null && JSON.parse(data).length != null) {
      let res = JSON.parse(data).map((item) => {
        if (item.params != '') {
          item.params = JSON.parse(item.params);
        } //转json入库
        delete item.key;
        delete item.edit;
        // delete item.disabled;
        return item;
      });
      resData = JSON.stringify(res);
    }
    console.log(resData);
    setRulesJsonData(resData);
  };

  //   保存编辑方法
  const handleSubmit = () => {
    // console.log('paramsConfData', paramsConfData);
    // console.log('rulesJsonData', rulesJsonData);
    if (rulesJsonData != null) {
      let rules = rulesJsonData;
      console.log(rules);
      const ruledata = JSON.parse(rules).filter((item) => {
        if (item.params) {
          return item;
        }
      });

      setRulesJsonData(ruledata);
    }

    setUpdateJsonLoading(true);
    updateJson({
      id: props.initData.id,
      paramsJson: paramsConfData,
      ruleJson: rulesJsonData,
      code: props.initData.code,
      contentJson: '',
      name: props.initData.name,
      exposeJson: JSON.stringify(exposeJson),
    }).then((res) => {
      // console.log(res);
      if (res.code === 0) {
        // 关闭配置页面，触发刷新列表数据
        setUpdateJsonLoading(false);
        props.onClose();
        props.refresh && props.refresh();
      } else {
        message.error('服务器繁忙，请稍后再试！');
        setUpdateJsonLoading(false);
      }
    });

    console.log({
      id: props.initData.id,
      paramsJson: paramsConfData,
      ruleJson: rulesJsonData,
      code: props.initData.code,
      contentJson: null,
      name: null,
    });
  };

  useEffect(() => {
    if (validateFormRef != null && validateFormRef.current != null) {
      // console.log('回填', props);
      // 获取参数值
      let resVariables = '';
      // 判断是否存在数据
      // if (props.initData.paramsJson === '' && props.initData.ruleJson === '') {
      //   message.error('请添加数据');
      //   return;
      // }
      // 构造参数配置对象
      let paramsObj = JSON.parse(props.initData.paramsJson);
      // 去除类型
      // 构造规则配置对象
      let rulesObj = JSON.parse(props.initData.ruleJson);
      // 去除类型
      // 合成json
      let resValue = JSON.stringify({
        paramsJson: paramsObj,
        ruleJson: rulesObj,
      });
      validateFormRef.current.setFieldsValue({
        code: props.initData.code,
        variables: '{}', //resValue, todo 暂时入参为空，后续考虑接口取
      });
    }
  }, [validateFormRef, props, validateModalVisible]);

  const validateData = () => {
    // 获取数据
    let val = validateFormRef.current.getFieldsValue();
    let resVariables = {};
    if (val.variables != null && JSON.parse(val.variables) != null) {
      // console.log('resVal', val.variables);
      resVariables = JSON.parse(val.variables);
      // console.log('resVariables', resVariables);
      // debugger;
    } else {
      message.error('请输入正确的JSON数据');
      return;
    }

    let payload = {
      code: props.initData.code,
      variables: resVariables,
    };
    // let payload = resVariables;
    validateDataApi(payload).then((res) => {
      setValiLoading(false);
      if (res != null) {
        setResValue(JSON.stringify(res));
      }
    });
  };

  //生成exposonJson的部分
  useEffect(() => {
    if (exposeJson && expjsonModalVisible) {
      expjsonFormRef?.current.setFieldsValue({
        initDataApi: exposeJson?.initDataApi,
        tableName: exposeJson?.tableName,
      });
    }
  }, [expjsonModalVisible, props, expjsonFormRef]);
  const requestColumns = [
    {
      title: '参数名',
      dataIndex: 'name',
      align: 'center',
      editable: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: '18%',
      align: 'center',
      ellipsis: true,
      editable: true,
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      width: '18%',
      align: 'center',
      ellipsis: true,
      editable: true,
    },
    {
      title: '库表字段名',
      dataIndex: 'columnName',
      width: '18%',
      align: 'center',
      ellipsis: true,
      editable: true,
    },
    {
      title: '符号',
      dataIndex: 'symbol',
      width: '18%',
      align: 'center',
      ellipsis: true,
      editable: true,
    },
  ];

  const responseColumns = [
    {
      title: '字段名',
      dataIndex: 'name',
      width: '30%',
      align: 'center',
      ellipsis: true,
      editable: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: '30%',
      align: 'center',
      ellipsis: true,
      editable: true,
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      width: '30%',
      align: 'center',
      ellipsis: true,
      editable: true,
    },
  ];

  //获取ExposeJson 弹窗数据
  const getTableData = (title, dataSource) => {
    if (title === 'requestData') {
      setRequestData(dataSource);
    } else if (title === 'responseData') {
      setResponseData(dataSource);
    }
  };
  // 输入表名，生成exponseHSON
  const handleGenerateExpJson = async () => {
    setExpjsonLoading(true);
    try {
      const values = await expjsonFormRef?.current.validateFields();
      generateExposeJson(values).then((res) => {
        if (
          res.code === 0 &&
          res.data?.request?.parameters.length > 0 &&
          res.data?.response?.parameters.length > 0
        ) {
          setExposeJson(res.data);
          setInitDataAPI(res.data?.initDataApi);
          setRequestData(res.data?.request?.parameters);
          setResponseData(res.data?.response?.parameters);
          setExpjsonLoading(false);
        } else {
          message.error('生成失败，请检查表名！');
          setExpjsonLoading(false);
        }
      });
    } catch (errorInfo) {
      setExpjsonLoading(false);
    }
  };

  // 保存exponseJson方法
  const saveExpJson = () => {
    let obj = {
      tableName: '',
      initDataApi: '',
      request: {},
      response: {},
      // ...exposeJson
    };
    obj.tableName = expTableName;
    obj.initDataApi = initDataAPI;
    obj.request.parameters = requestData;
    obj.response.parameters = responseData;
    setExposeJson(obj);
    setTimeout(() => {
      setExpjsonModalVisible(false);
    }, 1000);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '0px',
        left: '0px',
        right: '0px',
        bottom: '0px',
        backgroundColor: '#F1F2F4',
        zIndex: 100,
      }}
    >
      {/* 验证弹框 */}
      {validateModalVisible && (
        <>
          <Modal
            title="验证结果"
            maskClosable={false}
            visible={validateModalVisible}
            onCancel={() => {
              setValidateModalVisible(false);
            }}
            width={650}
            footer={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                }}
              >
                <Button
                  onClick={() => {
                    setValidateModalVisible(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  type={'primary'}
                  style={{
                    marginRight: '12px',
                  }}
                  loading={valiLoading}
                  onClick={() => {
                    setValiLoading(true);
                    setTimeout(() => {
                      setValiLoading(false);
                    }, 3000);
                    // console.log('props =>', props);
                    // 调用验证方法
                    validateData();
                  }}
                >
                  验证结果
                </Button>
              </div>
            }
          >
            <div>
              <Form ref={validateFormRef}>
                <div>code:</div>
                <Form.Item
                  name="code"
                  style={{
                    marginBottom: '12px',
                  }}
                // initialValue={'1'}
                >
                  <Input disabled={true}></Input>
                </Form.Item>
                <div>参数值:</div>
                <Form.Item
                  name="variables"
                  style={{
                    marginBottom: '12px',
                  }}
                >
                  <Input.TextArea
                    style={{
                      minHeight: '100px',
                    }}
                  ></Input.TextArea>
                </Form.Item>
              </Form>
              {/* 结果展示 */}
              <div>
                <div>验证结果:</div>
                <div>
                  {valiLoading ? (
                    <>
                      <Spin spinning={true}>
                        <div
                          style={{
                            border: '1px solid #d9d9d9',
                            borderRadius: '2px',
                            backgroundColor: '#f5f5f5',
                            padding: '5px 12px',
                            color: 'rgba(0, 0, 0, 0.25)',
                          }}
                        >
                          {resValue != null ? resValue : '请点击验证结果'}
                        </div>
                      </Spin>
                    </>
                  ) : (
                    <>
                      {resValue != null ? (
                        <>
                          <div
                            style={{
                              border: '1px solid #d9d9d9',
                              borderRadius: '2px',
                              backgroundColor: '#f5f5f5',
                              padding: '5px 12px',
                              color: 'rgba(0, 0, 0, 0.25)',
                              minHeight: '60px',
                            }}
                          >
                            {resValue}
                          </div>
                        </>
                      ) : (
                        <>
                          <div
                            style={{
                              border: '1px solid #d9d9d9',
                              borderRadius: '2px',
                              backgroundColor: '#f5f5f5',
                              padding: '5px 12px',
                              color: 'rgba(0, 0, 0, 0.25)',
                            }}
                          >
                            请点击验证结果
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}

      {/* 生成exposejson弹框 */}
      {expjsonModalVisible && (
        <>
          <Modal
            title="生成exposejson"
            maskClosable={false}
            destroyOnClose={true}
            visible={expjsonModalVisible}
            onCancel={() => {
              setExpjsonModalVisible(false);
            }}
            width="65%"
            footer={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                }}
              >
                <Button
                  onClick={() => {
                    setExpjsonModalVisible(false);
                  }}
                >
                  取消
                </Button>
                <Button
                  type={'primary'}
                  style={{
                    marginRight: '12px',
                  }}
                  loading={saveEJsonLoading}
                  onClick={() => {
                    setSaveEJsonLoading(true);
                    setTimeout(() => {
                      setSaveEJsonLoading(false);
                    }, 3000);
                    // 调用保存exposJson方法
                    saveExpJson();
                  }}
                >
                  保存exposejson
                </Button>
              </div>
            }
          >
            <div>
              <Form ref={expjsonFormRef}>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      name="tableName"
                      label="输入表名"
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}
                      style={{
                        marginBottom: '24px',
                      }}
                      rules={[{ required: true, message: '表名不能为空' }]}
                    >
                      <Input
                        placeholder="请输入表名"
                        allowClear
                        onChange={(e) => {
                          setExpTableName(e.target.value);
                        }}
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col span={8} offset={1}>
                    <Button
                      type="primary"
                      onClick={handleGenerateExpJson}
                      loading={expjsonLoading}
                    // style={{ width: '100%' }}
                    >
                      生成
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="initDataApi"
                      label="下拉框list接口"
                      style={{
                        marginBottom: '24px',
                      }}
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 18 }}
                      rules={[{ required: false, message: '下拉list接口不能为空' }]}
                    >
                      <Input
                        placeholder="请输入下拉list接口"
                        allowClear
                        onChange={(e) => {
                          setInitDataAPI(e.target.value);
                        }}
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Divider dashed style={{ margin: '12px 0' }} />
              <Card bordered={false} bodyStyle={{ padding: 0 }}>
                <EditTable
                  title="responseData"
                  columns={responseColumns}
                  tableDataSource={responseData}
                  getTableData={getTableData}
                />
              </Card>
              <Divider dashed style={{ margin: '0px 0 12px' }} />
              <Card bordered={false} bodyStyle={{ padding: 0 }}>
                <EditTable
                  title="requestData"
                  columns={requestColumns}
                  tableDataSource={requestData}
                  getTableData={getTableData}
                />
              </Card>
            </div>
          </Modal>
        </>
      )}
      <div
        style={{
          width: 'calc(100%)',
          height: 'calc(100%)',
          position: 'relative',
          right: '24px',
          top: '-24px',
          borderTop: '1px solid #f1f2f4',
          margin: '0px 24px',
        }}
      >
        {/* 头部内容 */}
        <div
          style={{
            flex: '0 0 88px',
            height: '88px',
            backgroundColor: '#fff',
            display: 'flex',
            fontSize: '14px',
          }}
        >
          <div
            style={{
              flex: '1',
              padding: '24px',
            }}
          >
            <div
              style={{
                height: '24px',
                lineHeight: '24px',
                display: 'flex',
              }}
            >
              <div
                style={{
                  flex: '1',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <span
                  style={{
                    color: '#888',
                  }}
                >
                  业务code：
                </span>
                <span>{props.initData.code}</span>
              </div>
              <div
                style={{
                  flex: '1',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <span
                  style={{
                    color: '#888',
                  }}
                >
                  业务名称：
                </span>
                <span>{props.initData.name}</span>
              </div>
            </div>
            <div
              style={{
                height: '32px',
                lineHeight: '32px',
              }}
            >
              <span
                style={{
                  color: '#888',
                }}
              >
                描述：
              </span>
              <span>暂无描述</span>
            </div>
          </div>
          <div
            style={{
              // borderLeft: '1px solid #f1f2f4',
              flex: '0 0 480px',
              display: 'flex',
              flexDirection: 'column-reverse',
            }}
          >
            <div
              style={{
                height: '64px',
                lineHeight: '64px',
                // border: '1px solid red',
                display: 'flex',
                flexDirection: 'row-reverse',
                padding: '16px',
              }}
            >
              <Button
                type="primary"
                onClick={() => {
                  handleSubmit();
                }}
                loading={updateJsonLoading}
              >
                保存编辑
              </Button>
              <Button
                type="ghost"
                style={{
                  marginRight: '12px',
                  color: '#1C6DE8',
                  border: '1px solid #1C6DE8',
                  backgroundColor: ' #F2F9FF',
                }}
                onClick={() => {
                  // 打开验证弹框
                  if (props.initData.paramsJson === '' && props.initData.ruleJson === '') {
                    message.error('请添加数据');
                    return;
                  }

                  setValidateModalVisible(true);
                }}
              >
                验证结果
              </Button>

              <Button
                type="ghost"
                style={{
                  marginRight: '12px',
                  color: '#1C6DE8',
                  border: '1px solid #1C6DE8',
                  backgroundColor: ' #F2F9FF',
                }}
                onClick={() => {
                  // // 打开生成exposejson的页面弹框
                  // if (props.initData.paramsJson === '' && props.initData.ruleJson === '') {
                  //   message.error('请添加数据');
                  //   return;
                  // }
                  setExpjsonModalVisible(true);
                }}
              >
                生成exposejson
              </Button>

              <div
                style={{
                  height: '32px',
                  lineHeight: '32px',
                  color: '#666666',
                  marginRight: '16px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  props.onClose && props.onClose();
                }}
              >
                <span
                  style={{
                    marginRight: '2px',
                  }}
                >
                  <RollbackOutlined />
                </span>
                <span>返回列表</span>
              </div>
            </div>
          </div>
        </div>
        {/* 下方参数配置、执行规则配置部分 */}
        <div
          style={{
            padding: '16px',
            height: 'calc(100% - 72px)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: '#fff',
              display: 'flex',
            }}
          >
            <div
              style={{
                flex: '1',
              }}
            >
              {paramsConfData != null && (
                <ParamsConf
                  initData={paramsConfData}
                  changeData={changeParamsConfData}
                  treeSelectOptions={treeSelectOptions}
                ></ParamsConf>
              )}
            </div>

            <div
              style={{
                flex: '0 0 16px',
                backgroundColor: '#f1f2f4',
              }}
            ></div>

            <div
              style={{
                flex: '1',
              }}
            >
              {rulesJsonData != null && (
                <RulesConf
                  initData={rulesJsonData}
                  changeData={changeRulesJsonData}
                  treeSelectOptions={treeSelectOptions}
                ></RulesConf>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfPage;
