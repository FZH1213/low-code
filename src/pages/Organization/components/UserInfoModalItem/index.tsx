import { Button, Form, message, Modal, Select, Space } from "@/components/base"
import { SubmitButton } from "@/components/base/form/Button";
import { useEffect, useRef, useState } from "react";
import styles from './style.less'
import {
    addRoleUser, updateRoleUser
} from '../../service';
import { judgeSucessAndGetMessage } from "@/utils/requestUtil";
const UserInfo = (props) => {
    //角色列表
    const [role, setRole] = useState<any>([]);
    const formRef = useRef<any>();
    useEffect(() => {
        if (props.recordDetail) {
            formRef?.current?.setFieldsValue({ ...props.recordDetail })
        } else {
            props.currentOrg && formRef?.current?.setFieldsValue({ 'orgId': props.currentOrg.id })
        }
    }, [])
    const onFieldFinish = async (params: any) => {
        let userName: any = []
        let flag1 = Array.isArray(params.userId)
        props.userNameList && props.userNameList.map((item: any, index: any) => {
            if (flag1) {
                for (let key in params.userId) {
                    if (item.value == params.userId[key]) {
                        userName.push(item.label)
                    }
                }
            } else {
                if (item.value == params.userId) {
                    userName = item.label
                }
            }
        })
        for (let key in params) {
            if (params[key] == undefined) {
                delete params[key];
            }
        }
        const [flag, msg] = await judgeSucessAndGetMessage(
            props.recordDetail ?
                updateRoleUser({ ...params, id: props.recordDetail.id, userName })
                :
                addRoleUser({ ...params, userName })
        );
        if (flag) {
            message.success(msg || '操作成功');
            props.handleUserInfoCancel(1)
        } else {
            message.error(msg || '操作失败');
            btnSubmitRef.current.reset();
        }
    }
    const onFieldFail = () => {
        btnSubmitRef.current.reset();
    }
    //获取角色列表方法
    const rolelist = () => {
        let arr: any = []
        props.roleList && props.roleList.map((item: any, index: any) => {
            let obj: any = {}
            obj['label'] = item.roleName
            // obj['value'] = item.roleName
            obj['value'] = item.roleId
            arr.push(obj)
        })
        setRole(arr)
    };
    // 初始化
    useEffect(() => {
        rolelist();
    }, [props]);
    const btnSubmitRef = useRef<any>();

    return (
        <Modal
            open={props.visible}
            title={props.title ? props.title : 'Title'}
            maskClosable={false}
            destroyOnClose
            footer={false}
            onCancel={() => props.handleUserInfoCancel(0)}
        >
            <Form
                ref={formRef}
                layout="vertical"
                name="form"
                onFinish={onFieldFinish}
                onFinishFailed={onFieldFail}
            >
                <Form.Item
                    name="orgId"
                    label="机构"
                    rules={[{ required: true, message: '请选择机构' }]}
                    colon={false}
                >
                    <Select
                        allowClear
                        options={[{
                            label: props.currentOrg.name,
                            value: props.currentOrg.id
                        }]}
                        disabled={true}
                        showArrow={false}
                    />
                </Form.Item>
                <Form.Item
                    name="userId"
                    label="登录名"
                    rules={[{ required: true, message: '请填写登录名' }]}
                    colon={false}
                >
                    <Select
                        allowClear
                        mode={props.recordDetail ? undefined : 'multiple'}
                        options={props.userNameList}
                        filterOption={(input: any, option: any) =>
                            (option?.label ?? '').includes(input)
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="roleId"
                    label="角色"
                    rules={[{ required: true, message: '请选择角色' }]}
                    colon={false}
                >
                    <Select
                        allowClear
                        options={role}
                    // mode={props.recordDetail ? undefined : 'multiple'}
                    />
                </Form.Item>
                <div className={styles.cardAffix}>
                    <Space>
                        <Button onClick={() => props.handleUserInfoCancel(1)}>返回</Button>
                        <SubmitButton ref={btnSubmitRef}>提交</SubmitButton>
                    </Space>
                </div>
            </Form>
        </Modal>
    )

}
export default UserInfo