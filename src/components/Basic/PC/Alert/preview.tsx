import { PcAlert as Alert } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';

export const PcAlert: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return <Alert {...props} {...node.props} />;
});

PcAlert.Behavior = createBehavior({
  name: 'PcAlert',
  selector: 'PcAlert',
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
            requestUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
          },
        },
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          //input属性
          properties: {
            message: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input.TextArea',
            },
            description: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input.TextArea',
            },
            type: {
              enum: ['success', 'info', 'warning', 'error'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'success',
              },
            },
            showIcon: {
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            closable: {
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            banner: {
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
      title: '告警提示',
      settings: {
        name: '标识',
        hidden: '隐藏',
        requestUrl: '校验告警接口',
        message: '告警信息',
        description: '告警详情',
        type: '告警类型',
        showIcon: '显示图标',
        closable: '是否允许关闭',
        banner: '是否存在边框',
      },
    },
  },
});

PcAlert.Resource = createResource({
  icon: '/pageDesign/AlertIcon.png',
  elements: [
    {
      componentName: 'PcAlert',
      props: {
        requestUrl: '',
      },
    },
  ],
});
