import React, { useEffect, useRef, useState } from 'react';
import {
    Table,
    Card,
    Input,
    DatePicker,
    Select,
    Form,
    Col,
    message,
    Space,
    Popconfirm,
    Row,
    Button,
    UploadProps,
    Modal,
} from 'antd';
// import '@/theme/default/common.less';
import TableSearchForm, { TableSearchFormInstance } from '@/pages/ReportForm/TempPage/components/TableSearchForm';
import { FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import moment from 'moment';
import api from '../service';
import { ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons';
import ModalFormTemplate from '../../ModalFormTemplate';
import ModalFormProTemplate from '../../ModalFormProTemplate';
import DataManageTemplate1 from '../../DataManageTemplate1';
import ExcelDownLoadButton from '@/pages/ReportForm/components/ExcelDownLoadButton';
import { history } from 'umi';
import { RcFile, UploadFile } from 'antd/lib/upload';
// import { getTreeDetailById } from '@/services/api';
import Dragger from 'antd/lib/upload/Dragger';
const { RangePicker } = DatePicker;
// const { Option } = Select;

const MainTableList: React.FC<{}> = (props: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [intCode, setIntCode] = useState<any>('');
    // 查询框
    const [queryFieldsProp, setQueryFieldsProp] = useState([]);
    const searchFormRef = useRef<TableSearchFormInstance | undefined>(undefined);
    const [filterObj, setFilterObj] = useState<any>(undefined);
    const [searchForm] = Form.useForm();
    // Table部分
    const [page, setPage] = useState({
        current: 1,
        total: 0,
    });
    const [pageSize, setPageSize] = useState<any>(5);
    const [pageNum, setPageNum] = useState<any>(1);
    const [tableColumns, setTableColumns] = useState<any>([]);
    const [tData, setData] = useState<any>();

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
    // 顶部按钮
    const [topbtnArr, setTopbtnArr] = useState<any>([]);
    const [isMoreSelect, setIsMoreSelect] = useState<boolean>(false)
    const [exceLoading, setExceLoading] = useState(false);
    const [tableColum, setTableColumn] = useState(undefined)
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectDataSource, setSelectDataSource] = useState({})
    const [uploadCode, setUploadCode] = useState<any>(undefined)
    const [uploadVisible, setUploadVisible] = useState(false)
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [UploadColumns, setUploadColumns] = useState<any>([]);
    useEffect(() => {
        getViewData();
    }, []);
    const getTableData = async (pageLink: any) => {
        const res1: any = await getTableProps(pageLink);
        res1 && pharseTableProps(res1);
    }
    const getTableProps = (pageLink: any) => {
        let tableLink = pageLink && pageLink.split("page&id=")[1];
        let pageProps: any = getTableCode(tableLink)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(pageProps);
            }, 300);
        });
    }
    // 根据页面id获取列表配置属性
    const getTableCode = async (id: any) => {
        const res0 = await api.getTreeDetailById({ id: id });
        if (res0.code === 0) {
            return res0.data;
        } else {
            message.error(res0.message || '操作失败')
            return undefined;
        }
    };


    // 列表属性解释
    const pharseTableProps = (data: any) => {
        let columnArr: any = [];
        // 列表属性解析
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
        });
        setUploadColumns(columnArr)
    }

    // 初始化话进入页面所有数据
    const getViewData = async () => {
        const res1: any = pharsePageProps(props.sqlData);
        const { srvCode, ...obj } = res1;
        searchForm.setFieldsValue({ ...obj }); //设置查询框默认值
        // 日期格式转化
        let newObj = { ...obj }
        for (let key in newObj) {
            if (key === 'inStartTime' || key === 'inEndTime') {
                newObj[key] = moment(newObj[key]).format('YYYY-MM-DD')
            }
        }
        res1 && getBizCodeData(srvCode, newObj, pageSize, pageNum, 1);
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
        let opebtnArr: any = []; //存在列按钮
        let topbtnArr: any = [];//顶部按钮
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
                if (item.tableColum == 'inStartTime') {
                    obj['inStartTime'] = moment().subtract(1, 'month')
                }
                if (item.tableColum == 'inEndTime') {
                    obj['inEndTime'] = moment()
                }
                arr.push(serchItemProps);
            }
            if (item.isId == 1) {
                setTableColumn(item.tableColum)
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
            if (item.isLinkTo == 1) {
                c_obj = {
                    ...c_obj,
                    render: (text: string, record: any) => {
                        return (
                            <a onClick={() => {
                                let obj: any = {}
                                let value: any = searchFormRef?.current?.getFormValues();
                                const condition = ['inStartTime', 'inEndTime']
                                for (let key in value) {
                                    if (condition.includes(key) && value[key]) {
                                        obj[key] = moment(value[key]._d).format("YYYY-MM-DD")
                                    }
                                    // else {
                                    //     obj[key] = value[key]
                                    // }
                                }
                                props.handleClickRow(record, obj)
                            }}>{text}</a>
                        );
                    }
                }
            }
            columnArr.push(c_obj);
        });
        getInitData(data?.initDataApi, arr);
        setTableColumns(columnArr);
        setFormFieldsProp(fieldsArr);
        // 按钮数据属性解析
        data && data?.topBut.map((it: any) => {
            if (it.position.includes('1')) {
                topbtnArr.push(it)
                if (it.type.includes('10')) {
                    setIsMoreSelect(true)
                }
            } else if (it.position.includes('2')) {
                opebtnArr.push(it);
            } else {
                return;
            }
        });
        setTopbtnArr(topbtnArr);
        setOpebtnArr(opebtnArr);
        // 数据接口参数解释
        data && data?.opeBut.map((ite: any) => {
            if (ite.paramValue && ite.paramType) {
                if (ite.paramType == 'datePicker') {
                    obj[ite.paramName] = moment(ite.paramValue);
                } else if (ite.paramType == 'rangerPicker') {
                    let arr: any = [moment(ite.paramValue.split(',')[0]), moment(ite.paramValue.split(',')[1])];
                    obj[ite.paramName] = arr;
                }
                else {
                    obj[ite.paramName] = ite.paramValue;
                }
            }
        });
        obj.srvCode = data.intCode;
        const { srvCode, ...obj1 } = obj;
        setFilterObj(obj1);
        return obj;
    }

    // 获取列表数据 by BizCode
    const getBizCodeData = async (srvCode: any, filterFFFF: any, pageSize: any, pageNum: any, flag: any) => {
        setLoading(true);
        let res0: any = await api.getDataByBizCode(Object.assign({ srvCode }, filterFFFF, { pageSize }, { pageNum }));
        let res = res0.response;
        if (res.code === 0 && res.data.cursor_result) {
            setData(res.data.cursor_result);
        } else {
            res.code !== 0 && message.error(res.message || '操作失败')
        }

        let obj: any = {};
        let value: any = searchFormRef?.current?.getFormValues();
        if (value) {
            const condition = ['inStartTime', 'inEndTime']
            for (let key in value) {
                if (condition.includes(key) && value[key]) {
                    obj[key] = moment(value[key]._d).format("YYYY-MM-DD")
                }
                // else {
                //     obj[key] = value[key]
                // }
            }
        } else {
            obj['inStartTime'] = filterFFFF['inStartTime']
            obj['inEndTime'] = filterFFFF['inEndTime']
        }
        flag && props.handleClickRow(res.data?.cursor_result?.records[0], obj);
        setLoading(false);
    }

    // 分页、排序、筛选变化时触发
    const onTableChange = async (pagination: any, filters: any, sorter: any) => {
        setPageSize(pagination.pageSize)
        setPage(pagination);
        getBizCodeData(intCode, filterObj, pagination.pageSize, pagination.current, 0);
    }

    // 查询框 筛选类型的组件
    const getComponents = (item: any, initData: any) => {
        const { componentCode: config } = item;
        const condition = ['disabled', 'searchSpan'];
        for (let key in config) {
            if (condition.includes(key)) {
                delete config[key]
            }
        }
        let dom: any = <Input {...config} placeholder={`请输入`} allowClear />;
        switch (item.filterType) {
            case 'input':
                dom = <Input {...config} />;
                break;
            case 'select':
                dom = <Select
                    {...config}
                    onChange={(e) => console.log('e', e)}
                    filterOption={(input: any, option: any) =>
                        (config.fieldNames.label && option[config.fieldNames.label].toLowerCase().includes(input.toLowerCase()))
                    }
                    showSearch={true}
                    options={initData && !!initData[item.name] && initData[item.name] && initData[item.name].length > 0 ? initData[item.name] : []}
                >

                </Select>
                break;
            case 'datePicker':
                dom = <DatePicker {...config} style={{ width: '100%' }}></DatePicker>
                break;
            case 'rangerPicker':
                dom = <RangePicker {...config} style={{ width: '100%' }}></RangePicker>
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
        getBizCodeData(intCode, { ...filterObj, ...e }, pageSize, pageNum, 1);
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
        getBizCodeData(intCode, obj, pageSize, pageNum, 1);
    };


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
        flag && getBizCodeData(intCode, filterObj, pageSize, pageNum, 0);
    };

    // 删除表格行内容
    const deleteRowData = async (record: any, code: any) => {
        let res: any = await api.execByCode(JSON.stringify(record), code);
        if (res.response.code === 0) {
            message.success(res.response.message);
        } else {
            message.error(res.response.message || '操作失败');
        }
        getBizCodeData(intCode, filterObj, pageSize, pageNum, 0);
    }

    // 批量删除表格内容
    const deleteMoreRowData = async (record: any, code: any) => {
        let obj: any = {}
        let arr: any = []
        record.map((item: any, index: any) => {
            !!tableColum && arr.push(item[tableColum])
        })
        obj['pkId'] = arr.toString()
        let res: any = await api.execByCode(JSON.stringify(obj), code);
        if (res.response.code === 0) {
            message.success(res.response.message || '删除成功');
            setSelectedRowKeys([])
            setSelectDataSource({})
        } else {
            message.error(res.response.message || '删除失败');
        }
        getBizCodeData(intCode, filterObj, pageSize, pageNum, 0);
    }

    const rowSelection = {
        //默认选中
        selectedRowKeys,
        onChange: (record: any, selectedRowKeys: any) => {
            setSelectedRowKeys(record)
            setSelectDataSource(selectedRowKeys)
        }
    }
    const uploadProps: UploadProps = {
        // onRemove: file => {
        //     const index = fileList.indexOf(file);
        //     const newFileList = fileList.slice();
        //     newFileList.splice(index, 1);
        //     setFileList(newFileList);
        // },
        beforeUpload: file => {
            // setFileList([...fileList, file])
            setFileList([file])
            return false;
        },
        fileList,
    };
    const handleUpload = () => {
        const formData = new FormData();
        fileList.forEach(file => {
            formData.append('file', file as RcFile);
        });
        fetch(uploadCode, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
            .then(res => {
                res.json()
            })
            .then(() => {
                setFileList([]);
                message.success('upload successfully.');
                setUploadVisible(false)
            })
            .catch(() => {
                message.error('upload failed.');
            })
    }
    return (
        <>
            {// 查询框
                props.isSearch && queryFieldsProp.length > 0 ?
                    <TableSearchForm
                        ref={searchFormRef}
                        queryFieldsProp={queryFieldsProp}
                        onSearch={onSearch}
                        onReset={onReset}
                        form={searchForm}
                        collapsable={true}
                    />
                    : null
            }
            <Card
                style={{ height: props.moduleHeight ? props.moduleHeight : 400, marginTop: 10 }}
                title={//顶部区域
                    topbtnArr.length > 0 ?
                        <Space>
                            {
                                topbtnArr.map((ite: any, i: any) => (
                                    ite.type == 2 ?   //新增跳转链接
                                        (
                                            <Button key={i} type="primary" onClick={() => {
                                                if (ite.link.indexOf('/report-manage/ModalFormReport/page&id=') > -1) {
                                                    setIsDisabled(false);
                                                    setModalTitle(ite.name);
                                                    setModalPageLink(ite.link);
                                                    setModalFormTemplate(true)
                                                } else if (ite.link.indexOf('/report-manage/ModalFormProReport/page&id=') > -1) {
                                                    setIsDisabled(false);
                                                    setModalTitle(ite.name);
                                                    setModalPageLink(ite.link);
                                                    setModalFormProTemplate(true)
                                                } else {
                                                    setIsDisabled(false);
                                                    history.push(ite.link)
                                                }
                                            }}>{ite.name}</Button>
                                        )
                                        : (
                                            ite.type == 9 ?   //导出
                                                (
                                                    !!tData && tData.records && tData.records.length > 0 ?
                                                        <ExcelDownLoadButton
                                                            url={ite.link}
                                                            isloading={exceLoading}
                                                            // method = 'POST'
                                                            data={() => {
                                                                setExceLoading(true)
                                                                setTimeout(() => {
                                                                    setExceLoading(false)
                                                                }, 5000)
                                                                return { srvCode: intCode, pageNum: tData.page ? tData.page : 1, pageSize: tData.total ? tData.total : 100000 }
                                                            }}
                                                            type="primary"
                                                        >
                                                            {ite.name}
                                                        </ExcelDownLoadButton>
                                                        :
                                                        null
                                                )
                                                : (
                                                    ite.type == 10 && tableColum ?   //批量删除
                                                        (
                                                            <Popconfirm
                                                                key={1}
                                                                title="你确定要删除这些内容吗?"
                                                                onConfirm={() => {
                                                                    deleteMoreRowData(selectDataSource, ite.code)
                                                                }}
                                                                okText="确定"
                                                                cancelText="取消"
                                                                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                                                            >
                                                                <Button type='primary'>{ite.name}</Button>
                                                            </Popconfirm>
                                                        )
                                                        : (
                                                            ite.type == 11 ?   //导入
                                                                (
                                                                    <Button type='primary'
                                                                        onClick={() => {
                                                                            setUploadCode(ite.code)
                                                                            setUploadVisible(true)
                                                                            ite.link && getTableData(ite.link)
                                                                        }}
                                                                    >{ite.name}</Button>
                                                                )
                                                                : null

                                                        )

                                                )

                                        )


                                ))
                            }
                        </Space>
                        : null
                }
                bordered={false}
            >
                {/* 列表部分 */
                    tableColumns.length > 0 ?
                        <Table
                            id="antdTable"
                            bordered={true}
                            size="small"
                            rowKey={(record: any, index: any) => index}
                            columns={opebtnArr.length > 0 ? columns : tableColumns}
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
                                pageSize: tData ? tData.limit : 5,
                                total: tData ? tData.total : 0,
                                current: tData ? tData.page : 1,
                                showQuickJumper: true,
                                showSizeChanger: true,
                                showTotal: (total: any, range: any[]) =>
                                    `第 ${range[0]} 项 - 第 ${range[1]} 项  /  共 ${total} 项`,
                            })}
                            onChange={onTableChange} //点击分页触发
                            rowSelection={tableColum && isMoreSelect ? { ...rowSelection } : undefined}
                        />
                        : null
                }

            </Card>
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
            {
                uploadCode && uploadVisible ?
                    <Modal
                        visible={uploadVisible}
                        onCancel={() => {
                            setUploadVisible(false)
                        }}
                        destroyOnClose={true}
                        maskClosable={false}
                        footer={[]}
                    >
                        <Row justify="center" align="middle" style={{ padding: '10px' }}>
                            <Col span={24}>
                                <Card title="导入模板" bordered={false}>
                                    <Table columns={UploadColumns} dataSource={[]} scroll={{ x: true }} />
                                </Card>
                                <Dragger {...uploadProps} maxCount={1} onChange={handleUpload}>
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-hint">点击或拖拽文件到此区域上传</p>
                                </Dragger>

                            </Col>
                        </Row>
                    </Modal>
                    : null
            }
        </>
    )
}

export default MainTableList;
