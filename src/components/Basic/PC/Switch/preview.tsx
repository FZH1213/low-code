import { Switch, Form } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
export const PcSwitch: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Form.Item label={node.props?.label} {...props} >
      <Switch {...node.props} />
    </Form.Item>
  );
});

PcSwitch.Behavior = createBehavior({
  name: 'PcSwitch',
  selector: 'PcSwitch',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        'field-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '字段属性',
          //formitem属性
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
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          //input属性
          properties: {
            defaultChecked: {
              //默认值
              type: 'boolean',
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
      title: 'Switch开关',
      settings: {
        label: '字段标签',
        name: '标识',
        required: '必填',
        defaultChecked: '是否默认开启'
      },
    },
  },
});

PcSwitch.Resource = createResource({
  //默认值
  icon: 'SwitchSource',
  elements: [
    {
      componentName: 'PcSwitch',
      props: {
        label: '开关',
        defaultChecked: false
      },
    },
  ],
});
