import { PcVScatter as Scatter } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcVScatter: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <Scatter
        requestUrl={node.props?.requestUrl}
        yField={node.props?.yField}
        xField={node.props?.xField}
        colorField={node.props?.colorField}
        sizeField={node.props?.sizeField}
        height={node.props?.height}
        shape={node.props?.shape}
        xBaseline={node.props?.xBaseline}
        yBaseline={node.props?.yBaseline}
        sizeMin={node.props?.sizeMin}
        sizeMax={node.props?.sizeMax}
        _var={{}}
      />
    </div>
  );
});

PcVScatter.Behavior = createBehavior({
  name: 'PcVScatter',
  selector: 'PcVScatter',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          properties: {
            requestUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
            yField: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            xField: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            colorField: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            sizeField: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '存在为气泡图，空为散点图',
              },
            },
            xBaseline: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            yBaseline: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            sizeMin: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            sizeMax: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            height: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            shape: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              enum: [
                'circle',
                'square',
                'bowtie',
                'diamond',
                'hexagon',
                'triangle',
                'triangle-down',
                'hollow-circle',
                'hollow-square',
                'hollow-bowtie',
                'hollow-diamond',
                'hollow-hexagon',
                'hollow-triangle',
                'hollow-triangle-down',
                'cross',
                'tick',
                'plus',
                'hyphen',
                'line',
              ],
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '散点图',
      settings: {
        requestUrl: '请求接口',
        yField: 'y轴/值',
        xField: 'x轴/字段',
        colorField: '点颜色映射字段',
        sizeField: '点大小映射字段（存在为气泡图，空为散点图）',
        xBaseline: 'x象限分割基准线',
        yBaseline: 'y象限分割基准线',
        sizeMin: '气泡最小size',
        sizeMax: '气泡最大size',
        height: '高度',
        shape: '散点形状',
      },
    },
  },
});

PcVScatter.Resource = createResource({
  //默认值
  icon: '/pageDesign/VScatter.png',
  elements: [
    {
      componentName: 'PcVScatter',
      props: {
        requestUrl: '',
        yField: 'yField',
        xField: 'xField',
        colorField: 'colorField',
        sizeField: '',
      },
    },
  ],
});
