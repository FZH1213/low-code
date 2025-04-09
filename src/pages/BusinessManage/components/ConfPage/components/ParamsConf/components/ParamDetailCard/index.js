// 参数配置卡片
import React, { useState, useEffect, useRef } from 'react';

import { Form, Input, Select, TreeSelect } from 'antd';

import {
  PlusCircleOutlined,
  DeleteOutlined,
  CloseOutlined,
  EditOutlined,
  FormOutlined,
  SaveOutlined,
} from '@ant-design/icons';
const { Option } = Select;

const ParamsDetailCard = (props) => {
  const formRef = useRef(null);

  const [data, setData] = useState(null);

  //   编辑状态
  const [editing, setEditing] = useState(false);

  const [treeSelectOptions, setTreeSelectOptions] = useState([]);

  useEffect(() => {
    if (props.treeSelectOptions != null && props.treeSelectOptions.length != null) {
      setTreeSelectOptions(props.treeSelectOptions);
    }
  }, [props.treeSelectOptions]);

  useEffect(() => {
    console.log('参数配置卡片 =>', props);
    if (props.itemData != null) {
      setData(props.itemData);
    }
  }, [props.itemData]);

  useEffect(() => {
    if (data != null && formRef != null && formRef.current != null) {
      formRef.current.setFieldsValue(data);

      if (data.param === '') {
        setEditing(true);
      }
    }
  }, [data, formRef]);

  //   开启编辑状态
  const startEdit = () => {
    setEditing(true);
  };

  const save = () => {
    formRef.current.validateFields().then(() => {
      //   debugger;
      props.changeItem && props.changeItem({ ...data, ...formRef.current.getFieldsValue() });
      setEditing(false);
    });
  };

  const deleteItem = () => {
    props.deleteItem && props.deleteItem(data);
  };

  return (
    <>
      {data != null && (
        <div
          style={{
            border: '1px solid rgba(0,0,0,0.1)',
            marginLeft: '16px',
            marginRight: '16px',
            marginBottom: '16px',
          }}
        >
          {/* 头部 */}
          <div
            style={{
              height: '48px',
              lineHeight: '48px',
              display: 'flex',
              borderBottom: '1px solid #f1f2f4',
              backgroundColor: '#F7F8FA',
            }}
          >
            <div
              style={{
                marginLeft: '16px',
                fontSize: '14px',
                fontWeight: 'bold',
                flex: '1',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <span>{data.param}</span>
            </div>
            <div
              style={{
                flex: '0 0 200px',
                display: 'flex',
                flexDirection: 'row-reverse',
                fontSize: '16px',
                color: '#C9CDD4',
                paddingRight: '16px',
              }}
            >
              {/* 删除icon */}
              <div
                style={{
                  marginLeft: '16px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  deleteItem();
                }}
              >
                <CloseOutlined />
              </div>

              {/* 根据编辑状态切换的 编辑 和 保存 按钮*/}
              <div
                style={{
                  cursor: 'pointer',
                }}
              >
                {editing === false ? (
                  <>
                    {/* 编辑 */}
                    <FormOutlined
                      onClick={() => {
                        startEdit();
                      }}
                    />
                  </>
                ) : (
                  <>
                    {/* 保存 */}
                    <SaveOutlined
                      onClick={() => {
                        save();
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 表单内容 */}
          <Form ref={formRef}>
            <div>
              <div
                style={{
                  display: 'flex',
                  margin: '24px 12px 12px 12px',
                }}
              >
                <div
                  style={{
                    flex: '1',
                  }}
                >
                  <Form.Item
                    name={`param`}
                    label="参数code"
                    rules={[{ required: true, message: '请输入参数code' }]}
                  >
                    <Input disabled={editing === false ? true : false}></Input>
                    {/* <TreeSelect treeData={treeSelectOptions}></TreeSelect> */}
                  </Form.Item>
                </div>
                <div
                  style={{
                    width: '12px',
                  }}
                ></div>
                <div
                  style={{
                    flex: '1',
                  }}
                >
                  <Form.Item
                    name={`type`}
                    label="参数类型"
                    rules={[{ required: true, message: '请输入参数类型' }]}
                  >
                    <Select defaultValue="json" disabled={!editing}>
                      <Option value="json">json</Option>
                      <Option value="string">string</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div
                style={{
                  padding: '0px 12px 0px 12px',
                  marginTop: '-12px',
                }}
              >
                <Form.Item
                  name={`default`}
                  label={
                    <span
                      style={{
                        marginLeft: '26px',
                      }}
                    >
                      默认值
                    </span>
                  }
                >
                  <Input.TextArea disabled={editing === false ? true : false}></Input.TextArea>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default ParamsDetailCard;
