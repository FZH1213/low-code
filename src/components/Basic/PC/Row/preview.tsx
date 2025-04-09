import { PcRow as Row } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
export const PcRow: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Row
      align={node.props?.align}
      justify={node.props?.justify}
      hgutter={node.props?.hgutter}
      vgutter={node.props?.vgutter}
      {...props}
    >
      {props.children}
    </Row>
  );
});

PcRow.Behavior = createBehavior({
  name: 'PcRow',
  selector: 'PcRow',
  designerProps: {
    droppable: true,
    propsSchema: {
      type: 'object',
      properties: {

        'component-group': {
          type: 'void',
          'x-component': 'RowlapseItem',
          title: '组件属性',
          properties: {
            align: {
              type: 'string',
              enum: ['top', 'middle', 'bottom'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'top',
              },
            },
            justify: {
              type: 'string',
              enum: ['start', 'end', 'center', 'space-around', 'space-between', 'space-evenly'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'start',
              },
            },
            hgutter: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            vgutter: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '行',
      settings: {
        align: '垂直对齐方式',
        justify: '水平排列方式',
        hgutter: '水平栅格间隔',
        vgutter: '垂直栅格间隔'
      },
    },
  },
});

PcRow.Resource = createResource({
  //默认值
  icon: '/pageDesign/rows.png',
  elements: [
    {
      componentName: 'PcRow',
      props: {
        label: '行',
      },
    },
  ],
});
