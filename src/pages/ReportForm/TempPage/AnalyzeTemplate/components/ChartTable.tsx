import React, { useEffect, useRef, useState } from 'react';
import {
    Table,
    Card,
    message,
    Space,
    Button,
    Input,
    Popconfirm,
    DatePicker,
    Select,
    Form,
    Row,
    Col,
    Modal,
    UploadProps,
    UploadFile,
} from 'antd';
import { history } from 'umi';
import { ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons';
import './styles.less';
import TableSearchForm, { TableSearchFormInstance } from '@/pages/ReportForm/TempPage/components/TableSearchForm';
import { FormInstance } from 'antd/lib/form';
import { FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import moment from 'moment';
import api from '../service';
import ModalFormTemplate from '../../ModalFormTemplate';
import ModalFormProTemplate from '../../ModalFormProTemplate';
import ModalFormItem from './ModalFormItem';
import { previewRichtext } from '@/pages/ReportForm/TempPage/components/richText/preRichtextHtml';
import ExcelDownLoadButton from '@/pages/ReportForm/components/ExcelDownLoadButton';
import { RcFile } from 'antd/lib/upload';
import Dragger from 'antd/lib/upload/Dragger';

const { RangePicker } = DatePicker;

// 调接口转译列表的某一列的数据
const ColSpanText = (props: any) => {
    const [text, setText] = useState<any>('');
    useEffect(async () => {
        let res: any = await api.execByCode(JSON.stringify(props.recordData), props.code);
        if (res.response.code === 0) {
            setText(res.response.data)
        } else {
            message.error(res.response.message || '转换失败');
            return
        }
    }, [])
    return (<span>{text}</span>)
}

const ChartTable: React.FC<{}> = (props: any) => {

    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [intCode, setIntCode] = useState<any>('');
    // 顶部按钮
    const [topbtnArr, setTopbtnArr] = useState<any>([]);
    // 查询框
    const [queryFieldsProp, setQueryFieldsProp] = useState([]);
    const searchFormRef = useRef<TableSearchFormInstance | undefined>(undefined);
    const [filterObj, setFilterObj] = useState<any>(undefined);
    const [searchForm] = Form.useForm<FormInstance | undefined>();
    // Table部分
    const [page, setPage] = useState({
        current: 1,
        total: 0,
    });
    const [pageSize, setPageSize] = useState<any>(undefined);
    const [pageNum, setPageNum] = useState<any>(undefined);
    const [opebtnArr, setOpebtnArr] = useState<any>([]);
    const [tableColumns, setTableColumns] = useState<any>([]);
    const [tData, setData] = useState<any>();
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectDataSource, setSelectDataSource] = useState({})
    // 下拉list数据
    const [initData, setInitData] = useState(undefined);
    // 表单属性
    const [formFieldsProp, setFormFieldsProp] = useState([]);
    // 弹窗部分
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<any>(undefined);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [recordDetial, setRecordDetial] = useState<any>(undefined);
    const [submitCode, setSubmitCode] = useState<any>(undefined); //用原有的页面属性

    const [modalPageLink, setModalPageLink] = useState<any>(undefined); //跳转页面
    const [modalFormTemplate, setModalFormTemplate] = useState<boolean>(false)  //新增模板链接（不含附件）
    const [modalFormProTemplate, setModalFormProTemplate] = useState<boolean>(false)  //新增模板链接（含附件）
    const [exceLoading, setExceLoading] = useState(false);
    const [tableColum, setTableColumn] = useState(undefined)
    const [uploadVisible, setUploadVisible] = useState(false)
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadCode, setUploadCode] = useState<any>(undefined)
    // 操作列宽度
    const [optionWidth, setOptionWidth] = useState<number>(180);
    const [UploadColumns, setUploadColumns] = useState<any>([]);
    const [isMoreSelect, setIsMoreSelect] = useState<boolean>(false)

    useEffect(() => {
        setPageLoading(true);
        setTopbtnArr([]);
        setQueryFieldsProp([]);
        setTableColumns([]);
        setData([]);
        const res1: any = pharsePageProps(props.sqlData);
        const { srvCode, ...obj } = res1;
        searchForm.setFieldsValue({ ...obj }); //设置查询框默认值
        // setTimeout(() => {
        // }, 1000)
        return () => { };
    }, [props.sqlData]);

    useEffect(() => {
        getBizCodeData(props.sqlData.intCode, { ...filterObj }, pageSize, pageNum);
    }, [])

    const getTableData = async (pageLink: any) => {
        const res1: any = await getTableProps(pageLink);
        res1 && pharseTableProps(res1);
    }

    const getTableProps = (pageLink: any) => {
        let tableLink = pageLink && pageLink.split("?id=")[1];
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
            if (item.optionWidth) {
                let width = Number(item.optionWidth)
                width && setOptionWidth(width)
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
    // 获取页面下拉框子项数据
    const getInitData = async (code: any, arr: any) => {
        let initData: any = undefined;
        if (code && arr.length) {
            let res: any = await api.execByCode(JSON.stringify({}), code);
            if (res.response.code === 0) {
                initData = res.response.data;
                setInitData(res.response.data);
            } else {
                message.error(res.message || '下拉框数据获取失败');
                return
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


    // 属性解释
    const pharsePageProps = (data: any) => {
        let topbtnArr: any = [];
        let opebtnArr: any = [];
        let columnArr: any = [];
        let arr: any = [];
        let obj: any = {}
        // 表单属性
        let fieldsArr: any = [];
        // 保存数据编码
        setIntCode(data?.intCode);
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
                }
                arr.push(serchItemProps);
            }
            if (item.isId == 1) {
                setTableColumn(item.tableColum)
            }
            if (item.optionWidth) {
                let width = Number(item.optionWidth)
                width && setOptionWidth(width)
            }

            // 表单属性构建
            let f_obj: any = {
                key: index,
                filterType: item.filterType,
                isFilter: item.isFilter,
                isDisabled: item.isDisabled,
                tableColum: item.tableColum,
                displayName: item.displayName,
                formItemProps: formItemProps,
                componentCode: componentCode,
                code: item.code,
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
            if (!!item.code && item.code != '') {
                c_obj = {
                    ...c_obj,
                    render: (_: any, record: any) => {
                        return (
                            <ColSpanText recordData={record} code={item.code} />
                        );
                    }
                }
            }
            if (item.filterType == 'RichText') {
                c_obj = {
                    ...c_obj,
                    render: (text: any, record: any) => {
                        return (
                            <a
                                href="javascript:;"
                                onClick={() => previewRichtext(record.richtextHtml)}
                            >预览富文本</a>
                        )
                    }
                }
            }
            columnArr.push(c_obj);
        });
        getInitData(data?.initDataApi, arr)
        setTableColumns(columnArr);
        setFormFieldsProp(fieldsArr);
        setPageLoading(false);
        obj.srvCode = data.intCode;
        const { srvCode, ...obj1 } = obj;
        setFilterObj(obj1);
        return obj;
    }

    // 获取列表数据 by BizCode
    const getBizCodeData = async (srvCode: any, filterFFFF: any, pageSize: any, pageNum: any) => {
        setLoading(true);
        setData([]);

        let res0: any = await api.getDataByBizCode(Object.assign({ srvCode }, filterFFFF, { pageSize }, { pageNum }));
        let res = res0.response;
        if (res.code === 0) {
            res.data.cursor_result && setData(res.data.cursor_result);
        } else {
            message.error(res.message);
        }
        setLoading(false);
        // combine 组件 loading title
        props.getLoading && props.getLoading();
        // combine 组件 loading title--- end
    }

    // 分页、排序、筛选变化时触发
    const onTableChange = async (pagination: any, filters: any, sorter: any) => {
        setPageSize(pagination.pageSize)
        setPage(pagination);
        getBizCodeData(intCode, filterObj, pagination.pageSize, pagination.current);
    }

    // 删除表格行内容
    const deleteRowData = async (record: any, code: any) => {
        let res: any = await api.execByCode(JSON.stringify(record), code);
        if (res.response.code === 0) {
            message.success(res.response.message || '删除成功');
        } else {
            message.error(res.response.message || '删除失败');
        }
        getBizCodeData(intCode, filterObj, pageSize, pageNum);
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
        getBizCodeData(intCode, filterObj, pageSize, pageNum);
    }
    // 表格 cloumn
    // const columns: any = [
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
                                item.type == 5 ? //修改
                                    (
                                        <a key={i} onClick={() => {
                                            let rowData: any = getFormItemValue(record);
                                            setIsDisabled(false);
                                            setModalVisible(true);
                                            setModalTitle(item.name);
                                            setSubmitCode(item.code);
                                            setRecordDetial(rowData);
                                        }}>{item.name}</a>
                                    )
                                    :
                                    (
                                        item.type == 7 ? //删除
                                            (
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
                                            ) : (
                                                item.type == 2 ?  //跳转其他页面
                                                    (
                                                        <a key={i} onClick={() => {
                                                            // let rowData: any = getFormItemValue(record);
                                                            // setIsDisabled(false);
                                                            // setModalVisible(true);
                                                            // setModalTitle(item.name);
                                                            // setModalPageLink(item.link);
                                                            // setRecordDetial(rowData);
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
                                                            }
                                                        }}>{item.name}</a>
                                                    ) : null
                                            )
                                    )
                            ))
                        }
                    </Space>
                );
            },
        },

    ];

    // 查询框 筛选类型的组件
    const getComponents = (item: any, initData: any) => {
        const { componentCode: config } = item;
        for (let key in config) {
            if (key === 'disabled' || key === 'isAdd' || key === 'isEdit' || key === 'isDetial' || key === 'searchSpan') {
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
                    if (!!newRowDetail[item.tableColum] && newRowDetail[item.tableColum]) {
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
                    if (!!newRowDetail[item.tableColum] && newRowDetail[item.tableColum]) {
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

    // 查询框 查询
    const onSearch = (e: any) => {
        queryFieldsProp.length && queryFieldsProp.map((item: any) => {
            // 时间范围
            if (item.filterType === 'rangerPicker') {
                for (let key in e) {
                    if (key === item.name && e[key] != undefined) {
                        e[`s_${key}`] = moment(e[key][0]._d).format('YYYY-MM-DD');
                        e[`e_${key}`] = moment(e[key][1]._d).format('YYYY-MM-DD');
                        // let nowTime = new Date();
                        // if (nowTime < e[`e_${key}`]) {
                        //     return -1;
                        // }
                        delete e[key];
                    }
                }
            }
            // 日期控件
            if (item.filterType === 'datePicker') {
                for (let key in e) {
                    if (key === item.name && e[key] != undefined) {
                        e[key] = item.componentCode.picker && item.componentCode.picker == "month" ? moment(e[key]).format("YYYYMM") : moment(e[key]).format("YYYY-MM-DD")
                    }
                }
            }
            //下拉框多选
            if (item.filterType === 'select' && !!item.componentCode && item.componentCode?.mode) {
                for (let key in e) {
                    if (key === item.name && e[key] !== undefined) {
                        e[key] = e[key].toString()
                    }
                }
            }
        })
        for (let key in e) {
            if (e[key] === undefined || e[key] === null || e[key] === '') {
                delete e[key]
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

    /**
     * 按钮操作-顶部按钮
    */
    // topbtn type == 1 新增弹窗
    const handleCancel = (flag: any) => {
        setModalVisible(false);
        setModalTitle(undefined);
        setModalPageLink(undefined);
        setRecordDetial(undefined);
        setSubmitCode(undefined);
        setModalFormTemplate(false);
        setModalFormProTemplate(false);
        //新增提交数据后、修改提交数据后，刷新数据页面 ，
        flag && getBizCodeData(intCode, filterObj, pageSize, pageNum);
    };

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
    };

    return (
        <>
            {// 查询框
                queryFieldsProp.length > 0 ?
                    // <Card className="area-mt">
                    // <Row justify="center" align="middle">
                    //     <Col span={24}>
                    <TableSearchForm
                        ref={searchFormRef}
                        queryFieldsProp={queryFieldsProp}
                        onSearch={onSearch}
                        onReset={onReset}
                        form={searchForm}
                    />
                    //     </Col>
                    // </Row>
                    // </Card>
                    : null
            }
            <Card bordered={false}>
                {//顶部区域
                    topbtnArr.length > 0 ?
                        <Row style={{ paddingTop: 10 }}>
                            <Space>
                                {
                                    topbtnArr.map((ite: any, i: any) => (
                                        ite.type == 1 ? //新增弹窗
                                            (
                                                <Button key={i} type="primary" onClick={() => {
                                                    setIsDisabled(false);
                                                    setModalVisible(true);
                                                    setModalTitle(ite.name);
                                                    setSubmitCode(ite.code);
                                                }}>{ite.name}</Button>
                                            ) : (
                                                ite.type == 2 ?   //跳转链接
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

                                            )

                                    ))
                                }
                            </Space>
                        </Row>
                        : null
                }

                {/* 列表部分 */
                    tableColumns.length > 0 ?

                        <Table
                            id="antdTable"
                            bordered={true}
                            size="small"
                            scroll={{ x: 1000 }}
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
                            rowSelection={tableColum && isMoreSelect ? { ...rowSelection } : undefined}
                        />

                        : null
                }
            </Card>

            {
                modalPageLink && modalFormTemplate ?
                    <ModalFormTemplate
                        isDisabled={isDisabled} //是否可编辑
                        modalTitle={modalTitle} //弹窗标题
                        modalVisible={modalFormTemplate} //是否打开弹窗
                        modalPageLink={modalPageLink} //页面链接
                        recordDetial={recordDetial}  //行数据
                        handleCancel={handleCancel} //关闭弹窗方法
                    />
                    : null
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
                submitCode || isDisabled && modalVisible ? <ModalFormItem
                    isDisabled={isDisabled}
                    modalTitle={modalTitle}
                    modalVisible={modalVisible}
                    recordDetial={recordDetial}
                    handleCancel={handleCancel}
                    formFieldsProp={formFieldsProp.length > 0 ? formFieldsProp : []}
                    submitCode={submitCode}
                    initData={initData}
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

export default ChartTable;
