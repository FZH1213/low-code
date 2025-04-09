import { Form, Input, Radio, Select, Tooltip } from '@/components/base';
import React, { forwardRef, useEffect, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { GLOBAL_VALUE } from '@/utils/globalValue';
export interface ComponentProps {
  /**
   * 操作类型编码
   * 1:新增
   * 2:编辑
   * 3:查看
   */
  operate?: number;
  /**
   * 用户数据
   */
  infoData?: any;

  ref?: any;
  company?: any;
  role?: any;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 22 },
};
const { Option } = Select;
const FunctionComponent: React.FC<ComponentProps> = forwardRef(
  ({ operate = 3, infoData, company, role }, ref) => {
    const [form] = Form.useForm();
    useEffect(() => {
      if (infoData) {
        // console.log("0000",infoData);

        form.setFieldsValue(infoData);
      }
    }, [infoData]);
    return (
      <>
        <Form {...layout} ref={ref} form={form}>
          <Form.Item name="userId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="userType"
            label="用户类型"
            rules={[{ required: true }]}
            initialValue="normal"
            hidden
          >
            <Radio.Group>
              <Radio.Button key="super" value="super">
                超级管理员
              </Radio.Button>
              <Radio.Button key="normal" value="normal">
                普通管理员
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="nickName"
            label="昵称"
            rules={[{ required: true, message: GLOBAL_VALUE.INPUT_PROMPT('昵称', 8), max: 8 }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="userName"
            label="登录名"
            rules={[{ required: true, message: GLOBAL_VALUE.INPUT_PROMPT('登录名', 20), max: 20 }]}
          >
            <Input disabled={operate !== 1} />
          </Form.Item>
          {operate === 1 && (
            <>
              <Form.Item
                name="password"
                label={
                  <>
                    <Tooltip title="大小写字母+数字+特殊字符包含4类中三种类型，长度为8位以上">
                      <ExclamationCircleOutlined style={{ color: 'grey' }} />
                    </Tooltip>
                    &nbsp;登录密码
                  </>
                }
                // 强密码(必须包含大小写字母和数字的组合，可以使用特殊字符，长度在 8-10之间)
                // rules={[{ required: true,  message: "请输入密码" , pattern: new RegExp('^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$'),}]}>
                rules={[
                  {
                    required: true,
                    message: '请输入大小写字母+数字+特殊字符包含4类中三种类型，长度为8位以上的密码',
                    pattern: new RegExp(
                      '^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,30}$',
                    ),
                  },
                ]}
              >
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
            </>
          )}

          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: false, message: GLOBAL_VALUE.INPUT_PROMPT('邮箱', 20, true) }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="手机号"
            rules={[
              {
                required: false,
                message: '请填写正确的手机号',
                pattern: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]} initialValue={1}>
            <Radio.Group>
              <Radio.Button key="0" value={0}>
                禁用
              </Radio.Button>
              <Radio.Button key="1" value={1}>
                正常
              </Radio.Button>
              <Radio.Button key="2" value={2}>
                锁定
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="userDesc"
            label="描述"
            rules={[{ required: false, message: '请输入描述' }]}
          >
            <Input.TextArea showCount maxLength={GLOBAL_VALUE.USER_TEXTAREA_MAX} />
          </Form.Item>
          {operate !== 2 && (
            <>
              {/* <Form.Item name="companyId" label="公司" rules={[{ required: true, message: '请选择公司' }]}>
              <Select
                showSearch
                allowClear
                optionFilterProp='children'
                placeholder="请选择"
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {company
                  ? company.map((item: any) => {
                    return (
                      <Option show={item['comName']} key={item['id']} value={item['id']}>
                        {item['comName']}
                      </Option>
                    );
                  })
                  : undefined}
              </Select>
            </Form.Item> */}
              <Form.Item
                label="角色"
                rules={[{ required: true, message: '请选择角色' }]}
                name="roleList"
              >
                <Select
                  showSearch
                  allowClear
                  mode="multiple"
                  optionFilterProp="children"
                  placeholder="请选择"
                  maxTagCount="responsive"
                  filterOption={(input, option: any) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {role
                    ? role.map((item: any) => {
                        return (
                          <Option
                            show={item['roleName']}
                            key={item['roleId']}
                            value={item['roleId']}
                          >
                            {item['roleName']}
                          </Option>
                        );
                      })
                    : undefined}
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </>
    );
  },
);

export default FunctionComponent;
