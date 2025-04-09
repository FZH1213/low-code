import { Statistic, Form } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

export const PcDisplaysStatistic: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Form.Item label={node.props?.label} name={node.props?.name} {...props}>
      <Statistic
        title={
          <div>
            <span>{node.props?.title}</span>
            <Tooltip placement="top" title={node.props?.tooltipTitle}>
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        }
        value={node.props?.value}
      />
    </Form.Item>
  );
});

PcDisplaysStatistic.Behavior = createBehavior({
  name: 'PcDisplaysStatistic',
  selector: 'PcDisplaysStatistic',
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
            // label: {
            //   //标签
            //   type: 'string',
            //   'x-decorator': 'FormItem',
            //   'x-component': 'Input',
            // },
            title: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            tooltipTitle: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            hidden: {
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
            value: {
              //默认值
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            alignType: {
              enum: ['default', 'horizontal'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'default',
              },
            },
            fontSize: {
              enum: ['default', 'small'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'default',
              },
            },
            fontMode: {
              enum: ['default', 'light'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'default',
              },
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '统计数值',
      settings: {
        // label: '字段标签',
        title: '统计组件标题',
        name: '标识',
        hidden: '隐藏',
        value: '默认值',
        tooltipTitle: '文字提示',
        alignType: '对齐方式',
        fontSize: '数值文本大小',
        fontMode: '数值文本模式',
      },
    },
  },
});

PcDisplaysStatistic.Resource = createResource({
  //默认值
  icon: '/pageDesign/DisplaysStatisticIcon.png',
  elements: [
    {
      componentName: 'PcDisplaysStatistic',
      props: {
        label: '',
        title: '统计数值',
        name: 's1',
        value: '代码无数据',
        tooltipTitle: '统计数值文字提示',
        alignType: 'default',
        fontSize: 'default',
        fontMode: 'default',
      },
    },
  ],
});
