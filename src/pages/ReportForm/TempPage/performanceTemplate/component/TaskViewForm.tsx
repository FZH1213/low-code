import React, { useEffect, useState } from 'react';
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
    Upload,
} from 'antd';
import '../../../theme/default/common.less';
import { getDataByBizCode } from '../service';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import { execByCode } from '../service';
import styles from '../styles.less';
import { UploadOutlined } from '@ant-design/icons';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

// 新增/编辑模板
const TaskViewForm: React.FC<{}> = (props: any) => {

    //formItem标题
    const forItemTitle = props.formItemTitle;
    //表单数据
    //下拉框子数据集
    const [initData, setInitData] = useState<any>(undefined);
    // 表单属性解析
    const [formFieldsProp, setFormFieldsProp] = useState([]);
    // 文件上传
    const [fileList, setFileList] = useState<any>([]);
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewTitle, setPreviewTitle] = useState<string>('');
    const { bizId, sqlData } = props;
    const isDisabled = props.isDisabled ? props.isDisabled : false;
    // useEffect(() => {
    //     setFormFieldsProp([]);
    //     pageLink && getViewData();
    // }, [pageLink]);

    // // 获取页面数据
    // const getViewData = async () => {
    //     const res1: any = await getViewProps();
    //     res1 && pharsePageProps(res1);
    // }
    // const getViewProps = () => {
    //     let pageProps: any = getSrvCode(pageLink)
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(pageProps);
    //         }, 300);
    //     });
    // }
    useEffect(() => {
        if (sqlData) {
            pharsePageProps(sqlData)
        }
    }, [sqlData, bizId])
    // 根据页面id获取页面配置属性
    const getSrvCode = async (id: any) => {
        const res0 = await getTreeDetailById({ id: id });
        if (res0.code === 0) {
            return res0.data;
        } else {
            return undefined;
        }
    };

    // 属性解释
    const pharsePageProps = (data: any) => {
        let fieldsArr: any = [];
        let fidKey: any = undefined;
        // console.log(data?.intfIttrDescList1[0], '123data?.intfIttrDescList1');
        // data && data?.initDataApi && getInitData(data?.initDataApi);
        data && data?.intfIttrDescList1.map((item: any, index: any) => {
            // console.log(item,'123item');
            let componentCode = JSON.parse(item.componentCode);
            let formItemProps: any = {};
            for (let key in componentCode) {
                if (FORM_ITEM_API.includes(key)) {
                    formItemProps[key] = componentCode[key];
                    delete componentCode[key];
                }
                if (TABLE_COLUMN_API.includes(key) || key === 'searchSpan' || key === 'isAdd' || key === 'isEdit' || key === 'isDetial' || key === 'name' || key === 'label' || key === 'rules') {
                    delete componentCode[key];
                }
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
            // console.log(fieldsArr, '123fieldsArr');

            // console.log(fidKey,'外面的fidKey');

            if (item.isId == 1) {
                fidKey = item.tableColum;
            }
        });
        // console.log(data?.intCode, "---------")
        data && data?.intCode && getBizCodeData(data.intCode, fidKey, fieldsArr);


        props.getFormFieldsProp(fieldsArr);
        // console.log(props.getFormFieldsProp(fieldsArr),'123props.get');

        setFormFieldsProp(fieldsArr);
    }

    // 获取页面下拉框子项数据
    const getInitData = async (code: any) => {
        let res: any = await execByCode(JSON.stringify({}), code);
        res.response.code === 0 && setInitData(res.response.data)
    }

    // 获取列表数据 by BizCode
    const getBizCodeData = async (srvCode: any, fidKey: any, fieldsArr: any) => {
        let filterFFFF: any = {};
        filterFFFF[fidKey] = bizId;
        // console.log(filterFFFF[fidKey],"执行了")
        let res0: any = await getDataByBizCode(Object.assign({ srvCode }, { ...filterFFFF }));
        let res = res0.response;

        if (res.code == 0) {
            let newRowDetail = { ...res.data?.cursor_result[0] }
            fieldsArr.forEach((item: any) => {
                if (item.filterType == 'datePicker') {
                    if (!!newRowDetail[item.tableColum] && newRowDetail[item.tableColum]) {
                        newRowDetail[item.tableColum] = moment(newRowDetail[item.tableColum])
                        // console.log(123);

                    } else {
                        newRowDetail[item.tableColum] = undefined
                        // console.log(newRowDetail[item.tableColum]);


                    }
                }
                if (item.filterType == 'rangerPicker') {
                    if (!!newRowDetail[item.tableColum] && newRowDetail[item.tableColum]) {
                        let arr: any = [moment(newRowDetail[item.tableColum].split(',')[0]), moment(newRowDetail[item.tableColum].split(',')[1])];
                        newRowDetail[item.tableColum] = arr;
                    } else {
                        newRowDetail[item.tableColum] = [moment(), moment()];
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
            });
            //设置审核表单内容
            // console.log(newRowDetail,"---------")
            props.form && props.form?.current.setFieldsValue(newRowDetail);
        }
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
        let flag = props.modalForm.getFieldValue(`${name}`)
        obj[name] = flag.fileList
        props.modalForm.setFieldsValue({ ...obj })
        setFileList([...curFileList])
    }

    return (
        <fieldset className="wb-fieldset wb-standard-margin" style={{ width: '90%' }}>
            <legend className="wb-fieldset-legend">
                <h3 className="wb-fieldset-title">{forItemTitle}</h3>
            </legend>
            <div className="wb-fieldset-content">
                <Row className="area-mb-large row_label">
                    {
                        formFieldsProp.length > 0 ? formFieldsProp.filter((it: any) => it.isDisabled != 1).map((item: any) => (
                            <Col span={24} className={styles.row_label}>
                                <Form.Item {...item.formItemProps} name={item.tableColum} label={item.displayName}>
                                    {
                                        item.filterType == "select" ?
                                            (
                                                <Select
                                                    showSearch={true}
                                                    {...item.componentCode}
                                                    onChange={(e) => console.log('e', e)}
                                                    filterOption={(input: any, option: any) =>
                                                        (item.componentCode.fieldNames.label && option[item.componentCode.fieldNames.label] && option[item.componentCode.fieldNames.label].toLowerCase().includes(input.toLowerCase()))
                                                    }
                                                    options={initData && !!initData[item.tableColum] && initData[item.tableColum] && initData[item.tableColum].length > 0 ? initData[item.tableColum] : []}
                                                >
                                                </Select>
                                            ) : (
                                                item.filterType == "datePicker" ?
                                                    (
                                                        <DatePicker
                                                            {...item.componentCode}
                                                            disabled={item.componentCode?.disabled ? true : isDisabled}
                                                        ></DatePicker>
                                                    ) :
                                                    (
                                                        item.filterType == "rangerPicker" ?
                                                            (
                                                                <RangePicker
                                                                    {...item.componentCode}
                                                                    disabled={item.componentCode?.disabled ? true : isDisabled}
                                                                ></RangePicker>
                                                            ) : (
                                                                item.filterType == "Upload" ?
                                                                    (
                                                                        <Upload
                                                                            {...item.componentCode}
                                                                            name='file'
                                                                            onPreview={handleUploadPreview}
                                                                            onChange={(info) => handleUploadChange(info, item.name)}
                                                                            fileList={props.modalForm.getFieldValue(`${item.name}`) ? [...props.modalForm.getFieldValue(`${item.name}`)] : []}
                                                                            headers={{
                                                                                Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
                                                                            }}
                                                                            disabled={item.componentCode?.disabled ? true : isDisabled}
                                                                        >
                                                                            <Button icon={<UploadOutlined />}>上传</Button>
                                                                        </Upload>
                                                                    ) :
                                                                    (
                                                                        item.filterType == 'Cascader' ?
                                                                            (
                                                                                <Cascader
                                                                                    {...item.componentCode}
                                                                                    options={[]}
                                                                                    onChange={(value) => { console.log(value) }}
                                                                                    disabled={item.componentCode?.disabled ? true : isDisabled}
                                                                                />
                                                                            ) :
                                                                            (
                                                                                item.filterType == 'TextArea' ?
                                                                                    <TextArea
                                                                                        {...item.componentCode}
                                                                                        style={{ height: 120 }}
                                                                                        disabled={item.componentCode?.disabled ? true : isDisabled}
                                                                                    />
                                                                                    :
                                                                                    (
                                                                                        item.filterType == 'ISelect' ?
                                                                                            <AutoComplete
                                                                                                {...item.componentCode}
                                                                                                filterOption={(input: any, option: any) =>
                                                                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                                                }
                                                                                                disabled={item.componentCode?.disabled ? true : isDisabled}
                                                                                                options={initData && !!initData[item.tableColum] && initData[item.tableColum] && initData[item.tableColum].length > 0 ? initData[item.tableColum] : []}
                                                                                            >
                                                                                            </AutoComplete>
                                                                                            :
                                                                                            <Input
                                                                                                {...item.componentCode}
                                                                                                disabled={item.componentCode?.disabled ? true : isDisabled}
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
            </div>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </fieldset >
    )
}

export default TaskViewForm;