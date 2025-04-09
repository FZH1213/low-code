import { Card } from 'antd';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
export const CardH5: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  console.info(node, props, 'card');
  return (
    <Card
      title={node?.props?.title}
      {...props} bordered={node?.props?.bordered}>
      {props.children}
    </Card>
  )

});

CardH5.Behavior = createBehavior({
  name: 'CardH5',
  selector: 'CardH5',
  designerProps: {
    droppable: true,
    propsSchema: {
      type: 'object',
      properties: {
        'field-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '字段属性',
          //formitem属性
          properties: {

            title: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          //input属性
          properties: {
            bordered: {
              //是否有边框
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            }
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '卡片',
      settings: {
        title: '卡片标题',
        bordered: '是否有边框',
      },
    },
  },
});

CardH5.Resource = createResource({
  //默认值
  icon: 'CardSource',
  elements: [
    {
      componentName: 'CardH5',
      props: {
        title: '卡片标题',
        bordered: true
      },
    },
  ],
});
