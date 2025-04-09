import type { EditableFormInstance, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import type { ActionType } from '@ant-design/pro-table';
import { Button, message, Space, Popconfirm, Tooltip, Row, Col } from 'antd';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import React, { useEffect, useRef, useState, useImperativeHandle } from 'react';
import { getDataByBizCode } from '../../service';

import moment from 'moment';
import itemAlign from '@/components/Workflow/behavior/itemAlign';
import styles from '../styles.less';

const PreTable: React.FC<any> = React.forwardRef((props, ref) => {
    useImperativeHandle(ref, () => {
        return {
            onSave: () => {
                let flag = true;
                // let data = dataSource.map((item: any) => {
                //     validateList.map((it: any) => {
                //         if (item[it] == "" || item[it] == undefined || item[it] == null) {
                //             flag = false;
                //         }
                //     })
                // })

                dataSource.map((item: any) => {
                    delete item['key']
                })
                if (flag) {
                    // return data;
                    return dataSource;
                } else {
                    message.error("内容未完成")
                    return [];
                }
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

    const [CountLists, setCountList] = useState<any>([]);
    const [ConnectLists, setConnectList] = useState<any>([]);
    useEffect(() => {
        if (sqlData) {
            const res = pharsePageProps(sqlData)
            // getBizCodeData(sqlData.initCode, id)
            // console.log(sqlData.intCode)
            // if (sqlData?.initCode) {
            //     console.log(sqlData?.initCode)
            //     getBizCodeData(sqlData?.initCode,id)
        }
    }, [sqlData])
    useEffect(() => {
        if (initCode) {
            getBizCodeData(initCode, { id: id })
        }
        // console.log(initCode)
    }, [initCode, id])
    useEffect(() => {
        if (orrButton) {
            getButtonArr(orrButton)
        }
        // console.log(orrButton)
    }, [orrButton])

    // 保存按钮
    const getButtonArr = (orrButton: any) => {
        // props.
    }

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
        let CountList: any = [];
        let ConnectList: any = [];
        // 保存数据编码
        // setIntCode(data?.intCode);
        // 按钮数据属性解析
        data && data?.topBut.map((it: any) => {
            if (it.position.includes('3')) {
                opebtnArr.push(it);
            } else {
                return;
            }
        });
        setOrrButton(opebtnArr);
        // 按钮可编辑
        if (data && data?.intCode) {
            setinitCode(data?.intCode)
            // 直接触发接口，获取整个数组的值，并且赋值
        }

        data && data?.intfIttrDescList1.forEach((item: any, index: any) => {
            let componentCode = JSON.parse(item.componentCode);
            let formItemProps: any = {};
            let tableColProps: any = {};

            if (item.code !== "") {
                objCode[item.tableColum] = item.code
            }
            let tableCol = JSON.parse(item.componentCode);
            if (item.isDisabled != 1) {
                let obj = {
                    title: item.displayName,
                    dataIndex: item.tableColum,
                    ...tableCol,
                }
                // 回显接口 ---start
                if (item.EchoCode) {
                    list.push(item.tableColum);
                    tclist.push(item.EchoCode);
                }
                // 回显接口 ---end

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
                // if (tableCol.valueType === 'select' && tableCol.number) {
                if (tableCol.valueType === 'digit') {
                    validateListValue.push(item.tableColum)
                    // console.log(item.tableColum,'789');

                    let valueEum: any = [];
                    function addNum(num: any) {
                        if (num <= tableCol.number) {
                            valueEum.push({ label: num, value: num })
                            addNum(++num)
                        } else {
                            // console.log(valueEum)
                        }
                    }
                    addNum(1)
                    // obj = {
                    //     ...obj,
                    //     fieldProps: {
                    //         options: valueEum
                    //     }
                    // }
                    obj = {
                        ...obj,
                        fieldProps: {//设置最大值和最小值
                            min: 0,
                            max: tableCol.number ? tableCol.number : 5,
                            // precision:2,//精度两位小数
                        }
                    }
                    // console.log(obj, '88888888888')
                }
                if (tableCol.isCount) {
                    CountList.push({ displayName: item.displayName, tableColum: item.tableColum, Num: tableCol.number });
                }
                if (tableCol.Connect) {
                    ConnectList.push(tableCol.Connect);
                }
                column_arr.push(obj);

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
            }

        });
        setColumns(column_arr)
        setCountList(CountList);
        setConnectList(ConnectList);
        setvalidateList(validateListValue)
        // console.log(validateList,'123validateList');
        return true;
    }
    // 列表数据

    // 获取列表数据 by BizCode
    const getBizCodeData = async (srvCode: any, filterFFFF: any) => {
        let res0: any = await getDataByBizCode(Object.assign({ srvCode }, filterFFFF));
        let res = res0.response;
        if (res.code === 0 && res.data.cursor_result) {
            let newData = res.data.cursor_result.map((item: any) => {
                let keyNumber = (Math.random() * 1000000).toFixed(0);
                let obj = {
                    ...item,
                    key: keyNumber,
                }
                return obj;
            });
            // 修改值的同时，同时修改value
            setDataSource(newData);
            setEditableRowKeys(newData.map((item: any) => item.key))
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
                rowKey={rowKey || 'key'}
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
            />

            {CountLists.length > 0 && <Row style={{ marginBottom: "20px" }} gutter={16}>
                <Col span={4} style={{ textAlign: "center" }}>合计</Col>
                {
                    CountLists.length > 0 && CountLists.map((item: any, index: any) => (

                        <Col span={4}>{item.displayName} : <span style={{ color: "#f43126" }}>{(dataSource.reduce((total: any, cur: any) => { return (total + ((cur[item.tableColum] || 0) * cur[ConnectLists[index]] * 0.1 * (10 / item.Num))) }, 0)).toFixed(2)}</span>
                        </Col>
                    )
                    )}
            </Row>}
        </>
    )
})
export default PreTable;