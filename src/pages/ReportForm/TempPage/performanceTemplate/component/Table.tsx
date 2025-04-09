import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable, EditableFormInstance } from '@ant-design/pro-table';
import { Button, message, Space } from 'antd';
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import { execByCode } from '../service'
import moment from 'moment'
import { getDataByBizCode } from '../service';
import EditPre from './Editpre';
import type { ActionType } from '@ant-design/pro-table';
import styles from '../styles.less';

const Table: React.FC<any> = React.forwardRef((props: any, ref: any) => {
    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
    const [dataSource, setDataSource] = useState<any>();
    const editFormRef = useRef<EditableFormInstance>()
    const actionRef = useRef<ActionType>();
    //父组件传来的数组
    const [tableColumns, setTableColumns] = useState<any>([]);
    // 按钮
    const [topbtnArrs, setTopbtnArrs] = useState<any>([]);
    //  编辑规则
    const { componentObject, SaveData, DataIndex, SaveCode, delFiled, DelCode, recordFiled, form, recordFiledName, editTableName, editCode } = props;

    const [isEdit, setIsEdit] = useState<any>(false);
    const [ModelShowEdit, setModelShowEdit] = useState<any>(false);
    const [row, setRow] = useState<any>({});
    const [editPreDataSource, setEditPreDataSource] = useState<any>([])
    useImperativeHandle(ref, () => {
        return {
            returnList: () => {
                let data = dataSource.map((item: any) => {
                    delete item.key;
                    delete item[SaveData];
                    delete item.index
                    return item
                })

                return data;
            }
            // splitLastDataOne: () => {
            //   splitLastData();
            // },
        };
    });
    useEffect(() => {
        if (props.sqlData) {
            pharsePageProps(props.sqlData)
        }

    }, [props.sqlData, props.initData])

    useEffect(() => {
        if (JSON.stringify(componentObject) != "{}") {
            setIsEdit(true);
        }
    }, [componentObject])
    //处理editable数据
    const pharsePageProps = (data: any) => {

        //遍历传过来的数据
        if (data.intCode) {
            getBizCodeData(data.intCode, { id: props.id })
        }
        let column_arr: any = [];
        let topbtnArr: any = [];
        data && data?.intfIttrDescList1.forEach((item: any, index: any) => {
            // console.log(item.intCode)
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
                    // console.log(props.initData)
                    obj = {
                        ...obj,
                        fieldProps: {
                            fieldNames: { ...fieldName },
                            options: props.initData && !!props.initData[item.tableColum] && props.initData[item.tableColum] && props.initData[item.tableColum].length > 0 ? props.initData[item.tableColum] : [],
                            showSearch: true,
                            filterOption: (input: any, option: any) =>
                                (fieldName.label && option[fieldName.label] && option[fieldName.label].toLowerCase().includes(input.toLowerCase())),
                            render: () => {
                                // console.log(555);

                            }
                        }

                    }
                }
                column_arr.push(obj)
                // console.log(column_arr,'123column_arr');
            }
        })
        // console.log(data?.intCode, '123data?.intCode');

        // 按钮解析
        data?.topBut.map((it: any) => {
            if (it.position.includes('2')) {
                topbtnArr.push(it)
            }
        });
        // 按钮解析---end

        setTableColumns(column_arr);
        // console.log(...tableColumns, '123...');

        setTopbtnArrs(topbtnArr);
    }
    // 获取列表数据 by BizCode
    const getBizCodeData = async (srvCode: any, filterFFFF: any) => {
        // console.log(filterFFFF, '124filterFFFF');

        // let res0: any = await getDataByBizCode(Object.assign({ srvCode }, filterFFFF));
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
            // console.log(dataSource,'表格数据');

            let key = newData.map((item: any) => item.key);
            // console.log(key);
            setEditableRowKeys(key)
        } else {
            res.code !== 0 && message.error(res.message || '操作失败')
        }
    }

    const columns: any = [
        ...tableColumns,
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (text: any, record: any) => [

            ],
        },
    ];
    //编辑按钮赋值
    const editShowModal = async (editCode: any, record: any) => {
        // console.log(editCode, '123editCode');
        // console.log(record, '123record')
        let value = form?.current.getFieldsValue();
        const { ...bizMap } = value;
        let obj: any = {}
        obj[recordFiled] = bizMap
        obj[editTableName] = record //表格外面一行数据
        let res0: any = await execByCode(obj, editCode)
        let res = res0.response;
        // console.log(res)
        if (res.code === 0 && res.data) {
            setEditPreDataSource(res.data)
            // let newData = res.data.map((item: any) => {
            //     let keyNumber = (Math.random() * 1000000).toFixed(0);
            //     let obj = {
            //         ...item,
            //         key: keyNumber,
            //     }
            //     return obj;
            // });
            // // 修改值的同时，同时修改value
            // setDataSource(newData);
            // // console.log(dataSource,'表格数据');

            // let key = newData.map((item: any) => item.key);
            // // console.log(key);
            // setEditableRowKeys(key)
        } else {
            res.code !== 0 && message.error(res.message || '操作失败')
        }
        setModelShowEdit(true);
        setRow(record);
    }

    //导入上月
    const clickBtn = (code: any, record: any) => {
        let value = form?.current.getFieldsValue();
        const { ...bizMap } = value;
        let obj: any = {};
        obj[recordFiledName] = bizMap;//formInfo
        obj[editTableName] = record;//Table
        // console.log(obj, '111');//107
        // console.log(code,'123code');
        // let bizMapRecord={}
        // bizMapRecord['bizMap2']=record
        // console.log(bizMapRecord,'123record');

        setRow(record)
        rootCode(code, obj);//传id和接口
    }
    const rootCode = async (code: any, filterFFFF: any) => {
        let res0: any = await execByCode(filterFFFF, code);
        // console.log(Object.assign({ srvCode }, filterFFFF, { pageSize }, { pageNum }),'123Object.assign');
        let res = res0.response;
        // console.log(res);
        if (res.code == 0) {
            message.success("success")
        }
    }
    const handleCancel = (data: any) => {
        setModelShowEdit(false);
    };
    return (
        <>

            <EditableProTable
                columns={columns}
                rowKey={'key'}
                editableFormRef={editFormRef}
                actionRef={actionRef}
                className={styles.edtiTbleList}
                scroll={{
                    x: 960,
                }}
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
                    actionRender: (row, config, defaultDoms) => {
                        let Btn = [defaultDoms.delete];
                        if (isEdit) {//编辑
                            // Btn.unshift(<Button type="link" onClick={() => { editShowModal(row) }}>
                            //     {componentObject.displayName}
                            // </Button>)
                            Btn.unshift(<Button type="link" onClick={() => { editShowModal(editCode, row) }}>
                                {componentObject.displayName}
                            </Button>)
                        }
                        if (topbtnArrs.length > 0) {//导入上月
                            topbtnArrs.map((item: any) => {
                                Btn.unshift(<Button type="link" onClick={() => { clickBtn(item.code, row) }}>
                                    {item.name}
                                </Button>)
                            })
                        }
                        return [...Btn];
                    },
                    onValuesChange: (record, recordList) => {
                        // console.log(recordList,'列表数据')
                        setDataSource(recordList)
                    },
                    onChange: setEditableRowKeys,
                    onDelete: async (key, row) => {
                        // console.log(key, row)
                        let obj = {};
                        for (let keys in row) {
                            if (keys != "index" && keys != "key") {
                                obj[keys] = row[keys]
                            }
                        }
                        let data = {};
                        data[delFiled] = obj;
                        execByCode(data, DelCode).then((res: any) => {
                            if (res.response.code == 0) {
                                message.success("success")

                            } else {
                                message.error("error")
                                actionRef.current?.addEditRecord(row)
                            }
                        })
                    }
                }}
            />
            {isEdit &&
                <EditPre
                    modalTitle={componentObject.displayName}
                    // 异步
                    ModalVisible={ModelShowEdit}
                    recordDetial={row}//行数据
                    DataIndex={DataIndex}
                    rowKey={row[DataIndex]}
                    SaveData={SaveData}
                    SaveCode={SaveCode}
                    recordField={recordFiled}
                    handleCancel={handleCancel}
                    intCode={componentObject?.intfManDesc.intCode}
                    initData={props.initData}
                    sqlData={componentObject?.intfManDesc}
                    form={form}
                    recordFiledName={recordFiledName}//表格内容
                    // editShowModal={editShowModal}
                    editPreDataSource={editPreDataSource}//editPre数据
                />
            }
        </>
    );
});
export default Table