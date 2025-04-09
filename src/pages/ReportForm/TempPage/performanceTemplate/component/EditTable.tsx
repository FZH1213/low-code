import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable, } from '@ant-design/pro-table';
import { getDataByBizCode } from '../service';

import { Button, message, Card, Row, Col } from 'antd';
import React, { useEffect, useState, useImperativeHandle, useRef } from 'react';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import { execByCode } from '../service';
import Table from './Table'



const EditTable: React.FC<any> = React.forwardRef((props: any, ref: any) => {
    const tableRef = useRef<any>(null);
    //判断第二层

    const [componentList, setComponentList] = useState<any>([]);
    const [componentObject, setComponentObject] = useState<any>({});

    // 下拉list数据
    const [initData, setInitData] = useState(undefined);
    const [DataIndex, setDataIndex] = useState<any>('id');
    const [SaveData, setSaveData] = useState<any>('bizMaps');
    const [delFiled, setDelFiled] = useState<any>('bizMap');
    const [recordFiled, setRecordFiled] = useState<any>('bizMap');
    const [SaveCode, setSaveCode] = useState<any>('');
    const [DelCode, setDelCode] = useState<any>('');
    const [recordFiledName, setRecordFiledName] = useState<any>('bizMap');
    const [editTableName, setEditTableName] = useState<any>('bizMap2');
    const [editCode, setEditCode] = useState<any>('');

    useImperativeHandle(ref, () => {
        return {
            returnList: () => {
                let data = tableRef?.current.returnList();
                return data;

            }
            // splitLastDataOne: () => {
            //   splitLastData();
            // },
        };
    });
    useEffect(() => {
        if (props.sqlData) {
            // console.log(props.sqlData, '------------------')
            pharsePageProps(props.sqlData)
        }
        // console.log(props.initData,'123indata');
    }, [props.sqlData])

    // 获取页面下拉框子项数据
    // const getInitData = async (code: any) => {
    //     let res: any = await execByCode(JSON.stringify({}), code);
    //     if (res.response.code === 0) {
    //         setInitData(res.response.data);
    //     } else {
    //         message.error(res.response.message || '操作失败')
    //     }
    // }
    //处理editable数据
    const pharsePageProps = (data: any) => {
        let componentLists: any = [];
        let editObject: any = {};
        // if (data.initDataApi) {
        //     getInitData(data.initDataApi)
        // }

        data && data?.intfIttrDescList1.forEach((item: any, index: any) => {
            // console.log(data?.intfIttrDescList1[0],'[0]');
            const condition = ['EditTable'];
            const conditionEdit = ['EditForm'];
            if (condition.includes(item.filterType)) {
                let componentCode = JSON.parse(item.componentCode);
                for (let key in componentCode) {
                    if (key == "delFiled") {
                        // console.log(componentCode[key])
                        setDelFiled(componentCode[key])
                    }
                    if (key == 'delCode') {
                        setDelCode(componentCode[key])
                    }
                    if (key == 'recordFiledName') {
                        setRecordFiledName(componentCode[key])
                    }
                    if (key == 'editTableName') {
                        setEditTableName(componentCode[key])
                    }

                }
                let obj = {
                    ...item
                }
                componentLists.push(obj)
            }
            if (conditionEdit.includes(item.filterType)) {
                let componentCode = JSON.parse(item.componentCode);
                let formItemProps: any = {};
                let tableColProps: any = {};
                for (let key in componentCode) {
                    if (key == "dataIndex") {
                        // console.log(componentCode[key])
                        setDataIndex(componentCode[key])
                    }
                    if (key == 'saveData') {
                        // console.log(componentCode[key],'1111')
                        setSaveData(componentCode[key])


                    }
                    if (key == 'saveCode') {
                        setSaveCode(componentCode[key])
                    }
                    if (key == 'recordFiled') {
                        setRecordFiled(componentCode[key])
                    }

                    if (key == 'editCode') {
                        setEditCode(componentCode[key])
                    }
                }
                editObject = { ...item }
                // console.log(item.intCode,'itemitem');

            }
        })
        // console.log(componentLists)
        // console.log(editObject)
        setComponentList(componentLists);
        setComponentObject(editObject);
    }
    const getInitData = async (code: any) => {
        let res: any = await execByCode(JSON.stringify({}), code);
        if (res.response.code === 0) {
            setInitData(res.response.data);
        } else {
            message.error(res.response.message || '操作失败')
        }

    }


    return (
        <>
            {/* {console.log(props.initData, '22data')} */}
            <Row>
                {componentList.length > 0 &&
                    componentList.map((item: any, i: any) => (

                        // { console.log(item, 'ite'); console.log(props.sqlData, 'sql'); console.log(componentList, '123List'); }



                        item.filterType == 'EditTable' ?
                            (
                                <Col span={24}>
                                    <Table
                                        ref={tableRef}
                                        sqlData={item?.intfManDesc}
                                        initData={initData}
                                        DataIndex={DataIndex}
                                        delFiled={delFiled}
                                        recordFiledName={recordFiledName}
                                        DelCode={DelCode}
                                        recordFiled={recordFiled}
                                        SaveData={SaveData}
                                        SaveCode={SaveCode}
                                        componentObject={componentObject}
                                        form={props.form}
                                        taskContentField={props.taskContentField}
                                        editTableName={editTableName}
                                        id={props.id}
                                        editCode={editCode}
                                    />
                                </Col>
                                // <Table sqlData={props.sqlData} initData={props.initData} />
                            )
                            : null


                    )
                    )}
            </Row>
        </>
    );
});
export default EditTable