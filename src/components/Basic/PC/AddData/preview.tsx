import { Table, Form } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import style from './index.less';
import {
  DataSourceSetter,
} from '@designable/formily-setters'
export const PcAddData: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <Form.Item label={node.props?.label} {...props}>
      <Table columns={node.props?.columns} pagination={false} />
    </Form.Item>
  );
});

PcAddData.Behavior = createBehavior({
  name: 'PcAddData',
  selector: 'PcAddData',
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
          },
        },
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          properties: {
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
                  label: "type",
                  value: "单元格类型(Input、Select)"
                }, {
                  label: "requestUrl",
                  value: ""
                }, {
                  label: "connect",
                  value: "联动数据('{sourceFiled: targetFiled}')"
                }, {
                  label: "width",
                  value: "200px"
                }]
              },
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '追加元素',
      settings: {
        name: '标识',
        columns: '选项',
      },
    },
  },
});

PcAddData.Resource = createResource({
  //默认值
  icon: 'InputSource',
  elements: [
    {
      componentName: 'PcAddData',
      props: {
        columns: [
          {
            title: '姓名',
            dataIndex: 'name',
            type: 'Input',
            requestUrl: '',
            width: '200px',
          },
          {
            title: '性别',
            dataIndex: 'sex',
            type: 'Input',
            requestUrl: '',
            connect: '',
            width: '200px',
          },
        ],
      },
    },
  ],
});
