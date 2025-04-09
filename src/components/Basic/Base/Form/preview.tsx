// import { BaseForm as Form } from './index';
import { Form } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';

export const BaseForm: DnFC<{}> = observer((props) => {
  const node: any = useTreeNode();
  // debugger;
  return (
    <Form
      style={{
        width: '100%',
        minHeight: 200,
        border: '1px solid #ddd',
        padding: 10,
      }}
      {...props}
      layout={node.props.layout}
      labelCol={{ span: node.props.labelCol }}
      wrapperCol={{ span: node.props.wrapperCol }}
    >
      {props.children}
    </Form>
  );
});

BaseForm.Behavior = createBehavior({
  name: 'BaseForm',
  selector: 'BaseForm',
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
            name: {
              //字段
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            requestUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
            // requestParams: {
            //   enum: ['id', 'code'],
            //   'x-decorator': 'FormItem',
            //   'x-component': 'Select',
            //   'x-component-props': {
            //     mode: 'tags'
            //   },
            // },
            layout: {
              enum: ['horizontal', 'vertical', 'inline'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
            },
            labelCol: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            wrapperCol: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '表单',
      settings: {
        requestUrl: '查询接口',
        requestParams: '查询入参',
        name: '标识',
        layout: '布局',
        labelCol: '标签网格宽度',
        wrapperCol: '组件网格宽度',
      },
    },
  },
});

BaseForm.Resource = createResource({
  //默认值
  icon: 'CardSource',
  elements: [
    {
      componentName: 'BaseForm',
      props: {
        layout: 'horizontal',
        labelCol: 6,
        wrapperCol: 12,
      },
    },
  ],
});
