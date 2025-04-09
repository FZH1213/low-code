import { Button } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';

import { DataSourceSetter } from '@designable/formily-setters';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
export const PcButton: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Button {...props} type={node?.props?.styleType}>
      {node?.props?.title}
    </Button>
  );
});

PcButton.Behavior = createBehavior({
  name: 'PcButton',
  selector: 'PcButton',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          properties: {
            title: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            styleType: {
              enum: ['primary', 'ghost', 'dashed', 'link', 'text', 'default'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
            },
            formName: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            requestUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
            queryParams: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
              'x-component-props': {
                defaultOptionValue: [
                  {
                    label: 'source',
                    value: 'id',
                  },
                  {
                    label: 'target',
                    value: 'id',
                  },
                ],
              },
            },

            type: {
              enum: ['submit', 'setVar', 'reSetVar'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'submit',
              },
            },
            wrapper: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            isExport: {
              enum: ['export', 'default'],
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
      title: '表单按钮',
      settings: {
        title: '按钮名称',
        formName: '绑定表单',
        styleType: '按钮样式',
        requestUrl: '请求接口',
        type: '按钮类型',
        wrapper: '包装名称',
        queryParams: '传参(url取)',
        isExport: '是否导出功能'
      },
    },
  },
});

PcButton.Resource = createResource({
  //默认值
  icon: '/pageDesign/submit.png',
  elements: [
    {
      componentName: 'PcButton',
      props: {
        title: '提交',
        label: 'PcButton',
        type: 'submit',
        requestUrl: '/api/bpm/bizDef/execByCode/biz.test.data.master.insertOrcreat',
        wrapper: 'bizMaps',
        styleType: 'default',
        queryParams: [
          {
            source: 'id',
            target: 'id',
          },
        ],
        isExport:'default'
      },
    },
  ],
});
