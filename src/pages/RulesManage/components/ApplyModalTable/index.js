import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Table, Pagination, Input, Row, Col, Select } from 'antd';
const { Search } = Input;
const { Option } = Select;
const ApplyModalTable = (props) => {
    const [showModel, setShowModal] = useState(false);
    const [tableData, setTableData] = useState(null);
    const [rowData, setRowData] = useState(null);
    const [searchValue, setSearchValue] = useState(null);
    const [selectKey, setSelectKey] = useState("1")
    //   每页条数
    const [limit, setLimit] = useState(10);
    // 第几页
    const [page, setPage] = useState(1);
    // 总条数
    const [total, setTotal] = useState(0);
    // 抽屉编辑的初始数据
    const [initData, setInitData] = useState(null);
    const tableColumns = [
        {
            title: 'API标识',
            dataIndex: 'code',
        },
        {
            title: 'API名称',
            dataIndex: 'name',
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreate',
        },
        // {
        //     title: '创建人',
        //     dataIndex: 'opCreateName',
        // },
    ];
    useEffect(() => {
        if (props.applyTables != null) {
            console.log('props.applyTables', props.applyTables);
            //   改变前重置每页条数，页数
            setLimit(props.applyTables.limit);
            setPage(props.applyTables.page);
            setTableData(props.applyTables.records);
            setTotal(props.applyTables.total);
            //   请求表格数据
        }
    }, [props.applyTables]);
    useEffect(() => {
        setShowModal(props.showTableModel)
    }, [props.showTableModel])
    useEffect(() => {
        if (props.rowData != null) {
            setRowData(props.rowData)
        }
    }, [props.rowData])
    const fetchTablesData = (limit, p) => {
        if (p == page) {
            return;
        }
        console.log(rowData.ruleDefId)
        if (searchValue != null && searchValue != "") {
            props.getApiData(rowData.ruleDefId, limit, p, searchValue, selectKey);
        } else {
            props.getApiData(rowData.ruleDefId, limit, p);
        }

    }
    const onInputSearch = (e) => {
        console.log('e =>', e);
        setSearchValue(e);
        if (e != null && e != "") {
            props.getApiData(rowData.ruleDefId, 10, 1, e, selectKey);
        } else {
            props.getApiData(rowData.ruleDefId, 10, 1);
        }
    };
    const handleChange = (value) => {
        setSelectKey(value)
    };
    return (
        <div>
            <Modal width={'80%'}
                title="应用场景"
                bodyStyle={{ paddingBottom: "48px" }}
                visible={showModel} onCancel={() => { setShowModal(false); props.closeCancel(false) }} footer={[]} maskClosable>
                <div>

                </div>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                    }}
                >
                    <Row>
                        <Col span={2} textAlign="right">
                            <Select defaultValue="1" onChange={handleChange}>
                                <Option value="0">API标识</Option>
                                <Option value="1">API名称</Option>

                            </Select>
                        </Col>
                        <Col span={8}><Search
                            placeholder="请输入能力关键词"
                            allowClear
                            onSearch={onInputSearch}
                            style={{ width: '100%' }}
                        ></Search></Col>
                    </Row>
                    {/* 表格部分 */}
                    <div
                        style={{
                            // flex: '1',
                            padding: '16px',
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
                            bottom: '-48px',
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
                            showSizeChanger={false}
                            onChange={(p) => {
                                console.log(p)
                                fetchTablesData(limit, p);
                            }}
                        ></Pagination>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default ApplyModalTable;
