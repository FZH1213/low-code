import { Input, Form } from 'antd';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
const FormItemDemo: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  console.info(props, node.props, 'formitem');
  return (
    <Form.Item label={node.props?.label} {...props}>
      {props.children}
    </Form.Item>
  );
});

FormItemDemo.Behavior = createBehavior({
  name: 'InputDemo',

  selector: 'InputDemo',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        'field-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          properties: {
            name: {
              //字段
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            label: {
              //标签
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            required: {
              //必填
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '输入框测试1',
      settings: {
        placeholder: '占位符',
        label: '字段标签',
        name: '标识',
        required: '必填',
      },
    },
  },
});

FormItemDemo.Resource = createResource({
  icon: 'InputSource',
  elements: [
    {
      componentName: 'FormItemDemo',
      props: {
        label: '123123',
        // 'x-decorator': 'FormItem',
      },
    },
  ],
});
export default FormItemDemo;
