import { PcSelect as Select } from './index';

import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import {
  DataSourceSetter,
} from '@designable/formily-setters'
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcSelect: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <Select
        label={node.props?.label}
        options={node.props?.options}
        requestUrl={node.props?.requestUrl}
        mode={node.props?.mode}
        required={node.props?.required}
        name={node.props?.name}
        placeholder={node.props?.placeholder}
        _var={{}}
      />
    </div>
  );
});

PcSelect.Behavior = createBehavior({
  name: 'PcSelect',
  selector: 'PcSelect',
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
            mode: {
              //类型
              type: 'string',
              enum: ['', "multiple", "tags"],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: '',
              },
            },
          },
        },
        'connect-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '联动属性',
          properties: {
            optionRequstParams: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
              'x-component-props': {
                defaultOptionValue: [
                  {
                    label: "sourceFiled",
                    value: "联动字段名"
                  },
                  {
                    label: "targetFiled",
                    value: "传参字段名"
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
      title: '选择器',
      settings: {
        label: '字段标签',
        name: '标识',
        required: '必填',
        requestUrl: '请求url',
        mode: '模式',
        options: '可选项',
        optionRequstParams: '下拉选项内容联动',
      },
    },
  },
});

PcSelect.Resource = createResource({
  //默认值
  icon: 'SelectSource',
  elements: [
    {
      componentName: 'PcSelect',
      props: {
        label: '选择器',
        options: [{ label: "语文", value: "语文" }, { label: "数学", value: "数学" }],
      },
    },
  ],
});
