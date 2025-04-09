import type { EditableFormInstance, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, message, Space, Popconfirm, Tooltip } from 'antd';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';

import { getDataByBizCode } from '../../service';

import moment from 'moment';
import itemAlign from '@/components/Workflow/behavior/itemAlign';
import styles from '../styles.less';

const PreWorkerTable: React.FC<any> = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => {
        return {
            onSave: () => {
                let data: any = [];
                editFormRef?.current?.validateFields().then(res => {
                    data = [...res];
                })
                return data;
            },
            // splitLastDataOne: () => {
            //   splitLastData();
            // },
        };
    });
    const { sqlData, from, id } = props;
    const [columns, setColumns] = useState<any>([]);
    // 列表加载
    const [loading, setLoading] = useState<any>(false);
    const actionRef = useRef<ActionType>();
    const editFormRef = useRef<EditableFormInstance>();
    // 设置主键
    const [rowKey, setRowKey] = useState<any>("");
    // 数组保存时获取下标
    const [dataSource, setDataSource] = useState<any>([]);
    const [initCode, setinitCode] = useState<any>("");
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(
        // () =>defaultData.map((item:any) => item.id),
    );
    const [validateList, setvalidateList] = useState<any>([]);
    const [orrButton, setOrrButton] = useState<any>([]);
    useEffect(() => {
        if (sqlData) {
            const res = pharsePageProps(sqlData)
        }
    }, [sqlData])
    useEffect(() => {
        if (initCode) {
            getBizCodeData(initCode, { id })
        }
        // console.log(initCode)
    }, [initCode, id])


    // 属性控制
    const pharsePageProps = (data: any) => {
        let column_arr: any = [];
        let arr1: any = [];
        let arr_recordlink: any = [];
        let obj_recordlink: any = {};
        let objKey: any = {};
        let objCode: any = {};
        let opebtnArr: any = [];
        // 表单属性
        let fieldsArr: any = [];
        // 新增一行默认值
        let detailObject: any = {};
        // 回显list
        let list: any = [];
        let tclist: any = [];
        let CodevalueObjects: any = {};
        let validateListValue: any = [];
        // 按钮可编辑
        if (data && data?.intCode) {
            setinitCode(data?.intCode)
        }
        data && data?.intfIttrDescList1.forEach((item: any, index: any) => {
            let componentCode = JSON.parse(item.componentCode);
            let formItemProps: any = {};
            let tableColProps: any = {};
            if (item.code !== "") {
                objCode[item.tableColum] = item.code
            }
            let tableCol = JSON.parse(item.componentCode);
            let obj = {
                title: item.displayName,
                dataIndex: item.tableColum,
                ...tableCol,
            }

            column_arr.push(obj);
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
        });
        setColumns(column_arr)
        setvalidateList(validateListValue)
        return true;
    }
    // 列表数据

    // 获取列表数据 by BizCode
    const getBizCodeData = async (srvCode: any, filterFFFF: any) => {
        // let res0: any = await getDataByBizCode(Object.assign({ srvCode }));
        let res0: any = await getDataByBizCode(Object.assign({ srvCode }, filterFFFF));
        let res = res0.response;
        if (res.code === 0 && res.data.cursor_result) {
            let newData = res.data.cursor_result.records.map((item: any) => {
                let keyNumber = (Math.random() * 1000000).toFixed(0);
                let obj = {
                    ...item,
                    key: keyNumber,
                }
                return obj;
            });
            setDataSource(newData);
        } else {
            res.code !== 0 && message.error(res.message || '操作失败')
        }
    }



    return (
        <>
            <EditableProTable
                loading={loading}
                bordered
                actionRef={actionRef}
                columns={columns}
                rowKey={'key'}
                editableFormRef={editFormRef}
                scroll={{
                    x: 1024,
                }}
                dateFormatter="string"
                value={dataSource}
                recordCreatorProps={false}
                editable={{
                    type: 'multiple',
                    editableKeys,
                    onValuesChange: (record, recordList) => {
                        setDataSource(recordList);
                    },
                }}
                pagination={{
                    pageSize: 10,
                    onChange: (page) => console.log(page),
                }}
            />
        </>
    )
})
export default PreWorkerTable;