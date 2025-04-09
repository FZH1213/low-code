import { PcCard as Card } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';

import { BackgroundStyleSetter } from '../../../base/Designable/BackgroundStyleSetter';

export const PcCard: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  console.info('node', node.props);
  return (
    <div {...props}>
      <Card
        title={node.props?.title}
        bordered={node.props?.bordered}
        size={node.props?.size}
        {...node.props}
        onClickLinkUrl={''} //防止设计时候点击跳转
      >
        {props.children}
      </Card>
    </div>
  );
});

PcCard.Behavior = createBehavior({
  name: 'PcCard',
  selector: 'PcCard',
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
            },
            size: {
              //类型
              type: 'string',
              enum: ['default', 'small'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'default',
              },
            },
            onClickLinkUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            onClickLinkNewtag: {
              type: 'string',
              enum: ['同一标签跳转', '新标签跳转'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: '',
              },
            },
          },
        },
        'component-style': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件样式',
          //input属性
          properties: {
            height: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'SizeInput',
            },
            background: {
              'x-component': BackgroundStyleSetter,
            },
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
        size: 'card 的尺寸',
        background: '背景',
        height: '高度',
        onClickLinkUrl: '点击跳转链接',
        onClickLinkNewtag: '跳转标签方式',
      },
    },
  },
});

PcCard.Resource = createResource({
  //默认值
  icon: 'CardSource',
  elements: [
    {
      componentName: 'PcCard',
      props: {
        title: '卡片标题',
        bordered: true,
      },
    },
  ],
});
