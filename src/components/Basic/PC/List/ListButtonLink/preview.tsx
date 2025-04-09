import { Button } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';

import {
  DataSourceSetter,
} from '@designable/formily-setters'
// import { BackgroundStyleSetter } from '@designable/react-settings-form';

import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcListButtonLink: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return <Button style={{ marginLeft: node?.props?.marginLeft }} {...props} type={node?.props?.type}>{node?.props?.title}</Button>;
});


PcListButtonLink.Behavior = createBehavior({
  name: 'PcListButtonLink',
  selector: 'PcListButtonLink',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          //input属性
          properties: {
            title: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            type: {
              enum: ['primary', 'ghost', 'dashed', 'link', 'text', 'default'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'default',
              },
            },
            linkType: {
              enum: ['link', 'get', 'post', 'download', 'delect',],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'link',
              },
            },
            linkUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
            linkParams: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
              'x-component-props': {
                defaultOptionValue: [{
                  label: "source",
                  value: "id"
                }, {
                  label: "target",
                  value: "id"
                }]
              },
            },
            marginLeft: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            isBack: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            isPopconfirm: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            popconfirmTitle: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            popconfirmOkText: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            popconfirmCancelText: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            popconfirmIcon: {
              enum: ['ExclamationCircle', 'QuestionCircleOutlined'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'ExclamationCircle',
              },
            },
            backgroundColor: {
              // 'x-component': 'BackgroundStyleSetter',//这里使用颜色选择器，浏览器直接崩溃？
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            customLinkParams: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
              'x-component-props': {
                defaultOptionValue: [{
                  label: "source",
                  value: "id"
                }, {
                  label: "target",
                  value: "id"
                }]
              },
            },
            statusControltype: {
              enum: ['default', 'hidden', 'disabled', 'changeText',],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'default',
              },
            },
            statusControlConfig: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
              'x-component-props': {
                defaultOptionValue: [
                  {
                    label: "field",
                    value: "status"
                  },
                  {
                    label: "value",
                    value: "1"
                  }
                ]
              },
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '按钮',
      settings: {
        title: '按钮名称',
        type: '按钮类型',
        linkType: '功能类型',
        linkUrl: '请求url',
        linkParams: 'url传参(行取)',
        marginLeft: '按钮之间间隔',
        isBack: '是否提交后返回',
        isPopconfirm: '是否展示二次确认框',
        popconfirmTitle: '二次确认框标题',
        popconfirmOkText: '二次确认框确认按钮文字',
        popconfirmCancelText: '二次确认框取消按钮文字',
        popconfirmIcon: '二次确认框图标',
        backgroundColor: '二次确认框图标颜色',
        customLinkParams: '自定义url参数',
        statusControltype: '按钮控制类型',
        statusControlConfig: '按钮控制条件',
      },
    },
  },
});

PcListButtonLink.Resource = createResource({
  //默认值
  icon: '/pageDesign/submit.png',
  elements: [
    {
      componentName: 'PcListButtonLink',
      props: {
        title: '跳转按钮',
        type: 'link',
        linkType: 'link',
        linkParams: [
          {
            source: 'id',
            target: 'id'
          }
        ],
        marginLeft: 8,
        isBack: 'true',
        isPopconfirm: false,
        popconfirmTitle: '标题',
        popconfirmOkText: '确定',
        popconfirmCancelText: '取消',
        backgroundColor: '#faad14',
      },
    },
  ],
});
