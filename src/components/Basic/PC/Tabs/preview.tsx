// import { PcTabs as Tabs } from './index';
import { Tabs } from '@/components/base';

import React, { useEffect } from 'react';
import { observer } from '@formily/react';
import { TreeNode, createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { LoadTemplate } from '@/components/base/Designable/LoadTemplate';
export const PcTabs: DnFC<{}> & {
  PcTabItemType?: DnFC<{}>
} = observer((props) => {
  const node = useTreeNode();
  const items = []
  React.Children.map(props.children, (child: any, index) => {
    console.info("child", child)
    const item = {
      label: child.props.node.props.label,
      key: index, //ant的key加载好多问题
      children: child
    }
    items.push(item)
  })
  return (
    <>
      <Tabs
        items={items}
        {...props}
      >
      </Tabs>
      <LoadTemplate
        actions={[
          {
            title: "添加标签页",
            icon: 'AddColumn',
            onClick: () => {
              const column = new TreeNode({
                componentName: 'PcTabs.PcTabItemType',
                props: {
                  label: "标题"
                },
              }
              )
              node.append(column)
            },
          },
        ]}
      />
    </>
  );
});
PcTabs.PcTabItemType = observer((props) => {
  const node = useTreeNode()
  return (
    <div style={{
      width: '100%',
      minHeight: 200,
      border: '1px solid #ddd',
      padding: 10,
    }}
      {...props}
    >{props.children}
    </div>
  )
})
PcTabs.Behavior = createBehavior({
  name: 'PcTabs',
  selector: 'PcTabs',
  designerProps: {
    droppable: true,
    propsSchema: {
      type: 'object',
      properties: {

        'component-group': {
          type: 'void',
          'x-component': 'TabslapseItem',
          title: '组件属性',
          properties: {
            // dataSource: {
            //   'x-decorator': 'FormItem',
            //   'x-component': DataSourceSetter,
            // },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '标签页',
      settings: {
        // dataSource: '数据'
      },
    },
  },
},
  {
    name: 'PcTabs.PcTabItemType',
    selector: 'PcTabs.PcTabItemType',
    designerProps: {
      droppable: true,
      propsSchema: {
        type: 'object',
        properties: {
          'component-group': {
            type: 'void',
            'x-component': 'CollapseItem',
            title: '组件属性',
            //input属性
            properties: {
              label: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              }
            },
          },
        },
      },
    },
    designerLocales: {
      'zh-CN': {
        title: '标签项',
        settings: {
          label: "选项卡头显示文字"
        },
      },
    },
  }
);

PcTabs.Resource = createResource({
  //默认值
  icon: 'TabSource',
  elements: [
    {
      componentName: 'PcTabs',
      props: {
        label: '标签页',

      },
      children: [
        {
          componentName: 'PcTabs.PcTabItemType',
          props: {
            label: "标题"
          },
        },
      ]

    },
  ],
});
