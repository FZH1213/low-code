import React, { useEffect, useRef, useState } from 'react';
import {
    Table,
    Card,
    message,
    Space,
    Button,
    Upload,
    Input,
    Popconfirm,
    DatePicker,
    Select,
    Form,
    UploadFile,
    Modal,
    Row,
    Col,
    UploadProps,
    Cascader,
    Dropdown,
    Menu,
} from 'antd';
import { history, useParams } from 'umi';
import { ExclamationCircleOutlined, InboxOutlined, UploadOutlined, DownOutlined } from '@ant-design/icons';
import TableSearchForm, { TableSearchFormInstance } from '@/pages/ReportForm/TempPage/components/TableSearchForm';
import { FormInstance } from 'antd/lib/form';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import moment from 'moment';
import api from './service';
import ModalFormTemplate from '../ModalFormTemplate';
import ModalFormProTemplate from '../ModalFormProTemplate';
import ModalFormItem from './components/ModalFormItem';
import DataManageTemplate1 from '../DataManageTemplate1';
import { previewRichtext } from '@/pages/ReportForm/TempPage/components/richText/preRichtextHtml';
import ExcelDownLoadButton from '@/pages/ReportForm/components/ExcelDownLoadButton';
import Dragger from 'antd/lib/upload/Dragger';
import { RcFile } from 'antd/lib/upload';

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


