import { Input, Form, Button } from 'antd';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import request from '@/utils/request';
import { ACCESS_TOKEN_KEY } from '@/content/index';

export const ButtonH5: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return <Button {...props}>{node?.props?.title}</Button>;
});

//获取接口
const res = await request('/api/base/menu/getTreeByUserAuth', {
  method: 'get',
  headers: {
    Authorization: `Bearer ${window.localStorage.getItem(`${ACCESS_TOKEN_KEY}`)}`,
  },
});
let interfacearr: any[] = [];
res.data[0].children.map((item: any) => {
  interfacearr = [item.title, ...interfacearr];
});

ButtonH5.Behavior = createBehavior({
  name: 'ButtonH5',
  selector: 'ButtonH5',
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
          //input属性
          properties: {
            title: {
              //占位
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            disabled: {
              //不可用
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            interface: {
              type: 'string',
              enum: interfacearr,
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: interfacearr[0],
              },
            },
            method: {
              type: 'string',
              enum: ['GET', 'POST'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'GET',
              },
            },
            _eval_onClick: {
              type: 'string',
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
        label: '字段标签',
        name: '标识',
        value: '值',
        disabled: '是否不可用',
        interface: '选择接口',
        _eval_onClick: 'function',
        method: '请求方法',
      },
    },
  },
});

ButtonH5.Resource = createResource({
  //默认值
  icon: 'UploadSource',
  elements: [
    {
      componentName: 'ButtonH5',
      props: {
        // value: '123',
        title: '按钮',
        label: 'ButtonH5',
        interface: '/api/bpm/pageDef/list',
        _eval_onClick:
          '()=>{formDataSubmit(params.interface,params.method),console.log(params.interface)}',
      },
    },
  ],
});
