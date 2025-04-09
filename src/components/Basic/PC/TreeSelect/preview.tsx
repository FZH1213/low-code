import { PcTreeSelect as TreeSelect } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { DataSourceSetter } from '@designable/formily-setters';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcTreeSelect: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  // debugger;
  return (
    <div {...props}>
      <TreeSelect
        treeData={node?.props?.treeData}
        requestUrl={node?.props?.requestUrl}
        requestType={node?.props?.requestType}
        label={node?.props?.label}
        required={node?.props?.required}
        name={node?.props?.name}
        placeholder={node?.props?.placeholder}
        _var={{}}
      />
    </div>
  );
});

PcTreeSelect.Behavior = createBehavior({
  name: 'PcTreeSelect',
  selector: 'PcTreeSelect',
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
            treeData: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
            },
            requestUrl: {
              // 请求接口
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
            requestType: {
              //请求类型
              type: 'string',
              enum: ['get', 'post'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'get',
              },
            }
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '树选择',
      settings: {
        label: '字段标签',
        name: '标识',
        required: '必填',
        requestUrl: '请求url',
        requestType: '请求类型',
        treeData: '数据项',
      },
    },
  },
});

PcTreeSelect.Resource = createResource({
  //默认值
  icon: 'TreeSelectSource',
  elements: [
    {
      componentName: 'PcTreeSelect',
      props: {
        label: '树选择',
        // requestUrl: 'aaa',
        requestType: 'post',
        // treeData: [{ id: 1, pId: 0, value: '1', title: 'Expand to load' },
        // { id: 2, pId: 0, value: '2', title: 'Expand to load' },
        // { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true },]
      },
    },
  ],
});
