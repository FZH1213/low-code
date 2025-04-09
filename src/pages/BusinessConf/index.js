// 业务配置页面
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button, message, Tree, Form, Input, Space, Typography, Modal, Spin } from 'antd';

import LeftDataList from './components/LeftDataList';

import { SaveOutlined } from '@ant-design/icons';

import EditItemCard from './components/EditItemCard';

import { updateJson, validateDataApi } from './service';

import wait from '../../pages/RulesManage/images/wait.png';

const BusinessConf = (props) => {
  const leftRef = useRef(null);

  const validateFormRef = useRef(null);

  const [selectKey, setSelectKey] = useState(null);

  const [selectItem, setSelectItem] = useState(null);

  const [jsonData, setJsonData] = useState(null);

  //   用于渲染的数据数组
  const [renderMap, setRenderMap] = useState([]);

  const [validateModalVisible, setValidateModalVisible] = useState(false);

  const [valiLoading, setValiLoading] = useState(false);

  const [initData, setInitData] = useState([]);

  const [resValue, setResValue] = useState(null);

  useEffect(() => {
    if (validateFormRef != null && validateFormRef.current != null) {
      console.log('回填', props);

      // 获取参数值
      // let resVariables = '';

      // 判断是否存在数据
      // if (props.initData.paramsJson === '' && props.initData.ruleJson === '') {
      //   message.error('请添加数据');
      //   return;
      // }

      // 构造参数配置对象
      // let paramsObj = JSON.parse(selectItem.paramsJson);

      // 去除类型

      // 构造规则配置对象
      // let rulesObj = JSON.parse(selectItem.ruleJson);

      // 去除类型

      // 合成json
      // let resValue = JSON.stringify({
      //   paramsJson: paramsObj,
      //   ruleJson: rulesObj,
      // });

      validateFormRef.current.setFieldsValue({
        code: selectItem.code,
        variables: '{}', //resValue, todo 暂时入参为空，后续考虑接口取
      });
    }
  }, [validateFormRef, selectItem, validateModalVisible]);

  //   初始化解析json
  useEffect(() => {
    setRenderMap([]);
    if (
      selectItem != null &&
      selectItem.paramsJson != null &&
      selectItem.paramsJson.length != null &&
      !!selectItem.paramsJson.length
    ) {
      console.log('initJson =>', JSON.parse(selectItem.paramsJson));

      //   解析content字段，如果是已有值，那么就替换默认值
      let contentJsonData = {};
      if (
        selectItem.contentJson != null &&
        selectItem.contentJson.length != null &&
        !!selectItem.contentJson.length
      ) {
        // debugger;

        // JSON.parse(selectItem.contentJson);

        if (selectItem.contentJson[0] === '{') {
          contentJsonData = JSON.parse(selectItem.contentJson);
        }

        // debugger;
        console.log('contentJsonData =>', contentJsonData);
        let jsonParamsArr = JSON.parse(selectItem.paramsJson);
        if (jsonParamsArr != null && jsonParamsArr.length != null && !!jsonParamsArr.length) {
          jsonParamsArr.forEach((item) => {
            if ('json' == item.type)
              contentJsonData[item.param] = JSON.stringify(contentJsonData[item.param]);
          });
        }
      }

      setJsonData(contentJsonData);

      //   构造渲染数据
      let renderData = [];

      if (contentJsonData != null) {
        for (let i in contentJsonData) {
          renderData.push({
            key: i,
            value: contentJsonData[i],
          });
        }
      }

      setRenderMap(renderData);
    }
  }, [selectItem]);

  const getSelectKey = (key) => {
    console.log('父组件获取选中key ', key);
    setSelectKey(key);
  };

  const getSelectItem = (item) => {
    console.log('父组件获取选中item ', item);
    setSelectItem(item);
  };

  const handleSave = () => {
    console.log('保存');

    console.log(jsonData);

    console.log({
      ...selectItem,
      contentJson: JSON.stringify(jsonData),
    });

    updateJson({
      ...selectItem,
      contentJson: JSON.stringify(jsonData),
    }).then((res) => {
      if (res.code === 0) {
        message.success('修改成功');

        // 调用刷新树形列表
        leftRef.current.refresh(selectItem.id);
      } else {
        message.error('服务器繁忙，请稍后再试！');
      }
    });
  };

  //   父组件接收数据改变，改变 content json 值，和 render 数据
  const emitData = (data) => {
    console.log('改变的值 =>', data);

    let copyJsonData = { ...jsonData };

    let jsonParamsArr = JSON.parse(selectItem.paramsJson);
    console.log('jsonParamsArr =>', jsonParamsArr);
    if (jsonParamsArr != null && jsonParamsArr.length != null && !!jsonParamsArr.length) {
      jsonParamsArr.forEach((item) => {
        if ('json' == item.type) {
          copyJsonData[item.param] = JSON.parse(copyJsonData[item.param]);
        } else {
          copyJsonData[item.param] = copyJsonData[item.param];
        }
      });
    }

    // for (let i in jsonData) {
    //   if (i === data.key) {
    //     copyJsonData[i] = JSON.parse(data.value);
    //   }
    // }

    console.log('copyJsonData', copyJsonData);

    setJsonData(copyJsonData);

    let copyRenderMap = [...renderMap].map((item) => {
      if (item.key === data.key) {
        return {
          key: item.key,
          value: data.value,
        };
      } else {
        return item;
      }
    });

    setRenderMap(copyRenderMap);
  };

  const validateData = () => {
    // 获取数据
    let val = validateFormRef.current.getFieldsValue();

    let resVariables = {};

    if (val.variables != null && JSON.parse(val.variables) != null) {
      // console.log('resVal', val.variables);

      resVariables = JSON.parse(val.variables);
      console.log('resVariables', resVariables);
      // debugger;
    } else {
      message.error('请输入正确的JSON数据');
      return;
    }

    let payload = {
      code: selectItem.code,
      variables: resVariables,
    };

    validateDataApi(payload).then((res) => {
      setValiLoading(false);
      if (res != null) {
        setResValue(JSON.stringify(res));
      }
    });
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        // border: '1px solid red',
        display: 'flex',
      }}
    >
      {/* 验证弹框 */}
      {validateModalVisible && (
        <>
          <Modal
            title="验证结果"
            visible={validateModalVisible}
            onCancel={() => {
              setResValue(null);
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
                    setResValue(null);
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
                    console.log('props =>', props);

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

      <div
        style={{
          flex: '0 0 360px',
          marginRight: '16px',
          backgroundColor: '#fff',
        }}
      >
        <LeftDataList
          ref={leftRef}
          getSelectKey={getSelectKey}
          getSelectItem={getSelectItem}
        ></LeftDataList>
      </div>
      <div
        style={{
          flex: '1',
          backgroundColor: '#fff',
        }}
      >
        {/* 右侧编辑区域 */}
        {/* 头部 */}
        <div
          style={{
            height: '48px',
            lineHeight: '48px',
            borderBottom: '1px solid #f1f2f4',
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
            {selectItem != null && selectItem.code != null && selectItem.name != null && (
              <>
                {
                  <span
                    style={{
                      width: '100%',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginLeft: '16px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {`${selectItem.code} / ${selectItem.name}`}
                  </span>
                }
              </>
            )}
          </div>
          <div
            style={{
              width: '150px',
              flex: '0 0 150px',
              display: 'flex',
              flexDirection: 'row-reverse',
              padding: '8px 16px',
            }}
          >
            <Button
              style={{ marginRight: '10px' }}
              type="primary"
              onClick={() => {
                handleSave();
              }}
              icon={<SaveOutlined />}
              disabled={renderMap.length != null && !!!renderMap.length}
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
                // if (selectItem.paramsJson === '' && selectItem.ruleJson === '') {
                //   message.error('请添加数据');
                //   return;
                // }

                setValidateModalVisible(true);
              }}
            >
              验证结果
            </Button>
          </div>
        </div>

        {/* 编辑部分 */}
        <div
          style={{
            // border: '1px solid red',
            height: 'calc(100vh - 145px)',
            width: '100%',
          }}
        >
          <div>
            <div
              style={{
                paddingTop: '16px',
              }}
            >
              {renderMap != null && renderMap.length != null && !!renderMap.length ? (
                // (
                //   <>
                //     {renderMap.map((item) => {
                //       return <EditItemCard emitData={emitData} initData={item}></EditItemCard>;
                //     })}
                //   </>
                // )

                <>
                  {renderMap.map((item) => {
                    return <EditItemCard emitData={emitData} initData={item}></EditItemCard>;
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
    </div>
  );
};

export default BusinessConf;
