import { PcG2Gauge as Gauge } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcG2Gauge: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <Gauge requestUrl={node.props?.requestUrl} _var={{}} />
    </div>
  );
});

PcG2Gauge.Behavior = createBehavior({
  name: 'PcG2Gauge',
  selector: 'PcG2Gauge',
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
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '仪表盘',
      settings: {
        requestUrl: '请求接口',
      },
    },
  },
});

PcG2Gauge.Resource = createResource({
  //默认值
  icon: '/pageDesign/Gauge.png',
  elements: [
    {
      componentName: 'PcG2Gauge',
      props: {
        requestUrl: '/api/bpm/bizDef/execByCode/sys._template.api.GaugeDate',
      },
    },
  ],
});
