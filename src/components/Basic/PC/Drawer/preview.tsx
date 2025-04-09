// import { PcDrawer as Drawer } from './index';
import { observer } from '@formily/react';
import { TreeNode, createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { LoadTemplate } from '@/components/base/Designable/LoadTemplate';
import {
  DataSourceSetter,
} from '@designable/formily-setters'
import { Button, Drawer } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
export const PcDrawer: DnFC<{}> & {
  OptionBar?: DnFC<{}>
} & {
  Content?: DnFC<{}>
} = observer((props) => {
  const node = useTreeNode();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const iframe = () => {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {node.props?.iframeUrl != null && (
          <iframe src={node.props?.iframeUrl} frameBorder="0" style={{ width: '100%', height: '100%' }}></iframe>
        )}
      </div>
    )
  }

  return (
    <div {...props}>
      <Button type={node.props?.styleType} onClick={handleOpen} {...props}>
        {node.props?.clickButton}
      </Button>
      <Drawer
        placement={node.props?.placement}
        title={node.props?.title}
        width={node.props?.width}
        onClose={handleClose}
        open={open}
        footer={props.children?.[1]}
      // footer={props.children?.[1]} _var={undefined} styleType={'default'} clickButton={''} 
      />
      {/* {props.children?.[0]} */}
      {node.props?.iframeUrl ? iframe() : props.children?.[0]}
      <LoadTemplate
        actions={[
          {
            title: "增加表单按钮",
            icon: 'AddColumn',
            onClick: () => {
              const column = new TreeNode({
                componentName: 'PcButton',
                props: {
                  title: '确 定',
                  label: 'PcButton',
                  type: 'submit',
                  requestUrl: '/api/bpm/bizDef/execByCode/biz.test.data.master.insertOrcreat',
                  wrapper: 'bizMaps',
                  styleType: 'primary',
                  queryParams: [
                    // {
                    //   source: 'id',
                    //   target: 'id',
                    // },
                  ],
                  isExport: 'default'
                }
              }
              )
              node.children[1].append(column)
            },
          },
        ]}
      />

      <LoadTemplate
        actions={[
          {
            title: "增加按钮",
            icon: 'AddColumn',
            onClick: () => {
              const column = new TreeNode({
                componentName: 'PcButtonLink',
                props: {
                  title: '取 消',
                  type: 'default',
                  linkType: 'cancel',
                  isBack: 'true',
                  linkParams: [
                  ],
                }
              }
              )
              node.children[1].append(column)
            },
          },
        ]}
      />

    </div>

  );
});

PcDrawer.OptionBar = observer((props) => {
  console.info("OptionBar", props)

  const node = useTreeNode()
  return (
    <div
      {...props}>
      <div
        style={{
          // width: '100%',
          minHeight: 30,
          minWidth: 100,
          border: '1px solid #ddd'
        }}
      >{props.children}</div>
    </div>
  )
})
PcDrawer.Behavior = createBehavior(
  {
    name: 'PcDrawer',
    selector: 'PcDrawer',
    designerProps: {
      // droppable: true,
      propsSchema: {
        type: 'object',
        properties: {
          'component-group': {
            type: 'void',
            'x-component': 'CollapseItem',
            title: '组件属性',
            //input属性
            properties: {
              title: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              width: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              clickButton: {
                //字段
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              styleType: {
                enum: ['primary', 'ghost', 'dashed', 'link', 'text', 'default'],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
              },
              placement: {
                enum: ['top', 'right', 'bottom', 'left'],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  defaultValue: 'right',
                },
              },
              linkParams: {
                'x-decorator': 'FormItem',
                'x-component': DataSourceSetter,
                'x-component-props': {
                  defaultOptionValue: [{
                    label: "source",
                    value: "id"
                  }, {
                    label: "target",
                    value: "id"
                  }]
                },
              },
              iframeUrl: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              }
            },
          },
        },
      },
    },
    designerLocales: {
      'zh-CN': {
        title: '抽屉',
        settings: {
          title: '抽屉名称',
          width: '抽屉宽度',
          pageSize: '每页数量',
          placement: '抽屉的方向',
          linkParams: 'url传参(行取)',
          clickButton: '按钮名称',
          styleType: '按钮样式',
          iframeUrl: '内嵌页面url',
        },
      },
    },
  },
  {
    name: 'PcDrawer.Content',
    selector: 'PcDrawer.Content',
    designerProps: {
      droppable: true,
      draggable: false,
      deletable: false,
      propsSchema: {
        type: 'object',
        properties: {
          'component-group': {
            type: 'void',
            'x-component': 'CollapseItem',
            title: '组件属性',
            //input属性
            properties: {
            },
          },
        },
      },
    },
    designerLocales: {
      'zh-CN': {
        title: '抽屉内容',
        settings: {
        },
      },
    },
  },
  {
    name: 'PcDrawer.OptionBar',
    selector: 'PcDrawer.OptionBar',
    designerProps: {
      // droppable: true,
      draggable: false,
      deletable: false,
      propsSchema: {
        type: 'object',
        properties: {
          'component-group': {
            type: 'void',
            'x-component': 'CollapseItem',
            title: '组件属性',
            //input属性
            properties: {
            },
          },
        },
      },
    },
    designerLocales: {
      'zh-CN': {
        title: '操作栏',
        settings: {
        },
      },
    },
  }
);

PcDrawer.Resource = createResource({
  //默认值
  icon: '/pageDesign/drawer.png',
  elements: [
    {
      componentName: 'PcDrawer',
      props: {
        pageSize: 10,
        title: '详情信息',
        width: '50%',
        placement: 'right',
        clickButton: '抽屉按钮',
        styleType: 'link',
        linkParams: [
          {
            source: 'id',
            target: 'id'
          }
        ],
      },
      children: [
        {
          componentName: 'PcDrawer.Content',
          props: {
          },
        },
        {
          componentName: 'PcDrawer.OptionBar',
          props: {
          },
        }
      ],

    },
  ],
});
