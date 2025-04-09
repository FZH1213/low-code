import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import ButtonUpload from './components/ButtonUpload';
import ImagesUpload from './components/ImagesUpload';
import DraggerUpload from './components/DraggerUpload';

export const PcUpload: DnFC<{}> = observer((props) => {
  const node = useTreeNode();

  if (node.props?.btnType === '图片') {
    return (
      <ImagesUpload node={node} params={props} />
    )
  } else if (node.props?.btnType === '推拽') {
    return (
      <DraggerUpload node={node} params={props} />
    )
  } else {
    return (
      <ButtonUpload node={node} params={props} />
    )
  };
});

PcUpload.Behavior = createBehavior({
  name: 'PcUpload',
  selector: 'PcUpload',
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
            fileName: {
              //占位
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
            btnType: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'enum': ['按钮', '图片', '推拽'],
              'x-component-props': {
                placeholder: '请选择文件类型',
                allowClear: true
              }
            },
          },
        },
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          //input属性
          properties: {
            accept: {
              //限制上传的文件类型
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'enum': ['pdf', 'excel', 'word', 'png', 'jpg', 'gif', 'txt', 'zip'],
              'x-component-props': {
                placeholder: '请选择文件类型',
                allowClear: true,
                mode: 'multiple',
              }
            },
            headers: {
              //设置上传的请求头部
              type: 'object',
              "x-hidden": true,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            action: {
              //上传的地址 
              type: 'string',
              "x-hidden": true,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            btype: {
              //上传的地址 
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            multiple: {
              //是否支持多选文件
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            maxCount: {
              //限制上传数量
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                type: 'number',
                min: 1,
                allowClear: true
              }
            },
            fileMax: {
              // 文件最大大小
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                type: 'number',
                allowClear: true
              }
            },
            disabled: {
              //是否支持多选文件
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
      title: '上传文件',
      settings: {
        label: '字段标签',
        name: '标识',
        required: '必填',
        fileName: '占位',
        btnType: '按钮显示类型',
        btype: '上传类型参数',

        maxCount: '限制上传数量',
        multiple: '是否支持多选文件',
        headers: '设置上传的请求头部',
        action: '上传的地址',
        accept: '文件类型',
        fileMax: '文件最大值（MB）',
        disabled: '禁止上传'
      },
    },
  },
});

PcUpload.Resource = createResource({
  //默认值
  icon: 'UploadSource',
  elements: [
    {
      componentName: 'PcUpload',
      props: {
        label: '上传文件',
        fileName: '上传文件',
        btnType: '按钮',
        _hasUid: true,
        action: '/api/file/fileInfo/upload',
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        btype: "LIST_OF_COMPLIANCE",
        maxCount: 1,
        name: 'file',
        fileMax: 3,
        disabled: false
      },
    },
  ],
});
