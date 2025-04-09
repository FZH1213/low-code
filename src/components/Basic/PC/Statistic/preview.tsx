import { Statistic } from '@/components/base';
import React, { useEffect, useState, useRef } from 'react';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
import { history } from 'umi';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';

export const PcStatistic: DnFC<{}> = observer((props) => {
  const [searchValue, setSearchValue] = useState<any>(null);
  const [statisticData, setStatisticData] = useState<any>({});
  const [loading, setLoading] = useState<any>(true);
  const node = useTreeNode();
  const renderHandle = async (params) => {
    const data = await judgeSucessAndGetData(
      await createRequest(node.props?.requestUrl, node.props?.requestMethod)(params),
    );
    if (!data) return;
    if (data) {
      setStatisticData(data);
    }
    setLoading(false);
  };
  useEffect(() => {
    // setSearchValue({ ...history.location.query });
    setSearchValue({ ...history.location.query, ...node.props?._var });
    console.log('node.props?._var', node.props?._var);

    renderHandle({ ...searchValue });
  }, [node.props?._var]);
  return (
    <div {...props}>
      <Statistic
        // title={node.props?.label}
        title={
          JSON.stringify(statisticData) !== '{}' && statisticData.title
            ? statisticData.title
            : node.props?.label
        }
        value={statisticData.value ? statisticData.value : node.props?.value}
      />
    </div>
  );
});

PcStatistic.Behavior = createBehavior({
  name: 'PcStatistic',
  selector: 'PcStatistic',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        'field-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '字段属性',
          //formitem属性
          properties: {
            name: {
              //字段
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            label: {
              //标签
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            hidden: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
          },
        },
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          //input属性
          properties: {
            requestUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
            value: {
              //默认值
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
      title: '统计数值',
      settings: {
        label: '字段标签',
        name: '标识',
        hidden: '隐藏',
        requestUrl: '查询url',
        requestMethod: '请求类型',
        value: '默认值',
      },
    },
  },
});

PcStatistic.Resource = createResource({
  //默认值
  icon: 'StatisticSource',
  elements: [
    {
      componentName: 'PcStatistic',
      props: {
        label: '统计数值',
        name: 's1',
        requestUrl: '/api/bpm/bizDef/execByCode/test.statistics',
        requestMethod: 'post',
        value: '暂无数据',
      },
    },
  ],
});
