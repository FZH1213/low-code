
import {
    BizTable,
    Button,
    Card, Drawer, Input, message, Modal, Space, Tag, Typography,
} from '@/components/base';
import TableSearchForm, { TableSearchFormInstance } from '@/components/TableSearchForm';
import React, { useEffect, useRef, useState } from 'react';
import { history } from 'umi';
import styles from './index.less';
import type { ColumnsType } from 'antd/es/table/interface';
import { fetchPageDefList, removeById } from './service';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';

import AddPageModal from './components/AddPageModal';
import { judgeSucessAndGetMessage } from '@/utils/requestUtil';
import EditPageModal from './components/editPageModal';

export interface ComponentProps { }

const FunctionComponent: React.FC<ComponentProps> = (props: { [key: string]: any }) => {

    const [btnLoading, setBtnLoading] = useState<boolean>(false);
    //查询框
    const queryFormRef = useRef<TableSearchFormInstance | undefined>(undefined);
    //查询条件
    const [searchFormValues, setSearchFormValues] = useState<any>({});
    // 重置标志位
    const [flag, setFlag] = useState<any>(false);
    // 新增弹窗显示隐藏
    const [addPageModalVisible, setAddPageModalVisible] = useState<any>(false);
    // 修改弹窗显示隐藏
    const [recordData, setRecordData] = useState<any>(undefined)
    const [editPageModalVisible, setEditPageModalVisible] = useState<any>(false);

    const tableColumns: ColumnsType<any> = [
        {
            title: '页面code',
            dataIndex: 'code',
            key: 'code',
            width: '15%',
            ellipsis: true,
        },
        // {
        //     title: 'id',
        //     dataIndex: 'id',
        //     key: 'id',
        //     width: '5%',
        //     ellipsis: true,
        // },
        {
            title: '标题',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
            ellipsis: true,
        },

        {
            title: '页面url',
            dataIndex: 'pageUrl',
            key: 'pageUrl',
            width: '15%',
            ellipsis: true,
        },
        // {
        //     title: '状态',
        //     dataIndex: 'status',
        //     key: 'status',
        //     width: '10%',
        //     ellipsis: true,
        //     render: (text: any) => {
        //         if (text === 0) {
        //             return <Tag color="error">禁用</Tag>;
        //         }

        //         if (text === 2) {
        //             return <Tag color="warning">锁定</Tag>;
        //         }

        //         return <Tag color="success">正常</Tag>;
        //     },
        // },
        {
            title: '创建时间',
            dataIndex: 'gmtCreate',
            key: 'gmtCreate',
            width: '15%',
            ellipsis: true,
        },
        {
            title: '页面Json',
            dataIndex: 'pageJson',
            key: 'pageJson',
            width: '25%',
            ellipsis: true,
        },
        {
            title: '操作',
            dataIndex: 'option',
            key: 'option',
            fixed: 'right',
            width: 150,
            render: (_: any, record: any) => {
                return (
                    <Space>
                        <Typography.Link onClick={() => {
                            history.push({
                                pathname: '/page-design',
                                query: {
                                    code: record.code,
                                    id: record.id,
                                    name: record.name,
                                }
                            })
                        }
                        }>设计页面</Typography.Link>
                        <Typography.Link onClick={() => {
                            setFlag(false)
                            setEditPageModalVisible(true)
                            setRecordData(record)
                        }
                        }>修改</Typography.Link>

                        <Typography.Link onClick={() => {
                            handleDelete(record)
                        }}>删除</Typography.Link>
                    </Space>
                );
            },
        },
    ];

    const handleDelete = (data: any) => {
        Modal.confirm({
            title: '确定删除吗？',
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                setBtnLoading(true)
                if (data.id) {
                    const [flag, msg] = await judgeSucessAndGetMessage(removeById(data.id));
                    // console.log('mag', msg);
                    // console.log('flag', flag);
                    if (flag) {
                        message.success(msg || '操作成功');
                        queryFormRef.current?.onSearchExec();
                    } else {
                        message.error(msg || '操作失败');
                    }
                    setBtnLoading(false);
                }
            },
        });
    };

    // 刷新列表
    const refreshTable = () => {
        setFlag(true)
    };

    const queryFieldsProp = [
        {
            label: '标题',
            name: 'name',
            components: <Input placeholder="请输入标题" allowClear />,
        },
        // {
        //     label: '状态',
        //     name: 'status',
        //     components: <Input placeholder="请输入状态" allowClear />,
        // },
        {
            label: '页面code',
            name: 'code',
            components: <Input placeholder="请输入页面ID" allowClear />,
        },
    ];

    // 新增 
    const handleAdd = () => {
        setFlag(false);
        setAddPageModalVisible(true)
    };
    // 关闭新增弹窗
    const closeAddPageModalVisible = () => {
        setAddPageModalVisible(false);
    };

    // 关闭新增弹窗
    const closeEditPageModalVisible = () => {
        setEditPageModalVisible(false);
        setRecordData(undefined);
    };

    return (
        <Space
            size={10}
            direction="vertical"
        >
            <TableSearchForm
                ref={queryFormRef}
                queryFieldsProp={queryFieldsProp}
                onSearch={(values) => {
                    setSearchFormValues(values);
                }}
                onReset={() => {
                    setSearchFormValues({});
                    setFlag(true);
                }}
            />
            <Card
                className={styles.newMarginCard}
                title={
                    <Space>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                            新增
                        </Button>
                    </Space>
                }
            >
                {/* 表格 */}
                <BizTable
                    flag={flag}
                    columns={tableColumns}
                    listService={fetchPageDefList}
                    rowKey="pageId"
                    searchFormValues={searchFormValues}
                // rowSelection={{
                //     type: 'checkbox',
                // }}
                />

            </Card>
            {/* 新增页面弹窗 */}
            {addPageModalVisible && (
                <AddPageModal
                    onClose={closeAddPageModalVisible}
                    visible={addPageModalVisible}
                    refreshTable={refreshTable}
                />
            )}
            {/* 修改页面弹窗 */}
            {editPageModalVisible && (
                <EditPageModal
                    onClose={closeEditPageModalVisible}
                    visible={editPageModalVisible}
                    recordData={recordData}
                    refreshTable={refreshTable}
                />
            )}
        </Space>
    );
};

export default FunctionComponent;
