import { Button, Form, Input, message, Modal, Select, Space, TreeSelect } from "@/components/base"
import { useEffect, useRef, useState } from "react";
import { SubmitButton } from "@/components/base/form/Button";
import styles from './style.less'
import {
    updateOrg
} from '../../service';
import { judgeSucessAndGetMessage } from "@/utils/requestUtil";
const AddOrUpdateModal = (props): any => {
    const formRef = useRef<any>();
    const [pname, setPname] = useState<any>('')
    useEffect(() => {
        props.recordDetail && formRef?.current?.setFieldsValue({ name: props.recordDetail.title, ...props.recordDetail })
    }, [])
    const onFieldFinish = async (params: any) => {
        for (let key in params) {
            if (params[key] == undefined) {
                delete params[key];
            }
        }
        const [flag, msg] = await judgeSucessAndGetMessage(updateOrg({ ...params, pname: pname ? pname : props.recordDetail.pname, id: props.recordDetail.key }));
        if (flag) {
            message.success(msg || '操作成功');
            props.handleOrgUpdateCancel(1, { ...params, id: props.recordDetail.key, pname: pname ? pname : props.recordDetail.pname })
        } else {
            message.error(msg || '操作失败');
            btnSubmitRef.current.reset();
        }
    }
    const onFieldFail = () => {
        btnSubmitRef.current.reset();
    }
    const btnSubmitRef = useRef<any>();
    return (
        <Modal
            open={props.visible}
            title='编辑详情'
            maskClosable={false}
            destroyOnClose
            onCancel={() => props.handleOrgUpdateCancel(0, {})}
            footer={false}
        >
            <Form
                ref={formRef}
                name='form'
                layout="vertical"
                onFinish={onFieldFinish}
                onFinishFailed={onFieldFail}
            >
                <Form.Item
                    name="pid"
                    label="所属机构"
                    rules={[{ required: true, message: '请选择所属机构' }]}
                    colon={false}
                >
                    <TreeSelect
                        allowClear
                        placeholder="请选择"
                        treeData={props.treeSelectData}
                        showSearch
                        filterTreeNode={(input: any, node: any) => {
                            if (typeof node.title === 'string') {
                                if (node.title.indexOf(input) !== -1) {
                                    return true;
                                } else {
                                    return false;
                                }
                            } else {
                                if (node.name.indexOf(input) !== -1) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }}
                        onSelect={(value: any, node: any, extra: any) => {
                            node.title && setPname(node.title)
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="name"
                    label="机构名称"
                    rules={[{ required: true, message: '请填写机构名称' }]}
                    colon={false}
                >
                    <Input placeholder='请填写'></Input>
                </Form.Item>
                <Form.Item
                    name="type"
                    label="机构类型"
                    rules={[{ required: true, message: '请填写机构类型' }]}
                    colon={false}
                >
                    <Select
                        allowClear
                        options={props.orgTypeListData}
                    />
                </Form.Item>
                <div className={styles.cardAffix}>
                    <Space>
                        <Button onClick={() => props.handleOrgUpdateCancel(1, {})}>返回</Button>
                        <SubmitButton ref={btnSubmitRef}>提交</SubmitButton>
                    </Space>
                </div>
            </Form>
        </Modal>
    )

}
export default AddOrUpdateModal