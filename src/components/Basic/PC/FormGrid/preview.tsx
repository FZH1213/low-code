import { Row, Col } from '@/components/base';
import React, { useEffect } from 'react';
import { observer } from '@formily/react';
import { TreeNode, createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { LoadTemplate } from '@/components/base/Designable/LoadTemplate';
import styles from './styles.less';
export const PcFormGrid: DnFC<{}> & {
  GridColumn?: DnFC<{}>;
} = observer((props) => {
  const node = useTreeNode();
  const items = [];
  React.Children.map(props.children, (child: any, index) => {
    const item = {
      props: child.props.node.props,
      key: index,
      children: child,
    };
    items.push(item);
  });
  const divStyle = {
    marginRight: '-1px',
    marginBottom: '-1px',
    minHeight: '50px',
    border: '1px dashed #ccc',
    backgroundColor: '#f5f5f5',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='12' fill='%23a2a9b6' text-anchor='middle' dominant-baseline='middle'%3E网格列%3C/text%3E%3C/svg%3E")`,
  };
  return (
    <div>
      <Row
        align={props?.align}
        justify={props?.justify}
        gutter={[props?.hgutter || 0, props?.vgutter || 0]}
        {...props}
      >
        {items.map((item) => (
          <Col
            style={item.children.props.node.children.length == 0 && divStyle}
            span={item.props.span}
            {...item.props}
          >
            {item.children.props.node.children.length == 0 ? <span></span> : item.children}
          </Col>
        ))}
      </Row>
      <LoadTemplate
        actions={[
          {
            title: '添加网格列',
            icon: 'AddColumn',
            onClick: () => {
              const column = new TreeNode({
                componentName: 'PcFormGrid.GridColumn',
                props: {
                  span: 8,
                },
              });
              node.append(column);
            },
          },
        ]}
      />
    </div>
  );
});
PcFormGrid.GridColumn = observer((props) => {
  const node = useTreeNode();
  return <div {...props}>{props.children}</div>;
});
PcFormGrid.Behavior = createBehavior(
  {
    name: 'PcFormGrid',
    selector: 'PcFormGrid',
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
              align: {
                type: 'string',
                enum: ['top', 'middle', 'bottom'],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  defaultValue: 'top',
                },
              },
              justify: {
                type: 'string',
                enum: ['start', 'end', 'center', 'space-around', 'space-between', 'space-evenly'],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  defaultValue: 'start',
                },
              },
              hgutter: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
              },
              vgutter: {
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
        title: '网格布局',
        settings: {
          align: '垂直对齐方式',
          justify: '水平排列方式',
          hgutter: '水平栅格间隔',
          vgutter: '垂直栅格间隔',
        },
      },
    },
  },
  {
    name: 'PcFormGrid.GridColumn',
    selector: 'PcFormGrid.GridColumn',
    designerProps: {
      droppable: true,
      propsSchema: {
        type: 'object',
        properties: {
          'component-group': {
            type: 'void',
            'x-component': 'CollapseItem',
            title: '组件属性',
            //input属性
            properties: {
              label: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
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
        title: '网格列',
        settings: {
          label: '网格列显示文字',
          span: '栅格占位格数',
          xs: 'xs 屏幕 < 576px',
          sm: 'sm 屏幕 ≥ 576px',
          md: 'md 屏幕 ≥ 768px',
          lg: 'lg 屏幕 ≥ 992px',
          xl: 'xl 屏幕 ≥ 1200px',
          xxl: 'xxl 屏幕 ≥ 1600px',
        },
      },
    },
  },
);

PcFormGrid.Resource = createResource({
  //默认值
  icon: 'GridSource',
  elements: [
    {
      componentName: 'PcFormGrid',
      props: {
        label: '网格布局',
      },
      children: [
        {
          componentName: 'PcFormGrid.GridColumn',
          props: {
            span: 8,
          },
        },
        {
          componentName: 'PcFormGrid.GridColumn',
          props: {
            span: 8,
          },
        },
        {
          componentName: 'PcFormGrid.GridColumn',
          props: {
            span: 8,
          },
        },
      ],
    },
  ],
});
