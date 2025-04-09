import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Input, Select, Button, Table, Checkbox, message, Form } from 'antd';
import { pauseTask, allApi, deleteTask, resumeTask } from './service';
import api from './service'
import { LOCAL_STORE_KEYS } from '@/utils/constant'
import { normalConfirm } from '@/components/base/modal/ConfirmModal';
import toast from '@/components/Toast';
import TableSearchForm, { TableSearchFormInstance } from "@/components/TableSearchForm";
import TaskModalForm from './TaskModalForm';
import { Space } from '@/components/base';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles.less';
const { Option } = Select;
let rowSelectionList: string | any[] = [];
let search: never[] = [];
const rowSelection: any = {
    fixed: true,
    type: Checkbox,
    onChange: (selectedRowKeys: any, selectedRows: any[]) => {
        rowSelectionList = selectedRows;
    },
    getCheckedboxProps: (record: any) => ({
        name: record.bzId,
    })
}
const TableList: React.FC<{}> = () => {
    const [pageTable] = Form.useForm();
    const [editTaskVisable, setEditTaskVisable] = useState<boolean>(false);
    const searchFormRef = useRef<TableSearchFormInstance | undefined>(undefined);
    const [subNode, setSubNode] = useState<any>({});
    const [search, setSearch] = useState({})
    const [allApis, setAllApis] = useState<Array<any>>([]);
    const [isAdd, setIsAdd] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [formLoading, setFormLoading] = useState<boolean>(false);
    const [pageData, setPageData] = useState<any>(undefined);
    const [page, setPage] = useState({
        psgeSize: 10,
        current: 1,
        total: 0,
    });
    useEffect(() => {
        fetchList();
        getAllApi()
    }, []);

    const getAllApi = async () => {
        let resp = await allApi();
        if (resp.code === 0) {
            setAllApis(resp.data);
            setLoading(false);
        }
    }
    const refresh = async () => {
        let params = Object.assign({}, search);
        let playload = {
            params,
        };
        fetchList(playload)

    }
    const columns = [
        {
            title: '任务名称',
            dataIndex: 'jobName',
            key: 'jobName',
            ellipsis: true,
        },
        {
            title: '调度信息',
            dataIndex: 'cronExpression',
            key: 'cronExpression',
            width: '20%',
            ellipsis: true,
            render: (text: any, record: any) => (
                <div>
                    {"cron表达式：" + text}
                </div>
            ),
        },
        {
            title: '状态',
            dataIndex: 'jobStatus',
            key: 'mobile',
            width: 70,
            render: (text: any, record: any) => (

                <div>
                    {text === "NORMAL" ?
                        <div>
                            <span className="ivu-badge-status-dot ivu-badge-status-success"></span>
                            <span className="ivu-badge-status-text">正常</span>
                        </div>
                        : <div>
                            <span className="ivu-badge-status-dot ivu-badge-status-error"></span>
                            <span className="ivu-badge-status-text">暂停</span>
                        </div>}
                </div>

            ),
        },
        {
            dataIndex: 'jobTrigger',
            title: '定时类型',
            width: '25%',
            render: (text: any) => (
                <div>
                    {text === "org.quartz.impl.triggers.CronTriggerImpl" ? "cron任务(CronTrigger)" : "简单任务(SimpleTrigger)"}
                </div>
            )
        },
        {
            title: '任务描述',
            dataIndex: 'jobDescription',
            key: 'jobDescription',
            width: '15%',
            ellipsis: true,
        },
        {
            title: '操作',
            width: 150,
            fixed: 'right',
            render: (val: any, record: any) => (
                <div>
                    <a
                        onClick={() => {
                            setIsAdd(false);
                            let data = {
                                ...record.data
                            }
                            record = {
                                ...record,
                                ...data
                            }
                            setSubNode(record);
                            setEditTaskVisable(true);
                        }}
                    >
                        编辑
                    </a>
                    <a style={{ marginLeft: "10" }} onClick={() => changeJobStatusConfirm(record)} >{record.jobStatus == "NORMAL" ? "  暂停  " : "  恢复  "}</a>
                    <a style={{ marginLeft: "10" }} onClick={() => onDeleteConfirm(record)} >删除</a>
                </div>
            ),
        },
    ];

    const queryFieldsProp: Array<FieldProp> = [
        { label: '任务名称', name: 'jobName', components: <Input placeholder="请输入任务名称" /> },
        {
            label: '状态',
            name: 'jobStatus',
            components: (
                <Select placeholder="请选择类型">
                    <Option key={0} value={"NORMAL"}>正常</Option>
                    <Option key={1} value={"PAUSED"}>暂停</Option>
                </Select>
            ),
        },
    ];

    const fetchList = async (params?: any) => {
        // return (playload: any) => {
        //     let params = Object.assign({}, playload.params, searchFormRef.current?.getFormValues());
        //     playload.params = params;
        //     return api.pageList(playload);
        // };
        setFormLoading(true);
        const resp = await api.pageList(params);
        setFormLoading(false);
        if (resp.code === 0) {
            console.log(resp.data);

            setPageData(resp.data);
            // 将current字符串转换为数字，否则分页面器无法显示选中样式
            const { current } = resp.data;
            resp.data.current = Number(current);
            setPage(resp.data);
        }
    }
    const onDeleteClick = async (record: any) => {
        const resp = await deleteTask({ jobName: record.jobName });
        if (resp.code === 0) {
            toast.success('删除成功');
            fetchList();
            // pageTable.current.renderData()
        } else {
            toast.error('删除失败');
        }
    };

    const onChangeJobStatus = async (record: any) => {
        if (record.jobStatus == "NORMAL") {
            const resp = await pauseTask({ jobName: record.jobName });
            if (resp.code === 0) {
                toast.success('暂停成功');
                fetchList();
                // pageTable.current.renderData()
            } else {
                toast.error('暂停失败');
            }
        } else {
            const resp = await resumeTask({ jobName: record.jobName });
            if (resp.code === 0) {
                toast.success('恢复成功');
                fetchList();
                // pageTable.current.renderData()
            } else {
                toast.error('恢复失败');
            }
        }
    };

    const onDeleteConfirm = (record: any) => {
        normalConfirm({
            title: '提示',
            content: '是否删除任务？',
            onOk: () => onDeleteClick(record)
        });
    }

    const changeJobStatusConfirm = (record: any) => {
        let tips = record.jobStatus == "NORMAL" ? "暂停" : "恢复";
        tips = "是否" + tips + "任务？";
        normalConfirm({
            title: '提示',
            content: tips,
            onOk: () => onChangeJobStatus(record)
        });
    }


    const onSearch = async (e) => {
        if (e) {
            setSearch({
                jobName: e.jobName,
                jobStatus: e.jobStatus
            })
            // pageTable.current.renderData()
        }
    };

    const onReset = async () => {
        await setSearch({})
        pageTable.current.renderData()
    }

    // 分页、排序、筛选变化时触发
    const onTableChange = async (pagination: any, filters: any, sorter: any) => {
        let params = Object.assign({
            limit: pagination.pageSize,
            page: pagination.current,
            ...pagination.requestMap,
        });

        // setFormLoading(true);
        // console.log('%c测试', 'color: white; background: red;', params, pagination)
        const { psgeSize, current, total } = pagination;
        setPage({
            psgeSize,
            current,
            total,
        });

        // const resp = await api.pageList(params);
        // setFormLoading(false);

        // if (resp.code === 0) {
        //     setPageData(resp.data);
        //     // 将current字符串转换为数字，否则分页面器无法显示选中样式
        //     const { current } = resp.data;
        //     resp.data.current = Number(current);
        //     setPage(resp.data);
        // }
    }

    return (
        <Space size={10} direction="vertical">
            <TableSearchForm
                queryFieldsProp={queryFieldsProp}
                onReset={() => {
                    fetchList();
                }}
                onSearch={(values) => {
                    fetchList(values);
                }}
                ref={searchFormRef}
            // localStoreKey={LOCAL_STORE_KEYS.TaskManagement}
            // form={queryForm}
            />
            <Card
                className={styles.TaskManagementCard}
                title={
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => {
                                setIsAdd(true);
                                setEditTaskVisable(true);
                            }}
                            icon={<PlusOutlined />}
                        >
                            新增
                        </Button>
                    </Space>
                }
            >
                <Table
                    className="wp-table area-mt"
                    rowSelection={rowSelection}
                    columns={columns}
                    size="small"
                    dataSource={pageData ? pageData.records : []}
                    loading={formLoading}
                    locale={formLoading ? {
                        emptyText: () => (
                            <div style={{ marginTop: '150px' }}>
                                <div style={{ marginTop: '20px' }}>正在加载中</div>
                            </div>
                        )
                    } : {}}
                    pagination={Object.assign(page, {
                        size: 'small',
                        showQuickJumper: true,
                        showSizeChanger: true,
                        showTotal: (total: any, range: any[]) =>
                            `第 ${range[0]} 项 - 第 ${range[1]} 项  /  共 ${total} 项`,
                    })}
                    onChange={onTableChange} //分页
                    rowKey="bzId"
                />
            </Card>
            <TaskModalForm
                data={isAdd ? {} : subNode}
                visable={editTaskVisable}
                allApis={allApis}
                modalLoading={loading}
                isAdd={isAdd}
                onRefresh={refresh}
                onCancel={() => {
                    setIsAdd(true);
                    setEditTaskVisable(false);
                }}
            />
        </Space>
    );
};

export default TableList;
