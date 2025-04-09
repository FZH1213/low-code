//编辑表格
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable, EditableFormInstance } from '@ant-design/pro-table';
import {
    AutoComplete,
    Button,
    Cascader,
    Col,
    DatePicker,
    Form,
    FormInstance,
    Input,
    message,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Upload,
    InputNumber,
    Affix
} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import { execByCode } from '../service'
import moment from 'moment'
import { getDataByBizCode } from '../service';


const EditPre: React.FC<any> = (props) => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
    const [dataSource, setDataSource] = useState<any>();
    const editFormRef = useRef<EditableFormInstance>()
    //父组件传来的数组
    const [tableColumns, setTableColumns] = useState<any>([]);
    const [id, setId] = useState<any>("");
    const { ModalVisible, rowKey, DataIndex, intCode, SaveData, recordDetial, SaveCode, recordField, recordFiledName, form, editPreDataSource } = props;
    //底部按钮数组
    const [bottomBtnArr, setBottomBtnArr] = useState<any>([])
    useEffect(() => {
        if (props.sqlData) {
            pharsePageProps(props.sqlData)
        }
        // setBottomBtnArr([])

    }, [props.sqlData, props.initData])
    // useEffect(() => {
    //     console.log(rowKey, "--------------")
    //     if (recordDetial[SaveData] && recordDetial[SaveData].length > 0) {
    //         console.log("执行了")
    //         let newData = recordDetial[SaveData].map((item: any) => {
    //             delete item.key;
    //             let keyNumber = (Math.random() * 1000000).toFixed(0);
    //             let obj = {
    //                 ...item,
    //                 key: keyNumber,
    //             }
    //             return obj;
    //         })
    //         setDataSource(newData);
    //         let key = newData.map((item: any) => item.key);
    //         console.log(key);
    //         setEditableRowKeys(key)

    //     } else if (!recordDetial[SaveData] || recordDetial[SaveData].length == 0) {
    //         console.log("执行了-------------")
    //         let obj: any = {};
    //         obj[DataIndex] = rowKey;
    //         setId(rowKey);
    //         getBizCodeData(intCode, obj)
    //     }
    // }, [rowKey, recordDetial, intCode])

    useEffect(() => {
        editEditPre(intCode)
    }, [])
    useEffect(() => {
        // if (recordDetial) {
        //     let value = form?.current.getFieldsValue();
        //     const { ...bizMap } = value;
        //     let obj: any = {};
        //     obj[DataIndex] = rowKey;
        //     obj[recordFiledName] =bizMap
        //     setId(rowKey);
        //     console.log(obj, intCode, '123obj');
        //     getBizCodeData(intCode, obj)//获取页面接口

        // }
    }, [])

    //
    useEffect(() => {
        getEditpreData()
        // console.log(editPreDataSource, '传过来');

    }, [editPreDataSource])
    //每次点编辑调接口
    const editEditPre = (intCode: any) => {
        // props.editShowModal(intCode)
    }
    const pharsePageProps = (data: any) => {
        //遍历传过来的数据
        let column_arr: any = [];
        //底部按钮
        let bottomBtnArrs: any = []
        // console.log(data.intCode, '123data.intCode');

        data && data?.intfIttrDescList1.forEach((item: any, index: any) => {
            let tableCol = JSON.parse(item.componentCode);
            if (item.isDisabled != 1) {

                let obj = {
                    title: item.displayName,
                    dataIndex: item.tableColum,
                    ...tableCol,
                }
                if (tableCol.valueType == "select") {
                    let fieldName: any = {} //自定义option label value字段
                    for (let key in obj) {
                        if (key === 'fieldNames') {
                            fieldName = { ...obj[key] }
                            delete obj[key]
                        }
                    }
                    console.log(props.initData)
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
                }
                column_arr.push(obj)
            }
        })

        data && data?.topBut.map((it: any) => {
            // console.log(it, '123item');
            if (it.position.includes('3')) {
                bottomBtnArrs.push(it)
                // console.log(it, '123456789');
            } else {
                return;
            }
        })
        setTableColumns(column_arr);
        // console.log(...tableColumns, '123...');
        setBottomBtnArr(bottomBtnArrs)//底部按钮
        // console.log(bottomBtnArr, '1111');



    }
    // 获取列表数据 by BizCode
    const getBizCodeData = async (srvCode: any, filterFFFF: any) => {
        // setDataSource(editPreDataSource)
        let res0: any = await getDataByBizCode(Object.assign({ srvCode, ...filterFFFF }));
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
            // console.log(dataSource,'getEditpreData');

            let key = newData.map((item: any) => item.key);
            // console.log(key);
            setEditableRowKeys(key)
        } else {
            res.code !== 0 && message.error(res.message || '操作失败')
        }



        // let res0: any = await getDataByBizCode(Object.assign({ srvCode }, filterFFFF));

    }

    //获取列表数据赋值
    const getEditpreData = () => {

        let newData = editPreDataSource.map((item: any) => {
            let keyNumber = (Math.random() * 1000000).toFixed(0);
            let obj = {
                ...item,
                key: keyNumber,
            }
            return obj;
        });
        setDataSource(newData)
        let key = newData.map((item: any) => item.key);
        // console.log(key);
        setEditableRowKeys(key)
    }

    //保存
    const submit2 = async (code: any) => {
        let record = {};
        for (let key in recordDetial) {
            if (key != "key" && key != "index") {
                record[key] = recordDetial[key];
            }
        }
        recordDetial[SaveData] = dataSource;
        let obj: any = {};
        let data = dataSource.map((item: any) => {
            delete item.key;
            return item;
        })
        // console.log(data);
        obj[SaveData] = data;
        if (recordField) {
            obj[recordField] = record;
        }
        execByCode(obj, code).then((res: any) => {
            // console.log(res)
            if (res.response.code == 0) {
                message.success("success")
            } else {
                message.error(res.response.message)
            }
        })

        props.handleCancel(recordDetial)
    }

    const columns: any = [
        ...tableColumns,


        {
            title: '操作',
            valueType: 'option',
            width: 100,
            render: (text: any, record: any) => [
            ],
        },
    ]
    const onCancel = () => {
        // let record = {};
        // for (let key in recordDetial) {
        //     if (key != "key" && key != "index") {
        //         record[key] = recordDetial[key];
        //     }
        // }
        // recordDetial[SaveData] = dataSource;
        // let obj: any = {};
        // let data = dataSource.map((item: any) => {
        //     delete item.key;
        //     return item;
        // })
        // console.log(data);
        // obj[SaveData] = data;
        // if (recordField) {
        //     obj[recordField] = record;
        // }
        // execByCode(obj, SaveCode).then((res: any) => {
        //     console.log(res)
        //     if (res.response.code == 0) {
        //         message.success("success")
        //     }
        // })
        props.handleCancel(recordDetial)

    }
    return (
        <>
            <Modal
                title={props.modalTitle ? props.modalTitle : 'Title'}
                visible={ModalVisible}
                width="80%"
                destroyOnClose={true}
                onCancel={onCancel}
                footer={false}
            >

                <EditableProTable
                    columns={columns}
                    rowKey="key"
                    scroll={{
                        x: 960,
                    }}
                    // recordCreatorProps={false}
                    recordCreatorProps={{
                        newRecordType: 'dataSource',
                        record: () => ({
                            key: Date.now(),
                        }),

                    }}
                    value={dataSource}

                    editable={{
                        type: 'multiple',
                        editableKeys,
                        onValuesChange: (record, recordList) => {
                            console.log(recordList)
                            setDataSource(recordList)
                        },
                        actionRender: (row, config, defaultDoms) => {
                            const Btn = [defaultDoms.delete];
                            return [...Btn];
                        },
                        onChange: setEditableRowKeys,
                    }}
                />
                <div
                    style={{
                        // borderTop: '1px solid #d9d9d9',
                        backgroundColor: 'white',
                        padding: 10,
                        paddingRight: 20,
                        paddingLeft: "90%",
                    }}
                >
                    <Space size="small">
                        {bottomBtnArr && bottomBtnArr.length > 0 ?
                            (bottomBtnArr.map((item: any) => (
                                item.type == 8 ? //通过
                                    (<Button
                                        type='primary'
                                        style={{ width: '96px' }}
                                        onClick={(e: any) => {
                                            submit2(item.code)
                                        }}
                                    >{item.name}</Button>) : (null)
                            )))

                            : (null)
                        }
                    </Space>
                </div>

            </Modal>
        </>
    )
}
export default EditPre;