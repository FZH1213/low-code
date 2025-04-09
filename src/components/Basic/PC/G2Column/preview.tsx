import { PcG2Column as Column } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcG2Column: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <Column
        requestUrl={node.props?.requestUrl}
        padding={node.props?.padding}
        xField={node.props?.xField}
        yField={node.props?.yField}
        xAxis={node.props?.xAxis}
        yAxis={node.props?.yAxis}
        seriesField={node.props?.seriesField}
        _var={{}}
      />
    </div>
  );
});

PcG2Column.Behavior = createBehavior({
  name: 'PcG2Column',
  selector: 'PcG2Column',
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
            yField: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            seriesField: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            requestUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
            // xAxis: {
            //   type: 'string',
            //   'x-decorator': 'FormItem',
            //   'x-component': 'Input',
            // },
            // yAxis: {
            //   type: 'string',
            //   'x-decorator': 'FormItem',
            //   'x-component': 'Input',
            // },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '柱状图',
      settings: {
        xField: 'x轴标识',
        yField: 'y轴标识',
        seriesField: '分类标识',
        requestUrl: '请求接口',
        // xAxis: 'x轴配置',
        // yAxis: 'y轴配置'
      },
    },
  },
});

PcG2Column.Resource = createResource({
  //默认值
  icon: '/pageDesign/bar-chart-fall.png',
  elements: [
    {
      componentName: 'PcG2Column',
      props: {
        xField: 'year',
        yField: 'value',
        // xAxis: {
        //   type: 'time',
        // },
        // yAxis: {
        //   label: {
        //     // 数值格式化为千分位
        //     formatter: (v) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
        //   },
        // },
        seriesField: 'category',
        requestUrl: '/api/bpm/bizDef/execByCode/sys._template.api.LineDate',
      },
    },
  ],
});
