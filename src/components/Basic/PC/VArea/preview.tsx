import { PcVArea as Area } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcVArea: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <Area
        requestUrl={node.props?.requestUrl}
        yField={node.props?.yField}
        xField={node.props?.xField}
        height={node.props?.height}
        _var={{}}
      />
    </div>
  );
});

PcVArea.Behavior = createBehavior({
  name: 'PcVArea',
  selector: 'PcVArea',
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
      title: '面积图',
      settings: {
        requestUrl: '请求接口',
        yField: 'y轴/值',
        xField: 'x轴/字段',
        height: '高度',
      },
    },
  },
});

PcVArea.Resource = createResource({
  //默认值
  icon: '/pageDesign/VArea.png',
  elements: [
    {
      componentName: 'PcVArea',
      props: {
        requestUrl: '',
        yField: 'yField',
        xField: 'xField',
      },
    },
  ],
});
