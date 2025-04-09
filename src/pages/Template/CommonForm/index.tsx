import React, { useState, useRef, useEffect } from 'react';
import { Form, Input, Row, Button, Select, message } from '@/components/base';
import { bizExecByCode } from '@/services/templateApi';
import style from "./index.less";

const ComponentsMap = { //组件映射
    Input,
    Select
}
const functionsMap = { //方法映射

}

/**
 * H5生成页面
 *
 * @param {*} props
 * @param {*} props.dataOption 组件列表数据
 * @return {*} 
 */
const TFOM: React.FC<{
    dataOption?: any;
    setOptionConfigView?: any;
}> = (props) => {
    props.route.children?.map((child) => {
        console.info("props.child", child)
    }
    )
    const formRef = useRef(null);


    // 获取页码数
    const [components, setComponents] = useState<any>([]);

    const handleBizExecByCode = async () => {

        let res = await bizExecByCode({ code: props.location.query.code });
        if (res.code === 0) {
            console.log(res.data, "表数据")
            setComponents(res.data._components)
        } else {
            message.error('处理失败请重试');
        }
    }

    useEffect(() => {
        /**
         *  加载
         */

        // handleBizExecByCode()
        formRef.current?.setFieldsValue(bizData)
    }, [])


    // 模拟接口数据
    const comData = [
        {
            type: 'Input',
            params: {
                name: "remark",
                label: "审批说明",
                rules: [{ required: true, message: '请输入111' }]

            }
        }, {
            type: 'Select',
            params: {
                name: "select",
            }
        }
    ]
    const bizData = {
        remark: "测试",
        table: ""

    }
    /**
     * 
     * @param item 匹配组件方法
     * @returns 
     */
    const opconfig = (item: any) => {
        let Component = undefined;
        Component = ComponentsMap[!!item ? item.type : ''];
        return (
            <Form.Item  {...item.params}>
                <Component  {...item.params} />
            </Form.Item>
        )

    }



    // 新建业务提交
    const handleAddSubmit = () => {
        if (
            formRef != null &&
            formRef.current != null &&
            formRef.current.getFieldsValue != null
        ) {
            formRef.current.validateFields().then((formData) => {
                console.log('提交参数 =>', formData);
            });
        }
    };
    return (
        <div>
            <Form
                ref={formRef}
            >
                {/* {
                    components ? components.map(item => {
                        return <div key={item.key}>{opconfig(item)}</div>
                    }) : null
                } */}
                {/* {props.route.children?.map((child) => { child.component })} */}
                <Form.Item name='remark'>
                    {props.children}
                </Form.Item>
            </Form>
            <Row>
                <Button type="primary" onClick={() => { handleAddSubmit() }}>提交</Button>
            </Row>
        </div>
    );
};

export default TFOM;
