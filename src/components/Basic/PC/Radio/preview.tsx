import { Radio, Form, Row, Col, Checkbox } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import {
  DataSourceSetter,
} from '@designable/formily-setters'
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcRadio: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Form.Item label={node.props?.label} {...props}>
      {/* <Radio.Group options={node.props?.options} /> */}
      <Radio.Group style={{ width: '100%' }} >
        <Row>
          {node.props?.options.map((item) => (
            <Col span={node.props?.span ? node.props?.span : 6}>
              <Radio value={item.value}>{item.label}</Radio>
            </Col>
          ))}
        </Row>
      </Radio.Group>
    </Form.Item>
  );
});

PcRadio.Behavior = createBehavior({
  name: 'PcRadio',
  selector: 'PcRadio',
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
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '单选框',
      settings: {
        label: '字段标签',
        name: '标识',
        required: '必填',
        options: '可选项',
        span: '子项占位栅格数',
        requestUrl: '请求url',
        optionRequstParams: '单选子项联动',
      },
    },
  },
});

PcRadio.Resource = createResource({
  //默认值
  icon: 'RadioGroupSource',
  elements: [
    {
      componentName: 'PcRadio',
      props: {
        label: '单选框',
        options: [{ label: "语文", value: "语文" }, { label: "数学", value: "数学" }],
      },
    },
  ],
});
