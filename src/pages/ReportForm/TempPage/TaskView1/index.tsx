import React, { useState, useEffect, useRef, Fragment } from 'react';
import {
    Button,
    Modal,
    Upload,
    Table,
    message,
    Space,
    Affix,
    Form,
    Select,
    Row,
    Col,
    DatePicker,
    Cascader,
    Input,
    InputNumber,
    Spin,
    AutoComplete,
    UploadProps,
    Divider,
} from 'antd';
import { useParams } from 'umi';
import moment from "moment";
import {
    getLoginUser,
    getButtonList,
    getUserList,
    completeTask,
    transferTask,
    selectTaskLogByTaskId,
    getSrvCode,
    execByCode,
    getDataByBizCode,
    getTreeDetailById,

} from './service';
import { Card } from 'antd-mobile';
const { Option } = Select;
import ComTextArea from '@/components/ComTextArea';
import styles from './style.less';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Dragger } = Upload;
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import { connect, history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import '@/pages/ReportForm/theme/default/common.less';

import { authUrl } from '@/utils/constant';



const App: React.FC = (props: any) => {
    const { code }: any = useParams();
    // console.log(code, '123');
    console.log(props, '45');
    // const approvePage = history.location.query?.approvePage;  //审批页面id
    // const approvePage = code.split("id=")[1]  //审批页面id
    const approvePage = code.split("pageId=")[1]  //审批页面id
    const taskId = props.location.query?.taskId; //任务id
    const bizId = props.location.query.bizId;
    // console.log(123, approvePage, taskId, bizId);
    const form = useRef<any>();
    const [tranferFormInfo] = Form.useForm();//转交弹窗


    //获取用户信息
    const [loginUserInfo, setLoginUserInfo] = useState<any>(undefined);
    //获取人员列表
    const [userListData, setUserListData] = useState<any>(undefined);
    //流程日志
    const [taskLogList, setTaskLogList] = useState<any>([]);
    //底部按钮数组
    const [bottomBtnArr, setBottomBtnArr] = useState<any>([])
    const [isModalVisible, setIsModalVisible] = useState(false);//关闭弹窗
    const [taskToUserId, setTaskToUserId] = useState<any>();//转交人
    //下拉框子数据集
    const [initData, setInitData] = useState<any>(undefined);

    // 表单属性解析
    const [formFieldsProp, setFormFieldsProp] = useState([]);
    const [taskContentField, setTaskContentField] = useState<any>([])
    // 文件上传带附件列表
    const [fileList, setFileList] = useState<any>([]);
    const [imageView, setImageView] = useState<string>('')

    const [isShow, setIsShow] = useState(false)
    const [contentValue, setContentValue] = useState(null)
    const [dataSourceFile, setDataSourceFile] = useState<any>([])
    const [modalVisibleFile, setModalVisibleFile] = useState(false)
    const [pasteFile, setPasteFile] = useState<any>([])
    const [accept, setAccept] = useState<any>("");
    const [msg, setMsg] = useState<any>("");

    // const isDisabled = props.isDisabled ? props.isDisabled : false;
    const isDisabled = props.isDisabled ? props.isDisabled : false;


    //文件上传带附件列表--end
    useEffect(() => {
        getLoginUserInfo();
        fetchGetUserList();
        fetchTaskLogList();
    }, []);

    useEffect(() => {
        setFormFieldsProp([]);
        setBottomBtnArr([])
        approvePage && getViewData();
    }, [approvePage]);
    /**获取当前用户信息*/
    const getLoginUserInfo = async () => {
        let res: any = await getLoginUser();
        setLoginUserInfo(res.data)
    }

    /**获取人员列表*/
    const fetchGetUserList = async () => {
        const response = await getUserList();
        if (response.code == 0) {
            // console.log(response);
            setUserListData(response.data)
        }
    }

    //获取流程日志
    const fetchTaskLogList = async () => {
        let params: any = {
            bizId: bizId,
            current: 1,
            pageSize: 10,
            procDefId123: props.location.query.procDefId123,
            taskId: taskId
        }
        const response: any = await selectTaskLogByTaskId(Object.assign(params));

        if (response.response.code == 0) {
            setTaskLogList(response.response.data.records)
            // console.log(response.response.data.records, '--------------');
        } else {
            message.error(response.message)
        }
    }

    //提交通过不通过
    const submit2 = async (pass: any, code: any) => {
        // console.log(pass,'123pass');
        // console.log(code, '123');

        let flag: any = true;
        let value = form?.current.getFieldsValue();
        const { remark, ...bizMap } = value;
        // console.log(taskContentField, '123taskContentField')
        taskContentField.map((item: any) => {
            // 日期框值格式化
            // console.log(item.filterType == "datePicker" && value[item.tableColum] != "" && value[item.tableColum] != null && value[item.tableColum] != undefined)

            if (item.filterType == "datePicker" && value[item.tableColum] != "" && value[item.tableColum] != null && value[item.tableColum] != undefined) {

                for (let key in bizMap) {
                    if (key == item.tableColum) {
                        let dp = moment(bizMap[key]._d).format("YYYY-MM-DD")
                        bizMap[key] = dp
                    }
                }
            }
            // 时间范围日期值格式化
            if (item.filterType == "rangerPicker") {
                for (let key in bizMap) {
                    if (key == item.tableColum) {
                        let rp1 = moment(bizMap[key][0]._d).format("YYYY-MM-DD")
                        let rp2 = moment(bizMap[key][1]._d).format("YYYY-MM-DD")
                        bizMap[key] = [rp1, rp2].toString();
                    }
                }
            }
            // 上传文件框值格式化
            if (item.filterType == 'Upload') {
                for (let key in bizMap) {
                    if (key == item.tableColum) {
                        let arr: any = [];
                        if (bizMap[key]) {
                            bizMap[key] && bizMap[key].forEach((it: any) => {
                                if (it.status === 'defalut') {
                                    let o = {
                                        name: it.name,  // 文件名
                                        fileId: it.fileId, // 服务端，文件id
                                        type: it.type,
                                    }
                                    arr.push(o)
                                } else {
                                    let o = {
                                        name: it.name,  // 文件名
                                        fileId: it.response.data.fileId, // 服务端，文件id
                                        type: it.type,    //保存文件类型
                                    }
                                    arr.push(o)
                                }
                            });
                            bizMap[key] = JSON.stringify(arr);
                        }
                    }
                }
            }
            // 级联选择器值格式化
            if (item.filterType == 'Cascader') {
                for (let key in bizMap) {
                    if (key == item.tableColum) {
                        bizMap[key] = bizMap[key].toString()
                    }
                }
            }
        });
        // 字段值为NULL,转换为空字符串''
        for (let key in bizMap) {
            // console.log(bizMap, '123bizMap');

            if (bizMap[key] === null || bizMap[key] === undefined) {
                bizMap[key] = '';
            }
        }
        let params: any = {
            bizMap: bizMap,
            taskId: taskId,
            pass: pass,
            remark: remark ? remark : '',
        }
        // console.log(params, '123params');
        // let res: any = await execByCode(params, code)
        let res: any = await completeTask(Object.assign(params))
        // console.log(authUrl, '123authUrl');

        if (res.response.code === 0) {
            message.success(`success`)
            history.goBack()
        } else {
            message.error(res.response.message)
            history.goBack()
        }
    }

    // 关闭弹窗
    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // 流程转交
    const handletransferOk = async () => {
        let value = form?.current.getFieldsValue();
        const { remark } = value;
        let params = {
            doUserId: loginUserInfo.userId,
            toUserId: taskToUserId,
            taskId: taskId,
            remark: remark,
        };
        let res: any = await transferTask(Object.assign(params));
        if (res.response.code === 0) {
            setIsModalVisible(false);
            message.success('转交成功')
            props.history.push({
                pathname: '/report-manage/TaskView1',
            })
        }
    };

    // 流程信息列表columns
    const columns: Array<any> = [
        {
            title: '节点',
            dataIndex: 'nodeName',
            key: 'nodeName',
            align: 'center',
            width: '11%',
        },
        {
            title: '创建时间',
            dataIndex: 'gmtCreate',
            key: 'gmtCreate',
            align: 'center',
            width: '11%',
        },
        {
            title: '处理人',
            dataIndex: 'opModifiedName',
            key: 'opModifiedName',
            align: 'center',
            width: '11%',
        },
        {
            title: '审核结果',
            dataIndex: 'optType',
            key: 'optType',
            align: 'center',
            width: '11%',
        },

        {
            title: '审核时间',
            dataIndex: 'gmtModified',
            key: 'gmtModified',
            align: 'center',
            width: '11%',
        },
        {
            title: '审核意见',
            dataIndex: 'remark',
            key: 'remark',
            align: 'center',
            width: '11%',
        },
    ];

    //item项占满一行后，label文字部分和wrapper输入部分的占比
    const formItemLayout2 = {
        labelCol: {
            xl: 3,
            md: 4,
        },
        wrapperCol: {
            xl: 21,
            md: 22,
        },
    }

    //上面表单
    // 获取页面数据
    const getViewData = async () => {
        const res1: any = await getViewProps();
        res1 && pharsePageProps(res1);
    }
    const getViewProps = () => {
        let pageProps: any = getSrvCode(approvePage)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(pageProps);
            }, 300);
        });
    }

    // 根据页面id获取页面配置属性
    const getSrvCode = async (id: any) => {
        // console.log(id, 'id');
        // console.log({ id: id }, 'idid');

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
        let bottomBtnArrs: any = []

        // let fidKey: any = approvePage;
        // console.log(data?.intfIttrDescList1);
        data && data?.initDataApi && getInitData(data?.initDataApi);
        data && data?.intfIttrDescList1.map((item: any, index: any) => {
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
            // console.log(data.topBut, '123data.topBut');


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

            if (item.isId == 1) {
                fidKey = item.tableColum;
            }
        });

        data.topBut.map((it: any) => {

            if (it.type == 16) {//通过
                it = {
                    ...it,
                    pass: 'Y'
                }
            } else if (it.type == 17) {//不通过
                it = {
                    ...it,
                    pass: 'N'
                }
            } else if (it.type == 18) {//提交
                it = {
                    ...it,
                    pass: 'Y'
                }
            } else if (it.type == 19) {//转交
                it = {
                    ...it,
                    pass: 'C'
                }
            }
            if (it.position.includes('3')) {
                bottomBtnArrs.push(it)
                // console.log(bottomBtnArrs, '123456789');

            } else {
                return;
            }
        })
        data && data?.intCode && getBizCodeData(data.intCode, fidKey, fieldsArr);
        getFormFieldsProp(fieldsArr);
        setFormFieldsProp(fieldsArr);
        setBottomBtnArr(bottomBtnArrs)//底部按钮
        // console.log(fieldsArr, '123fieldsArr');
        // console.log(bottomBtnArrs, '789bottomBtnArrs');
        // console.log(bottomBtnArr, '7777777bottomBtnArr');

        // console.log(formFieldsProp, '123formFieldsProp');

    }

    // 获取页面下拉框子项数据
    const getInitData = async (code: any) => {
        let res: any = await execByCode(JSON.stringify({}), code);
        res.response.code === 0 && setInitData(res.response.data)
    }
    // 获取列表数据 by BizCode
    const getBizCodeData = async (srvCode: any, fidKey: any, fieldsArr: any) => {
        // console.log('bizId', bizId);
        let filterFFFF: any = {};
        // filterFFFF[fidKey] = bizId;
        filterFFFF['id'] = bizId;
        let res0: any = await getDataByBizCode(Object.assign({ srvCode }, filterFFFF));
        let res = res0.response;
        if (res.code == 0) {
            let newRowDetail = { ...res.data?.cursor_result[0] }
            fieldsArr.forEach((item: any) => {
                if (item.filterType == 'datePicker') {
                    if (!!newRowDetail[item.tableColum] && newRowDetail[item.tableColum]) {
                        newRowDetail[item.tableColum] = moment(newRowDetail[item.tableColum])
                    } else {
                        newRowDetail[item.tableColum] = undefined
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
            form && form?.current.setFieldsValue(newRowDetail);
        }
    }
    // 获取代办审核内容的控件类型,用于提交日期格式转化
    const getFormFieldsProp = (arr: any) => {
        setTaskContentField(arr)
    }

    //文件
    const columnFile = [
        {
            title: '序号',
            dataIndex: 'seq',
            width: 80,
            render: (text: any, record: any, index: any) => `${index + 1}`  // 自增
        },
        {
            title: '文档名称',
            dataIndex: 'fileName',
            width: 160,
            render:
                (val: any, record: any) => (
                    <Fragment>
                        {
                            record.fileName.split(".").pop() == "jpeg" || record.fileName.split(".").pop() == "JPEG" ||
                                record.fileName.split(".").pop() == "png" || record.fileName.split(".").pop() == "PNG" ||
                                record.fileName.split(".").pop() == "image" || record.fileName.split(".").pop() == "IMAGE" ||
                                record.fileName.split(".").pop() == "jpg" || record.fileName.split(".").pop() == "JPG" ?
                                <a onClick={() => imageModal(record)} >{val}</a>
                                :
                                val
                        }
                    </Fragment>
                )
        },
        {
            title: '文档大小',
            dataIndex: 'size',
            width: 120,
            render: (val: any) => <span>{val > 1024 ? (val > 1024 * 1024 ? `${(val / (1024 * 1024)).toFixed(2)}MB` : `${(val / 1024).toFixed(2)}KB`) : `${val}B`}</span>
        },
        {
            title: '备注',
            width: 180,
            dataIndex: 'commentInfo',
            render: (text: any, record: any) => {
                let br = <br></br>;
                let result = null;
                for (let i = 0; i < fileList.length; i++) {

                    if (text) {
                        let contentStr = fileList[i].commentInfo;
                        contentStr = text.split("\n");
                        for (let j = 0; j < contentStr.length; j++) {
                            if (j == 0) {
                                result = contentStr[j];
                            } else {
                                result = <span>{result}{br}{contentStr[j]}</span>;
                            }
                        }
                        return <Tooltip title={result} trigger="click" placement="bottom">
                            <div style={{ width: "92%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", wordBreak: "keep-all" }}>{result}</div>
                        </Tooltip>
                    }
                }
            },
        },
        {
            title: '上传人',
            dataIndex: 'entName',
            width: 120,
        },
        {
            title: '上传时间',
            width: 160,
            dataIndex: 'entTime',
            defaultSortOrder: 'descend',
            sorter: (a: any, b: any) => a.entTime.localeCompare(b.entTime),
            render: (val: any) => <span>{moment(val).format(dateFormatYMDHMS)}</span>,
        },
        {
            title: '操作',
            dataIndex: 'opt',
            width: 140,
            key: 'delete',
            render: (text: any, record: any, index: any) => (
                <Fragment>
                    <a href={`/api/file/fileDown/downloadFileById?fileId=${record.fileId}`}>下载</a>
                    <Divider type="vertical" style={{ display: isDisabled ? 'none' : 'inline' }} />
                    <a onClick={() => {
                        setFileList(fileList.filter((item: any) => item.fileId !== record.fileId))
                        setDataSourceFile(dataSourceFile.filter((item: any) => item.fileId !== record.fileId))
                    }}
                        // disabled={isDisabled ? isDisabled : (!!props.disabled && props.disabled ? props.disabled : false)}
                        style={{ display: isDisabled ? 'none' : 'inline' }}
                    >删除</a>
                </Fragment>
            )
        }
    ]
    const imageModal = (record: any) => {
        setModalVisibleFile(true)
        const imgUrl: any = fileList.find((item: any) => item.uid === record.uid)
        setImageView(imgUrl.fileUrlView)
    }
    const dateFormatYMDHMS = 'YYYY-MM-DD HH:mm:ss';
    const handleOk = () => {
        setIsShow(false)
        fileList.map((item: any) => {
            if (!item['commentInfo']) {
                item['commentInfo'] = contentValue
            }
        })
        setDataSourceFile(fileList)
        setContentValue(null)
    }
    const formItemLayout = {
        labelCol: {
            span: 2,
        },
        wrapperCol: {
            span: 22,
        },
    };
    const uploadFiles: UploadProps = {
        accept,
        name: 'file',
        multiple: true,
        action: '/api/file/fileInfo/upload',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        data: { btype: 'LIST_OF_COMPLIANCE' },
        onChange(info: any) {
            const { status } = info.file;
            if (status !== 'uploading') {
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                info.file.response.data['commentInfo'] = contentValue
                info.file.response.data['size'] = info.file.size
                setFileList(() => {
                    return [...fileList, info.file.response.data]
                })
            } else if (status === 'removed') {
                let currentFile = fileList.filter((item: any, index: any) => {
                    return item.fileId !== info.file.response.data.fileId
                })
                setFileList(currentFile)
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onRemove(file: any) {
            file.status = 'removed'
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
        beforeUpload(file: any) {
            console.log(file.type);
            const isLt1M = file.size / 1024 / 1024 < 100;
            if (!isLt1M) {
                message.error('附件大小不能超过100M!');
            }
            return isLt1M || Upload.LIST_IGNORE;
        }
    };

    return (
        <>
            <Card>
                <Form
                    ref={form}
                    className="wb-page-form"
                    name="form"
                >
                    {/* 审核内容 */}
                    <fieldset className="wb-fieldset wb-standard-margin" style={{ width: '90%' }}>
                        <legend className="wb-fieldset-legend">
                            <h3 className="wb-fieldset-title">审核内容</h3>
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
                                                                            item.filterType == "upload" ?
                                                                                (
                                                                                    <>
                                                                                        <Button
                                                                                            icon={<UploadOutlined />}
                                                                                            {...item.componentCode}
                                                                                            onClick={() => {
                                                                                                setIsShow(true)
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
                                                                                                        (
                                                                                                            item.filterType == "InputNumber" ?
                                                                                                                <InputNumber
                                                                                                                    style={{ width: '100%' }}
                                                                                                                    {...item.componentCode}
                                                                                                                    disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                                                                                />
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
                    </fieldset >
                    <fieldset className="wb-fieldset wb-standard-margin" style={{ width: '90%' }}>
                        <Card title="文件列表" className={styles.card} >
                            <Table columns={columnFile} dataSource={dataSourceFile} scroll={{ x: true }} />
                        </Card>
                    </fieldset>
                    <Modal
                        visible={isShow}
                        onCancel={() => {
                            setIsShow(false)

                        }}
                        onOk={handleOk}
                        destroyOnClose={true}
                        maskClosable={false}
                    >
                        <Form id={'uploadid'} style={{ padding: '20px' }}>
                            <Form.Item {...formItemLayout} label="备注：">
                                <TextArea style={{ minHeight: 32 }} placeholder="请输入" rows={4}
                                    onChange={(e: any) => {
                                        setContentValue(e.currentTarget.value)
                                    }}
                                />
                            </Form.Item>
                            <Dragger {...uploadFiles}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-hint">点击或拖拽文件到此区域上传</p>
                                <p className="ant-upload-hint">{msg}</p>
                            </Dragger>
                        </Form>
                    </Modal>

                    {/* 审核意见 */}
                    <fieldset className="wb-fieldset wb-standard-margin" style={{ width: '90%' }}>
                        <legend className="wb-fieldset-legend">
                            <h3 className="wb-fieldset-title">审核意见</h3>
                        </legend>
                        <div className="wb-fieldset-content">
                            <Row>
                                <Col span={24} className={styles.row_label}>
                                    {/* loginUserInfo != undefined && userListData != undefined && taskLogList != undefined &&  */}
                                    {
                                        <ComTextArea
                                            FormItemProps={{
                                                name: 'remark',
                                                rules: [{ required: false, message: '意见不能为空' }, { max: 2000 }],
                                                // ...formItemLayout2
                                            }}
                                            label="意&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;见"
                                            placeholder="请输入意见"
                                            showCount
                                            maxLength={2000}
                                            autoSize={{ minRows: 3 }}
                                        ></ComTextArea>
                                    }
                                </Col>
                            </Row>
                        </div>
                    </fieldset>
                    {/* 流程信息 */}

                    <fieldset className="wb-fieldset wb-standard-margin" style={{ width: '90%' }}>
                        <legend className="wb-fieldset-legend">
                            <h3 className="wb-fieldset-title">流程信息</h3>
                        </legend>
                        <div style={{ paddingBottom: 10 }}>
                            {loginUserInfo != undefined && userListData != undefined && taskLogList != undefined && <Table
                                columns={columns}
                                rowKey="id"
                                dataSource={taskLogList}
                            />}
                        </div>
                    </fieldset>

                    {/* 流程审核按钮 */}
                    <Affix
                        offsetBottom={0}
                        style={{
                            textAlign: 'right',
                            width: '100%',
                            position: 'fixed',
                            bottom: 0,
                            left: "0",
                            zIndex: 999
                        }}
                    >
                        <div
                            style={{
                                borderTop: '1px solid #d9d9d9',
                                backgroundColor: 'white',
                                padding: 10,
                                paddingRight: 20,
                                paddingLeft: "12.5%",
                            }}
                        >
                            <Space size="small">
                                <Button
                                    type="default"
                                    style={{ width: '96px' }}
                                    onClick={(e: any) => {
                                        history.go(-1);
                                    }}
                                >返回</Button>
                                {
                                    bottomBtnArr.length > 0 ?
                                        (bottomBtnArr.map((item: any) => (
                                            item.type == 16 ? //通过
                                                (
                                                    <Button
                                                        type='primary'
                                                        value={item.pass}
                                                        style={{ width: '96px' }}
                                                        onClick={(e: any) => {
                                                            submit2(item.pass, item.code)
                                                        }}
                                                    >{item.name}</Button>
                                                ) : (item.type == 17 ?//不通过
                                                    (<Button
                                                        type='primary'
                                                        value={item.pass}
                                                        style={{ width: '96px' }}
                                                        onClick={(e: any) => {
                                                            submit2(item.pass, item.code)
                                                        }}
                                                    >{item.name}</Button>) : (
                                                        item.type == 18 ?//提交
                                                            (<Button
                                                                type='primary'
                                                                value={item.pass}
                                                                style={{ width: '96px' }}
                                                                onClick={(e: any) => {
                                                                    submit2(item.pass, item.code)
                                                                }

                                                                }
                                                            >{item.name}</Button>) : (
                                                                item.type == 19 ?//转交
                                                                    (<Button
                                                                        type='primary'
                                                                        value={item.pass}
                                                                        style={{ width: '96px' }}
                                                                        onClick={() => {
                                                                            setIsModalVisible(true)
                                                                        }}
                                                                    >{item.name}</Button>
                                                                    ) : (null)
                                                            )
                                                    ))
                                        ))) : (null)
                                }
                            </Space>
                        </div>
                    </Affix>
                </Form>
            </Card>
            <Modal
                title="转交处理人"
                visible={isModalVisible}
                // visible={true}
                onOk={handletransferOk}
                onCancel={handleCancel}
            >
                <Form
                    {...formItemLayout2}
                    layout="horizontal"
                    style={{ marginTop: "10px" }}
                    form={tranferFormInfo}
                >
                    <Form.Item
                        label="处理人"
                        style={{ marginBottom: "12px" }}
                        name="tranferName"
                    >
                        <Select
                            showSearch
                            optionFilterProp="children"
                            placeholder="请选择处理人"
                            onChange={(e) => {
                                setTaskToUserId(e);
                            }}
                        >
                            {userListData != undefined && userListData.length > 0 && userListData.map((item: any) => (
                                <Option key={item.userId} value={item.userId}>{item.nickName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default App;
