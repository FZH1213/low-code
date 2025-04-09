// 参数编辑卡片
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, message, Modal, Form, Input, Spin } from 'antd';

import {
  PlusCircleOutlined,
  DeleteOutlined,
  CloseOutlined,
  EditOutlined,
  FormOutlined,
  SaveOutlined,
} from '@ant-design/icons';

const EditItemCard = (props) => {
  const formRef = useRef(null);

  // 编辑状态
  const [editing, setEditing] = useState(false);

  //   保存方法
  const save = () => {
    setEditing(false);

    props.emitData &&
      props.emitData({
        ...props.initData,
        value: formRef.current.getFieldsValue().inputValue,
      });
  };

  //   初始填充值
  useEffect(() => {
    if (
      props.initData != null &&
      formRef != null &&
      formRef.current != null &&
      formRef.current.setFieldsValue != null
    ) {
      formRef.current.setFieldsValue({
        inputValue: props.initData.value,
      });
    }
  }, [props.initData, formRef]);

  return (
    <div
      style={{
        border: '1px solid #F8F8F8',
        margin: '0px 16px 16px 16px',
        backgroundColor: '#F8F8F8',
      }}
    >
      {/* 头部 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '0px 16px',
          color: '#1C6DE8',
        }}
      >
        <div
          style={{
            height: '48px',
            lineHeight: '48px',
            fontSize: '16px',
            fontWeight: 'bold',
            flex: '1',
          }}
        >
          {props.initData.key}
        </div>

        {/* 头部右侧编辑icon */}
        <div
          style={{
            flex: '0 0 60px',
            display: 'flex',
            flexDirection: 'row-reverse',
            paddingTop: '12px',
          }}
        >
          <div>
            {editing != null && editing === true ? (
              <>
                {/* 保存icon */}
                <div
                  style={{
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#C9CDD4',
                  }}
                  onClick={() => {
                    save();
                  }}
                >
                  <span
                    style={{
                      marginRight: '3px',
                    }}
                  >
                    <SaveOutlined></SaveOutlined>
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* 编辑icon */}
                <div
                  style={{
                    cursor: 'pointer',
                    fontSize: '18px',
                    color: '#C9CDD4',
                  }}
                  onClick={() => {
                    setEditing(true);
                  }}
                >
                  <span
                    style={{
                      marginRight: '3px',
                    }}
                  >
                    <EditOutlined></EditOutlined>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 卡片中的输入域 */}
      <Form ref={formRef}>
        <div>
          <Form.Item
            style={{
              marginBottom: '16px',
              marginLeft: '16px',
              marginRight: '16px',
            }}
            name="inputValue"
          >
            <Input disabled={editing === true ? false : true}></Input>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default EditItemCard;
