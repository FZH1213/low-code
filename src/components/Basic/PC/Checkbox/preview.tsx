import { Checkbox, Col, Form, Row } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import {
  DataSourceSetter,
} from '@designable/formily-setters'
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcCheckbox: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Form.Item label={node.props?.label} {...props}>
      {/* <Checkbox.Group options={node.props?.options} /> */}
      <Checkbox.Group style={{ width: '100%' }} >
        <Row>
          {node.props?.options.map((item) => (
            <Col span={node.props?.span ? node.props?.span : 6}>
              <Checkbox value={item.value}>{item.label}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </Form.Item>
  );
});

PcCheckbox.Behavior = createBehavior({
  name: 'PcCheckbox',
  selector: 'PcCheckbox',
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
            span: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
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
        'display-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '展示属性',
          properties: {
            isShowAll: {
              type: 'string',
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
      title: '多选框',
      settings: {
        label: '字段标签',
        name: '标识',
        required: '必填',
        options: '可选项',
        span: '子项占位栅格数',
        requestUrl: '请求url',
        optionRequstParams: '多选子项联动',
        isShowAll: '是否显示全选',
      },
    },
  },
});

PcCheckbox.Resource = createResource({
  //默认值
  icon: 'CheckboxGroupSource',
  elements: [
    {
      componentName: 'PcCheckbox',
      props: {
        label: '多选框',
        options: [{ label: "语文", value: "语文" }, { label: "数学", value: "数学" }],
        isShowAll: false,
      },
    },
  ],
});
