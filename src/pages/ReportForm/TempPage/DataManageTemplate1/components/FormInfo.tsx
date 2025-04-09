import React, { useEffect, useRef, useState } from 'react';
import {
    AutoComplete,
    Button,
    Cascader,
    Col,
    DatePicker,
    Form,
    Input,
    message,
    Modal,
    Row,
    Select,
    Spin,
    InputNumber,
} from 'antd';
import { DownOutlined, QuestionCircleOutlined, UpOutlined } from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
// import '@/theme/default/common.less';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import styles from '../styles.less';
import api from '../service';
import moment from 'moment';
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const FormInfo = (props: any) => {
    const isDisabled = props.isDisabled ? props.isDisabled : false;
    const [formFieldsProp, setFormFieldsProp] = useState<any>([]);
    // 上传文件
    const [fileList, setFileList] = useState<any>([]);
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewTitle, setPreviewTitle] = useState<string>('');

    // 展开
    const [expand, setExpand] = useState<any>(props.expand);

    // 下拉框设置默认值
    const [showSelecctValueList, setSelectValueList] = useState<any>([]);
    const [fileNamesObject, setFileNamesObject] = useState<any>(undefined);


    // 加数据回显
    const [codeList, setCodeList] = useState<any>([]); // 要回显的code 那一行的那个tableColum
    const [TCName, setTCName] = useState<any>([]);  // 存储code,他的接口：bctp.biz.hr.quit.auto.data
    const [timeReserveList, setTimeReserveList] = useState<any>([]); // 时间框的回显 ，filterType == "dataPicker"
    const { changedFields } = props;
    // 加数据回显 --- end

    // 级联回显
    const [CascaderList, setCascaderList] = useState<any>(undefined);
    const [CascaderObject, setCascaderObject] = useState<any>(undefined);
    const [FieldNamesValueList, setFieldNamesValueList] = useState<any>(undefined);
    // 级联回显 --end

    const { handleinputvalue } = props

    //传递数据
    useEffect(() => {
        // console.log(11523,props);
        handleinputvalue(props.formData)
        // console.log('foremdata',props.formData);
    }, []);

    useEffect(() => {
        const res1: any = pharsePageProps(props.sqlData);
        res1 && props.form?.current.setFieldsValue(props.formData);
    }, []);
    // 首次props.formData 赋值时，如果有改变的内容，就调接口
    useEffect(() => {
        if (codeList && TCName && props.formData) {
            if (TCName.length > 0 && codeList.length > 0) {
                for (let key in props.formData) {
                    if (codeList.indexOf(key) > -1) {
                        let obj = {};
                        let index = codeList.indexOf(key);
                        let code = TCName[index];
                        obj[key] = props.formData[key];
                        api.execByCode(obj, code).then((res: any) => {
                            // res.response.code === 0 ? obj[item.tableColum] = res.response.data : message.error(res.response.message || '操作失败')
                            if (res.response.code === 0) {
                                let data = { ...res.response.data[0] };
                                // console.log(timeReserveList)
                                timeReserveList.map((item: any) => {
                                    if (data[item]) {
                                        data[item] = moment(data[item]);
                                    }
                                })
                                // console.log(data);
                                props.form?.current.setFieldsValue({ ...data });
                            }
                            // 设置datepick的值
                        })

                    }
                }
            }
        }
    }, [TCName, codeList])

    //级联回显
    useEffect(() => {
        if (CascaderList && CascaderObject && FieldNamesValueList && props.formData) {
            let object = { ...props.formData }
            if (CascaderList.length > 0 && JSON.stringify(CascaderObject) != "{}" && props.formData && FieldNamesValueList.length > 0) {
                CascaderList.map((item: any, index: any) => {
                    if (props.formData[item] != "" && props.formData[item] != undefined && props.formData[item] != null) {
                        let array = arrayFilter(CascaderObject[item], props.formData[item], FieldNamesValueList[index])
                        let list = Returnarray(array, FieldNamesValueList[index]);
                        // console.log(list)
                        object[item] = list
                    }
                })
                props.form?.current.setFieldsValue(object)
            } else {
                console.log("执行了", object)
                props.form?.current.setFieldsValue(object)
            }
        }
    }, [CascaderList, CascaderObject, FieldNamesValueList])
    //回显 ---end

    useEffect(() => {
        props.recordDetial === undefined && formFieldsProp.length
    }, [formFieldsProp])

    useEffect(() => {
        if (showSelecctValueList.length > 0 && props.initData && fileNamesObject) {
            const data = props.form?.current.getFieldsValue();
            showSelecctValueList.map((item: any) => {
                if (props.initData[item]) {
                    if (data[item] == undefined || data[item] == "") {
                        let obj = {};
                        obj[item] = props.initData[item][0][fileNamesObject[item]['value']]
                        props.form?.current.setFieldsValue(obj);
                    }
                }
            })

        }
    }, [props.initData, showSelecctValueList, fileNamesObject])

    useEffect(() => {
        if (CascaderList && props.initData && CascaderList.length > 0) {
            // 级联回显 ---start
            let arrList: any = {};
            CascaderList.map((item: any, index: any) => {
                // console.log(props.initData[item], 'props.initData[item]');
                arrList[item] = JSON.parse(JSON.stringify(props.initData[item]))
            })
            // console.log(arrList, 'arrList');
            setCascaderObject(arrList);
        }
    }, [CascaderList, props.initData])

    // 数组过滤 data 是那个数组， recordDetail=["136"],返回一个数组 ["124","64","136"]
    const arrayFilter = (data: any, recordDetial: any, value: any) => {
        let array: any = [];

        // console.log(data, recordDetial, value);
        array = data.filter((item: any) => {
            if (item.children.length > 0) {
                item.children = arrayFilter(item.children, recordDetial, value);
                return item[value] == recordDetial[0] + "" || item.children.length > 0
            }
            if (item.children.length == 0) {
                return item[value] == recordDetial[0] + ""
            }
        })
        // console.log(array, '22222')
        return array;
    }
    const Returnarray = (array: any, value: any) => {
        let list: any = [];
        array.map((item: any) => {
            list.push(item[value])
            if (item.children.length > 0) {
                list.push(...Returnarray(item.children, value))
            }
        })
        // console.log(list)
        return list
    }

    //模块 属性解释
    const pharsePageProps = (data: any) => {
        // 表单属性
        let fieldsArr: any = [];
        let showSelecctValueLists: any = [];
        let fileNames: any = {};
        // 回显
        let timeList: any = []
        let list: any = [];
        let tclist: any = [];
        // 级联回显 ---start
        let CascaderList: any = [];
        let FieldNamesValue: any = [];
        // 级联回显 ----end
        let defaultValueObj: any = {};
        // 搜素框解析、列表属性解析
        data && data?.intfIttrDescList1.map((item: any, index: any) => {
            let componentCode = JSON.parse(item.componentCode);
            let formItemProps: any = {};
            let tableColProps: any = {};
            let msg = ''
            let accept = ''
            let href = '';
            for (let key in componentCode) {
                if (FORM_ITEM_API.includes(key)) {
                    formItemProps[key] = componentCode[key];
                    delete componentCode[key]
                }
                if (TABLE_COLUMN_API.includes(key)) {
                    tableColProps[key] = componentCode[key];
                    delete componentCode[key]
                }
                if (key === 'searchSpan') {
                    delete componentCode[key]
                }
                if (key === 'href') {
                    href = componentCode[key]
                    delete componentCode[key]
                }
                if (key == "msg") {
                    msg = componentCode[key]
                }
                if (key == "accept" && componentCode[key] != undefined) {
                    accept = componentCode[key]
                }
                if (key == 'fieldNames') {
                    fileNames[item.tableColum] = componentCode[key]
                }
                if (item.filterType == 'Cascader' && key == "fieldNames") {
                    FieldNamesValue.push(componentCode[key].value);
                }

                if (key == 'defaultValue') {
                    if (item.filterType == "datePicker") {
                        defaultValueObj[item.tableColum] = moment(componentCode[key])
                    } else {
                        defaultValueObj[item.tableColum] = componentCode[key]
                    }
                    delete componentCode[key]

                }
            }
            // 添加codeList ，用于数据回显
            if (item.EchoCode) {
                list.push(item.tableColum);
                tclist.push(item.EchoCode);

                // console.log(list)
            }
            // 添加codeList ，用于数据回显 -- end
            props.getChildNodeData(accept, msg)
            if (item.showSelecctValue) {
                showSelecctValueLists.push(item.tableColum);
            }
            if (item.filterType == "datePicker") {
                timeList.push(item.tableColum);
            }

            if (item.filterType == 'Cascader') {
                CascaderList.push(item.tableColum);
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
                showSelecctValue: item.showSelecctValue
            }
            fieldsArr.push(f_obj);
        });
        setCascaderList(CascaderList);
        setFieldNamesValueList(FieldNamesValue)
        setFormFieldsProp(fieldsArr);
        setSelectValueList(showSelecctValueLists)
        setFileNamesObject(fileNames)
        //回显要用到拉
        setTimeReserveList(timeList);
        setCodeList(list);
        setTCName(tclist);
        props.form?.current.setFieldsValue(defaultValueObj)
        return true;
    }


    // 预览文件回调函数
    const handleUploadPreview = async (file: any) => {
        let flag = file.type;
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (flag.includes('image')) {
            if (file.status == 'done' && file.response.code === 0) {
                let url = `${FILE_REQUEST_BASE}?fileId=${file.response.data.fileId}`;
                setPreviewImage(url);
                setPreviewVisible(true);
                setPreviewTitle(file.name);
            } else if (file.status == 'defalut') {
                let url = `${FILE_REQUEST_BASE}?fileId=${file.fileId}`;
                setPreviewImage(url);
                setPreviewVisible(true);
                setPreviewTitle(file.name);
            }
        } else {
            if (file.status == 'done' && file.response.code === 0) {
                window.location.href = `${FILE_REQUEST_BASE}?fileId=${file.response.data.fileId}&token=${token}`
            } else if (file.status == 'defalut') {
                window.location.href = `${FILE_REQUEST_BASE}?fileId=${file.fileId}&token=${token}`;
            }
        }
    }

    //文件预览窗口关闭
    const handleCancel = () => {
        setPreviewVisible(false);
    };

    // 文件上传回调函数
    const handleUploadChange = async ({ file, fileList }: any, name: any) => {
        const isLt100M = file.size / 1024 / 1024 > 100;
        let curFileList = fileList;
        curFileList = curFileList.filter((file: any) => {
            if (!isLt100M) {
                if (file.response) {
                    return file.response.code === 0;
                }
                return true;
            } else {
                file.status = 'error';
                message.error('上传文件不能大于100M！', 2);
                return false;
            }
        });
        if (file.response && file.response.code != 0) {
            message.error(file.response.message);
            return;
        }

        let obj: any = {}
        let flag = props.form.getFieldValue(`${name}`)
        obj[name] = flag.fileList
        props.form.setFieldsValue({ ...obj })
        setFileList([...curFileList])
    }
    // 填报回显 --start 



    useEffect(() => {
        let flag = true;
        for (let key in changedFields) {
            if (!changedFields[key]) {
                flag = false
            }
        }
        if (TCName.length > 0 && codeList.length > 0 && changedFields && JSON.stringify(changedFields) != '{}' && flag) {
            if (codeList.indexOf(Object.getOwnPropertyNames(changedFields)[0]) > -1) {
                let index = codeList.indexOf(Object.getOwnPropertyNames(changedFields)[0]);
                let code = TCName[index]; //接口lz
                // console.log(code);
                let data = { ...changedFields }
                // console.log(data, "执行了");
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
                        // console.log(data);
                        props.form?.current.setFieldsValue({ ...data });
                    }
                    // 设置datepick的值
                })
            }
        }
    }, [changedFields, TCName, codeList])
    // 填报回显 --end
    return (
        <div className="wb-fieldset-content">
            <a
                style={{ float: 'right' }}
                onClick={() => {
                    setExpand(!expand);
                }}
            >
                {expand ? ['收起', <UpOutlined />] : ['展开', <DownOutlined />]}
            </a>
            <Row style={{ width: "100%" }}>
                {
                    formFieldsProp.length > 0 ? formFieldsProp.filter((it: any) => it.isDisabled != 1).map((item: any, i: any) => (
                        <Col
                            style={{ display: expand ? 'block' : i < 2 ? 'block' : 'none' }}
                            // span={props.colSpan ? props.colSpan : 24}
                            md={props.colSpan ? props.colSpan : 24}
                            xs={24}
                            sm={24}
                            key={i}
                            className={styles.row_label}

                        >
                            <Form.Item {...item.formItemProps} name={item.tableColum} label={item.displayName}
                                tooltip={
                                    item.formItemProps.tooltip ?
                                        {
                                            color: item.formItemProps.tooltip.backgroundColor,
                                            title:
                                                <Row style={{ color: item.formItemProps.tooltip.fontColor, whiteSpace: 'nowrap' }}>
                                                    {
                                                        item.formItemProps.tooltip.title ?
                                                            item.formItemProps.tooltip.title.split('|').map((ite: any, index: any) => (
                                                                < Col span={24}>{ite}</Col>
                                                            ))
                                                            :
                                                            < Col span={24}>请配置提示语</Col>
                                                    }
                                                </Row>
                                            ,
                                            icon: <QuestionCircleOutlined style={{ color: item.formItemProps.tooltip.iconColor }} />
                                        } : null}
                            >
                                {
                                    item.filterType == "select" ?

                                        (
                                            <Select
                                                {...item.componentCode}
                                                onChange={(e) => console.log('e', e)}
                                                filterOption={(input: any, option: any) =>
                                                    (item.componentCode.fieldNames.label && option[item.componentCode.fieldNames.label] && option[item.componentCode.fieldNames.label].toLowerCase().includes(input.toLowerCase()))
                                                }
                                                showSearch={true}
                                                options={props.initData && !!props.initData[item.tableColum] && props.initData[item.tableColum] && props.initData[item.tableColum].length > 0 ? props.initData[item.tableColum] : []}
                                            >
                                            </Select>
                                        ) : (
                                            item.filterType == "datePicker" ?
                                                (
                                                    <DatePicker
                                                        {...item.componentCode}
                                                        style={{ width: "100%" }}
                                                    ></DatePicker>
                                                ) :
                                                (
                                                    item.filterType == "rangerPicker" ?
                                                        (
                                                            <RangePicker
                                                                {...item.componentCode}
                                                            ></RangePicker>
                                                        ) : (
                                                            item.filterType == "Upload" ?
                                                                (
                                                                    // <Upload
                                                                    //     {...item.componentCode}
                                                                    //     name='file'
                                                                    //     onPreview={handleUploadPreview}
                                                                    //     onChange={(info) => handleUploadChange(info, item.name)}
                                                                    //     fileList={props.modalForm.getFieldValue(`${item.name}`) ? [...props.modalForm.getFieldValue(`${item.name}`)] : []}
                                                                    //     headers={{
                                                                    //         Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
                                                                    //     }}
                                                                    // >
                                                                    //     <Button icon={<UploadOutlined />}>上传</Button>
                                                                    // </Upload>
                                                                    <>
                                                                        <Button
                                                                            icon={<UploadOutlined />}
                                                                            {...item.componentCode}
                                                                            onClick={() => {
                                                                                // setIsShow(true)
                                                                                props.handleModal(1)
                                                                            }}
                                                                            disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                                        >上传文件</Button>
                                                                        {item.href &&
                                                                            <Button type="primary" href={item.href ? `/api/file/fileDown/downloadFileById?fileId=${item.href}` : "#"}>
                                                                                下载附件
                                                                            </Button>
                                                                        }
                                                                    </>
                                                                ) :
                                                                (
                                                                    item.filterType == 'Cascader' ?
                                                                        (
                                                                            <Cascader
                                                                                {...item.componentCode}
                                                                                options={props.initData && !!props.initData[item.tableColum] && props.initData[item.tableColum] && props.initData[item.tableColum].length > 0 ? props.initData[item.tableColum] : []}
                                                                                onChange={(value) => { console.log(value) }}
                                                                            />
                                                                        ) :
                                                                        (
                                                                            item.filterType == 'TextArea' ?
                                                                                <TextArea
                                                                                    {...item.componentCode}
                                                                                    style={{ height: 120 }}
                                                                                />
                                                                                :
                                                                                (
                                                                                    item.filterType == 'ISelect' ?
                                                                                        <AutoComplete
                                                                                            {...item.componentCode}
                                                                                            filterOption={(input: any, option: any) =>
                                                                                                (item.componentCode.fieldNames.label && option[item.componentCode.fieldNames.label] && option[item.componentCode.fieldNames.label].toLowerCase().includes(input.toLowerCase()))
                                                                                            }
                                                                                            disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                                                            options={props.initData && !!props.initData[item.tableColum] && props.initData[item.tableColum] && props.initData[item.tableColum].length > 0 ? props.initData[item.tableColum] : []}
                                                                                        >
                                                                                        </AutoComplete>
                                                                                        :
                                                                                        item.filterType == "InputNumber" ?
                                                                                            <InputNumber
                                                                                                style={{ width: '100%' }}
                                                                                                {...item.componentCode}
                                                                                                disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                                                            />

                                                                                            :

                                                                                            <Input
                                                                                                {...item.componentCode}
                                                                                                disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                                                                allowClear
                                                                                            />
                                                                                )
                                                                        )
                                                                )
                                                        )
                                                )
                                        )
                                }
                            </Form.Item>
                        </Col>
                    )) :
                        <Col span={24}>
                            <div className={styles.spinCss}>
                                <Spin />
                            </div>
                        </Col>
                }
            </Row>

            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
};

export default FormInfo;