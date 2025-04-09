import { Input, Form } from 'antd';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
export const InputDemo: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  console.info(node.props);
  return (
    <Form.Item label={node.props?.label} {...props}>
      <Input placeholder={node.props?.placeholder} />
    </Form.Item>
  );
});

InputDemo.Behavior = createBehavior({
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
            key: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            label: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          properties: {
            placeholder: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
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
        key: '标识',
      },
    },
  },
});

InputDemo.Resource = createResource({
  icon: 'InputSource',
  elements: [
    {
      componentName: 'InputDemo',
      props: {
        label: '标签',
        // 'x-decorator': 'FormItem',
      },
    },
  ],
});
