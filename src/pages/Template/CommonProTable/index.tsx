import React, { useRef, useState, useEffect } from 'react';
import type { ProColumns, ActionType } from '@/components/base/Pro/pro-table';
import ProTable from '@/components/base/Pro/pro-table';
import { Button, message, Popconfirm, Space } from '@/components/base';
import { judgeSucessAndGetMessage } from '@/utils/requestUtil';
import { Access, useAccess } from 'umi';
import { AUTHORITY_ACTION } from '@/constants/authority';
import { bizExecByCode } from '@/services/templateApi';
import { PcButtonLink } from '@/components/Basic/PC'
export interface ComponentProps { }

const FunctionComponent: React.FC<ComponentProps> = (props: {}) => {
    const actionRef = useRef<ActionType>();
    const access = useAccess();
    const [rowData, setRowData] = useState<API.Api | undefined>(undefined);
    const [modalVisable, setModalVisable] = useState<boolean>(false);
    /**
     * 操作类型编码
     * 1:新增
     * 2:编辑
     * 3:查看
     */
    const [operate, setOperate] = useState<number>(3);


    const columns: ProColumns<{}>[] = [
        {
            title: '路由名称',
            dataIndex: 'routeName',
            search: {
                transform: (value) => {
                    return {
                        routeName_l: value,
                    };
                },
            },
        },
        {
            title: '服务ID',
            dataIndex: 'serviceId',
            search: {
                transform: (value) => {
                    return {
                        serviceId_l: value,
                    };
                },
            },
        },
        {
            title: '转发地址',
            dataIndex: 'uri',
            copyable: true,
            ellipsis: true,
            search: {
                transform: (value) => {
                    return {
                        uri_l: value,
                    };
                },
            },
        },

        {
            title: '访问路径',
            dataIndex: 'predicates',
            copyable: true,
            ellipsis: true,
            search: {
                transform: (value) => {
                    return {
                        predicates_l: value,
                    };
                },
            },
        },

        {
            title: '路由状态',
            dataIndex: 'status',
            valueType: 'select',
            sorter: true,
            valueEnum: {
                '0': {
                    text: '关闭',
                    status: 'Error',
                },
                '1': {
                    text: '开启',
                    status: 'Success',
                },
            },
        },
        {
            title: '创建时间',
            key: 'showTime',
            dataIndex: 'createTime',
            valueType: 'dateTime',
            sorter: true,
            hideInSearch: true,
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            valueType: 'dateRange',
            hideInTable: true,
            search: {
                transform: (value) => {
                    return {
                        createTime_st: value[0],
                        createTime_et: value[1],
                    };
                },
            },
        },
        {
            title: '操作',
            valueType: 'option',
            fixed: 'right',
            width: 90,
            render: (text, record, _, action) => [
                <Access accessible={access.canDo(AUTHORITY_ACTION.ROUTE_EDIT)}>
                    <a
                        onClick={() => {
                            setOperate(2);
                            setRowData(record);
                            setModalVisable(true);
                        }}
                    >
                        编辑
                    </a>
                </Access>,
                <Access accessible={access.canDo(AUTHORITY_ACTION.ROUTE_DETAIL)}>
                    <a
                        onClick={() => {
                            setOperate(3);
                            setRowData(record);
                            setModalVisable(true);
                        }}
                    >
                        查看
                    </a>
                </Access>,
            ],
        },
    ];

    const handleDelete = async (ids: (string | number)[]) => {
        // const [success, msg] = await judgeSucessAndGetMessage(deleteByIds(ids));
        // if (success) {
        //   message.success(msg);
        //   actionRef.current?.reload();
        // } else {
        //   message.error(msg);
        // }
        // return success;
    };

    const handleRefresh = async () => {
        // const [success, msg] = await judgeSucessAndGetMessage(refreshGateway());
        // if (success) {
        //   message.success(msg);
        // } else {
        //   message.error(msg);
        // }
    };

    return (
        <ProTable<{}>
            columns={columns}
            actionRef={actionRef}
            request={(params = {}, sort, filter) => {
                params["_code"] = "sys._template.api.listPage"
                return bizExecByCode(params);
            }}
            rowKey="name"
            search={
                true && {
                    labelWidth: 'auto',
                }
            }
            pagination={{
                pageSize: 10,
            }}
            dateFormatter="string"
            headerTitle="路由列表"
            rowSelection={
                {
                    // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
                    // 注释该行则默认不显示下拉选项
                    // selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                }
            }
            tableAlertOptionRender={({ intl, selectedRowKeys, selectedRows, onCleanSelected }) => {
                return (
                    <Space size={16}>
                        <Popconfirm
                            title="确定要删除选中的数据吗?"
                            onConfirm={async () => {
                                const success = await handleDelete(selectedRowKeys);
                                if (success) {
                                    onCleanSelected();
                                }
                            }}
                            okText="是"
                            cancelText="否"
                        >
                            <a href="#">批量删除</a>
                        </Popconfirm>
                        <a onClick={() => onCleanSelected()}>取消选择</a>
                    </Space>
                );
            }}
            toolBarRender={(selectedRowKeys, selectedRows) => [
                <Access accessible={true}>
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            console.info("aaa", selectedRowKeys, selectedRows)
                            setOperate(1);
                            setRowData(undefined);
                            setModalVisable(true);
                        }}
                    >
                        新建
                    </Button>
                    {
                        React.cloneElement(<PcButtonLink title='aaab' />, { id: 112 })

                    }
                </Access>,
                <Access accessible={access.canDo(AUTHORITY_ACTION.ROUTE_REFRESH)}>
                    <Popconfirm
                        title="确定要刷新网关配置吗?"
                        onConfirm={() => handleRefresh()}
                        okText="是"
                        cancelText="否"
                    >
                        <Button>刷新网关</Button>
                    </Popconfirm>
                </Access>,
            ]}
        />

    );
};

export default FunctionComponent;
