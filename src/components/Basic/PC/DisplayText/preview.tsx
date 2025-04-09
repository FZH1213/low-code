import { PcDisplayText as DisplayText } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
export const PcDisplayText: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div  {...props}>
      <DisplayText initialValue={node.props?.initialValue} {...node.props} />
    </div>
  );
});

PcDisplayText.Behavior = createBehavior({
  name: 'PcDisplayText',
  selector: 'PcDisplayText',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          properties: {
            initialValue: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input.TextArea',
            }
          },
        },
        'component-style': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件样式',
          //input属性
          properties: {
            'font': {
              'x-component': 'FontStyleSetter',
            },
          }
        }
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '展示文本',
      settings: {
        initialValue: '默认值',
        font: '字体'
      },
    },
  },
});

PcDisplayText.Resource = createResource({
  //默认值
  icon: 'TextAreaSource',
  elements: [
    {
      componentName: 'PcDisplayText',
      props: {
        label: '展示文本',
        initialValue: '展示文本',
      },
    },
  ],
});
