import { DatePicker, Form } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
export const PcDatePicker: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Form.Item label={node.props?.label} {...props}>
      <DatePicker
        placeholder={node.props?.placeholder}
        picker={node.props?.picker}
      />
    </Form.Item>
  );
});

PcDatePicker.Behavior = createBehavior({
  name: 'PcDatePicker',
  selector: 'PcDatePicker',
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
            picker: {
              //类型
              type: 'string',
              enum: ["date", "month", "year"],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'date',
              },
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '日期选择框',
      settings: {
        label: '字段标签',
        name: '标识',
        required: '必填',
        placeholder: '占位符',
        picker: "设置选择器类型",
      },
    },
  },
});

PcDatePicker.Resource = createResource({
  //默认值
  icon: 'DateRangePickerSource',
  elements: [
    {
      componentName: 'PcDatePicker',
      props: {
        label: '日期选择框',
      },
    },
  ],
});
