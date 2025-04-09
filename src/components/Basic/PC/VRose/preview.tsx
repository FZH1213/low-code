import { PcVRose as Rose } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcVRose: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <Rose
        requestUrl={node.props?.requestUrl}
        yField={node.props?.yField}
        xField={node.props?.xField}
        height={node.props?.height}
        _var={{}}
      />
    </div>
  );
});

PcVRose.Behavior = createBehavior({
  name: 'PcVRose',
  selector: 'PcVRose',
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
            height: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '玫瑰图图',
      settings: {
        requestUrl: '请求接口',
        yField: 'y轴/值',
        xField: 'x轴/字段',
        height: '高度',
      },
    },
  },
});

PcVRose.Resource = createResource({
  //默认值
  icon: '/pageDesign/VRose.png',
  elements: [
    {
      componentName: 'PcVRose',
      props: {
        requestUrl: '',
        yField: 'yField',
        xField: 'xField',
      },
    },
  ],
});
