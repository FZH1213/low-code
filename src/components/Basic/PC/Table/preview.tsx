import { PcTable as ProTable } from './index';
import { observer } from '@formily/react';
import { TreeNode, createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
// import {
//   DataSourceSetter,
// } from '@designable/formily-setters'
import {
  DataSourceSetter
} from './setters/index'
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
import { LoadTemplate } from '@/components/base/Designable/LoadTemplate';
export const PcTable: DnFC<{}> & {
  ToolBar?: DnFC<{}>
} & {
  OptionBar?: DnFC<{}>
} = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <ProTable
        columns={node.props?.columns}
        headerTitle={node.props?.headerTitle}
        pageSize={node.props?.pageSize}
        requestUrl={node.props?.requestUrl}
        requestMethod={node.props?.requestMethod}
        toolBarRender={props.children?.[0]}
        option={props.children?.[1]}
        search={node.props?.search}
      />

      <LoadTemplate
        actions={[
          {
            title: "增加上按钮栏按钮",
            icon: 'AddColumn',
            onClick: () => {
              const column = new TreeNode({
                componentName: 'PcListButtonLink',
                props: {
                  title: '跳转按钮',
                  type: 'link',
                  linkType: 'link',
                  linkParams: [
                    // {
                    //   source: 'id',
                    //   target: 'id'
                    // }
                  ],
                  marginLeft: 8,
                  isBack: 'true',
                }
              }
              )
              node.children[0].append(column)
            },
          },
        ]}
      />

      <LoadTemplate
        actions={[
          {
            title: "增加操作栏按钮",
            icon: 'AddColumn',
            onClick: () => {
              const column = new TreeNode({
                componentName: 'PcListButtonLink',
                props: {
                  title: '操作按钮',
                  type: 'link',
                  linkType: 'link',
                  linkParams: [
                    {
                      source: 'id',
                      target: 'id'
                    }
                  ],
                  isBack: 'true',
                  isPopconfirm: false,
                  popconfirmTitle: '标题',
                  popconfirmOkText: '确定',
                  popconfirmCancelText: '取消',
                  popconfirmIcon: 'ExclamationCircle',
                  backgroundColor: '#faad14',
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
            title: "增加操作栏抽屉",
            icon: 'AddColumn',
            onClick: () => {
              const column = new TreeNode({
                componentName: 'PcDrawer',
                props: {
                  title: '详情信息',
                  width: '50%',
                  placement: 'right',
                  requestUrl: '/page-preview/test1129.add1',
                  clickButton: '按钮名称',
                  styleType: 'link',
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
                    children: [
                      {
                        componentName: 'PcButton',
                        props: {
                          title: '提交',
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
                      },
                      {
                        componentName: 'PcButtonLink',
                        props: {
                          title: '返回',
                          type: 'default',
                          linkType: 'cancel',
                          isBack: 'true',
                          linkParams: [
                            // {
                            //   source: 'id',
                            //   target: 'id'
                            // }
                          ],
                        }
                      }
                    ]
                  }
                ],
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
PcTable.ToolBar = observer((props) => {

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
PcTable.OptionBar = observer((props) => {
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

PcTable.Behavior = createBehavior(
  {
    name: 'PcTable',
    selector: 'PcTable',
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
              headerTitle: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              columns: {
                'x-decorator': 'FormItem',
                'x-component': DataSourceSetter,
                'x-component-props': {
                  defaultOptionValue: [{
                    label: "title",
                    value: "标题"
                  }, {
                    label: "dataIndex",
                    value: "标识"
                  }, {
                    label: "search",
                    value: "是否查询"
                  }]
                },
              },
              rowKey: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              pageSize: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
              },
              requestUrl: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': Treeselect,
              },
              requestMethod: {
                enum: ['get', 'post'],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  defaultValue: 'post',
                },
              },
              search: {
                enum: ['true', 'false'],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
              },
              isPagination: {
                enum: ['true', 'false'],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
              },
              isShowToolBar: {
                enum: ['true', 'false'],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
              }
            },
          },
        },
      },
    },
    designerLocales: {
      'zh-CN': {
        title: '表格',
        settings: {
          headerTitle: '表头名称',
          columns: '选项',
          rowKey: '表格行id',
          pageSize: '每页数量',
          requestUrl: '查询url',
          requestMethod: '请求类型',
          search: '显示搜索',
          isPagination: '显示分页',
          isShowToolBar: '显示操作栏'
        },
      },
    },
  }, {
  name: 'PcTable.ToolBar',
  selector: 'PcTable.ToolBar',
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
            headerTitle: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '上按钮栏',
      settings: {
      },
    },
  },
}, {
  name: 'PcTable.OptionBar',
  selector: 'PcTable.OptionBar',
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

PcTable.Resource = createResource({
  //默认值
  icon: '/pageDesign/Table.png',
  elements: [
    {
      componentName: 'PcTable',
      props: {
        pageSize: 10,
        headerTitle: '人员信息',
        rowKey: 'id',
        requestUrl: '/api/bpm/bizDef/execByCode/sys._template.api.listPage',
        requestMethod: 'post',
        columns: [
          {
            title: '姓名',
            dataIndex: 'name',
            search: true
          },
          {
            title: '性别',
            dataIndex: 'sex',
            search: true,
          },
        ],
        search: 'true',
        isPagination: 'true',
        isShowToolBar: 'true',
      },
      children: [
        {
          componentName: 'PcTable.ToolBar',
          props: {
          },
        },
        {
          componentName: 'PcTable.OptionBar',
          props: {
          },
        }
      ],
    },
  ],
});
