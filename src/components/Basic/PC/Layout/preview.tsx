import { PcLayout as Layout } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
export const PcLayout: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  console.info(node.props?.layout)
  return (
    <div  {...props}>
      <Layout
        layout={node.props?.layout}
      >
        {props.children}
      </Layout>
    </div>
  )

});

PcLayout.Behavior = createBehavior({
  name: 'PcLayout',
  selector: 'PcLayout',
  designerProps: {
    droppable: true,
    propsSchema: {
      type: 'object',
      properties: {
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          properties: {
            layout: {
              type: 'string',
              enum: ['Layout', 'Header', 'Sider', 'Content', 'Footer'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'Layout',
              },
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '布局',
      settings: {
        layout: '布局类型'
      },
    },
  },
});

PcLayout.Resource = createResource({
  //默认值
  icon: 'CardSource',
  elements: [
    {
      componentName: 'PcLayout',
      props: {
        layout: 'Layout'
      },
    },
  ],
});
