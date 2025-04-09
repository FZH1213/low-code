import { PcG2Pie as Pie } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcG2Pie: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <Pie
        requestUrl={node.props?.requestUrl}
        angleField={node.props?.angleField}
        colorField={node.props?.colorField}
        radius={node.props?.radius}
        innerRadius={node.props?.innerRadius}
        _var={{}}
      />
    </div>
  );
});

PcG2Pie.Behavior = createBehavior({
  name: 'PcG2Pie',
  selector: 'PcG2Pie',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          properties: {
            angleField: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            colorField: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            radius: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            innerRadius: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            requestUrl: {
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
      title: '饼图',
      settings: {
        requestUrl: '请求接口',
        angleField: '值',
        colorField: '字段名',
        radius: '半径',
        innerRadius: '内半径',
        // xAxis: 'x轴配置',
        // yAxis: 'y轴配置'
      },
    },
  },
});

PcG2Pie.Resource = createResource({
  //默认值
  icon: '/pageDesign/pie-chart-2.png',
  elements: [
    {
      componentName: 'PcG2Pie',
      props: {
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6,
        requestUrl: '/api/bpm/bizDef/execByCode/sys._template.api.PieDate',
      },
    },
  ],
});
