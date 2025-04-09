import { AutoComplete, Form } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
import { DataSourceSetter } from '@designable/formily-setters';
export const PcAutoComplete: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Form.Item label={node.props?.label} {...props}>
      <AutoComplete options={node.props?.options} />
    </Form.Item>
  );
});

PcAutoComplete.Behavior = createBehavior({
  name: 'PcAutoComplete',
  selector: 'PcAutoComplete',
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
          //AutoComplete属性
          properties: {
            options: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
            },
            requestUrl: {
              // 请求接口
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '自动完成',
      settings: {
        label: '字段标签',
        name: '标识',
        required: '必填',
        requestUrl: '请求url',
        options: '可选项',
      },
    },
  },
});

PcAutoComplete.Resource = createResource({
  //默认值
  icon: 'AutoCompleteSource',
  elements: [
    {
      componentName: 'PcAutoComplete',
      props: {
        label: '自动完成',
        options: [
          { label: '语文', value: '1' },
          { label: '数学', value: '2' },
        ],
      },
    },
  ],
});
