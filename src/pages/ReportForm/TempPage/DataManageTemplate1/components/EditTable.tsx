import React, { useEffect, useRef, useState } from 'react';
import type { EditableFormInstance, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { Button, message, Space } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import styles from '../styles.less';
// import { getDataByBizCode } from '@/services/api';
import api from '../service';
import moment from 'moment';
import { previewRichtext } from '@/pages/ReportForm/TempPage/components/richText/preRichtextHtml';
import { FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import { history } from 'umi'
import { Popconfirm } from '@/components/base';
import ModalFormItem from './ModalFormItem';
import ModalFormTemplate from '../../ModalFormTemplate';
// import { values } from 'lodash';


const EditTable = (props: any) => {
    // 表格保存数据统一是onsave进行保存，不点保存，提交时不保存数据
    const [loading, setLoading] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const editFormRef = useRef<EditableFormInstance>()
    const [currentRowKey, setCurrentRowKey] = useState<any>(undefined)
    const [flag, setFlag] = useState<boolean>(false)
    // 新建行文案
    // const [CreatorButtonText, setCreatorButtonText] = useState<any>('新建一行');
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(
        // () =>defaultData.map((item:any) => item.id),
    );
    // 数组保存时获取下标
    const [dataSource, setDataSource] = useState<any>([]);
    // const [dataSourceIndex, setDataSourceIndex] = useState<any[]>();
    const [tableColumns, setTableColumns] = useState<any>([]);
    const [filterFFFF, setFilterFFFF] = useState<any>();
    const [recordLinkArr, setRecordLinkArr] = useState<any>([]);  //与树关联过滤字段
    const [recordLinkObj, setRecordLinkObj] = useState<any>(undefined);
    const [recordObj, setRecordObj] = useState<any>(undefined);
    const [fillCode, setFillCode] = useState<any>(undefined)//规则
    const [newVal, setNewVal] = useState<any>(undefined)
    //获取数据接口编码标识 
    // const [intCode, setIntCode] = useState<any>('');
    // 主键obj
    const [idKey, setIdKey] = useState<any>({});
    // 时间判断
    const [dateKeys, setDateKeys] = useState<any>([]);
    // 新增加默认值 --start
    const [addDetailObject, setAddDetailObject] = useState<any>(undefined)
    // 新增加默认值 --end


    // 加数据会显 -- start
    const [codeList, setCodeList] = useState<any>([]);
    const [TCName, setTCName] = useState<any>([]);
    const [CodevalueObject, setCodevalueObject] = useState<any>({});
    const [CodeInitvalueObject, setCodeInitvalueObject] = useState<any>({});

    const [timeReserveList, setTimeReserveList] = useState<any>([]);// 时间回显的

    const [codeColumn, setcodeColumn] = useState<any>(undefined);// editTable规则字段名

    // 加数据会显 -- end
    const [opebtnArr, setOpebtnArr] = useState<any>([]);
    // 弹窗部分
    const [formFieldsProp, setFormFieldsProp] = useState([]);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<any>(undefined);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [recordDetial, setRecordDetial] = useState<any>(undefined);
    const [modalPageLink, setModalPageLink] = useState<any>(undefined); //跳转页面
    const [modalFormTemplate, setModalFormTemplate] = useState<boolean>(false)  //新增模板链接（不含附件）
    useEffect(() => {
        const res1: any = pharsePageProps(props.sqlData);
        res1 && setLoading(true);
    }, [props.sqlData, props.initData]);
    //模块 属性解释
    const pharsePageProps = (data: any) => {
        let column_arr: any = [];
        let arr1: any = [];
        let arr_recordlink: any = [];
        let obj_recordlink: any = {};
        let objKey: any = {};
        let objCode: any = {}
        let opebtnArr: any = [];
        // 表单属性
        let fieldsArr: any = [];
        // 新增一行默认值
        let detailObject: any = {};
        // 回显list
        let list: any = [];
        let tclist: any = [];
        let CodevalueObjects: any = {};
        // 保存数据编码
        // setIntCode(data?.intCode);
        // 按钮数据属性解析
        data && data?.topBut.map((it: any) => {
            if (it.position.includes('2')) {
                opebtnArr.push(it);
            } else {
                return;
            }
        });
        setOpebtnArr(opebtnArr);
        data && data?.intfIttrDescList1.forEach((item: any, index: any) => {
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
            if (item.code !== "") {
                objCode[item.tableColum] = item.code
            }
            let tableCol = JSON.parse(item.componentCode);
            let obj = {
                title: item.displayName,
                dataIndex: item.tableColum,
                ...tableCol,
            }
            if (item.EchoCode) {
                list.push(item.tableColum);
                tclist.push(item.EchoCode);
            }
            // if (!tableCol.timeRange && tableCol.valueType != 'RichText') {
            //     obj["formItemProps"] = () => {
            //         return {
            //             rules: [{required: true, message: '此项为必填项' }],
            //         };
            //     }
            // }

            //为editTable添加校验
            if (tableCol.required && tableCol.required == true) {
                obj["formItemProps"] = { rules: [{ required: true, message: '此项为必填项' }] };
                // console.log(tableCol.required, '789');
                // console.log(obj, '456obj');
            }

            // 新增加默认值 -- start
            if (tableCol.defaultValue) {
                if (item.valueType == "dateTime") {
                    detailObject[item.tableColum] = moment(tableCol.defaultValue)
                }
                if (item.EchoCode) {
                    CodevalueObjects[item.tableColum] = tableCol.defaultValue;
                }
                detailObject[item.tableColum] = tableCol.defaultValue;
            }
            // 新增加默认值 -- end
            if (tableCol.valueType === 'select') {
                let fieldName: any = {} //自定义option label value字段
                for (let key in obj) {
                    if (key === 'fieldNames') {
                        fieldName = { ...obj[key] }
                        delete obj[key]
                    }
                }
                obj = {
                    ...obj,
                    fieldProps: {
                        fieldNames: { ...fieldName },
                        options: props.initData && !!props.initData[item.tableColum] && props.initData[item.tableColum] && props.initData[item.tableColum].length > 0 ? props.initData[item.tableColum] : [],
                        showSearch: true,
                        filterOption: (input: any, option: any) =>
                            (fieldName.label && option[fieldName.label] && option[fieldName.label].toLowerCase().includes(input.toLowerCase()))
                    }
                }
            } else if (tableCol.valueType === 'treeSelect') {
                // 树形 下拉选择框
                let fieldName: any = {} //自定义option label value字段
                for (let key in obj) {
                    if (key === 'fieldNames') {
                        fieldName = { ...obj[key] }
                        delete obj[key]
                    }
                }
                obj = {
                    ...obj,
                    fieldProps: {
                        options: props.initData && !!props.initData[item.tableColum] && props.initData[item.tableColum] && props.initData[item.tableColum].length > 0 ? props.initData[item.tableColum] : [],
                        fieldNames: {
                            ...fieldName
                        }
                    }
                }
            } else if (tableCol.valueType === 'cascader') {
                // 级联选择器
                let fieldName: any = {}; //自定义option label value字段
                for (let key in obj) {
                    if (key === 'fieldNames') {
                        fieldName = { ...obj[key] }
                        delete obj[key]
                    }
                }
                obj = {
                    ...obj,
                    fieldProps: {
                        options: props.initData && !!props.initData[item.tableColum] && props.initData[item.tableColum] && props.initData[item.tableColum].length > 0 ? props.initData[item.tableColum] : [],
                        fieldNames: {
                            ...fieldName
                        }
                    }
                }
            } else if (tableCol.valueType == 'RichText') {
                obj = {
                    ...obj,
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
            else if (tableCol.valueType.toLowerCase().indexOf("range") > -1) {
                let arr: any = [];
                arr.push(item.tableColum)
                setDateKeys(arr);
            }
            // 所有的date数据
            // 关联过滤字段
            if (item.recordField) {
                arr_recordlink.push(item.recordField);
                obj_recordlink[item.tableColum] = item.recordField;
                // 过滤字段数据不可编辑
                obj = {
                    ...obj,
                    readonly: true,
                }
            }

            // 添加codeList ，用于数据会显
            if (item.EchoCode) {
                // console.log(item.EchoCode);
                list.push(item.tableColum);
                tclist.push(item.EchoCode);

                // console.log(list)
            }
            // 添加codeList ，用于数据会显 -- end

            // 获取主键ID
            if (item.isId == 1) {
                objKey[item.tableColum] = null;
            }
            item.isDisabled != 1 && column_arr.push(obj);
            let o: any = {};
            o[obj.dataIndex] = obj.dataIndex + '*';
            arr1.push(o);
            let obj1 = {};
            arr1.forEach((it: any) => {
                for (let key in it) {
                    obj1[key] = '';
                }
            });
            // console.log(arr1, '123arr1');

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
            setFilterFFFF(obj1);
            setFillCode(objCode)
        });

        setAddDetailObject(detailObject)
        // 回显接口 ---start
        setCodeList(list);
        setCodevalueObject(CodevalueObjects);
        setCodeInitvalueObject(CodevalueObjects);
        setTCName(tclist);
        // 回显接口 ---end
        setTableColumns(column_arr);
        setRecordLinkArr(arr_recordlink);
        setRecordLinkObj(obj_recordlink);
        setIdKey(objKey);

        //回显要用到
        // setTimeReserveList(timeList);
        setCodeList(list);
        setTCName(tclist);
        setFormFieldsProp(fieldsArr);
        return true;
    }
    const compareEndTime = (key: any) => {
        let startCol: any = undefined
        let endtimeArr: any = []
        tableColumns.map((item: any) => {
            if (item.valueType == "dateTime" && item.timeRange) {
                if (item.timeRange == 'start') {
                    startCol = item.dataIndex
                    // item.formItemProps['rules'] = [{
                    //     validator: (rule: any, value: any) => {
                    //         let settingYear = value.year()
                    //         let settingMonth = value.month()
                    //         let settingDay = value.date()
                    //         let settingHours = value.hours()
                    //         let settingMinutes = value.minutes()
                    //         let settingSeconds = value.seconds()

                    //         let currentYear = moment().year()
                    //         let currentMonth = moment().month()
                    //         let currentDay = moment().date()
                    //         let currentHours = moment().hours()
                    //         let currentMinutes = moment().minutes()
                    //         let currentSeconds = moment().seconds()
                    //         if (settingYear > currentYear) {
                    //             // 通过验证
                    //             return Promise.resolve()
                    //         } else if (settingYear === currentYear && settingMonth > currentMonth) {
                    //             return Promise.resolve()
                    //         } else if (settingYear === currentYear && settingMonth === currentMonth && settingDay > currentDay) {
                    //             return Promise.resolve()
                    //         } else if (settingYear === currentYear && settingMonth === currentMonth && settingDay === currentDay && settingHours > currentHours) {
                    //             return Promise.resolve()
                    //         } else if (settingYear === currentYear && settingMonth === currentMonth && settingDay === currentDay && settingHours === currentHours && settingMinutes > currentMinutes) {
                    //             return Promise.resolve()
                    //         } else if (settingYear === currentYear && settingMonth === currentMonth && settingDay === currentDay && settingHours === currentHours && settingMinutes === currentMinutes && settingSeconds >= currentSeconds) {
                    //             return Promise.resolve()
                    //         } else {
                    //             return Promise.reject('开始日期不能先于当前日期！')
                    //         }
                    //     }
                    // }]
                }
                else if (item.timeRange.indexOf('end') > -1) {
                    endtimeArr.push({ 'order': item.timeRange.split('end')[1], 'tableCol': item.dataIndex })
                    item.formItemProps['rules'] = [{
                        validator: (rule: any, value: any) => {
                            let rowData = editFormRef.current?.getRowData?.(key!)
                            let startTime = undefined
                            endtimeArr.map((item: any) => {
                                if (rule.field.split('.')[1] === item.tableCol) {
                                    if (item.order == 1) {
                                        startTime = rowData[startCol]
                                    } else if (item.order > 1) {
                                        let index = endtimeArr.findIndex((ite: any) => ite.order == item.order - 1)
                                        startTime = rowData[endtimeArr[index].tableCol]
                                    }
                                }
                            })
                            let startYear = moment(startTime).year()
                            let startMonth = moment(startTime).month()
                            let startDay = moment(startTime).date()
                            let startHours = moment(startTime).hours();
                            let startMinutes = moment(startTime).minutes();
                            let startSeconds = moment(startTime).seconds()

                            let endYear = value.year()
                            let endMonth = value.month()
                            let endDay = value.date()
                            let endHours = value.hours()
                            let endMinutes = value.minutes()
                            let endSeconds = value.seconds()
                            if (startTime) {
                                if (endYear > startYear) {
                                    // 通过验证
                                    return Promise.resolve()
                                } else if (endYear === startYear && endMonth > startMonth) {
                                    return Promise.resolve()
                                } else if (endYear === startYear && endMonth === startMonth && endDay > startDay) {
                                    return Promise.resolve()
                                } else if (endYear === startYear && endMonth === startMonth && endDay === startDay && endHours > startHours) {
                                    return Promise.resolve()
                                } else if (endYear === startYear && endMonth === startMonth && endDay === startDay && endHours === startHours && endMinutes > startMinutes) {
                                    return Promise.resolve()
                                } else if (endYear === startYear && endMonth === startMonth && endDay === startDay && endHours === startHours && endMinutes === startMinutes && endSeconds > startSeconds) {
                                    return Promise.resolve()
                                } else {
                                    return Promise.reject('结束日期不能先于开始日期！')
                                }
                            } else {
                                return Promise.reject('未配置开始日期！')
                            }

                        }
                    }]
                }
            }
        })
    }
    useEffect(() => {
        let obj = { ...props.recordDetial };
        //列表行数据
        let linkobj: any = {}
        for (let key in obj) {
            if (recordLinkArr.includes(key)) {
                for (let val in recordLinkObj) {
                    if (recordLinkObj[val] === key) {
                        linkobj[val] = obj[key]
                    }
                }
            }
        }
        setRecordObj(linkobj)
        linkobj && Object.keys(linkobj).length !== 0 && props.sqlData.intCode && getBizCodeData(props.sqlData.intCode, { ...linkobj });
        setLoading(false);
    }, [recordLinkArr, recordLinkObj, props.sqlData.intCode, props.recordDetial, dateKeys])

    // 获取列表数据 by BizCode
    const getBizCodeData = async (srvCode: any, filterFFFF: any) => {
        let res0: any = await api.getDataByBizCode(Object.assign({ srvCode }, filterFFFF));
        let res = res0.response;
        if (res.code === 0 && res.data.cursor_result) {

            let newData = res.data.cursor_result.map((item: any) => {
                for (let key in item) {

                    if (dateKeys.includes(key)) {
                        item[key] = item[key].split(',');
                    }
                }
                let keyNumber = (Math.random() * 1000000).toFixed(0);

                let obj = {
                    ...item,
                    key: keyNumber,
                }

                return obj;
            });
            // 修改值的同时，同时修改value
            setDataSource(newData);

            // props.getEditTableData(newData, props.tableIndex);
        } else {
            res.code !== 0 && message.error(res.message || '操作失败')
        }
    }

    // 点击保存数据
    const saveRowData = async (rowKey: any, data: any, row: any, newLine: any) => {
        return new Promise((resolve) => {
            let propValue = { ...data };
            for (let key in propValue) {
                if (dateKeys.includes(key)) {
                    propValue[key] = propValue[key].join(",")
                }
            }
            props.getEditTableData(propValue, props.tableIndex)
            setTimeout(() => {
                resolve(data)
                setFlag(false)
                setNewVal(undefined)
            }, 2000);
        });
    };

    // 删除行数据 
    const delteRowData = async (key: any, row: any) => {
        // console.log(row);
        // dateKeys.forEach((item: any) => {
        //     row[item] = row[item].join(",")
        // })
        props.getDeleteTableData(row, props.tableIndex);
    }
    //配置 删除按钮
    const DeleteRow = (record: any) => {
        setDataSource((dataSource: any) => {
            return dataSource.filter((item) => item.id !== record.id)
        });
        props.getDeleteTableData(record, props.tableIndex);
    }
    //    设置编辑、详情页数据
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
    //详情页 关闭弹窗方法
    const handleCancel = (flag: any) => {
        setModalVisible(false);
        setModalTitle(undefined);
        setModalPageLink(undefined);
        setRecordDetial(undefined);
        // setSubmitCode(undefined);
        // setErpEdit(false);
        setModalFormTemplate(false);
        //新增提交数据后、修改提交数据后，刷新数据页面 ，
        // flag && getBizCodeData(intCode, filterObj, pageSize, pageNum);
    };
    const columns: ProColumns<any>[] = [
        ...tableColumns,
        {
            title: '操作',
            valueType: 'option',
            width: 150,
            fixed: 'right',
            align: 'center',
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record.key);
                        setFlag(true)
                        compareEndTime(record.key)
                    }}
                >
                    编辑
                </a>,
                // 复制
                <EditableProTable.RecordCreator
                    key="copy"
                    record={{
                        ...record,
                        key: Date.now(),
                        ...idKey,
                    }}
                >
                    <a>复制</a>
                </EditableProTable.RecordCreator>,
                // 删除按钮
                opebtnArr.length > 0 && opebtnArr.map((item: any, i: any) => (

                    /*                         item.type == 5 ?
                                              (
                                                  <a key={i} onClick={() => {
                                                      let rowData: any = getFormItemValue({ ...record });
                                                      setIsDisabled(false);
                                                      setModalVisible(true);
                                                      setModalTitle(item.name);
                                                      setSubmitCode(item.code)
                                                      setRecordDetial(rowData);
                                                  }}>{item.name}</a>
                                              ) : */
                    item.type == 2 ? (
                        <a key={i} onClick={() => {
                            let rowData: any = getFormItemValue({ ...record });
                            if (item.link.indexOf('/report-manage/ModalFormReport/page&id=') > -1) {
                                setIsDisabled(false);
                                setModalTitle(item.name);
                                setModalPageLink(item.link);
                                setRecordDetial(rowData);
                                setModalFormTemplate(true)
                            }/*  else if (item.link.indexOf('/template/ModalFormProTemplate?id=') > -1) {
                                      setIsDisabled(false);
                                      setModalTitle(item.name);
                                      setModalPageLink(item.link);
                                      setRecordDetial(rowData);
                                      setModalFormProTemplate(true)
                                  } else if (item.link.indexOf('/template/DataManageTemplate?id=') > -1) {
                                      setErpEdit(true);
                                      setModalTitle(item.name);
                                      setModalPageLink(item.link);
                                      setRecordDetial(rowData);
                                  } else if (item.link.indexOf('/reportform/create/manage-page1/choice-sql?id=') > -1 && item.link.indexOf("问卷模板") > -1) {
                                      history.push(`/reportform/create/manage-page1/choice-sql?id=${record.id}&title=问卷模板&tplTypId=909271860088160`)
                                  } */

                            else {
                                setIsDisabled(false);
                                // history.push(item.link)
                                window.location.href = item.link
                            }
                        }}>{item.name}</a>
                    )
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
                                                title="你要删除这行内容吗?"
                                                onConfirm={() => {

                                                    DeleteRow(record)

                                                }

                                                }
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
            ],
        },
    ];
    var prevTime = Date.now();
    const throttle = (handle: any, wait: any, record: any) => {
        let nowTime = Date.now();
        if (nowTime - prevTime > wait) {
            handle(record)
            prevTime = nowTime;
        }
    }
    const fillData = (record: any) => {
        if (flag && record.knlId && record.docId) {
            let arr: any = []
            let obj: any = {}
            record.knlId !== newVal && api.execByCode(JSON.stringify({ knlId: record.knlId }), fillCode.knlId).then((res: any) => {
                if (res.response.code === 0) {
                    editFormRef.current?.setRowData?.(currentRowKey!, { knlId: record.knlId, docId: record.docId })
                    for (let key in record) {
                        arr.push(key)
                    }
                    for (let keys in res.response.data[0]) {
                        if (!arr.includes(keys) || res.response.data[0][keys] === undefined || res.response.data[0][keys] === "") {
                            delete res.response.data[0][keys]
                        }
                    }
                    editFormRef.current?.setRowData?.(currentRowKey!, res.response.data[0])
                    Object.assign(obj, res.response.data[0])
                } else {
                    message.error(res.response.message || '操作失败')
                }
            }).then(
                () => {
                    api.execByCode(JSON.stringify({ docId: record.docId }), fillCode.docId).then((res1: any) => {
                        if (res1.response.code === 0) {
                            let arr1 = []
                            for (let key1 in obj) {
                                if (record[key1] === undefined || record[key1] === "") {
                                    arr1.push(key1)
                                }
                            }
                            for (let key1s in res1.response.data[0]) {
                                if (!arr.includes(key1s) || arr1.includes(key1s) || res1.response.data[0][key1s] === undefined || res1.response.data[0][key1s] === "") {
                                    delete res1.response.data[0][key1s]
                                }
                            }
                            editFormRef.current?.setRowData?.(currentRowKey!, { ...res1.response.data[0], id: record.id ? record.id : null })
                            setNewVal(record.knlId)
                        } else {
                            message.error(res1.response.message || '操作失败')
                        }
                    })
                }
            )
        }
    }
    return (
        <div className="wb-fieldset-content">
            <div style={{ paddingBottom: 10 }}>
                <Space>
                    <Button
                        type="primary"
                        onClick={async () => {
                            let key = (Math.random() * 1000000).toFixed(0)
                            let flag = true;
                            let datas = {
                                key,
                                // ...filterFFFF,
                                ...recordObj,
                                ...addDetailObject,
                                ...idKey,
                            };
                            // 规则
                            if (fillCode && !codeColumn) {//有规则&&没有字段  
                                // console.log(fillCode, '123');

                                flag = false;
                                // console.log(fillCode)
                                let codeColumn: any = {}
                                for (let key in fillCode) {
                                    let code = fillCode[key];
                                    let res: any = await api.execByCode(JSON.stringify({}), code);
                                    // console.log(res,'123res');
                                    if (res.response.code === 0) {
                                        codeColumn[key] = res.response.data
                                    }
                                    datas = { ...datas, ...codeColumn }
                                }
                                setcodeColumn(codeColumn)
                                // console.log(datas);
                                actionRef.current?.addEditRecord?.(datas);
                            } else {
                                flag = false;
                                datas = { ...datas, ...codeColumn }
                                actionRef.current?.addEditRecord?.(datas);
                            }
                            // else 
                            if (JSON.stringify(CodevalueObject) != "{}") {
                                flag = false;
                                let flags = true;
                                for (let key in CodevalueObject) {
                                    if (datas[key] != "" && datas[key] != undefined && datas[key] != null) {
                                        flag = false;
                                        let code = TCName[codeList.indexOf(key)]
                                        let data = {};
                                        data[key] = CodevalueObject[key];
                                        api.execByCode(data, code).then((res: any) => {
                                            // res.response.code === 0 ? obj[item.tableColum] = res.response.data : message.error(res.response.message || '操作失败')
                                            if (res.response.code === 0) {
                                                let data = { ...res.response.data[0] };
                                                // console.log(timeReserveList)
                                                timeReserveList.map((item: any) => {
                                                    if (data[item]) {
                                                        data[item] = moment(data[item]);
                                                    }
                                                })
                                                datas = { ...datas, ...data }
                                                actionRef.current?.addEditRecord?.(datas);
                                                compareEndTime(key)
                                            }
                                            // 设置datepick的值
                                        })
                                    }
                                }
                                if (flags) {
                                    // console.log("======执行了")
                                    actionRef.current?.addEditRecord?.(datas);
                                    compareEndTime(key)
                                }
                            }
                            // console.log(datas, 'datasS');
                            if (flag) {
                                actionRef.current?.addEditRecord?.(datas);
                                compareEndTime(key)
                            }


                        }}
                        icon={<PlusOutlined />}
                    >
                        {props.CreatorButtonText ? props.CreatorButtonText : '新建一行'}
                    </Button>
                </Space>
            </div>

            <EditableProTable
                loading={loading}
                className={styles.edtiTbleList}
                style={{ padding: 0 }}
                bordered
                actionRef={actionRef}
                columns={columns}
                rowKey="key"
                editableFormRef={editFormRef}
                scroll={{
                    x: 960,
                }}
                dateFormatter="string"
                value={dataSource}
                onChange={(value: any) => {
                    setDataSource(value);
                }}
                recordCreatorProps={false}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onChange: (editableKeys: any, editableRows: any) => {
                        console.log(editableKeys, editableRows)
                    },
                    actionRender: (row, config, defaultDoms) => {
                        setCurrentRowKey(row.key)
                        setFlag(true)
                        return [defaultDoms.delete, defaultDoms.save, defaultDoms.cancel];
                    },
                    onValuesChange: (record, recordList) => {
                        // if (record) {
                        //     dateKeys.forEach((item: any) => {
                        //         record[item] = moment(record[item]).format()
                        //     })
                        // }  
                        record && throttle(fillData, 500, record)
                        // 回显
                        if (record && JSON.stringify(CodeInitvalueObject) != "{}") {
                            let obj = { ...CodeInitvalueObject }
                            for (let key in obj) {
                                if (record[key] != obj[key] && record[key] != "" && record[key] != undefined && record[key] != null) {
                                    obj[key] = record[key];
                                    // console.log(codeList.indexOf(key))
                                    let code = TCName[codeList.indexOf(key)]
                                    let data = {};
                                    data[key] = record[key];
                                    // console.log(data, code);
                                    api.execByCode(data, code).then((res: any) => {
                                        // res.response.code === 0 ? obj[item.tableColum] = res.response.data : message.error(res.response.message || '操作失败')
                                        if (res.response.code === 0) {

                                            let data = { ...res.response.data[0] };
                                            // console.log(timeReserveList)
                                            timeReserveList.map((item: any) => {
                                                if (data[item]) {
                                                    data[item] = moment(data[item]);
                                                }
                                            })
                                            record = { ...record, ...data }
                                            editFormRef.current?.setRowData?.(record.key!, record)
                                        }
                                        // 设置datepick的值
                                    })
                                }
                            }
                            setCodeInitvalueObject(obj);
                        } else {
                            setDataSource(recordList)
                        }
                    },
                    onSave: async (rowKey, data, row, newLine) => {
                        await saveRowData(rowKey, data, row, newLine);
                    },
                    onDelete: async (key, row) => {
                        await delteRowData(key, row)
                    }
                }}

                pagination={{
                    pageSize: 5,
                    onChange: (page) => console.log(page),
                }}
            />
            {  //详情弹窗
                isDisabled && modalVisible ? <ModalFormItem
                    // intCode={intCode}
                    isDisabled={isDisabled}
                    modalTitle={modalTitle}
                    modalVisible={modalVisible}
                    recordDetial={recordDetial}//行数据
                    handleCancel={handleCancel}
                    formFieldsProp={formFieldsProp.length > 0 ? formFieldsProp : []}
                    // submitCode={submitCode}
                    initData={props.initData}
                />
                    : null
            }
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
        </div>
    );
};

export default EditTable;