import { Form, Input, InputNumber, Radio, TreeSelect } from '@/components/base';
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
   *菜单树
   */
  menuTree?: any[];

  /**
   * 按钮信息
   */
  infoData?: string;
}

const { TreeNode } = TreeSelect;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 17 },
};

const FunctionComponent: React.FC<ComponentProps> = forwardRef(
  ({ operate = 3, infoData, menuTree }, ref) => {
    const [form] = Form.useForm();

    useEffect(() => {
      if (infoData) {
        form.setFieldsValue(infoData);
      }
    }, [infoData]);

    const loop = (data: any[]) => {
      return (
        data?.map((item) => (
          <TreeNode value={item.menuId} title={item.menuName}>
            {item.children && loop(item.children || [])}
          </TreeNode>
        )) || []
      );
    };

    const loopTree = (data: any[], root: boolean) => {
      if (root) {
        return [<TreeNode value="0" title="无" />, ...loop(data)];
      }
      return loop(data);
    };

    return (
      <>
        <Form {...layout} ref={ref} form={form}>
          <Form.Item name="actionId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="menuId" label="上级菜单" rules={[{ required: true }]}>
            <TreeSelect disabled> {loopTree(menuTree || [], true)}</TreeSelect>
          </Form.Item>
          <Form.Item name="actionCode" label="功能编码" rules={[{ required: true, message: GLOBAL_VALUE.INPUT_PROMPT('功能编码', 30), max: 30 }]}>
            <Input />
          </Form.Item>
          <Form.Item name="actionName" label="功能名称" rules={[{ required: true, message: GLOBAL_VALUE.INPUT_PROMPT('功能名称', 20), max: 20 }]}>
            <Input />
          </Form.Item>

          <Form.Item name="priority" label="优先级" initialValue={0}>
            <InputNumber />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue={1}>
            <Radio.Group>
              <Radio.Button key="0" value={0}>
                禁用
              </Radio.Button>
              <Radio.Button key="1" value={1}>
                启用
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="actionDesc" label="描述">
            <Input.TextArea showCount maxLength={GLOBAL_VALUE.TEXTAREA_MAX} />
          </Form.Item>
        </Form>
      </>
    );
  },
);

export default FunctionComponent;
