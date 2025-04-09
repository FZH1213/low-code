import { useEffect, useMemo, useState } from 'react';
import {
    Form,
    Input,
    Select,
    DatePicker,
    Col,
    Row,
    Upload,
    Button,
    Modal,
    message,
    Cascader,
    Card,
    Empty,
} from 'antd';
import {
    getSrvCodeDetail
} from '../service';
import moment from 'moment';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE } from '@/utils/constant';
import { UploadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const FormInfo = (props: any) => {
    const sqlData = props.sqlData;
    const [idKey, setIdKey] = useState<any>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [formItemGroup, setFormItemGroup] = useState<any>([]);
    const [subSelOption, setSubSelOption] = useState<any>([]); //下拉框子项数据集
    const [cascaderOption, setCascaderOption] = useState<any>({}) //级联选择器子项数据

    // 上传文件
    const [fileList, setFileList] = useState<any>([]);
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewTitle, setPreviewTitle] = useState<string>('');

    useEffect(() => {
        phraseSubSQL();
        getDetial();
    }, [sqlData]);

    // 初始化
    useMemo(async () => {
        if (sqlData?.intCode && idKey && 1) {
            let objjj = {
                srvCode: sqlData?.intCode,
            };
            objjj[idKey] = props.bizId;
            let res0: any = await getSrvCodeDetail(objjj); //获取数据
            let res: any = res0.response;
            if (res.code === 0) {
                let newRowDetail = { ...res.data.cursor_result[0] }
                // 日期值初始化
                formItemGroup.forEach((item: any) => {
                    if (item.filterType == 'datePicker') {
                        !!newRowDetail[item.name] && newRowDetail[item.name] ? newRowDetail[item.name] = moment(newRowDetail[item.name]) : newRowDetail[item.name] = undefined
                    }
                    if (item.filterType == 'rangerPicker') {
                        newRowDetail[item.name] = moment(newRowDetail[item.name])
                    }
                    if (item.filterType == 'Upload') {
                        if (newRowDetail[item.name]) {
                            if (JSON.parse(newRowDetail[item.name])) {
                                let arr: any = [];
                                JSON.parse(newRowDetail[item.name]).forEach((it: any) => {
                                    let o = {
                                        ...it,
                                        url: `${FILE_REQUEST_BASE}?fileId=${it.fileId}`,
                                        status: 'defalut',
                                    }
                                    arr.push(o)
                                });
                                newRowDetail[item.name] = arr;
                            }
                        } else {
                            delete newRowDetail[item.name]
                        }
                    }
                    if (item.filterType == 'Cascader') {
                        if (newRowDetail[item.name]) {
                            newRowDetail[item.name] = newRowDetail[item.name].split(',')
                        }
                    }
                })
                //设置审核表单内容
                props.form && props.form?.current.setFieldsValue(newRowDetail);
                setLoading(false);
            }
        }
    }, [formItemGroup]);


    const getDetial = () => {
        // 表单项解释
        if (sqlData?.intfIttrDescList1.length) {
            
            let arr: any = [];
            sqlData.intfIttrDescList1.map(async (item: any) => {
                let componentCode = JSON.parse(item.componentCode);
                for (let key in componentCode) {
                    const condition = ['align', 'width', 'ellipsis', 'fixed', 'isAdd', 'isEdit', 'isDetial'];
                    if (condition.includes(key)) {
                        delete componentCode[key]
                    }
                }
                let obj = {
                    isFilter: item.isFilter,
                    isDisabled: item.isDisabled,
                    tableColum: item.tableColum,
                    filterType: item.filterType,
                    ...componentCode,
                }
                arr.push(obj);
                if (item.isId == 1) {
                    await setIdKey(item.tableColum)
                }
            });
            setFormItemGroup(arr);
        }

    }

    // 去重数组数据
    const reduceData = (arr: any) => {
        let newcertInfoList = [];
        let temparr = [];
        for (let i = 0; i < arr.length; i++) {
            let t = arr[i];
            let newFlag = t.value + t.label + t.name
            if (temparr.indexOf(newFlag) == -1) {
                temparr.push(newFlag);
                newcertInfoList.push(t);
            }
        }
        return newcertInfoList;
    }


    // 扁平数据转换为树形结构
    const toTreeData = async (arr: any, primaryKey: any, parentId: any) => {
        arr.forEach(function (item: any) {
            delete item.children;
        });
        let map = {}; // 构建map
        arr.forEach((i: any) => {
            map[i[primaryKey]] = i; // 构建以primaryKey为键 当前数据为值
        });
        let treeData: any = [];
        arr.forEach((child: any) => {
            const mapItem = map[child[parentId]]; // 判断当前数据的parentId是否存在map中
            if (mapItem) {
                (mapItem.children || (mapItem.children = [])).push(child);
            } else {
                // 不存在则是组顶层数据
                treeData.push(child);
            }
        });
        return new Promise((resolve) => {
            resolve(treeData)
        });
    };

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

    // SQl-select
    const phraseSubSQL = () => {
        if (sqlData?.intfIttrDescList1.length) {
            let selObjAttr: any = [];
            let casObjAtrr: any = {};
            sqlData.intfIttrDescList1.forEach(async (item: any) => {
                // 三级sql for select Option
                if (item.filterType === 'select') {
                    if (item?.intfManDesc) {
                        let labelField = '';
                        let valueField = '';
                        item.intfManDesc.intfIttrDescList1.forEach((it: any) => {
                            if (it.displayName === 'label') {
                                labelField = it.tableColum;
                            }
                            if (it.displayName === 'value') {
                                valueField = it.tableColum;
                            }
                        });
                        let res: any = await getSrvCodeDetail({ srvCode: item.intfManDesc.intCode });
                        if (res.response.code === 0 && res.response.data.cursor_result && res.response.data.cursor_result.length > 0) {
                            res.response.data.cursor_result.forEach((ii: any) => {
                                if (!!ii[labelField]) {
                                    let o = {
                                        filterType: item.filterType,
                                        value: ii[valueField],
                                        label: ii[labelField],
                                        name: item.tableColum,
                                    }
                                    selObjAttr.push(o)
                                }
                            });
                        }
                    }
                    setSubSelOption(reduceData(selObjAttr))
                }
                // 三级sql for Cascader Option
                if (item.filterType === 'Cascader') {
                    if (item?.intfManDesc) {
                        let primaryKey = '';
                        let parentId = '';
                        item.intfManDesc.intfIttrDescList1.forEach((ite: any) => {
                            if (ite.displayName === 'primaryKey') {
                                primaryKey = ite.tableColum
                            }
                            if (ite.displayName === 'parentId') {
                                parentId = ite.tableColum
                            }
                        });
                        let res: any = await getSrvCodeDetail({ srvCode: item.intfManDesc.intCode });
                        if (res.response.code === 0 && res.response.data.cursor_result && res.response.data.cursor_result.length > 0) {
                            casObjAtrr[item.tableColum] = await toTreeData(res.response.data.cursor_result, primaryKey, parentId)
                        }
                    }
                    setCascaderOption({ ...cascaderOption, ...casObjAtrr });
                }
            });
        }
    }


    return (
        <Card loading={loading}>
            <fieldset className="wb-fieldset">
                <legend className="wb-fieldset-legend">
                    <h3 className="wb-fieldset-title">审核内容</h3>
                </legend>
                {
                    formItemGroup.length > 0 ?
                        <div className="wb-fieldset-content">
                            <Row>
                                {
                                    formItemGroup.filter((it: any) => it.isDisabled != 1).map((item: any) => (
                                        <Col span={item.searchSpan ? item.searchSpan : 24}>
                                            <Form.Item {...item}>
                                                {
                                                    item.filterType == "select" ?
                                                        (
                                                            <Select
                                                            
                                                                showSearch={true}
                                                                {...item}
                                                                onChange={(e) => console.log('e', e)}
                                                                filterOption={(input: any, option: any) =>
                                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                                }
                                                                disabled={item?.disabled ? true : false}
                                                            >
                                                                {subSelOption.filter((it: any) => it.name === item.tableColum).map((ite: any) => (
                                                                    <Option key={ite.value} label={ite.label} value={ite.value}>{ite.label}</Option>
                                                                ))}
                                                            </Select>
                                                        ) : (
                                                            item.filterType == "datePicker" ?
                                                                (
                                                                    <DatePicker
                                                                        {...item}
                                                                        disabled={item?.disabled ? true : false}
                                                                    ></DatePicker>
                                                                ) :
                                                                (
                                                                    item.filterType == "rangerPicker" ?
                                                                        (
                                                                            <RangePicker {...item}
                                                                                disabled={item?.disabled ? true : false}
                                                                            ></RangePicker>
                                                                        ) : (
                                                                            item.filterType == "Upload" ?
                                                                                (
                                                                                    <Upload {...item}
                                                                                        name='file'
                                                                                        onPreview={handleUploadPreview}
                                                                                        onChange={(info) => handleUploadChange(info, item.tableColum)}
                                                                                        fileList={props.form.getFieldValue(`${item.tableColum}`) ? [...props.form.getFieldValue(`${item.tableColum}`)] : []}
                                                                                        headers={{
                                                                                            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
                                                                                        }}
                                                                                        disabled={item?.disabled ? true : false}
                                                                                    >
                                                                                        <Button icon={<UploadOutlined />}>上传</Button>
                                                                                    </Upload>
                                                                                ) :
                                                                                (
                                                                                    item.filterType == 'Cascader' ?
                                                                                        (
                                                                                            cascaderOption[item.tableColum] && cascaderOption[item.tableColum].length > 0 ?
                                                                                                (
                                                                                                    <Cascader
                                                                                                        {...item}
                                                                                                        options={cascaderOption[item.tableColum]}
                                                                                                        onChange={(value) => { console.log(value) }}
                                                                                                        disabled={item?.disabled ? true : false}
                                                                                                    />
                                                                                                )
                                                                                                :
                                                                                                <Input placeholder={`请输入`} allowClear disabled={item?.disabled ? true : false} />
                                                                                        ) :
                                                                                        (
                                                                                            item.filterType == 'TextArea' ?
                                                                                                <TextArea  {...item} style={{ height: 120 }} />
                                                                                                :
                                                                                                <Input placeholder={`请输入`} allowClear disabled={item?.disabled ? true : false} />
                                                                                        )
                                                                                )
                                                                        )
                                                                )
                                                        )
                                                }
                                            </Form.Item>
                                        </Col>
                                    ))
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
                        :
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
            </fieldset>
        </Card>
    );
};

export default FormInfo;