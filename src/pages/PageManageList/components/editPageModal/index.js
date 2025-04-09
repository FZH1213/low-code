import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Form,
  Tree,
  Input,
  Space,
  Typography,
  Modal,
  Spin,
  Select,
  Row,
  Col,
  Table,
  Tag,
  Drawer,
  Popconfirm,
  Pagination,
  message,
} from 'antd';
import { EditPage } from './service';

// 编辑弹窗
const EditPageModal = (props) => {
  const formRef = useRef(null);
  const { recordData } = props;

  useEffect(() => {
    recordData && formRef?.current.setFieldsValue(recordData)
  }, [recordData]);

  const handleSubmit = () => {
    formRef.current.validateFields().then((value) => {
      let obj = {
        ...value,
        pageUrl: `/page-preview/${value.code}`,
      };
      EditPage({
        ...obj
      }).then((res) => {
        if (res.code === 0) {
          // 刷新列表
          props.refreshTable();
          // 关闭弹框
          props.onClose && props.onClose();
        }
      });
    });
  };

  // formItem布局
  const formItemLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 18
    }
  }


  return (
    <Modal
      width="50%"
      title="修改"
      visible={props.visible}
      onCancel={props.onClose}
      destroyOnClose={true}
      maskClosable={false}
      onOk={() => {
        handleSubmit();
      }}
    >
      <Form
        ref={formRef}
      >
        <Form.Item
          {...formItemLayout}
          name="id"
          label="id"
          hidden={true}
          rules={[{ required: false, message: '请输入id' }]}
          colon={false}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="code"
          label="页面code"
          rules={[{ required: true, message: '请输入页面code' }]}
          colon={false}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="name"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
          colon={false}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="pageJson"
          label="页面定义json"
          rules={[{ required: false, message: '页面定义json' }]}
          hidden={true}
          colon={false}
        >
          <Input.TextArea></Input.TextArea>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          name="pageUrl"
          label="页面url"
          rules={[{ required: true, message: '请输入页面url' }]}
          colon={false}
        >
          <Input
            disabled={true}
          ></Input>
        </Form.Item>
      </Form>
    </Modal >
  );
};

export default EditPageModal;
