import { Form, Input, Row, Button, Card, Select, Col, message, Popconfirm, Spin, DatePicker, Upload, Cascader, Space } from 'antd';
import { FormInstance } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';
import styles from '../style.less';
import api from '../service';
import { FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import moment from 'moment';
import ModalFormItem from './ModalFormItem';
import React from 'react';
import ModalFormTemplate from '../../ModalFormTemplate';
import ModalFormProTemplate from '../../ModalFormProTemplate';
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const TreeNodeDetail = (props: any) => {
  const { linkRowDetial, sqlData, treeDetialTitile, selectedKeysValue } = props;
  // const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm<FormInstance | undefined>();
  const [formFieldsProp, setFormFieldsProp] = useState([]);
  const [initData, setInitData] = useState(undefined);
  const [editCode, setEditCode] = useState<any>('');
  const [delCode, setDelCode] = useState<any>('');
  // 弹窗部分
  const [modalTitle, setModalTitle] = useState<any>(undefined);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [recordDetial, setRecordDetial] = useState<any>(undefined);
  const [modalPageLink, setModalPageLink] = useState<any>(undefined); //跳转页面
  const [modalFormTemplate, setModalFormTemplate] = useState<boolean>(false)  //新增模板链接（不含附件）
  const [modalFormProTemplate, setModalFormProTemplate] = useState<boolean>(false)  //新增模板链接（含附件）
  // 获取页面下拉框子项数据
  const getInitData = async (code: any) => {
    if (code) {
      let res: any = await api.execByCode(JSON.stringify({}), code);
      res.response.code === 0 && setInitData(res.response.data);
    }
  }
  //树菜单模块 属性解释
  const pharsePageProps = (data: any) => {
    // 表单属性
    let fieldsArr: any = [];
    // 获取下拉list接口
    getInitData(data?.initDataApi);
    // 编辑、删除 接口，保存在state
    data && data?.topBut.map((it: any) => {
      if (it.type === '5') {
        setEditCode(it.code)
      }
      if (it.type === '7') {
        setDelCode(it.code)
      }
    });

    // 搜素框解析、列表属性解析
    data && data?.intfIttrDescList1.map((item: any, index: any) => {
      let componentCode = JSON.parse(item.componentCode);
      let formItemProps: any = {};
      for (let key in componentCode) {
        if (FORM_ITEM_API.includes(key)) {
          formItemProps[key] = componentCode[key];
          delete componentCode[key];
        }
        if (TABLE_COLUMN_API.includes(key) || key === 'searchSpan' || key === 'rules') {
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
    });

    setFormFieldsProp(fieldsArr);
  }

  useEffect(() => {
    pharsePageProps(sqlData)
  }, []);

  useEffect(() => {
    form.resetFields();
    let newRecord: any = { ...linkRowDetial }
    if (newRecord && selectedKeysValue) {
      formFieldsProp.forEach((item: any) => {
        if (item.filterType == 'datePicker') {

          if (!!newRecord[item.tableColum] && newRecord[item.tableColum]) {
            newRecord[item.tableColum] = moment(newRecord[item.tableColum]).format('YYYY-MM-DD')
          } else {
            newRecord[item.tableColum] = moment()
          }
        }
        if (item.filterType == 'rangerPicker') {
          if (!!newRecord[item.tableColum] && newRecord[item.tableColum]) {
            let arr: any = [moment(newRecord[item.tableColum].split(',')[0]), moment(newRecord[item.tableColum].split(',')[1])];
            newRecord[item.tableColum] = arr;
          } else {
            newRecord[item.tableColum] = [moment(), moment()];
          }
        }
      });
      form.setFieldsValue(newRecord);
    } else {
      form.resetFields();
    }

  }, [linkRowDetial, selectedKeysValue])

  // 关闭新增、编辑弹窗
  const handleCancel = (flag: any) => {
    setModalVisible(false);
    setModalTitle(undefined);
    setRecordDetial(undefined);
    setModalPageLink(undefined);
    //新增提交数据后、修改提交数据后，刷新数据页面 
    flag && props.refreshPage(flag)
  };

  // 删除方法
  const deleteTreeNode = async () => {
    const { title, ...obj }: any = { ...linkRowDetial }
    let res: any = await api.execByCode(JSON.stringify({ ...obj }), delCode);
    if (res.response.code === 0) {
      message.success(res.response.message);
      props.refreshPage(2)
    } else {
      message.error(res.response.message);
    }
  }


  return (
    <Card bodyStyle={{ paddingTop: 0, paddingBottom: 0, marginBottom: 0 }}>
      <Card
        title={`${treeDetialTitile}信息`}
        className={styles.tstitle}
        extra={
          <React.Fragment>
            <Space>
              {
                sqlData.topBut.length && sqlData.topBut.filter((item: any) => item.position == 2).map((ite: any, i: any) => (
                  ite.type == 5 ? //编辑弹窗
                    (
                      <Button
                        key={i}
                        type={formFieldsProp.length > 0 ? 'primary' : 'default'}
                        disabled={props.selectedKeysValue ? false : true}
                        onClick={() => {
                          let newRecord: any = { ...linkRowDetial }
                          formFieldsProp.forEach((item: any) => {
                            if (item.filterType == 'datePicker') {
                              if (!!newRecord[item.tableColum] && newRecord[item.tableColum]) {
                                newRecord[item.tableColum] = moment(newRecord[item.tableColum])
                              } else {
                                newRecord[item.tableColum] = moment()
                              }
                            }
                            if (item.filterType == 'rangerPicker') {
                              if (!!newRecord[item.tableColum] && newRecord[item.tableColum]) {
                                let arr: any = [moment(newRecord[item.tableColum].split(',')[0]), moment(newRecord[item.tableColum].split(',')[1])];
                                newRecord[item.tableColum] = arr;
                              } else {
                                newRecord[item.tableColum] = [moment(), moment()];
                              }
                            }
                          });
                          // 树节点编辑
                          setRecordDetial(newRecord);
                          setModalVisible(true);
                          setModalTitle('编辑');
                        }}
                      >
                        {ite.name}
                      </Button>
                    )
                    : (
                      ite.type == 2 ? //编辑弹窗
                        (
                          <Button
                            key={i}
                            type={formFieldsProp.length > 0 ? 'primary' : 'default'}
                            disabled={props.selectedKeysValue ? false : true}
                            onClick={() => {
                              let newRecord: any = { ...linkRowDetial }
                              formFieldsProp.forEach((item: any) => {
                                if (item.filterType == 'datePicker') {
                                  if (!!newRecord[item.tableColum] && newRecord[item.tableColum]) {
                                    newRecord[item.tableColum] = moment(newRecord[item.tableColum])
                                  } else {
                                    newRecord[item.tableColum] = moment()
                                  }
                                }
                                if (item.filterType == 'rangerPicker') {
                                  if (!!newRecord[item.tableColum] && newRecord[item.tableColum]) {
                                    let arr: any = [moment(newRecord[item.tableColum].split(',')[0]), moment(newRecord[item.tableColum].split(',')[1])];
                                    newRecord[item.tableColum] = arr;
                                  } else {
                                    newRecord[item.tableColum] = [moment(), moment()];
                                  }
                                }
                              });
                              // 树节点编辑
                              // setModalVisible(true);
                              // setRecordDetial(newRecord);
                              // setModalTitle(ite.name);
                              // setModalPageLink(ite.link);

                              // let rowData: any = getFormItemValue(record);
                              if (ite.link.indexOf('/report-manage/ModalFormReport/page&id=') > -1) {
                                setModalTitle(ite.name);
                                setModalPageLink(ite.link);
                                setRecordDetial(newRecord);
                                setModalFormTemplate(true)
                              } else if (ite.link.indexOf('/report-manage/ModalFormProReport/page&id=') > -1) {
                                setModalTitle(ite.name);
                                setModalPageLink(ite.link);
                                setRecordDetial(newRecord);
                                setModalFormProTemplate(true)
                              }
                            }}
                          >
                            {ite.name}
                          </Button>
                        ) : null
                    )
                ))
                // 树节点编辑
                // setRecordDetial(newRecord);
                // setModalVisible(true);
                // setModalTitle('编辑');
              }
              <Popconfirm
                title="确认删除此节点？"
                onConfirm={() => deleteTreeNode()}
                okText="确定"
                cancelText="取消"
                icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
              >
                <Button
                  className='deleteBtn'
                  disabled={props.selectedKeysValue ? false : true}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >删除</Button>

              </Popconfirm>
            </Space>
          </React.Fragment>
        }
      ></Card>
      <Form
        form={form}
      >
        <fieldset className="wb-fieldset">
          <div className="wb-fieldset-content">
            <Row>
              {
                formFieldsProp.length > 0 ? formFieldsProp.filter((it: any) => it.isDisabled != 1).map((item: any, i: any) => (
                  <Col span={12} key={i}>
                    <Form.Item
                      {...item.formItemProps}
                      name={item.tableColum}
                      label={item.displayName}
                      hidden={false}
                      required={false}
                    >
                      {
                        item.filterType == "select" ?
                          (
                            <Select
                              {...item.componentCode}
                              getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                              filterOption={(input: any, option: any) =>
                                (item.componentCode.fieldNames.label && option[item.componentCode.fieldNames.label].toLowerCase().includes(input.toLowerCase()))
                              }
                              showSearch={true}
                              disabled={true}
                              options={props.initData && !!props.initData[item.tableColum] && props.initData[item.tableColum] && props.initData[item.tableColum].length > 0 ? props.initData[item.tableColum] : []}
                            >
                            </Select>
                          )
                          : (
                            item.filterType == "datePicker" ?
                              (
                                <Input  {...item.componentCode}
                                  disabled={true}></Input>
                                // <DatePicker
                                //   {...item.componentCode}
                                //   disabled={true}
                                //   style={{ width: '100%' }}
                                //   defaultValue={(props.recordDetial && props.recordDetial[item.tableColum] )? props.recordDetial[item.tableColum]: item.isDisabled ? null : moment()}
                                // ></DatePicker>
                              ) :
                              (
                                item.filterType == "rangerPicker" ?
                                  (
                                    <RangePicker
                                      {...item.componentCode}
                                      getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                      disabled={true}
                                    ></RangePicker>
                                  ) : (
                                    item.filterType == "Upload" ?
                                      (
                                        <Upload
                                          // {...item.componentCode}
                                          name='file'
                                          onPreview={handleUploadPreview}
                                          onChange={(info) => handleUploadChange(info, item.name)}
                                          fileList={props.modalForm.getFieldValue(`${item.name}`) ? [...props.modalForm.getFieldValue(`${item.name}`)] : []}
                                          headers={{
                                            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
                                          }}
                                          disabled={true}
                                        >
                                          <Button icon={<UploadOutlined />}>上传</Button>
                                        </Upload>
                                      ) :
                                      (
                                        item.filterType == 'Cascader' ?
                                          (
                                            <Cascader
                                              // {...item.componentCode}
                                              getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                              options={[]}
                                              disabled={true}
                                            />
                                          ) :
                                          (
                                            item.filterType == 'TextArea' ?
                                              <TextArea
                                                // {...item.componentCode}
                                                style={{ height: 120 }}
                                                disabled={true}
                                              />
                                              :
                                              <Input
                                                {...item.componentCode}
                                                disabled={true}
                                              />
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
      </Form>
      {
        modalPageLink && modalFormTemplate ?
          <ModalFormTemplate
            isDisabled={false}
            modalTitle={modalTitle}
            modalVisible={modalFormTemplate}
            modalPageLink={modalPageLink}
            recordDetial={recordDetial}
            handleCancel={handleCancel}
          // initData={initData} //下拉list数据
          /> : null
      }

      {
        modalPageLink && modalFormProTemplate ?
          <ModalFormProTemplate
            isDisabled={false}  //是否可编辑
            modalTitle={modalTitle}   //弹窗标题
            modalVisible={modalFormProTemplate} //是否打开弹窗
            modalPageLink={modalPageLink} //页面链接
            recordDetial={recordDetial}  //行数据
            handleCancel={handleCancel}  //关闭弹窗方法
          />
          : null
      }
      {
        editCode && modalVisible ? <ModalFormItem
          isDisabled={false}
          modalTitle={modalTitle}
          modalVisible={modalVisible}
          recordDetial={recordDetial}
          handleCancel={handleCancel}
          formFieldsProp={formFieldsProp.length > 0 ? formFieldsProp : []}
          submitCode={editCode}
          initData={initData} //下拉list数据
        />
          : null
      }
    </Card>
  )
};

export default TreeNodeDetail;