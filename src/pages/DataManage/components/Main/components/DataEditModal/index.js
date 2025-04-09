// 新增数据库弹框
// 需要入参刷新下方树形图的方法
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Row, Col, Form, Input, Select, Button, message } from 'antd';

import { editDataSource } from './service.js';

const DataEditModal = (props) => {
  const formRef = useRef(null);

  const [initData, setInitData] = useState(null);

  useEffect(() => {
    if (props.initialData != null) {
      setInitData(props.initialData);
    }
  }, [props.initialData]);

  useEffect(() => {
    // 回填表格初始数据
    if (initData != null && props.visible == true) {
      formRef.current.setFieldsValue({
        ...initData,
      });
      console.log('formRef =>', formRef);
      console.log('initData =>', initData);
    }
  }, [initData, props.visible]);

  //   点击确认提交
  const handleSubmit = () => {
    console.log('提交');

    console.log('formRef =>', formRef);

    if (formRef != null && formRef.current != null && formRef.current.getFieldsValue != null) {
      // console.log('表单数据 =>', formRef.current.getFieldsValue());

      formRef.current
        .validateFields()
        .then((value) => {
          console.log('value =>', value);

          // 合并参数
          let params = Object.assign({}, { ...initData }, { ...value });

          const updata = async () => {
            console.log('提交到接口的数据 =>', params);

            editDataSource(params).then((res) => {
              console.log('res =.', res);
              if (res.code === 0) {
                message.success('修改成功！');

                // 触发请求右上数据，以及触发刷新树形图
                props.finishEdit && props.finishEdit();

                props.close && props.close();
              }
            });
          };

          updata();
        })
        .catch((err) => {
          console.log(err);
        });

      // props.close != null && props.close();
    }

    // props.close != null && props.close();
  };

  //   label 渲染函数
  const getLabel = (str, require) => {
    return (
      <div
        style={{
          fontSize: '14px',
          //   paddingRight: '12px',
          width: '82px',
        }}
      >
        {require != null && require === true && (
          <span
            style={{
              fontSize: '16px',
              color: 'red',
              fontWeight: 'bold',
              paddingLeft: '2px',
              paddingRight: '2px',
            }}
          >
            *
          </span>
        )}
        <span>{str}</span>
      </div>
    );
  };

  return (
    <div>
      {props.visible && (
        <>
          <Modal
            className="data_source_add_modal_zxx1143"
            visible={props.visible}
            width={'480px'}
            onCancel={() => {
              props.close != null && props.close();
            }}
            title={
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                修改数据库
              </span>
            }
            bodyStyle={{
              padding: '16px 32px',
            }}
            footer={
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row-reverse',
                }}
              >
                <Button
                  type="primary"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  修改
                </Button>
                <Button
                  type="ghost"
                  style={{
                    marginRight: '8px',
                    color: '#86909C',
                  }}
                  onClick={() => {
                    props.close && props.close();
                  }}
                >
                  取消
                </Button>
                <Button
                  type="ghost"
                  style={{
                    color: '#86909C',
                  }}
                >
                  测试连通性
                </Button>
              </div>
            }
          >
            <>
              <Form ref={formRef}>
                <Form.Item
                  name="dbName"
                  label={getLabel('数据库名称', true)}
                  style={{ marginBottom: '12px' }}
                  // required={true}
                  rules={[{ required: true, message: '请输入数据库名称' }]}
                >
                  <Input></Input>
                </Form.Item>

                <Form.Item
                  name="dbUsername"
                  label={getLabel('用户名', true)}
                  style={{ marginBottom: '12px' }}
                  // required={true}
                  rules={[{ required: true, message: '请输入用户名' }]}
                >
                  <Input></Input>
                </Form.Item>

                <Form.Item
                  name="dbPassword"
                  label={getLabel('密码', true)}
                  style={{ marginBottom: '12px' }}
                  // required={true}
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input></Input>
                </Form.Item>

                <Form.Item
                  name="port"
                  label={getLabel('端口', true)}
                  style={{ marginBottom: '12px' }}
                  // required={true}
                  rules={[{ required: true, message: '请输入端口' }]}
                >
                  <Input type="number"></Input>
                </Form.Item>
                <Form.Item
                  // required={true}
                  name="ip"
                  label={getLabel('IP', true)}
                  style={{ marginBottom: '12px' }}
                  rules={[{ required: true, message: '请输入IP' }]}
                >
                  <Input></Input>
                </Form.Item>
                <Form.Item
                  name="dbType"
                  label={getLabel('数据库类型', true)}
                  style={{ marginBottom: '12px' }}
                  // required={true}
                  rules={[{ required: true, message: '请选择数据库类型' }]}
                >
                  <Select>
                    <Select.Option value="1">Mysql</Select.Option>
                    <Select.Option value="2">Hive</Select.Option>
                    <Select.Option value="3">Oracle</Select.Option>
                  </Select>
                </Form.Item>
                {/* <Form.Item name="" label={getLabel('数据来源', true)} style={{ marginBottom: '12px' }}>
                  <Input></Input>
                </Form.Item> */}
              </Form>
            </>
          </Modal>
        </>
      )}
    </div>
  );
};

export default DataEditModal;
