import { PcVDualAxes as DualAxes } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcVDualAxes: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <DualAxes
        height={node.props?.height}
        requestUrl1={node.props?.requestUrl1}
        requestUrl2={node.props?.requestUrl2}
        xField={node.props?.xField}
        yField1={node.props?.yField1}
        geometry1={node.props?.geometry1}
        seriesField1={node.props?.seriesField1}
        yField2={node.props?.yField2}
        geometry2={node.props?.geometry2}
        seriesField2={node.props?.seriesField2}
        _var={{}}
      />
    </div>
  );
});

PcVDualAxes.Behavior = createBehavior({
  name: 'PcVDualAxes',
  selector: 'PcVDualAxes',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          properties: {
            xField: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            height: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            requestUrl1: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
            yField1: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            geometry1: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              enum: ['column', 'line'],
            },
            seriesField1: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            requestUrl2: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
            yField2: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            geometry2: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              enum: ['column', 'line'],
            },
            seriesField2: {
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
      title: '双轴图',
      settings: {
        requestUrl1: 'y1轴请求接口',
        requestUrl2: 'y2轴请求接口',
        yField1: 'y1轴/值',
        geometry1: 'y1轴类型',
        seriesField1: 'y1轴序列字段',
        yField2: 'y2轴/值',
        geometry2: 'y2轴类型',
        seriesField2: 'y2轴序列字段',
        xField: 'x轴/字段',
        height: '高度',
      },
    },
  },
});

PcVDualAxes.Resource = createResource({
  //默认值
  icon: '/pageDesign/VDualAxes.png',
  elements: [
    {
      componentName: 'PcVDualAxes',
      props: {
        requestUrl1: '',
        requestUrl2: '',
        xField: '',
        yField1: '',
        seriesField1: '',
        yField2: '',
        seriesField2: '',
      },
    },
  ],
});
