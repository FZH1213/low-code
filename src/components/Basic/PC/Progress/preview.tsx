import { Progress, Form } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';

export const PcProgress: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Form.Item label={node.props?.label} name={node.props?.name} {...props}>
      <Progress percent={node.props?.value} size={node.props?.size} {...node.props} />
    </Form.Item>
  );
});

PcProgress.Behavior = createBehavior({
  name: 'PcProgress',
  selector: 'PcProgress',
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
            hidden: {
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
            value: {
              //默认值
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            type: {
              enum: ['line', 'circle', 'dashboard'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'line',
              },
            },
            showInfo: {
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            size: {
              enum: ['default', 'small'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'default',
              },
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '进度条',
      settings: {
        name: '标识',
        hidden: '隐藏',
        value: '默认值',
        type: '进度条样式',
        showInfo: '是否显示数值',
        size: '大小',
      },
    },
  },
});

PcProgress.Resource = createResource({
  icon: '/pageDesign/ProgressIcon.png',
  elements: [
    {
      componentName: 'PcProgress',
      props: {
        label: '',
        showInfo: true,
      },
    },
  ],
});
