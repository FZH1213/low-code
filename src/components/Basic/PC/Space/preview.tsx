import { PcSpace as Space } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
export const PcSpace: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Space
      align={node.props?.align}
      direction={node.props?.direction}
      size={node.props?.size}
      wrap={node.props?.wrap}
      {...props}
    >
      {props.children}
    </Space>
  );
});

PcSpace.Behavior = createBehavior({
  name: 'PcSpace',
  selector: 'PcSpace',
  designerProps: {
    droppable: true,
    propsSchema: {
      type: 'object',
      properties: {

        'component-group': {
          type: 'void',
          'x-component': 'SpacelapseItem',
          title: '组件属性',
          properties: {
            align: {
              type: 'string',
              enum: ['start', 'end', 'center', 'baseline'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'start',
              },
            },
            direction: {
              type: 'string',
              enum: ['vertical', 'horizontal'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'vertical',
              },
            },
            size: {
              type: 'string',
              enum: ['small', 'middle', 'large'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'small',
              },
            },
            wrap: {
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
      title: '间距',
      settings: {
        align: '对齐方式',
        direction: '间距方向',
        size: '间距大小',
        wrap: '是否换行'
      },
    },
  },
});

PcSpace.Resource = createResource({
  //默认值
  icon: '/pageDesign/space.png',
  elements: [
    {
      componentName: 'PcSpace',
      props: {
        label: '间距',
      },
    },
  ],
});
