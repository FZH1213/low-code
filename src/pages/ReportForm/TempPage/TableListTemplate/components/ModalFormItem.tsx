import React, { useEffect, useRef, useState } from 'react';
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
  InputNumber
} from 'antd';
// import '@/theme/default/common.less';
import { SubmitButton } from '@/pages/ReportForm/TempPage/components/Button';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE } from '@/utils/constant';
import moment from 'moment';
import api from '../service';
import styles from '../styles.less';
import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
// import RichText from '../../components/richText';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

// 新增/编辑模板
const ModalFormItem: React.FC<{}> = (props: any) => {
  const isDisabled = props.isDisabled ? props.isDisabled : false;
  const [form] = Form.useForm<FormInstance | undefined>();
  const btnSubmitRef = useRef<any>();
  // 文件上传
  const [fileList, setFileList] = useState<any>([]);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  // 富文本
  const [richTextCon, setrichTextCon] = useState<string>('');
  const [richTexthtml, setrichTexthtml] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    props.recordDetial && form.setFieldsValue({ ...props.recordDetial });
    props.recordDetial === undefined && props.formFieldsProp.length && getUserInfo()
  }, [props]);

  //获取用户信息
  const getUserInfo = () => {
    setLoading(true)
    props.formFieldsProp.length && props.formFieldsProp.map(async (item: any, index: any) => {
      if (!!item.code && item.code) {
        let obj: any = {}
        api.execByCode(JSON.stringify({}), item.code).then((res: any) => {
          res.response.code === 0 ? obj[item.tableColum] = res.response.data : message.error(res.response.message || '操作失败')
          res.response.code === 0 && form.setFieldsValue({ ...obj });
        })
      }
    })
    setLoading(false)
  }

  // 提交验证
  const onFieldFinish = async (params: any) => {
    let editData = { ...params };

    props.formFieldsProp.map((item: any) => {
      // 日期框值格式化
      if (item.filterType == "datePicker") {
        for (let key in editData) {
          if (key == item.tableColum && editData[key] !== undefined) {
            let dp: any = undefined;
            item?.componentCode?.showTime ? dp = moment(editData[key]._d).format("YYYY-MM-DD HH:mm:ss") : dp = moment(editData[key]._d).format("YYYY-MM-DD")
            editData[key] = dp
          }
        }
      }
      // 时间范围日期值格式化
      if (item.filterType == "rangerPicker") {
        for (let key in editData) {
          if (key == item.tableColum && editData[key] !== undefined) {
            let rp1: any = undefined;
            let rp2: any = undefined;
            item?.componentCode?.showTime ? rp1 = moment(editData[key][0]._d).format("YYYY-MM-DD HH:mm:ss") : rp1 = moment(editData[key][0]._d).format("YYYY-MM-DD");
            item?.componentCode?.showTime ? rp1 = moment(editData[key][0]._d).format("YYYY-MM-DD HH:mm:ss") : rp1 = moment(editData[key][0]._d).format("YYYY-MM-DD")
            editData[key] = [rp1, rp2].toString();
          }
        }
      }
      // 上传文件框值格式化
      if (item.filterType == 'Upload') {
        for (let key in editData) {
          if (key == item.tableColum) {
            let arr: any = [];
            if (editData[key]) {
              editData[key] && editData[key].forEach((it: any) => {
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
              editData[key] = JSON.stringify(arr);
            }
          }
        }
      }
      // 级联选择器值格式化
      if (item.filterType == 'Cascader') {
        for (let key in editData) {
          if (key == item.tableColum && editData[key] !== undefined) {
            editData[key] = editData[key].toString()
          }
        }
      }
      // 富文本RichText
      if (item.filterType == 'RichText') {
        for (let key in editData) {
          if (key == item.tableColum) {
            let richText = richTexthtml.replace(/<p>|<\/p>/gi, "")
            editData[key] = richTextCon;
            editData["richtextHtml"] = richText
          }
        }
      }

      //下拉框多选
      if (item.filterType === 'select' && !!item.componentCode && item.componentCode?.mode) {
        for (let key in editData) {
          if (key === item.tableColum && editData[key] !== undefined) {
            editData[key] = editData[key].toString()
          }
        }
      }

    });
    // 字段值为NULL,转换为空字符串''
    for (let key in editData) {
      if (!editData[key] && editData[key] != "" && editData[key] != null) {
        delete editData[key]
      }
    }

    if (!!props.treeObj) {
      editData = {
        ...editData,
        ...props.treeObj,
      }
    } else {
      editData = {
        ...editData,
      }
    }

    let submitData: any = {
      bizMap: editData
    };
    const res: any = await api.execByCode(JSON.stringify(submitData), props.submitCode)
    if (res.response.code === 0) {
      message.success(res.response.message);
      props.handleCancel(1);
    } else {
      message.error(res.response.message);
      btnSubmitRef.current.reset();
    }
  }

  // 提交失败，取消保存按钮 loading
  const onFieldFail = () => {
    btnSubmitRef.current.reset();
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

  //子传父 富文本框变化回调
  const getEditorValue = (str: any, htmlstr: any) => {
    setrichTextCon(str)
    setrichTexthtml(htmlstr);
  }
  const colseModal = () => props.handleCancel(0);

  return (
    <Modal
      title={props.modalTitle ? props.modalTitle : 'Title'}
      visible={props.modalVisible}
      width="70%"
      maskClosable={false}
      destroyOnClose={true}
      onCancel={colseModal}
      footer={false}
    >
      {
        loading ?
          <div className={styles.spinexample}>
            <Spin delay={500} />
          </div>
          : <Form
            form={form}
            className="wb-page-form"
            name="form"
            preserve={false}
            onFinish={onFieldFinish}
            onFinishFailed={onFieldFail}
          >

            <fieldset className="wb-fieldset wb-standard-margin">
              <div className="wb-fieldset-content">
                <Row className="area-mb-large" style={{ marginBottom: 50, width: "100%" }}>
                  {
                    props.formFieldsProp.length > 0 ? props.formFieldsProp.filter((it: any) => it.isDisabled != 1).map((item: any, i: any) => (
                      <Col
                        md={item.componentCode.colspan ? item.componentCode.colspan : 24}
                        xs={24}
                        sm={24}
                        key={i} className={styles.row_label}>
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
                          initialValue={(props.recordDetial && props.recordDetial[item.tableColum]) ? props.recordDetial[item.tableColum] : item.filterType == "datePicker" ? moment() : item.filterType == "select" && !item?.code && !!props.initData && props.initData[item.tableColum] && props.initData[item.tableColum].length ? props.initData[item.tableColum][0][item.componentCode.fieldNames.value] : undefined}
                        >
                          {
                            item.filterType == "InputNumber" ?
                              <InputNumber
                                style={{ width: '100%' }}
                                {...item.componentCode}
                                disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                              />
                              :
                              item.filterType == "select" ?
                                (
                                  <Select
                                    style={{ width: '100%' }}
                                    {...item.componentCode}
                                    getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                    onChange={(e) => console.log('e', e)}
                                    filterOption={(input: any, option: any) =>
                                      (item.componentCode.fieldNames.label && option[item.componentCode.fieldNames.label] && option[item.componentCode.fieldNames.label].toLowerCase().includes(input.toLowerCase()))
                                    }
                                    showSearch={true}
                                    disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                    options={props.initData && !!props.initData[item.tableColum] && props.initData[item.tableColum] && props.initData[item.tableColum].length > 0 ? props.initData[item.tableColum] : []}
                                  >
                                  </Select>
                                ) : (

                                  item.filterType == "datePicker" ?
                                    (


                                      <DatePicker
                                        style={{ width: "100%" }}
                                        {...item.componentCode}
                                        getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                        disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                        // defaultValue={isDisabled ? null : moment()}
                                        defaultValue={(props.recordDetial && props.recordDetial[item.tableColum]) ? props.recordDetial[item.tableColum] : isDisabled ? null : moment()}
                                      ></DatePicker>

                                    ) :
                                    (
                                      item.filterType == "rangerPicker" ?
                                        (
                                          <RangePicker
                                            {...item.componentCode}
                                            getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                            disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
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
                                                disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                              >
                                                <Button icon={<UploadOutlined />}>上传</Button>
                                              </Upload>
                                            ) :
                                            (
                                              item.filterType == 'Cascader' ?
                                                (
                                                  <Cascader
                                                    {...item.componentCode}
                                                    getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                                    options={props.initData && !!props.initData[item.tableColum] && props.initData[item.tableColum] && props.initData[item.tableColum].length > 0 ? props.initData[item.tableColum] : []}
                                                    onChange={(value) => { console.log(value) }}
                                                    disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                  />
                                                ) :
                                                (
                                                  item.filterType == 'TextArea' ?
                                                    <TextArea
                                                      {...item.componentCode}
                                                      style={{ height: 120 }}
                                                      disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                    />
                                                    :
                                                    (
                                                      item.filterType == 'RichText' ?
                                                        // <RichText
                                                        //   getEditorValue={getEditorValue}
                                                        //   values={props.recordDetial && props.recordDetial[item.tableColum] ? props.recordDetial[item.tableColum] : null}
                                                        //   isreadOnly={isDisabled}
                                                        // />
                                                        <Input />
                                                        :
                                                        (
                                                          item.filterType == 'ISelect' ?
                                                            <AutoComplete
                                                              {...item.componentCode}
                                                              getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                                              filterOption={(input: any, option: any) =>
                                                                (item.componentCode.fieldNames.label && option[item.componentCode.fieldNames.label] && option[item.componentCode.fieldNames.label].toLowerCase().includes(input.toLowerCase()))
                                                              }
                                                              disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                              options={props.initData && !!props.initData[item.tableColum] && props.initData[item.tableColum] && props.initData[item.tableColum].length > 0 ? props.initData[item.tableColum] : []}
                                                            >
                                                            </AutoComplete>
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
            </fieldset>

            <div className={styles.cardAffix}>
              <Space>
                <Button onClick={() => props.handleCancel(0)}>返回</Button>
                {isDisabled ? null : <SubmitButton ref={btnSubmitRef}>提交</SubmitButton>}
              </Space>
            </div>
          </Form>
      }

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Modal >
  );
};

export default ModalFormItem;