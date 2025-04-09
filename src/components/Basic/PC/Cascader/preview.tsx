import { PcCascader as Cascader } from './index';

import React, { useEffect, useState, useRef } from 'react';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { DataSourceSetter } from '@designable/formily-setters';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
export const PcCascader: DnFC<{}> = observer((props) => {
  const [optionsData, setOptionsData] = useState<any>([]);
  const node = useTreeNode();

  const renderHandle = async () => {
    const data = await judgeSucessAndGetData(
      await createRequest(node.props?.requestUrl, node.props?.requestMethod)({}),
    );
    if (!data) return;
    if (data) {
      setOptionsData(data);
    }
  };
  useEffect(() => {
    renderHandle();
  }, [node.props?._var]);

  return (
    <div {...props}>
      <Cascader
        label={node.props?.label}
        options={optionsData ? optionsData : node.props?.options}
        requestUrl={node.props?.requestUrl}
        mode={node.props?.mode}
        required={node.props?.required}
        name={node.props?.name}
        placeholder={node.props?.placeholder}
        _var={{}}
      />
    </div>
  );
});

PcCascader.Behavior = createBehavior({
  name: 'PcCascader',
  selector: 'PcCascader',
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
            required: {
              //必填
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
            options: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
            },
            requestUrl: {
              // 请求接口
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
      title: '级联选择',
      settings: {
        label: '字段标签',
        name: '标识',
        required: '必填',
        requestUrl: '请求url',
        requestMethod: '请求类型',
        mode: '模式',
        options: '可选项',
      },
    },
  },
});

PcCascader.Resource = createResource({
  //默认值
  icon: 'CascaderSource',
  elements: [
    {
      componentName: 'PcCascader',
      props: {
        label: '级联选择',
        requestUrl: '',
        requestMethod: 'post',
        options: [
          {
            value: '浙江',
            label: '浙江',
            children: [
              {
                value: '杭州',
                label: '杭州',
                children: [
                  {
                    value: '西湖',
                    label: '西湖',
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  ],
});
