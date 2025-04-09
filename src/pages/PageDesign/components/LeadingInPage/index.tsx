import { useEffect, useState } from 'react';
import { useDesigner, TextWidget } from '@designable/react';
import { Button, Form, message, Modal, TreeSelect } from 'antd';
import { transformToSchema, transformToTreeNode } from '../../service';
import { getDataList } from '@/pages/PageManageList2/components/LeftDataList/service';
import { getByCode } from '@/pages/DesignPreview/service';
import { cloneDeep } from 'lodash';

const LeadingInPage = () => {
    const [visible, setVisible] = useState<boolean>(false); // 弹窗显示
    const [loading, setloading] = useState<boolean>(false); // 弹窗加载动画
    const [listData, setListData] = useState<any>([]); // 全部页面列表
    const [form] = Form.useForm();
    const designer = useDesigner();

    // 弹窗确定按钮
    const handleLeadingInPage = () => {
        form.validateFields().then(async (values) => {
            const { code } = values;
            setloading(true);
            // 获取需要导入的页面
            const res = await getByCode(code);
            setloading(false);
            if (res.code === 0) {
                setVisible(false);
                if (!res.data?.pageJson) {
                    message.warning("页面没有需要导入的内容！");
                    return;
                }
                const { children: targetChild } = JSON.parse(res.data?.pageJson);
                const data = transformToSchema(designer.getCurrentTree(), undefined);
                // 因为对象key值不能相同，所以添加一个时间戳让页面可以添加多次
                const newTime = new Date().getTime();
                const loop = (data: any, dataMap: Object = {}) => {
                    const cloneData = cloneDeep(data);
                    Object.keys(cloneData).map((item: any) => {
                        const record = cloneData[item];
                        const key = item + newTime;
                        record['x-designable-id'] = key;
                        delete dataMap[item];
                        dataMap[key] = record;
                        if (cloneData[item]?.children && Object.keys(cloneData[item].children).length) {
                            dataMap[key].children = loop(cloneData[item].children, dataMap[key].children);
                        }
                    });
                    return dataMap;
                };
                // 赋值到页面json的子级里
                data.children = { ...data.children, ...loop(targetChild) };
                // 写入设计页面
                designer.setCurrentTree(transformToTreeNode(data, undefined));

            }
        });
    };

    // 获取所有配置页面列表
    const getCodeList = async () => {
        getDataList().then((res) => {
            if (res.code === 0) {
                setListData(res.data);
            }
        });
    }
    useEffect(() => {
        getCodeList();
    }, [])

    return (
        <>
            <Button
                onClick={() => {
                    setVisible(true);
                }}
            >
                <TextWidget>导入其它页面</TextWidget>
            </Button>

            <Modal
                visible={visible}
                onCancel={setVisible.bind(null, false)}
                onOk={handleLeadingInPage}
                title="导入其它页面"
                confirmLoading={loading}
            >
                <Form
                    form={form}
                >
                    <Form.Item
                        label="导入页面"
                        name="code"
                        rules={[{ required: true, message: '请选择需要导入的页面' }]}
                    >
                        <TreeSelect
                            style={{ width: '100%' }}
                            treeData={listData}
                            filterTreeNode={(inputValue: string, { label, value }: any) => (
                                label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()) || value.includes(inputValue)
                            )}
                            showSearch
                            allowClear
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default LeadingInPage;