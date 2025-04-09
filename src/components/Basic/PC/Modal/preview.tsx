import { Modal, Button } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { useState } from 'react';
export const PcModal: DnFC<{}> = observer((props) => {
  const [isModalOpen, setisModalOpen] = useState<any>(false);
  const node = useTreeNode();
  const showModal = () => {
    setisModalOpen(true);
  };
  const handleCancel = () => {
    setisModalOpen(false);
  };
  const handleOk = () => {
    setisModalOpen(false);
  };
  return (
    <>
      <Button type={node.props?.styleType} onClick={showModal} {...props}>
        {node.props?.clickButton}
      </Button>
      <div
        style={{
          width: '100%',
          minHeight: 200,
          border: '1px solid #ddd',
          padding: 10,
        }}
      >
        {props?.children}
      </div>

      <Modal
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        title={node.props?.title}
        {...props}
        footer={null}
      >
        {props?.children}
      </Modal>
    </>
  );
});

PcModal.Behavior = createBehavior({
  name: 'PcModal',
  selector: 'PcModal',
  designerProps: {
    droppable: true,
    propsSchema: {
      type: 'object',
      properties: {
        'field-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '按钮属性',
          //formitem属性
          properties: {
            clickButton: {
              //字段
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            styleType: {
              enum: ['primary', 'ghost', 'dashed', 'link', 'text', 'default'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
            },
            // label: {
            //   //标签
            //   type: 'string',
            //   'x-decorator': 'FormItem',
            //   'x-component': 'Input',
            // },
            // hidden: {
            //   type: 'string',
            //   'x-decorator': 'FormItem',
            //   'x-component': 'Switch',
            // },
            // required: {
            //   //必填
            //   type: 'string',
            //   'x-decorator': 'FormItem',
            //   'x-component': 'Switch',
            // },
          },
        },
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '弹框属性',
          //input属性
          properties: {
            title: {
              //占位
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            // type: {
            //   //类型
            //   type: 'string',
            //   enum: ['text', 'tel', 'password', 'number'],
            //   'x-decorator': 'FormItem',
            //   'x-component': 'Select',
            //   'x-component-props': {
            //     defaultValue: 'text',
            //   },
            // },
            // maxLength: {
            //   //字数
            //   type: 'number',
            //   'x-decorator': 'FormItem',
            //   'x-component': 'NumberPicker',
            // },
            // value: {
            //   //默认值
            //   type: 'string',
            //   'x-decorator': 'FormItem',
            //   'x-component': 'Input',
            // },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '弹框',
      settings: {
        clickButton: '按钮名称',
        title: '弹框标题',
        styleType: '按钮样式',
        // label: '字段标签',
        // name: '标识',
        // required: '必填',
        // hidden: '隐藏',
        // type: '类型',
        // maxLength: '字数',
        // value:'默认值'
      },
    },
  },
});

PcModal.Resource = createResource({
  //默认值
  icon: '/pageDesign/modal.png',
  elements: [
    {
      componentName: 'PcModal',
      props: {
        clickButton: '打开弹框',
        title: '弹框',
        styleType: 'default',
      },
    },
  ],
});
