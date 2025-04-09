import React, { useEffect, useRef, useState } from 'react';
import {
    Table,
    Card,
    Input,
    DatePicker,
    Select,
    Form,
    Button,
    Space,
    Popconfirm,
    message,
    Cascader,
} from 'antd';
// import '@/theme/default/common.less';
import TableSearchForm, { TableSearchFormInstance } from '@/pages/ReportForm/TempPage/components/TableSearchForm';
import { FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
// import { getDataByBizCode } from '@/services/api';
// import api from ''
import moment from 'moment';
import api from '../service';
// import styles from '../style.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import ModalFormItem from './ModalFormItem';
import ModalFormTemplate from '../../ModalFormTemplate';
import ModalFormProTemplate from '../../ModalFormProTemplate';
import { previewRichtext } from '@/pages/ReportForm/TempPage/components/richText/preRichtextHtml';
const { RangePicker } = DatePicker;

const TableList: React.FC<{}> = (props: any) => {

    const [loading, setLoading] = useState<boolean>(false);
    const [intCode, setIntCode] = useState<any>('');
    // 顶部按钮
    const [topbtnArr, setTopbtnArr] = useState<any>([]);
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
    const [pageSize, setPageSize] = useState<any>(10);
    const [pageNum, setPageNum] = useState<any>(1);
    const [tableColumns, setTableColumns] = useState<any>([]);
    const [tData, setData] = useState<any>();
    // 操作按钮
    const [opebtnArr, setOpebtnArr] = useState<any>([]);
    const [treeLinkArr, setTreeLinkArr] = useState<any>([]);  //与树关联过滤字段
    const [treeLinkObj, setTreeLinkObj] = useState<any>(undefined);
    const [treeObj, setTreeObj] = useState<any>(undefined);
    // 表单属性
    const [formFieldsProp, setFormFieldsProp] = useState([]);
    const [initData, setInitData] = useState(undefined);
    // 弹窗部分
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<any>(undefined);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [recordDetial, setRecordDetial] = useState<any>(undefined);
    const [submitCode, setSubmitCode] = useState<any>(undefined); //用原有的页面属性
    const [modalPageLink, setModalPageLink] = useState<any>(undefined); //跳转页面

    const [modalFormTemplate, setModalFormTemplate] = useState<boolean>(false)  //新增模板链接（不含附件）
    const [modalFormProTemplate, setModalFormProTemplate] = useState<boolean>(false)  //新增模板链接（含附件）

    useEffect(() => {
        const res1: any = pharsePageProps(props.sqlData);
        const { srvCode, ...obj } = res1;
        searchForm.setFieldsValue({ ...obj }); //设置查询框默认值
    }, []);
    useEffect(() => {
        let obj = { ...props.linkRowDetial }; //点击树节点传递的数据
        let linkobj: any = {}
        for (let key in obj) {
            if (treeLinkArr.includes(key)) {
                for (let val in treeLinkObj) {
                    if (treeLinkObj[val] === key) {
                        linkobj[val] = obj[key]
                    }
                }
            }
        }
        setTreeObj(linkobj)
        setFilterObj({})
        searchForm.resetFields()
        props.linkRowDetial && Object.keys(props.linkRowDetial).length !== 0 && getBizCodeData(intCode, { ...linkobj }, pageSize, pageNum, 0);
    }, [props.linkRowDetial])


    //新增旁边提示
    const buttonStyle = {
        color: 'red',
        marginRight: '20px',
        display: props.linkRowDetial && Object.keys(props.linkRowDetial).length !== 0 ? 'none' : 'inline-block'
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
        let obj: any = {}; //图表过滤参数值
        let topbtnArr: any = [];
        let opebtnArr: any = [];
        let arr_treelink: any = [];
        let obj_treelink: any = {};
        // 表单属性
        let fieldsArr: any = [];
        // 保存数据编码
        setIntCode(data?.intCode);
        // 按钮数据属性解析
        data && data?.topBut.map((it: any) => {
            //权限控制隐藏与显示
            if (it.permissionCode && it.isShow == 1 || !it.isShow) {
                if (it.position.includes('1')) {
                    topbtnArr.push(it)
                } else if (it.position.includes('2')) {
                    opebtnArr.push(it);
                }
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
            // 上传功能

            // 上传功能 --end
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
                formItemProps: formItemProps,
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
            columnArr.push(c_obj);
            // 关联过滤字段
            if (item.treeLinkField) {
                arr_treelink.push(item.treeLinkField);
                obj_treelink[item.tableColum] = item.treeLinkField;
            }
        });
        getInitData(data?.initDataApi, arr);
        setTableColumns(columnArr);
        setTreeLinkArr(arr_treelink);
        setTreeLinkObj(obj_treelink);
        setFormFieldsProp(fieldsArr);

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
            let data = res.data.cursor_result.records;

            // data.map((item:any) => {
            //   uploadList.map((it: any) => {
            //     console.log(item[it])
            //   })
            // })
            setData(res.data.cursor_result);
        }
        res.code === 0 && res.data.cursor_result && setData(res.data.cursor_result);
        setLoading(false);
    }

    // 分页、排序、筛选变化时触发
    const onTableChange = async (pagination: any, filters: any, sorter: any) => {
        setPageSize(pagination.pageSize)
        setPage(pagination);
        getBizCodeData(intCode, { ...filterObj, ...treeObj }, pagination.pageSize, pagination.current, 0);
    }

    // 查询框 筛选类型的组件
    const getComponents = (item: any, initData: any) => {
        const { componentCode: config } = item;
        const condition: any = ['disabled', 'searchSpan']
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
                    allowClear
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
                dom = <DatePicker {...config}></DatePicker>
                break;
            case 'rangerPicker':
                dom = <RangePicker {...config}></RangePicker>
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

    // 查询框 查询
    const onSearch = (e: any) => {
        queryFieldsProp.length && queryFieldsProp.map((item: any) => {
            // 时间范围
            if (item.filterType === 'rangerPicker') {
                for (let key in e) {
                    if (key === item.name && e[key] !== undefined) {
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
                    if (key === item.name && e[key] !== undefined) {
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

        setFilterObj({ ...filterObj, ...e })
        getBizCodeData(intCode, { ...filterObj, ...e, ...treeObj }, pageSize, pageNum, 1);
    }

    // 查询框 重置
    const onReset = () => {
        searchForm.resetFields();
        setFilterObj({})
        getBizCodeData(intCode, { ...treeObj }, pageSize, pageNum, 1);
    };

    // 关闭弹窗
    const handleCancel = (flag: any) => {
        setModalVisible(false);
        setModalTitle(undefined);
        setRecordDetial(undefined);
        setSubmitCode(undefined);
        setModalPageLink(undefined);
        setModalFormTemplate(false);
        setModalFormProTemplate(false);
        //新增提交数据后、修改提交数据后，刷新数据页面 ，
        flag && getBizCodeData(intCode, { ...filterObj, ...treeObj }, pageSize, pageNum, flag);
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
                    if (!!newRowDetail[item.tableColum] && newRowDetail[item.tableColum] && newRowDetail[item.tableColum].indexOf(',') > -1) {
                        newRowDetail[item.tableColum] = newRowDetail[item.tableColum].split(',')
                    } else {
                        return newRowDetail[item.tableColum]
                    }
                }
            })
            return newRowDetail
        } else {
            return undefined;
        }
    }

    // 删除表格行内容
    const deleteRowData = async (record: any, code: any) => {
        let res: any = await api.execByCode(JSON.stringify(record), code);
        if (res.response.code === 0) {
            message.success(res.response.message);
        } else {
            message.error(res.response.message || '操作失败');
        }
        getBizCodeData(intCode, { ...filterObj, ...treeObj }, pageSize, pageNum, 0);
    }


    // 表格 cloumn
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
                                    ) : (
                                        item.type == 6 ?   //详情
                                            (
                                                <a key={i} onClick={() => {
                                                    let rowData: any = getFormItemValue(record);
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
                                                    } else if (!item.link && !item.code) {
                                                        setIsDisabled(true);
                                                        setModalVisible(true);
                                                        setModalTitle(item.name);
                                                        setRecordDetial(rowData);
                                                    }
                                                }}>{item.name}</a>
                                            ) : (
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
                                    )
                            ))
                        }
                    </Space>
                );
            },
        },
    ];


    return (
        <>
            <Card
                title={props.treeDetialTitile}
                headStyle={{ paddingTop: 10, borderBottom: '1px solid #f0f0f5' }}
                extra={
                    <React.Fragment>
                        <Space>
                            {
                                topbtnArr.length ? topbtnArr.map((ite: any, i: any) => (
                                    ite.type == 1 ? //新增弹窗
                                        (
                                            <Button
                                                key={i}
                                                type="primary"
                                                size="small"
                                                disabled={props.linkRowDetial && Object.keys(props.linkRowDetial).length !== 0 ? false : true}
                                                onClick={() => {
                                                    // 树节点新增
                                                    setIsDisabled(false);
                                                    setModalVisible(true);
                                                    setModalTitle(ite.name);
                                                    setSubmitCode(ite.code);
                                                }}
                                            >
                                                {ite.name}
                                            </Button>
                                        )
                                        : (
                                            ite.type == 2 ? //新增弹窗
                                                (
                                                    <div>
                                                        <span style={buttonStyle}>选中项目才可点击新增</span>
                                                        <Button
                                                            key={i}
                                                            type="primary"
                                                            size="small"
                                                            disabled={props.linkRowDetial && Object.keys(props.linkRowDetial).length !== 0 ? false : true}
                                                            onClick={() => {
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
                                                                }
                                                            }}
                                                        >
                                                            {ite.name}
                                                        </Button>
                                                    </div>
                                                ) : null
                                        )
                                ))
                                    : null
                            }
                        </Space>
                    </React.Fragment>
                }
                bordered={false}
            >
                {// 查询框
                    props.isSearch && queryFieldsProp.length > 0 ?
                        <TableSearchForm
                            ref={searchFormRef}
                            queryFieldsProp={queryFieldsProp}
                            onSearch={onSearch}
                            onReset={onReset}
                            form={searchForm}
                            collapsable={false}
                        />

                        : null
                }

                {/* 列表部分 */
                    tableColumns.length > 0 ?
                        <Table
                            id="antdTable"
                            bordered={true}
                            size="small"
                            rowKey="bzId"
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
                            dataSource={props.linkRowDetial && Object.keys(props.linkRowDetial).length !== 0 && tData && tData.records && tData.records.length > 0 ? tData.records : []}
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
                        treeObj={treeObj}
                    // initData={initData} //下拉list数据
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
                        treeObj={treeObj} //树节点信息
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
                    treeObj={treeObj}
                />
                    : null
            }
        </>
    )
}

export default TableList;