const FunctionComponent: React.FC<{}> = (props: any) => {
    const { code }: any = useParams();
    // console.log(code, '123c');

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
    // 下拉list数据
    const [initData, setInitData] = useState(undefined);
    // 表单属性
    const [formFieldsProp, setFormFieldsProp] = useState<any>([]);
    // 弹窗部分
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<any>(undefined);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [recordDetial, setRecordDetial] = useState<any>(undefined);
    const [submitCode, setSubmitCode] = useState<any>(undefined); //用原有的页面属性

    const [modalPageLink, setModalPageLink] = useState<any>(undefined); //跳转页面
    const [modalFormTemplate, setModalFormTemplate] = useState<boolean>(false)  //新增模板链接（不含附件）
    const [modalFormProTemplate, setModalFormProTemplate] = useState<boolean>(false)  //新增模板链接（含附件）
    const [erpEdit, setErpEdit] = useState<boolean>(false); //erp编辑模板
    const [exceLoading, setExceLoading] = useState(false);
    const [selectDataSource, setSelectDataSource] = useState({})
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [tableColum, setTableColumn] = useState(undefined)
    const [UploadColumns, setUploadColumns] = useState<any>([]);
    const [uploadVisible, setUploadVisible] = useState(false)
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploadCode, setUploadCode] = useState<any>(undefined)
    const [isMoreSelect, setIsMoreSelect] = useState<boolean>(false)
    // 操作列宽度
    const [optionWidth, setOptionWidth] = useState<number>(180);
    //每行input框个数
    const [rowInput, setRowInput] = useState<any>(0);

    useEffect(() => {
        setPageLoading(true);
        setTopbtnArr([]);
        setQueryFieldsProp([]);
        setTableColumns([]);
        setData([]);
        // setTimeout(() => {
        getViewData();
        // }, 1000)
        return () => { };
    }, [code]);

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

    // 初始化话进入页面所有数据
    const getViewData = async () => {
        const res1: any = await getViewProps();
        // debugger;
        const { srvCode, ...obj } = res1;
        searchForm.setFieldsValue({ ...obj }); //设置查询框默认值
        res1 && getBizCodeData(srvCode, obj, pageSize, pageNum);
    }

    // 获取页面配置的属性
    const getViewProps = () => {
        let pageProps: any = getSrvCode(code.split("page&id=")[1]);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(pageProps);
            }, 300);
        });
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

    // 根据页面id获取页面配置属性
    const getSrvCode = async (id: any) => {

        let obj: any = {};
        const res0 = await api.getTreeDetailById({ id: id });
        if (res0.code === 0) {
            const defaultValue: any = pharsePageProps(res0.data);
            // 数据接口参数解释
            res0.data && res0.data?.opeBut.map((ite: any) => {
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

            obj.srvCode = res0.data.intCode;
            obj = { ...obj, ...defaultValue }
            const { srvCode, ...obj1 } = obj;
            setFilterObj(obj1);
            return obj;
        } else {
            message.error(res0.message || '操作失败');
            return undefined;
        }
    };

    // 属性解释
    const pharsePageProps = (data: any) => {
        let topbtnArr: any = [];
        let opebtnArr: any = [];
        let columnArr: any = [];
        let arr: any = [];
        let defaultValue: any = {};
        // 表单属性
        let fieldsArr: any = [];
        // 保存数据编码
        setIntCode(data?.intCode);
        // 按钮数据属性解析
        data && data?.topBut.map((it: any) => {
            // console.log(it, '123it');
            //权限控制隐藏与显示
            if (it.permissionCode && it.isShow == 1 || !it.isShow) {
                //有权限有权限编码显示,只有权限编码也显示,有权限无权限编码不显示,无权限不显示,都为空显示(原来的)
                // console.log(it, '123item');
                if (it.position.includes('1')) {
                    topbtnArr.push(it)
                    if (it.type.includes('10')) {
                        setIsMoreSelect(true)
                    }
                } else if (it.position.includes('2')) {
                    if (it.type.includes("13")) {
                        // setArrLevel(true)

                        console.log("13")
                    } else {
                        opebtnArr.push(it);
                    }
                } else {
                    return;
                }
            }
        });
        setTopbtnArr(topbtnArr);
        setOpebtnArr(opebtnArr);

        // 搜素框解析、列表属性解析
        let flag = false;
        data && data?.intfIttrDescList1.map((item: any, index: any) => {
            let componentCode = JSON.parse(item.componentCode);
            let formItemProps: any = {};
            let tableColProps: any = {};
            for (let key in componentCode) {
                if (key == "rowinput") {
                    flag = true
                    setRowInput(componentCode[key])
                    delete componentCode[key]
                }
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
                    // components: getComponents(item.filterType, item.tableColum, componentCode)
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
            if (item.defaultValue) {
                defaultValue[item.tableColum] = item.defaultValue;
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
                            // <span>{record[`${item.tableColum}1`]}</span>
                            <ColSpanText recordData={record} code={item.code} />
                        );
                    }
                }
            }
            if (item.filterType == 'upload') {
                c_obj = {
                    ...c_obj,
                    render: (text: any, record: any) => {
                        console.log("Record", record)
                        console.log("text", text)
                        return (
                            <div>
                                {text && text != "[]" && text.length > 0 &&
                                    JSON.parse(text).map((item: any) => {
                                        return (
                                            <a href={`/api/file/fileDown/downloadFileById?fileId=${item.fileId}`}>{item.fileName}</a>
                                        )
                                    })
                                }
                            </div>
                        )
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
        if (!flag) {
            setRowInput(3)
        }
        getInitData(data?.initDataApi, arr)
        setTableColumns(columnArr);
        setFormFieldsProp(fieldsArr);
        setPageLoading(false);
        return defaultValue;
    }

    // 获取列表数据 by BizCode
    const getBizCodeData = async (srvCode: any, filterFFFF: any, pageSize: any, pageNum: any) => {
        setLoading(true);
        setData([]);
        let res0: any = await api.getDataByBizCode(Object.assign({ srvCode }, filterFFFF, { pageSize }, { pageNum }));
        let res = res0.response;
        if (res.code === 0) {
            // console.log(res.data.cursor_result, '123res.data.cursor_result');

            res.data.cursor_result && setData(res.data.cursor_result);
        } else {
            message.error(res.message);
        }
        setLoading(false);
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
    const columns: any = [
        {
            key: 'number',
            title: '序号',
            align: 'center',
            // bordered: true,
            width: '100px',
            render: (text: any, record: any, index: any) => {
                return (
                    <div>
                        {page.current < 2 ?
                            (
                                <div>{index + 1}</div>
                            ) : (
                                <div>{index + 1 + (page.current - 1) * (pageSize)}</div>
                                //分页后不从0开始,index+1+(页码-1)*条数+1=>0+1+(2-1)*10=>11
                            )}
                    </div>

                )
            }
        },
        ...tableColumns,
        {
            key: 'option',
            title: '操作',
            align: 'center',
            width: optionWidth,
            fixed: 'right',
            render: (text: any, record: any, index: any) => {
                return (
                    <Space>
                        {
                            // console.log(index, 123)
                            // console.log(record, 456)
                            // console.log(index, 789)
                        }
                        {
                            opebtnArr.length > 0 && opebtnArr.map((item: any, i: any) => (
                                item.type == 2 ? (
                                    <a key={i} onClick={() => {
                                        let rowData: any = getFormItemValue({ ...record });
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
                                        } else if (item.link.indexOf('/reportform/create/manage-page1/choice-sql?id=') > -1 && item.link.indexOf("问卷模板") > -1) {
                                            history.push(`/reportform/create/manage-page1/choice-sql?id=${record.id}&title=问卷模板&tplTypId=909271860088160`)
                                        }

                                        else {
                                            setIsDisabled(false);
                                            // history.push(item.link)
                                            window.location.href = item.link
                                        }
                                    }}>{item.name}</a>
                                )
                                    :
                                    (
                                        item.type == 3 ? (
                                            <a>{item.name}</a>
                                        ) : (
                                            item.type == 4 ?
                                                (
                                                    <a>{item.name}</a>
                                                ) :
                                                (
                                                    item.type == 5 ?
                                                        (
                                                            <a key={i} onClick={() => {
                                                                let rowData: any = getFormItemValue({ ...record });
                                                                setIsDisabled(false);
                                                                setModalVisible(true);
                                                                setModalTitle(item.name);
                                                                setSubmitCode(item.code)
                                                                setRecordDetial(rowData);
                                                            }}>{item.name}</a>
                                                        ) :
                                                        (
                                                            item.type == 6 ? (
                                                                <a key={i} onClick={() => {
                                                                    let rowData: any = getFormItemValue({ ...record });
                                                                    if (item.link && item.link.indexOf('/report-manage/ModalFormReport/') > -1) {
                                                                        setIsDisabled(true);
                                                                        setModalTitle(item.name);
                                                                        setModalPageLink(item.link);
                                                                        setRecordDetial(rowData);
                                                                        setModalFormTemplate(true)
                                                                    } else if (item.link && item.link.indexOf('/report-manage/ModalFormProReport/') > -1) {
                                                                        setIsDisabled(true);
                                                                        setModalTitle(item.name);
                                                                        setModalPageLink(item.link);
                                                                        setRecordDetial(rowData);
                                                                        setModalFormProTemplate(true)
                                                                    }
                                                                    else if (!item.link && !item.code) {
                                                                        setIsDisabled(true);
                                                                        setModalVisible(true);
                                                                        setModalTitle(item.name);
                                                                        setRecordDetial(rowData);
                                                                    } else {
                                                                        setIsDisabled(true);
                                                                        history.push(item.link)
                                                                    }
                                                                }}>{item.name}</a>
                                                            ) :
                                                                (
                                                                    item.type == 7 ?
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
                                                                        )
                                                                        :
                                                                        null
                                                                )
                                                        )
                                                )
                                        )

                                    )
                            ))
                        }
                    </Space>
                )
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
                break;
            case 'Cascader':
                dom = <Cascader
                    {...config}
                    options={initData && !!initData[item.name] && initData[item.name] && initData[item.name].length > 0 ? initData[item.name] : []}
                    onChange={(value) => { console.log(value) }}
                />
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
                    }
                    //  else {
                    //     newRowDetail[item.tableColum] = moment()
                    // }
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
                        // newRowDetail[item.tableColum] = newRowDetail[item.tableColum].split(',')
                        newRowDetail[item.tableColum] = newRowDetail[item.tableColum]
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
            // 级联选择器值格式化
            if (item.filterType == 'Cascader') {
                for (let key in e) {
                    if (key == item.name && e[key] !== undefined) {
                        e[key] = e[key][e[key].length - 1].toString()//数组最后一个数
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
    //topbtn type == 3 按钮调规则接口
    const junkInterface = async (code: any) => {
        let param: any = {
            bizMap: {}
        }
        const res: any = await api.execByCode(JSON.stringify(param), code);
        if (res.response.code == 0) {
            message.success(res.response.message)
            setTimeout(() => {
                getBizCodeData(intCode, filterObj, pageSize, pageNum);
            }, 500);
        } else {
            message.error(res.response.message)
        }
    }

    // topbtn type == 4 导入文件按钮
    const Uprops = {
        name: 'file',
        headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
        },
        showUploadList: false,
        onChange(info: any) {
            if (info.file.status === 'done') {
                setTimeout(() => {
                    message.success(`${info.file.name} 导入成功!`);
                    getBizCodeData(intCode, filterObj, pageSize, pageNum);
                }, 2000)
            } else if (info.file.status === 'error') {
                setTimeout(() => {
                    message.error(`${info.file.name} 导入失败!`);
                }, 2000)
            }
        },
    };

    // topbtn type == 1 新增弹窗
    const handleCancel = (flag: any) => {
        setModalVisible(false);
        setModalTitle(undefined);
        setModalPageLink(undefined);
        setRecordDetial(undefined);
        setSubmitCode(undefined);
        setErpEdit(false);
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
            // setFileList([...fileList, file]);
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
                queryFieldsProp.length > 0 && rowInput ?
                    <TableSearchForm
                        ref={searchFormRef}
                        queryFieldsProp={queryFieldsProp}
                        onSearch={onSearch}
                        onReset={onReset}
                        form={searchForm}
                        rowInput={rowInput}//每行input框个数
                    />
                    : null
            }
            <Card
                style={queryFieldsProp.length > 0 ? { marginTop: 10 } : {}}
                title={//顶部区域
                    topbtnArr.length > 0 ?
                        <Space>
                            {
                                topbtnArr.map((ite: any, i: any) => (
                                    ite.type == 1 ? //新增弹窗
                                        (
                                            console.log('111'),

                                            <Button key={i} type="primary" onClick={() => {
                                                setIsDisabled(false);
                                                setModalVisible(true);
                                                setModalTitle(ite.name);
                                                setSubmitCode(ite.code);
                                            }}>{ite.name}</Button>
                                        ) : (
                                            ite.type == 2 ?   //跳转链接
                                                (
                                                    // console.log('222'),
                                                    <Button key={i} type="primary" onClick={() => {
                                                        if (ite.link.indexOf('/report-manage/ModalFormReport/page&id=') > -1) {
                                                            setIsDisabled(false);
                                                            setModalTitle(ite.name);
                                                            setModalPageLink(ite.link);
                                                            setModalFormTemplate(true)
                                                        } else if (ite.link.indexOf('/report-manage/ModalFormProReport/') > -1) {
                                                            setIsDisabled(false);
                                                            setModalTitle(ite.name);
                                                            setModalPageLink(ite.link);
                                                            setModalFormProTemplate(true)
                                                        } else if (ite.link.indexOf('/platform-out/reportform/create/manage-page1/choice-sql?title=') > -1 && ite.link.indexOf("问卷模板") > -1) {
                                                            history.push(ite.link)
                                                        } else {
                                                            setIsDisabled(false);
                                                            window.location.href = ite.link
                                                        }
                                                    }}>{ite.name}</Button>
                                                ) : (
                                                    ite.type == 3 ? //按钮调接口
                                                        (
                                                            <Button key={i} type="primary" onClick={() => junkInterface(ite.code)}>{ite.name}</Button>
                                                        ) :
                                                        (
                                                            ite.type == 4 ? //导入文件按钮
                                                                <>
                                                                    <Upload key={i} {...Uprops} action={`${ite.link}`}>
                                                                        <Button type="primary" icon={<UploadOutlined />}>{ite.name}</Button>
                                                                    </Upload>

                                                                </>
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
                                                                                        return { srvCode: intCode, pageNum: tData.page, pageSize: tData.total }
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
                                                                                        :
                                                                                        ite.type == 12 ?
                                                                                            // <a href={`/api/file/fileDown/downloadFileById?fileId=${record.fileId}`}>下载</a>
                                                                                            (
                                                                                                <Button type="primary" href={ite.code ? `/api/file/fileDown/downloadFileById?fileId=${ite.code}` : "#"}>{ite.name}</Button>
                                                                                            )
                                                                                            : null

                                                                                )

                                                                        )

                                                                )
                                                        )
                                                )
                                        )
                                ))
                            }
                        </Space>

                        : null
                }
                loading={pageLoading}
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
                            // scroll={{ x: true }}
                            scroll={{ y: 'calc(100vh - 100px)' }}
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

export default FunctionComponent