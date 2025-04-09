import { Form, Image } from 'antd';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { useState } from 'react';
export const PcImage: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  const [srcId, setSrcId] = useState(undefined);
  return (
    <Form.Item
      getValueProps={(value: any) => setSrcId(value)}
      label={node.props?.label}
      name={node.props?.name}
      {...props}
    >
      {srcId ? (
        <Image
          width={node.props?.width}
          height={node.props?.height}
          src={`/api/file/fileDown/downloadFileById?fileId=${node.props?.value}`}
          preview={node.props?.isPreview ? false : true}
        />
      ) : null}
    </Form.Item>
  );
});

PcImage.Behavior = createBehavior({
  name: 'PcImage',
  selector: 'PcImage',
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
          properties: {
            // value: {
            //     //默认值
            //     type: 'string',
            //     'x-decorator': 'FormItem',
            //     'x-component': 'Input',
            // },
            width: {
              //宽度
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            height: {
              //宽度
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            isPreview: {
              //必填
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '图片',
      settings: {
        // value: '图片默认值',
        name: '标识',
        label: '字段标签',
        required: '必填',
        hidden: '隐藏',
        isPreview: '禁用预览',
        width: '宽度',
        height: '高度',
      },
    },
  },
});

PcImage.Resource = createResource({
  //默认值
  icon: '/pageDesign/image.png',
  elements: [
    {
      componentName: 'PcImage',
      props: {
        width: 200,
      },
    },
  ],
});
