import { Form } from '@/components/base';
import { Input } from 'antd';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';

const { TextArea } = Input;
export const PcTextArea: DnFC<{}> = observer((props) => {
    const node = useTreeNode();
    return (
        <Form.Item label={node.props?.label} {...props}>
            <TextArea placeholder={node.props?.placeholder} id={node.props?.label} {...node.props} />
        </Form.Item>
    );
});

PcTextArea.Behavior = createBehavior({
    name: 'PcTextArea',
    selector: 'PcTextArea',
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
                    //input属性
                    properties: {
                        placeholder: {
                            //占位
                            type: 'string',
                            'x-decorator': 'FormItem',
                            'x-component': 'Input',
                        },
                        maxLength: {
                            //字数
                            type: 'number',
                            'x-decorator': 'FormItem',
                            'x-component': 'NumberPicker',
                        },
                        showCount: {
                            //是否展示字数
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
            title: '文本输入框',
            settings: {
                placeholder: '占位符',
                label: '字段标签',
                name: '标识',
                required: '必填',
                hidden: '隐藏',
                maxLength: '字数',
                showCount: '是否展示字数',
            },
        },
    },
});

PcTextArea.Resource = createResource({
    //默认值
    icon: 'TextAreaSource',
    elements: [
        {
            componentName: 'PcTextArea',
            props: {
                placeholder: '请输入',
                label: '文本输入框',
            },
        },
    ],
});
