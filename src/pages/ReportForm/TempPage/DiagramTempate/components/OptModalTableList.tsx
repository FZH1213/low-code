import React, { useEffect, useRef, useState } from 'react';
import {
    Table,
    Card,
    Input,
    DatePicker,
    Select,
    Form,
    Button,
    Modal,
    Space,
    message,
    Popconfirm,
} from 'antd';
// import '@/theme/default/common.less';
import TableSearchForm, { TableSearchFormInstance } from '@/components/TableSearchForm';
import { FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import moment from 'moment';
import api from '../service';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import DataManageTemplate1 from '../../DataManageTemplate1';
import ModalFormProTemplate from '../../ModalFormProTemplate';
import ModalFormTemplate from '../../ModalFormTemplate';

const { RangePicker } = DatePicker;
// const { Option } = Select;

const OptModalTableList: React.FC<{}> = (props: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [intCode, setIntCode] = useState<any>('');
    // 查询框
    const [queryFieldsProp, setQueryFieldsProp] = useState([]);
    const searchFormRef = useRef<TableSearchFormInstance | undefined>(undefined);
    const [filterObj, setFilterObj] = useState<any>(undefined);
    const [searchForm] = Form.useForm<TableSearchFormInstance | undefined>();
    // Table部分
    const pageTable = useRef<any>(null);
    const [page, setPage] = useState({
        current: 1,
        total: 0,
    });
    const [pageSize, setPageSize] = useState<any>(10);
    const [pageNum, setPageNum] = useState<any>(1);
    const [tableColumns, setTableColumns] = useState<any>([]);
    const [tData, setData] = useState<any>();
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const [titleField, setTitleField] = useState<any>();
    const [linkField, setLinkField] = useState<any>([]);  //与主表关联字段

    // 操作按钮
    const [opebtnArr, setOpebtnArr] = useState<any>([]);
    // 表单属性
    const [formFieldsProp, setFormFieldsProp] = useState([]);
    // 弹窗部分
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<any>(undefined);
    const [recordDetial, setRecordDetial] = useState<any>(undefined);
    const [modalPageLink, setModalPageLink] = useState<any>(undefined); //跳转页面
    const [modalFormTemplate, setModalFormTemplate] = useState<boolean>(false)  //新增模板链接（不含附件）
    const [modalFormProTemplate, setModalFormProTemplate] = useState<boolean>(false)  //新增模板链接（含附件）
    const [erpEdit, setErpEdit] = useState<boolean>(false); //erp编辑模板


    useEffect(() => {
        props.linkRowDetial ? getViewData() : setData(undefined);
    }, [props.linkRowDetial]);

    // 初始化话进入页面所有数据
    const getViewData = async () => {
        const res1: any = pharsePageProps(props.sqlData);
        const { srvCode, ...obj } = res1;
        searchForm.setFieldsValue({ ...obj }); //设置查询框默认值
        // props.linkRowDetial && setTableTitle(props.linkRowDetial[titleField]); //与主表链接关联，改变标题
        res1 && getBizCodeData(srvCode, obj, pageSize, pageNum);
    }
    // 获取页面下拉框子项数据
    const getInitData = async (code: any, arr: any) => {
        let initData: any = undefined;
        if (code && arr.length) {
            let res: any = await api.execByCode(JSON.stringify({}), code);
            if (res.response.code === 0) {
                initData = res.response.data
            } else {
                message.error(res.response.message || '操作失败')
            }
        }
        let newArr: any = arr.map((item: any) => {
            let o = {
                ...item,
                components: getComponents(item, initData),
            }
            return o;
        });
        setQueryFieldsProp(newArr)
    }

    //模块 属性解释
    const pharsePageProps = (data: any) => {
        let columnArr: any = [];
        let arr: any = [];
        let obj: any = []; //图表过滤参数值
        let linkFieldArr: any = [];
        let opebtnArr: any = []; //存在列按钮
        // 表单属性
        let fieldsArr: any = [];
        // 保存数据编码
        setIntCode(data?.intCode);

        // 搜素框解析、列表属性解析
        data && data?.intfIttrDescList1.map((item: any, index: any) => {
            let componentCode = JSON.parse(item.componentCode);
            let formItemProps: any = {};
            let tableColProps: any = {};
            for (let key in componentCode) {
                if (FORM_ITEM_API.includes(key)) {
                    formItemProps[key] = componentCode[key];
                    delete componentCode[key]
                }
                if (TABLE_COLUMN_API.includes(key)) {
                    tableColProps[key] = componentCode[key];
                    delete componentCode[key]
                }
            }
            // 是否查询框字段
            if (item.isFilter == 1) {
                // 搜索框属性构建
                let serchItemProps = {
                    span: componentCode.searchSpan,
                    name: item.tableColum,
                    label: item.displayName,
                    layout: {
                        labelCol: formItemProps?.labelCol,
                        wrapperCol: formItemProps?.wrapperCol,
                    },
                    componentCode: componentCode,
                    filterType: item.filterType,
                    // components: getComponents(item.filterType, componentCode)
                }
                arr.push(serchItemProps);
            }
            // 表单属性构建
            let f_obj: any = {
                key: index,
                filterType: item.filterType,
                isFilter: item.isFilter,
                isDisabled: item.isDisabled,
                tableColum: item.tableColum,
                displayName: item.displayName,
                componentCode: componentCode,
            }
            fieldsArr.push(f_obj);
            // column列属性数据构建
            let c_obj: any = {
                key: item.tableColum,
                title: item.displayName,
                dataIndex: item.tableColum,
                filterType: item.filterType,
                isFilter: item.isFilter,
                isDisabled: item.isDisabled,
                ...tableColProps
            }
            columnArr.push(c_obj);

            // 关联过滤字段
            if (item.isLinkTo == 1) {
                linkFieldArr.push(item.tableColum)
            }

            //标题变化关联字段
            if (item.isTitleField) {
                setTitleField(item.isTitleField);
            }
        });

        getInitData(data?.initDataApi, arr);
        setTableColumns(columnArr);
        setLinkField(linkFieldArr);
        // setQueryFieldsProp(arr);
        setFormFieldsProp(fieldsArr);
        // 按钮数据属性解析
        data && data?.topBut.map((it: any) => {
            if (it.position.includes('2')) {
                opebtnArr.push(it);
            }
        });
        setOpebtnArr(opebtnArr);

        // 数据接口参数解释
        data && data?.opeBut.map((ite: any) => {
            if (ite.paramValue && ite.paramType) {
                if (ite.paramType == 'datePicker') {
                    obj[ite.paramName] = moment(ite.paramValue);
                } else if (ite.paramType == 'rangerPicker') {
                    let arr: any = [moment(ite.paramValue.split(',')[0]), moment(ite.paramValue.split(',')[1])];
                    obj[ite.paramName] = arr;
                } else {
                    obj[ite.paramName] = ite.paramValue;
                }
            }
        });

        obj.srvCode = data.intCode;
        !!props.linkRowDetial && props.linkRowDetial && linkFieldArr.map((it: any) => {
            obj[it] = props.linkRowDetial[it];
        });

        const { srvCode, ...obj1 } = obj;
        setFilterObj(obj1);
        return obj;
    }

    // 获取列表数据 by BizCode
    const getBizCodeData = async (srvCode: any, filterFFFF: any, pageSize: any, pageNum: any) => {
        setLoading(true);
        let res0: any = await api.getDataByBizCode(Object.assign({ srvCode }, filterFFFF, { pageSize }, { pageNum }));
        let res = res0.response;
        if (res.code === 0) {
            res.data.cursor_result && setData(res.data.cursor_result);
        } else {
            message.error(res.message || '操作失败')
        }
        // res.code === 0 && res.data.cursor_result && setData(res.data.cursor_result);
        setLoading(false);
    }

    // 分页、排序、筛选变化时触发
    const onTableChange = async (pagination: any, filters: any, sorter: any) => {
        setPageSize(pagination.pageSize)
        setPage(pagination);
        getBizCodeData(intCode, filterObj, pagination.pageSize, pagination.current);
    }

    // 查询框 筛选类型的组件
    const getComponents = (item: any, initData: any) => {
        const { componentCode: config } = item;
        for (let key in config) {
            if (key === 'disabled' || key === 'isAdd' || key === 'isEdit' || key === 'isDetial' || key === 'searchSpan') {
                delete config[key]
            }
        }
        let dom: any = <Input placeholder={`请输入`} allowClear />;
        switch (item.filterType) {
            case 'input':
                dom = <Input {...config} />;
                break;
            case 'select':
                dom = <Select
                    {...config}
                    onChange={(e) => console.log('e', e)}
                    // filterOption={(input: any, option: any) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    filterOption={(input: any, option: any) =>
                        (config.fieldNames.label && option[config.fieldNames.label].toLowerCase().includes(input.toLowerCase()))
                    }
                    showSearch={true}
                    options={initData && !!initData[item.name] && initData[item.name] && initData[item.name].length > 0 ? initData[item.name] : []}
                >

                </Select>
                break;
            case 'datePicker':
                dom = <DatePicker {...config}></DatePicker>
                break;
            case 'rangerPicker':
                dom = <RangePicker {...config}></RangePicker>
            default:
                break;
        }
        return dom;
    };

    // 查询框 查询
    const onSearch = (e: any) => {
        for (let key in e) {
            let value = e[key]; // 判断依据
            if (typeof (value) == 'object') {
                if (Array.isArray(value)) {
                    e.inStartTime = moment(value[0]._d).format('YYYY-MM-DD');
                    e.inEndTime = moment(value[1]._d).format('YYYY-MM-DD');
                    let nowTime = new Date();
                    if (nowTime < e.inEndTime) {
                        return -1;
                    }
                    delete e[key];
                } else {
                    e[key] = moment(value._d).format("YYYY-MM-DD");
                }
            }
            if (value === undefined || value === null) {
                delete e[key];
            }
        }
        setFilterObj({ ...filterObj, ...e });
        getBizCodeData(intCode, { ...filterObj, ...e }, pageSize, pageNum);
    }

    // 查询框 重置
    const onReset = () => {
        let obj = { ...filterObj };
        searchForm.resetFields();
        queryFieldsProp.forEach((item: any) => {
            for (let key in obj) {
                if (key.includes(item.name)) {
                    obj[key] = '';
                }
            }
        });
        setFilterObj(obj);
        getBizCodeData(intCode, obj, pageSize, pageNum);
    };

    // 打开弹窗
    const openModalVisible = () => {
        setModalVisible(true)
    }

    // 取消弹窗
    const handleModalCancel = () => {
        setModalVisible(false)
    }

    // 增加操作列按钮表格 cloumn
    const columns: any = [
        ...tableColumns,
        {
            key: 'option ',
            title: '操作',
            align: 'center',
            width: 180,
            fixed: 'right',
            render: (text: any, record: any) => {
                return (
                    <Space>
                        {
                            opebtnArr.length > 0 && opebtnArr.map((item: any, i: any) => (
                                item.type == 2 ?  //跳转其他页面
                                    <a key={i} onClick={() => {
                                        let rowData: any = getFormItemValue(record);
                                        if (item.link.indexOf('/report-manage/ModalFormReport/page&id=') > -1) {
                                            setIsDisabled(false);
                                            setModalTitle(item.name);
                                            setModalPageLink(item.link);
                                            setRecordDetial(rowData);
                                            setModalFormTemplate(true)
                                        } else if (item.link.indexOf('/report-manage/ModalFormProReport/page&id=') > -1) {
                                            setIsDisabled(false);
                                            setModalTitle(item.name);
                                            setModalPageLink(item.link);
                                            setRecordDetial(rowData);
                                            setModalFormProTemplate(true)
                                        } else if (item.link.indexOf('/report-manage/DataManageReport/page&id=') > -1) {
                                            setErpEdit(true);
                                            setModalTitle(item.name);
                                            setModalPageLink(item.link);
                                            setRecordDetial(rowData);
                                        }
                                    }}>{item.name}</a>
                                    : (
                                        item.type == 6 ? (
                                            <a key={i} onClick={() => {
                                                let rowData: any = getFormItemValue({ ...record });
                                                if (item.link && item.link.indexOf('/report-manage/ModalFormReport/page&id=') > -1) {
                                                    setIsDisabled(true);
                                                    setModalTitle(item.name);
                                                    setModalPageLink(item.link);
                                                    setRecordDetial(rowData);
                                                    setModalFormTemplate(true)
                                                } else if (item.link && item.link.indexOf('/report-manage/ModalFormProReport/page&id=') > -1) {
                                                    setIsDisabled(true);
                                                    setModalTitle(item.name);
                                                    setModalPageLink(item.link);
                                                    setRecordDetial(rowData);
                                                    setModalFormProTemplate(true)
                                                } else {
                                                    item.link ? window.location.href = item.link : null;
                                                }
                                            }}>{item.name}</a>
                                        ) : (
                                            item.type == 7 ?  //删除
                                                <Popconfirm
                                                    key={i}
                                                    title="你确定要删除这行内容吗?"
                                                    onConfirm={() => deleteRowData(record, item.code)}
                                                    okText="确定"
                                                    cancelText="取消"
                                                    icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                                                >
                                                    <a>{item.name}</a>
                                                </Popconfirm>
                                                : null
                                        )
                                    )
                            ))
                        }
                    </Space>
                );
            },
        },
    ];

    // 设置编辑、详情页数据
    const getFormItemValue = (record: any) => {
        if (record) {
            let newRowDetail = { ...record }
            formFieldsProp.forEach((item: any) => {
                if (item.filterType == 'datePicker') {
                    if (!!newRowDetail[item.tableColum] && newRowDetail[item.tableColum]) {
                        newRowDetail[item.tableColum] = moment(newRowDetail[item.tableColum])
                    } else {
                        newRowDetail[item.tableColum] = moment()
                    }
                }
                if (item.filterType == 'rangerPicker') {
                    if (!!newRowDetail[item.tableColum] && newRowDetail[item.tableColum]) {
                        if (record[item.tableColum].includes(",")) {
                            newRowDetail[item.tableColum] = [moment(newRowDetail[item.tableColum].split(',')[0]), moment(newRowDetail[item.tableColum].split(',')[1])];
                        } else {
                            newRowDetail[item.tableColum] = moment(newRowDetail[item.tableColum])
                        }
                    } else {
                        newRowDetail[item.tableColum] = null
                    }
                }
                if (item.filterType == 'Upload') {
                    if (newRowDetail[item.tableColum]) {
                        if (JSON.parse(newRowDetail[item.tableColum])) {
                            let arr: any = [];
                            JSON.parse(newRowDetail[item.tableColum]).forEach((it: any) => {
                                let o = {
                                    ...it,
                                    url: `${FILE_REQUEST_BASE}?fileId=${it.fileId}`,
                                    status: 'defalut',
                                }
                                arr.push(o)
                            });
                            newRowDetail[item.tableColum] = arr;
                        }
                    } else {
                        delete newRowDetail[item.tableColum]
                    }
                }
                if (item.filterType == 'Cascader') {
                    if (newRowDetail[item.tableColum]) {
                        newRowDetail[item.tableColum] = newRowDetail[item.tableColum].split(',')
                    }
                }
                if (item.filterType == 'select' && !!item.componentCode && item.componentCode?.mode) {
                    if (!!newRowDetail[item.tableColum] && newRowDetail[item.tableColum]) {
                        newRowDetail[item.tableColum] = newRowDetail[item.tableColum].split(',')
                    }
                }
            })
            return newRowDetail
        } else {
            return undefined;
        }
    }

    // 关闭弹窗
    const handleCancel = (flag: any) => {
        setModalTitle(undefined);
        setRecordDetial(undefined);
        setModalPageLink(undefined);
        setModalFormTemplate(false);
        setModalFormProTemplate(false);
        setErpEdit(false);
        //新增提交数据后、修改提交数据后，刷新数据页面
        flag && getBizCodeData(intCode, filterObj, pageSize, pageNum);
    };

    // 删除表格行内容
    const deleteRowData = async (record: any, code: any) => {
        let res: any = await api.execByCode(JSON.stringify(record), code);
        if (res.response.code === 0) {
            message.success(res.response.message);
        } else {
            message.error(res.response.message || '操作失败');
        }
        getBizCodeData(intCode, filterObj, pageSize, pageNum);
    }

    return (
        <Card style={{ height: props.moduleHeight ? props.moduleHeight : 400 }}>
            {(titleField && props.linkRowDetial) || props.tableTitle ?
                <div
                    style={{ textAlign: "center", fontSize: 14, fontWeight: 700 }}>
                    {titleField && props.linkRowDetial[titleField] ? props.linkRowDetial[titleField] : props.tableTitle}
                </div>
                : null
            }

            {// 查询框
                props.isSearch && queryFieldsProp.length > 0 ?

                    <TableSearchForm
                        ref={searchFormRef}
                        queryFieldsProp={queryFieldsProp}
                        onSearch={onSearch}
                        onReset={onReset}
                        form={searchForm}
                    />
                    : null
            }

            {/* 列表部分 */
                tableColumns.length > 0 ?
                    // <Card className="area-mt">
                    <Table
                        id="antdTable"
                        ref={pageTable}
                        bordered={true}
                        size="small"
                        rowKey="bzId"
                        columns={opebtnArr.length > 0 ? columns : tableColumns}
                        loading={loading}
                        locale={{
                            emptyText: loading
                                ? () => (
                                    <div style={{ height: '100px' }}>
                                        <div style={{ marginTop: '20px' }}>正在加载中</div>
                                    </div>
                                )
                                : '',
                        }}
                        scroll={{ y: 'calc(100% - 150px)' }}
                        dataSource={tData && tData.records && tData.records.length > 0 ? tData.records : []}
                        pagination={false}
                    />
                    // </Card>
                    : null
            }

            {
                pageTable?.current && tData?.records.length > 0 ?

                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <Button size="small" onClick={openModalVisible}>{`更多${props.modalTitle}>>`}</Button>
                    </div>
                    : null
            }
            <Modal
                title={`历史${props.modalTitle}`}
                width="65%"
                maskClosable={false}
                onCancel={handleModalCancel}
                visible={modalVisible}
                destroyOnClose={true}
                bodyStyle={{ paddingBottom: 20 }}
                footer={
                    <div style={{ textAlign: "right" }}>
                        <Space>
                            <Button onClick={handleModalCancel}>关闭</Button>
                        </Space>
                    </div>
                }
            >
                <Table
                    style={{ paddingTop: 16 }}
                    id="antdTable"
                    bordered={true}
                    size="small"
                    rowKey="bzId"
                    columns={tableColumns}
                    loading={loading}
                    locale={{
                        emptyText: loading
                            ? () => (
                                <div style={{ lineHeight: '150px' }}>
                                    <div style={{ marginTop: '20px' }}>正在加载中</div>
                                </div>
                            )
                            : '',
                    }}
                    scroll={{ y: 'calc(100% - 150px)' }}
                    dataSource={tData && tData.records && tData.records.length > 0 ? tData.records : []}
                    pagination={Object.assign(page, {
                        size: 'small',
                        pageSize: tData ? tData.limit : 10,
                        total: tData ? tData.total : 0,
                        current: tData ? tData.page : 1,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        showTotal: (total: any, range: any[]) =>
                            `第 ${range[0]} 项 - 第 ${range[1]} 项  /  共 ${total} 项`,
                    })}
                    onChange={onTableChange} //点击分页触发
                />
            </Modal>

            {
                modalPageLink && modalFormTemplate ?
                    <ModalFormTemplate
                        isDisabled={isDisabled}
                        modalTitle={modalTitle}
                        modalVisible={modalFormTemplate}
                        modalPageLink={modalPageLink}
                        recordDetial={recordDetial}
                        handleCancel={handleCancel}
                    /> : null
            }

            {
                modalPageLink && modalFormProTemplate ?
                    <ModalFormProTemplate
                        isDisabled={isDisabled}  //是否可编辑
                        modalTitle={modalTitle}   //弹窗标题
                        modalVisible={modalFormProTemplate} //是否打开弹窗
                        modalPageLink={modalPageLink} //页面链接
                        recordDetial={recordDetial}  //行数据
                        handleCancel={handleCancel}  //关闭弹窗方法
                    />
                    : null
            }

            {
                modalPageLink && erpEdit ?
                    <DataManageTemplate1
                        modalTitle={modalTitle}
                        modalVisible={erpEdit}
                        modalPageLink={modalPageLink}
                        recordDetial={recordDetial}
                        handleCancel={handleCancel}
                    />
                    : null
            }
        </Card>
    )
}

export default OptModalTableList;
