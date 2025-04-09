import { Input, Form } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import style from './index.less';
import { Pattern } from '../patternIndex';
export const PcInput: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Form.Item label={node.props?.label} {...props}>
      <Input placeholder={node.props?.placeholder} id={node.props?.label} disabled={node.props?.disabled} {...node.props} className={node.props?.disabled ? style.disabled : ''} />
    </Form.Item>
  );
});

PcInput.Behavior = createBehavior({
  name: 'PcInput',
  selector: 'PcInput',
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
            hidden: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            disabled: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            required: {
              //必填
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            pattern: {
              //校验规则
              'x-decorator': 'FormItem',
              'x-component': Pattern,
            },
            ruleMessage: {
              //必填校验提示语
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
            placeholder: {
              //占位
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
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
            maxLength: {
              //字数
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            value: {
              //默认值
              type: 'string',
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
      title: '输入框',
      settings: {
        placeholder: '占位符',
        label: '字段标签',
        name: '标识',
        hidden: '隐藏',
        disabled: '不可填写',
        required: '必填',
        pattern: '验证规则',
        ruleMessage: '校验提示语',
        type: '类型',
        maxLength: '字数',
        value: '默认值',
      },
    },
  },
});

PcInput.Resource = createResource({
  //默认值
  icon: 'InputSource',
  elements: [
    {
      componentName: 'PcInput',
      props: {
        placeholder: '请输入',
        label: '输入框',
      },
    },
  ],
});
