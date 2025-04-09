import { Input, Form } from 'antd';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
export const InputDemo: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  console.info(node, 'input');
  return (
    <Form.Item label={node.props?.label} {...props}>
      <Input placeholder={node.props?.placeholder} id={node.props?.label} {...node.props} />
    </Form.Item>
  );
});

InputDemo.Behavior = createBehavior({
  name: 'InputDemo',
  selector: 'InputDemo',
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
            placeholder: {
              //占位
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            // value: {
            //   //值
            //   type: 'string',
            //   'x-decorator': 'FormItem',
            //   'x-component': 'Input',
            // },
            type: {
              //类型
              type: 'string',
              enum: ['text', 'tel', 'password', 'number'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'text',
              },
            },
            disabled: {
              //不可用
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            readOnly: {
              //只读
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
              'x-component-props': {
                defaultClick: false,
              },
            },
            clearable: {
              //是否可清除
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            maxLength: {
              //字数
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
      title: '输入框',
      settings: {
        placeholder: '占位符',
        label: '字段标签',
        name: '标识',
        required: '必填',
        value: '值',
        disabled: '是否不可用',
        type: '类型',
        readOnly: '只读',
        clearable: '是否可清除',
        maxLength: '字数',
      },
    },
  },
});

InputDemo.Resource = createResource({
  //默认值
  icon: 'InputSource',
  elements: [
    {
      componentName: 'InputDemo',
      props: {
        // value: '123',
        placeholder: '请输入',
        label: 'input',
        readOnly: false,
      },
    },
  ],
});
