import { Rate, Form } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
export const PcRate: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Form.Item label={node.props?.label} {...props}>
      <Rate />
    </Form.Item>
  );
});

PcRate.Behavior = createBehavior({
  name: 'PcRate',
  selector: 'PcRate',
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
          properties: {

          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '评分',
      settings: {
        label: '字段标签',
        name: '标识',
        required: '必填'
      },
    },
  },
});

PcRate.Resource = createResource({
  //默认值
  icon: 'RateSource',
  elements: [
    {
      componentName: 'PcRate',
      props: {
        label: '评分',
      },
    },
  ],
});
