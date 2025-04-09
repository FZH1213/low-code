import { PcTree as Tree } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcTree: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  // 显示搜索框
  return (
    <div {...props}>
      <Tree
        requestUrl={node.props?.requestUrl}
        placeholder={node.props?.placeholder}
        wrapper={node.props?.wrapper}
        _var={{}}
      />
    </div>
  );
});

PcTree.Behavior = createBehavior({
  name: 'PcTree',
  selector: 'PcTree',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          //input属性
          properties: {
            placeholder: {
              // 搜索占位符
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            requestUrl: {
              // 请求接口
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
            wrapper: {
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
      title: '树形选择',
      settings: {
        placeholder: '占位符',
        requestUrl: '请求url',
        wrapper: '点击事件变量包装名称',
      },
    },
  },
});

PcTree.Resource = createResource({
  //默认值
  icon: 'TreeSelectSource',
  elements: [
    {
      componentName: 'PcTree',
      props: {
        showSearch: true,
        placeholder: '请输入',
        requestUrl: '/api/bpm/bizDef/execByCode/sys._template.api.treeDateMock',
      },
    },
  ],
});
