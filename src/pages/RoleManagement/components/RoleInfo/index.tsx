import { Form, Input, Radio, Select } from '@/components/base';
import React, { forwardRef, useEffect } from 'react';

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
   * 角色数据
   */
  infoData?: any;
  ref?: any;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const FunctionComponent: React.FC<ComponentProps> = forwardRef(({ operate = 3, infoData }, ref) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (infoData) {
      form.setFieldsValue(infoData);
    }
  }, [infoData]);

  return (
    <>
      <Form {...layout} ref={ref} form={form}>
        <Form.Item name="roleId" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="roleCode" label="角色编码" rules={[{ required: true, message: GLOBAL_VALUE.INPUT_PROMPT('角色编码', 20), max: 20 }]}>
          <Input />
        </Form.Item>
        <Form.Item name="roleName" label="角色名称" rules={[{ required: true, message: GLOBAL_VALUE.INPUT_PROMPT('角色名称', 20), max: 20 }]}>
          <Input />
        </Form.Item>

        <Form.Item name="status" label="状态" rules={[{ required: true }]} initialValue={0}>
          <Radio.Group>
            <Radio.Button key="0" value={0}>
              禁用
            </Radio.Button>
            <Radio.Button key="1" value={1}>
              启用
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="roleDesc" label="描述" rules={[{ required: false, message: '请输入描述' }]}>
          <Input.TextArea showCount maxLength={GLOBAL_VALUE.USER_TEXTAREA_MAX} />
        </Form.Item>
      </Form>
    </>
  );
});

export default FunctionComponent;
