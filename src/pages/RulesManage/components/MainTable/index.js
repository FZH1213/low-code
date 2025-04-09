import React, { useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';
import { getTableData } from './service';
import { Button, message, Modal, Form, Input, Spin, Table, Pagination, Popconfirm } from 'antd';

const MainTable = React.forwardRef((props, ref) => {
    // useImperativeHandle(ref, () => {
    //     return {
    //         refresh: () => {
    //             refresTable();
    //         },
    //     };
    // });
    // 加载标志位
    const [loading, setLoading] = useState(false);

    const [tableData, setTableData] = useState(null);

    //   每页条数
    const [limit, setLimit] = useState(10);

    // 第几页
    const [page, setPage] = useState(1);

    // 总条数
    const [total, setTotal] = useState(0);

    // 抽屉编辑的初始数据
    const [initData, setInitData] = useState(null);

    // 列表请求数据时loading 状态
    const [loadings, setLoadings] = useState(true);
    const fetchTablesData = (limit, page) => {
        setLoadings(true)

        if (props.data.children.length > 0) {
            getTableData({ pid: `${props.data.key}`, limit, page }).then((res) => {
                console.log('获取分页数据 =>', res);
                if (res.code === 0) {
                    setTableData(res.data.records);
                    setTotal(res.data.total);
                    setPage(res.data.page);
                    setLoadings(false)
                }
            });
        } else {
            getTableData({ id: `${props.data.key}`, limit, page }).then((res) => {
                console.log('获取分页数据 =>', res);
                if (res.code === 0) {
                    setTableData(res.data.records);
                    setTotal(res.data.total);
                    setPage(res.data.page);
                    setLoadings(false)
                }
            });
        }
    };

    // 打开复制弹窗
    const openCopyPage = (row) => {
        props.openCopyPage && props.openCopyPage(row);
        props.copeFlag && props.copeFlag(true)
    };
    const openConfigPage = (row) => {
        props.openConfigPage && props.openConfigPage(row);
    }
    // 打开应用弹窗
    const openApplyPage = (row) => {
        props.openApplyPage  && props.openApplyPage(row);
    }
    useEffect(() => {
        if (props.data != null) {
            console.log('selectKey ', props.data);
            //   改变前重置每页条数，页数
            setLimit(10);
            setPage(1);

            //   请求表格数据
            fetchTablesData(limit, page);
        }
    }, [props.data]);
    //   表格columns
    const tableColumns = [
        {
            title: '规则标识',
            key: 'ruleDefId',
            dataIndex: 'ruleDefId',
        },
        {
            title: '规则名称',
            dataIndex: 'name',
            key: "name"
        },
        {
            title: '操作',
            dataIndex: 'id',
            key: "id",
            align: 'center',
            width: '240px',
            fixed: 'right',
            render: (value, row) => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                    >
                        <div
                            onClick={() => {
                                openCopyPage(row);
                            }}
                            style={{ marginRight: '5px' }}
                        >
                            <a>复制</a>
                        </div>

                        <div
                            onClick={() => {
                                console.log('业务初始数据 =>', row);
                                openConfigPage(row);
                            }}
                            style={{ marginRight: '5px' }}
                        >
                            <a>执行配置</a>
                        </div>
                        <div
                            onClick={() => {
                                console.log('业务初始数据 =>', row);
                                openApplyPage(row);
                            }}
                            style={{ marginRight: '5px' }}
                        >
                            <a>应用场景</a>
                        </div>
                        <div>
                            <Popconfirm
                                title={`确定要删除该接口吗?`}
                                okText="确认"
                                cancelText="关闭"
                                showCancel
                                onConfirm={() => {
                                    props.openDeletePage(row);
                                }}
                            >
                                <div
                                    onClick={() => {
                                        console.log('业务初始数据 =>', row);

                                    }}

                                >
                                    <a>删除</a>
                                </div>
                            </Popconfirm>
                        </div>

                    </div>

                );
            },
        },
    ];
    return (
        <div
            style={{
                height: 'calc(100vh - 214px)',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
            }}
        >
            {/* 表格部分 */}
            <div
                style={{
                    // flex: '1',
                    padding: '16px',
                    height: 'calc(100vh - 276px)',
                    overflow: 'hidden',
                }}
            >
                <div>
                    <div>
                        {tableData != null && (
                            <Table
                                columns={tableColumns}
                                size="small"
                                dataSource={tableData}
                                bordered={true}
                                pagination={false}
                                loading={loadings}
                            ></Table>
                        )}
                    </div>
                </div>
            </div>
            {/* 分页展示部分 */}
            <div
                style={{
                    // flex: '0 0 48px',
                    position: 'absolute',
                    bottom: '0px',
                    height: '48px',
                    lineHeight: '48px',
                    // borderTop: '1px solid #f1f2f4',
                    paddingLeft: '16px',
                    paddingRight: '16px',
                    flexDirection: 'row-reverse',
                    textAlign: 'right',
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    width: '100%',
                }}
            >
                <Pagination
                    total={total}
                    current={page}
                    showTotal={(total) => `共${total}条`}
                    onChange={(p) => {
                        fetchTablesData(limit, p);
                    }}
                ></Pagination>
            </div>
        </div>
    );
})

export default MainTable;
