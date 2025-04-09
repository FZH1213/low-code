import { Button } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';

import { DataSourceSetter } from '@designable/formily-setters';
export const PcButtonLink: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Button {...props} type={node?.props?.type}>
      {node?.props?.title}
    </Button>
  );
});

PcButtonLink.Behavior = createBehavior({
  name: 'PcButtonLink',
  selector: 'PcButtonLink',
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
              enum: [
                { label: '返回上页', value: 'goBack' },
                { label: '普通跳转', value: 'defaulLink' },
                { label: '弹页跳转', value: 'openLink' },
                { label: '普通download', value: 'defaultDownLoad' },
                { label: '单选跳转', value: 'link' },
                { label: '单选get请求', value: 'get' },
                { label: '单选post请求', value: 'post' },
                { label: '单选download请求', value: 'download' },
                { label: '单选delect请求', value: 'delect' },
                // { label: '多选get请求', value: 'Mget' },
                { label: '多选post请求', value: 'Mpost' },
                { label: '抽屉取消关闭', value: 'cancel' },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'goBack',
              },
            },
            isBack: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            linkUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            formUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            linkParams: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
              'x-component-props': {
                defaultOptionValue: [
                  {
                    label: 'source',
                    value: 'id',
                  },
                  {
                    label: 'target',
                    value: 'id',
                  },
                ],
              },
            },
            linkQueryParams: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
              'x-component-props': {
                defaultOptionValue: [
                  {
                    label: 'source',
                    value: 'id',
                  },
                  {
                    label: 'target',
                    value: 'id',
                  },
                ],
              },
            },
            linkParamsSelf: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
              'x-component-props': {
                defaultOptionValue: [
                  {
                    label: 'filed',
                    value: '字段名',
                  },
                  {
                    label: 'value',
                    value: '值',
                  },
                ],
              },
            },
            fileID: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            wrapper: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            mType: {
              enum: [
                { label: '包裹字符串格式', value: 'string' },
                { label: '包裹字符串数组', value: 'stringarray' },
                { label: '包裹JSON字符串数组', value: 'JsonStringarray' },
                { label: '包裹对象数组', value: 'object' },
                { label: '包裹JSON对象数组', value: 'JsonObject' },
                { label: '直传数组对象', value: 'array' },
                { label: '直传JSON数组对象', value: 'JsonObjArray' },
                { label: '直传数组字符串', value: 'strArray' },
                { label: '直传JSON数组字符串', value: 'JsonStrArray' },
              ],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
            },
            disabled: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
              'x-component-props': {
                defaultOptionValue: [
                  {
                    label: 'filed',
                    value: '字段名',
                  },
                  {
                    label: 'value',
                    value: '值',
                  },
                ],
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
        formUrl: '请求url（行取）',
        linkParams: 'url传参(行取)',
        linkQueryParams: 'url传参(url取)',
        isBack: '是否提交后返回',
        disabled: '使用条件',
        linkParamsSelf: '自定义传参',
        mType: '多选传参类型',
        wrapper: '多选包装参数',
        fileID: '普通下载传ID',
      },
    },
  },
});

PcButtonLink.Resource = createResource({
  //默认值
  icon: '/pageDesign/submit.png',
  elements: [
    {
      componentName: 'PcButtonLink',
      props: {
        title: '跳转按钮',
        type: 'default',
        linkType: 'goBack',
        isBack: 'true',
        buttonType: 'PcButtonLink',
        mType: 'object',
      },
    },
  ],
});
