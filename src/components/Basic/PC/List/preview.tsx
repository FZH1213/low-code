// import { PcList as List } from './index';
// import { List } from '@/components/base';
import { ProList } from '@ant-design/pro-components';
import { observer } from '@formily/react';
import { TreeNode, createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { LoadTemplate } from '@/components/base/Designable/LoadTemplate';

// import {
//   DataSourceSetter,
// } from '@designable/formily-setters'
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
import styles from './index.less'
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { history } from 'umi';
import React, { useEffect, useState, useRef } from 'react';

export const PcList: DnFC<{}> & {
  ToolBar?: DnFC<{}>
} & {
  Content?: DnFC<{}>
} & {
  OptionBar?: DnFC<{}>
} = observer((props) => {
  const node = useTreeNode();
  const [searchValue, setSearchValue] = useState<any>(null);
  const [dataList, setDataList] = useState<any>(null);

  useEffect(() => {
    setSearchValue({ ...history.location.query, ...node.props?._var });
    renderHandle({ ...searchValue })
  }, [node.props?._var]);

  const renderHandle = async (params) => {
    const data = await judgeSucessAndGetData(await createRequest(node.props?.requestUrl, node.props?.requestMethod)(params));
    if (!data) return;
    setDataList(data.records)
    // setDataList(data.records.slice(0, 1))
  }

  return (
    <div {...props} className={styles.container}>
      <ProList
        size={node.props?.size}
        toolBarRender={() => {
          return [props.children?.[0],]
        }}
        dataSource={dataList}
        rowKey={node.props?.rowKey}
        headerTitle={node.props?.headerTitle}
        // request={(params = {}, sort, filter) => {
        //   return createRequest(node.props?.requestUrl, node.props?.requestMethod)(params);
        // }}
        pagination={{ pageSize: node.props?.pageSize }}
        metas={{
          content: {
            dataIndex: 'content',
            render: (_, row) => {
              //   console.log('props.children111',props.children)
              // return (
              //   props.children
              //   // () => props.children?.[1]
              // )
              let arr = []
              if (props.children) {
                if (Array.isArray(props.children)) {
                  props.children.map((item: any, index: any) => {
                    // console.log('item.props.node.componentName', item.props.node.componentName);
                    if (item.props.node.componentName == "PcList.ToolBar" || item.props.node.componentName == "PcList.OptionBar") {
                    } else {
                      arr.push(item)
                    }
                  })
                }
              }
              return arr;
            }
          },
          actions: {
            // cardActionProps: 'actions',
            render: (_, row) => {
              let arr = []
              if (props.children) {
                if (Array.isArray(props.children)) {
                  props.children.map((item: any, index: any) => {
                    // console.log('item.props.node.componentName', item.props.node.componentName);
                    if (item.props.node.componentName == "PcList.OptionBar") {
                      arr.push(item)
                    } else {
                    }
                  })
                }
              }
              return arr;
            }
          }
        }}
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
                }
              }
              )
              node.children[2].append(column)
            },
          },
        ]}
      />

    </div>
  );
});

PcList.ToolBar = observer((props) => {

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

PcList.Content = observer((props) => {

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

PcList.OptionBar = observer((props) => {
  console.info("OptionBar", props)

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

PcList.Behavior = createBehavior({
  name: 'PcList',
  selector: 'PcList',
  designerProps: {
    // droppable: true,
    propsSchema: {
      type: 'object',
      properties: {
        'component-group': {
          type: 'void',
          'x-component': 'ListlapseItem',
          title: '组件属性',
          properties: {
            headerTitle: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            // dataSource: {
            //   'x-decorator': 'FormItem',
            //   'x-component': DataSourceSetter,
            //   'x-component-props': {
            //     defaultOptionValue: [
            //       {
            //         label: '商品信息',
            //         value: 'info',
            //       },
            //       {
            //         label: '订单售后状态',
            //         value: 'status',
            //       },
            //       {
            //         label: '实收金额',
            //         value: 'yuan',
            //       },
            //       {
            //         label: '买家/收货人',
            //         value: 'remark',
            //       },
            //       {
            //         label: '配送时间',
            //         value: 'date',
            //       },
            //     ],
            //   },
            // },
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
            size: {
              enum: ['small', 'default', 'large'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'default',
              },
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '列表',
      settings: {
        headerTitle: '列表标题',
        // dataSource: '数据',
        rowKey: '列表行id',
        pageSize: '每页数量',
        requestUrl: '查询url',
        requestMethod: '请求类型',
        size: '显示大小',
      },
    },
  },
},
  {
    name: 'PcList.ToolBar',
    selector: 'PcList.ToolBar',
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
  name: 'PcList.Content',
  selector: 'PcList.Content',
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
      title: '列表内容',
      settings: {
      },
    },
  },
},
  {
    name: 'PcList.OptionBar',
    selector: 'PcList.OptionBar',
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
  },
);

PcList.Resource = createResource({
  //默认值
  icon: '/pageDesign/list.png',
  elements: [
    {
      componentName: 'PcList',
      props: {
        pageSize: 10,
        headerTitle: '列表信息',
        label: '列表',
        rowKey: 'id',
        requestUrl: '/api/bpm/bizDef/execByCode/test.prolist',
        requestMethod: 'post',
        // dataSource: [
        //   {
        //     label: '商品信息',
        //     value: 'info',
        //   },
        //   {
        //     label: '订单售后状态',
        //     value: 'status',
        //   },
        //   {
        //     label: '实收金额',
        //     value: 'yuan',
        //   },
        //   {
        //     label: '买家/收货人',
        //     value: 'remark',
        //   },
        //   {
        //     label: '配送时间',
        //     value: 'date',
        //   },
        // ],
        size: 'default',
      },
      children: [
        {
          componentName: 'PcList.ToolBar',
          props: {
          },
        },
        {
          componentName: 'PcList.Content',
          props: {
          },
          children: [
            {
              componentName: 'BaseForm',
              props: {
              },
            }
          ]
        },
        {
          componentName: 'PcList.OptionBar',
          props: {
          },
        },
      ],
    },
  ],
});
