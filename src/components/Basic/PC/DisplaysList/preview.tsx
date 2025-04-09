import { List } from '@/components/base';
import React, { useEffect, useState, useRef } from 'react';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
import { history } from 'umi';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';

import { DataSourceSetter } from '@designable/formily-setters';
export const PcDisplaysList: DnFC<{}> = observer((props) => {
  const [searchValue, setSearchValue] = useState<any>(null);
  const [listDataSource, setlistDataSource] = useState<any>([]);
  const node = useTreeNode();
  const renderHandle = async (params) => {
    const data = await judgeSucessAndGetData(
      await createRequest(node.props?.requestUrl, node.props?.requestMethod)(params),
    );
    if (!data) return;
    if (data) {
      setlistDataSource(data);
    }
  };
  useEffect(() => {
    // setSearchValue({ ...history.location.query });
    // setSearchValue({ ...history.location.query, ...node.props?._var });
    // console.log('node.props?._var', node.props?._var);
    renderHandle({ ...searchValue });
  }, []);
  return (
    <List
      dataSource={listDataSource ? listDataSource : node.props?.dataSource}
      // dataSource={node.props?.dataSource}
      renderItem={(value) => <List.Item>{props.children}</List.Item>}
    ></List>
    // <List
    //   {...props}
    //   dataSource={node.props?.dataSource}
    // >
    //   {props.children}
    // </List>
  );
});

PcDisplaysList.Behavior = createBehavior({
  name: 'PcDisplaysList',
  selector: 'PcDisplaysList',
  designerProps: {
    droppable: true,
    propsSchema: {
      type: 'object',
      properties: {
        'component-group': {
          type: 'void',
          'x-component': 'ListlapseItem',
          title: '组件属性',
          properties: {
            dataSource: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
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
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '展示列表',
      settings: {
        dataSource: '数据',
        requestUrl: '查询url',
        requestMethod: '请求类型',
      },
    },
  },
});

PcDisplaysList.Resource = createResource({
  //默认值
  icon: '/pageDesign/DisplaysListIcon.png',
  elements: [
    {
      componentName: 'PcDisplaysList',
      props: {
        label: '展示列表',
        requestUrl: '',
        requestMethod: 'post',
      },
    },
  ],
});
