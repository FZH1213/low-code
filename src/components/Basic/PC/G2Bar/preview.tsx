import { PcG2Bar as Bar } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';

export const PcG2Bar: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <Bar
        requestUrl={node.props?.requestUrl}
        xField={node.props?.xField}
        yField={node.props?.yField}
        seriesField={node.props?.seriesField}
        _var={{}}
      />
    </div>
  );
});

PcG2Bar.Behavior = createBehavior({
  name: 'PcG2Bar',
  selector: 'PcG2Bar',
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
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '条形图',
      settings: {
        xField: 'x轴标识',
        yField: 'y轴标识',
        seriesField: '分类标识',
        requestUrl: '请求接口',
      },
    },
  },
});

PcG2Bar.Resource = createResource({
  //默认值
  icon: '/pageDesign/Arrow Bar.png',
  elements: [
    {
      componentName: 'PcG2Bar',
      props: {
        xField: 'value',
        yField: 'year',
        seriesField: 'year',
        requestUrl: '/api/bpm/bizDef/execByCode/sys._template.api.BarDate',
      },
    },
  ],
});
