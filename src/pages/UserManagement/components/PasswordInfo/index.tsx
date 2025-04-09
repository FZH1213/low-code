import React, { forwardRef, useEffect, useState } from 'react';
import { Form, Input } from '@/components/base';

export interface ComponentProps {
  /**
   * 用户数据
   */
  infoData?: any;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const FunctionComponent: React.FC<ComponentProps> = forwardRef(({ infoData }, ref) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (infoData) {
      form.setFieldsValue(infoData);
    }
  }, [infoData]);

  return (
    <>
      <Form {...layout} ref={ref} form={form}>
        <Form.Item name="userId" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="userName" label="登录名" initialValue={infoData.userName}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="password" label="登录密码" rules={[{ required: true, message: "请输入大小写字母+数字+特殊字符包含4类中三种类型，长度为8位以上的密码", pattern: new RegExp('^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,30}$'), }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="passwordConfirm"
          dependencies={['password']}
          label="再次确认密码"
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </>
  );
});

export default FunctionComponent;
