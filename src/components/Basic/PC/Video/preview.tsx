import { Form, Image } from 'antd';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { useState } from 'react';
import { VideoSetterInput } from './VideoInput';
export const PcVideo: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  const [srcId, setSrcId] = useState(undefined);
  return (
    <>
      {node.props?.useScense === '普通使用' ? (
        <video
          width={node.props?.width}
          src={node.props?.uploadUrl || ''}
          preload="auto"
          playsInline
          autoPlay={node.props?.autoPlay}
          loop={node.props?.loop}
          controls={node.props?.controls}
        ></video>
      ) : (
        <Form.Item
          getValueProps={(value: any) => setSrcId(value)}
          label={node.props?.label}
          name={node.props?.name}
          {...props}
        >
          {srcId ? (
            <video
              width={node.props?.width}
              src={`/api/file/fileDown/downloadFileById?fileId=${node.props?.value}`}
              preload="auto"
              playsInline
              autoPlay={node.props?.autoPlay}
              loop={node.props?.loop}
              controls={node.props?.controls}
            ></video>
          ) : null}
        </Form.Item>
      )}
    </>
  );
});

PcVideo.Behavior = createBehavior({
  name: 'PcVideo',
  selector: 'PcVideo',
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
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            required: {
              //必填
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            useScense: {
              //类型
              type: 'string',
              enum: ['普通使用', '表单受控'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: '普通使用',
              },
            },
          },
        },
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          properties: {
            width: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            uploadUrl: {
              'x-decorator': 'FormItem',
              'x-component': VideoSetterInput,
            },
            autoPlay: {
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            loop: {
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            controls: {
              type: 'boolean',
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
      title: '视频',
      settings: {
        name: '标识',
        label: '字段标签',
        required: '必填',
        hidden: '隐藏',
        width: '宽度',
        useScense: '使用场景',
        uploadUrl: '素材上传',
        autoPlay: '自动开始播放',
        loop: '循环播放',
        controls: '播放控件',
      },
    },
  },
});

PcVideo.Resource = createResource({
  //默认值
  icon: '/pageDesign/Video.png',
  elements: [
    {
      componentName: 'PcVideo',
      props: {
        useScense: '普通使用',
        uploadUrl: '',
      },
    },
  ],
});
