import { PcCol as Col } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
export const PcCol: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Col
      span={node.props?.span}
      xs={node.props?.xs}
      sm={node.props?.sm}
      md={node.props?.md}
      lg={node.props?.lg}
      xl={node.props?.xl}
      xxl={node.props?.xxl}
      {...props}
    >
      {props.children}
    </Col>
  );
});

PcCol.Behavior = createBehavior({
  name: 'PcCol',
  selector: 'PcCol',
  designerProps: {
    droppable: true,
    propsSchema: {
      type: 'object',
      properties: {

        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          properties: {
            span: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            xs: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            sm: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            md: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            lg: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            xl: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            xxl: {
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
      title: '列',
      settings: {
        span: '栅格占位格数',
        xs: 'xs 屏幕 < 576px',
        sm: 'sm 屏幕 ≥ 576px',
        md: 'md 屏幕 ≥ 768px',
        lg: 'lg 屏幕 ≥ 992px',
        xl: 'xl 屏幕 ≥ 1200px',
        xxl: 'xxl 屏幕 ≥ 1600px'
      },
    },
  },
});

PcCol.Resource = createResource({
  //默认值
  icon: '/pageDesign/view-column.png',
  elements: [
    {
      componentName: 'PcCol',
      props: {
        label: '列',
      },
    },
  ],
});
