import React, { useEffect, useState, useRef, } from 'react';
import {
  Row,
  Col,
  Select,
  Card,
  Space,
  Form,
  message,
  Modal,
  Affix,
  Table,
  Button,
  Tag,
} from 'antd';
import { connect, history, useParams } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import '@/pages/ReportForm/theme/default/common.less';
import styles from './styles.less';
import {
  getLoginUser,
  getButtonList,
  getUserList,
  completeTask,
  transferTask,
  selectTaskLogByTaskId,
  getSrvCode,
  execByCode
} from './service';
import ComTextArea from '@/components/ComTextArea';
import TaskViewForm from './component/TaskViewForm';
// 绩效模块
import PreTable from './component/components/pretable';
import PreWorkerTable from './component/components/preworkerTable';
import EditTable from './component/EditTable';
import { authUrl } from '@/utils/constant';
import moment from 'moment';
const { Option } = Select;

interface DataType {
  examName: string[];
  performanceTemplate: string[]
}
const Step2: React.FC<any> = (props) => {
  const { code }: any = useParams();

  // const approvePage = history.location.query?.approvePage;  //审批页面id
  // const taskId = history.location.query?.taskId; //任务id
  // const bizId = history.location.query.bizId;
  const approvePage = code.split("pageId=")[1]  //审批页面id
  const taskId = props.location.query?.taskId; //任务id
  const bizId = props.location.query.bizId;
  // console.log(buttons, 'buttons');
  // console.log(approvePage, '123approvePage');


  const tableRef = useRef<any>(null);
  const listRef = useRef<any>(null);
  /** 流程任务审核信息 */
  // const [loading, setLoading] = useState<boolean>(false);
  // const [formComponent, setFormComponent] = useState<any>(undefined);
  const form = useRef<any>();
  /** 流程信息日志 */
  //   {loginUserInfo !=undefined && userListData!=undefined && taskLogList !=undefined && 
  const [taskLogList, setTaskLogList] = useState<any>(undefined);
  /**审核结果*/
  const [taskCheckResultList, setTaskCheckResultList] = useState<any>(undefined);
  /** 流程按钮 */
  const [loginUserInfo, setLoginUserInfo] = useState<any>(undefined);
  const [buttonList, setButtonlist] = useState<any>([]);
  // 绩效保存按钮
  const [prebuttonList, setPreButtonlist] = useState<any>([]);

  // 转交弹窗
  const [userListData, setUserListData] = useState<any>(undefined);
  const [tranferFormInfo] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskToUserId, setTaskToUserId] = useState<any>();

  const [taskContentField, setTaskContentField] = useState<any>([])

  //一级sql页面
  const [componentList, setComponentList] = useState<any>([]);
  const [formItemGroup, setFormItemGroup] = useState<any>([]);
  const [isEditTable, setIsEditTable] = useState<boolean>(false)
  // 下拉list数据
  const [initData, setInitData] = useState(undefined);

  //底部按钮数组
  const [bottomBtnArr, setBottomBtnArr] = useState<any>([])

  //下拉表格
  const [selectTable, setSelectTable] = useState<any>('')
  //下拉表格中的编辑表格
  const [performance, setPerformance] = useState<any>('')


  useEffect(() => {
    if (approvePage) {
      getSrvCodeInfo(approvePage)
    }
    setBottomBtnArr([])

  }, [approvePage])
  useEffect(() => {
    getLoginUserInfo();
    fetchGetUserList();
    fetchTaskLogList();
    // fetchGetButtonList();
    fetchTaskCheckResultList()
    // console.log(initData, '11data');

  }, []);


  /**根据页面id获取页面各个模块配置属性  一级sql*/
  const getSrvCodeInfo = async (id: any) => {
    const res0: any = await getSrvCode({ id });

    if (res0.code === 0 && res0.data) {
      // console.log(res0, '789res0')
      let componentArr: any = [];
      let formItemArr: any = [];
      let bbtnArr: any = [];
      let editTableColArr: any = [];
      let fillterDefault: any = {};
      let bottomBtnArrs: any = []
      let selectTables: any = ''//下拉表格
      let performances: any = ''//编辑表格

      // 页面元素属性遍历
      // console.log(res0.data,'123res0.data');

      res0.data.intfIttrDescList1.map((item: any, index: any) => {
        const condition = ['FormItem', 'SelectTable', 'TextArea', 'normalTable', 'Performance', 'workerShow'];

        if (condition.includes(item.filterType) && item.isDisabled != 1) {
          // console.log(item.filterType, '===================');

          let obj = {
            key: index,
            sortKey: item.sortNumber ? Number(item.sortNumber) : index,
            ...item
          }
          // console.log(obj)
          componentArr.push(obj);
          // console.log(componentArr, '123componentArr');

          if (item.filterType == 'FormItem' && item.componentCode && !JSON.parse(item.componentCode).isDisabled) {
            item?.intfManDesc?.intfIttrDescList1.map((ite: any) => {
              let o = {
                key: ite.tableColum,
                tableColum: ite.tableColum,
                filterType: ite.filterType,
                defaultValue: item.defaultValue
              }
              editTableColArr.push(ite.tableColum)
              formItemArr.push(o);
            });
            if (item.defaultValue) {
              fillterDefault[item.tableColum] = item.defaultValue;
            }
          }
          if (item.filterType == 'SelectTable') {
            selectTables = item.filterType
          }
          if (item.filterType == 'Performance') {
            performances = item.filterType
          }
          if (item.filterType == 'workerShow') {
            // console.log(item, '123workerShow');
          }
        }
      });

      //按钮属性解析
      res0.data.topBut.map((it: any) => {
        // console.log(it, '123item');
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
          // console.log(it, '123456789');
        } else {
          return;
        }
      })

      setFormItemGroup(formItemArr);
      setComponentList(componentArr);
      setBottomBtnArr(bottomBtnArrs)//底部按钮
      // console.log(bottomBtnArr, '123bottomBtnArrs');
      setSelectTable(selectTables)
      setPerformance(performances)


      return true;
    } else {
      res0.code !== 0 && message.error(res0.message || '操作失败')
      return false;
    }
  };

  /**获取当前用户信息*/
  const getLoginUserInfo = async () => {
    let res: any = await getLoginUser();
    // console.log(res.data)
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

  /**获取审批按钮*/
  const fetchGetButtonList = async () => {
    const response = await getButtonList();
    if (response.code == 0) {
      let arrBtn: any = [];
      if (buttons) {
        buttons?.split(",").map((it: any) => {
          let filterArr = response.data.filter((item: any) => item.num == it);
          let strIndex = filterArr[0]?.name.indexOf('|');
          let o = {
            name: filterArr[0]?.name.slice(0, strIndex),
            param: filterArr[0]?.name.slice(strIndex + 1)
          }
          arrBtn.push(o)
        });
        console.log(arrBtn)
        setButtonlist(arrBtn)
      }
    }
  }

  //region
  // /**获取流程日志*/
  // const fetchTaskLogList = async () => {
  //   const response = await selectTaskLogByTaskId({ taskId });
  //   // console.log(response.code == 0 && JSON.stringify(response.data) == "{}")
  //   if (response.code == 0 && JSON.stringify(response.data) == "{}") {
  //     console.log(response)
  //     setTaskLogList([])
  //     //
  //   } else if (response.code == 0) {

  //     setTaskLogList(response.data)
  //   }
  // }
  //regionEnd


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
      console.log(response.response.data.records, '--------------');
    } else {
      message.error(response.message)
    }
  }

  /**获取审核结果*/
  const fetchTaskCheckResultList = async () => {
    const response: any = await selectTaskLogByTaskId({ taskId });
    // console.log(response.code == 0 && JSON.stringify(response.data) == "{}")
    if (response.code == 0 && JSON.stringify(response.data) == "{}") {
      // console.log(response, '456response')
      setTaskCheckResultList([])
      //
    } else if (response.code == 0) {

      setTaskCheckResultList(response.data)
    }
  }

  // 流程审批提交
  const submit = async (param: any, taskId: any, btnName: any) => {
    let flag: any = true;
    let value = form?.current.getFieldsValue();
    // console.log(value, '123value');

    const { remark, ...bizMap } = value;
    // console.log(taskContentField)
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
      pass: param,
      remark: remark ? remark : '',
    };
    if (tableRef) {
      let dataSource = tableRef.current.returnList();
      params.bizMaps = dataSource;
      // console.log(params.bizMaps, 'params.bizMaps');
      if (dataSource.length > 0) {
        params.bizMaps = dataSource;
        // params.bizMaps = bizMapsDataSource;
      }
      // console.log(dataSource, "-----------执行了")
    }
    if (listRef) {
      let data = listRef.current.onSave();
      if (data.length > 0) {
        params.bizMaps = data;
        // params.bizMaps = bizMapsDataSource;

      } else {
        flag = false;
      }
      // console.log(data, "-----------执行")
    }
    // console.log(params, '123params');
    let res: any = await completeTask(Object.assign(params))
    // if (res.response.code === 0 && !!btnName) {
    //   message.success(`操作成功,${btnName}流程`)
    //   //   props.history.push({
    //   //     pathname: '/reportform/temp/todo-list',
    //   //   })
    //   if (authUrl) {
    //     window.location = authUrl;
    //   } else {
    //     props.history.push({
    //       pathname: '/reportform/temp/todo-list',
    //     })
    //   }
    // } else {
    //   message.error(res.response.message)
    // }
  };
  //提交、不通过、通过、按钮
  const submit2 = async (pass: any, code: any) => {
    // console.log(pass,'123pass');
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

    if (tableRef && selectTable && selectTable !== '') {
      let dataSource = tableRef.current.returnList();
      params.bizMaps = dataSource;
      // console.log(params.bizMaps, 'params.bizMaps2');
    }
    if (listRef && performance && performance !== '') {
      let data = listRef.current.onSave();
      if (data.length > 0) {
        params.bizMaps = data;
        // params.bizMaps = bizMapsDataSource;

      } else {
        flag = false;
      }
      // console.log(data, "-----------执行")
    }
    // console.log(params, '123456');

    if (code != '' && code != undefined) {
      let res0: any = await execByCode(params, code)
    }
    let res: any = await completeTask(Object.assign(params))

    if (res.response.code == 0) {
      message.success(`success`)
      history.goBack()
    } else {
      message.error(res.response.message)
      history.goBack()
    }
  }


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
        pathname: '/reportform/temp/todo-list',
      })
    }
  };

  // 关闭弹窗
  const handleCancel = () => {
    setIsModalVisible(false);
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

  //单独的全占满布局，如主题部分
  const colLayout2 = {
    xl: 24,
    md: 24,
  };
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

  // 获取页面下拉框子项数据
  const getInitData = async (code: any) => {
    let res: any = await execByCode(JSON.stringify({}), code);
    if (res.response.code === 0) {
      setInitData(res.response.data);
    } else {
      message.error(res.response.message || '操作失败')
    }
  }
  // 获取代办审核内容的控件类型,用于提交日期格式转化
  const getFormFieldsProp = (arr: any) => {
    setTaskContentField(arr)
  }
  //下拉框值改变
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  //SelectTable
  const columns1: any = [
    {
      title: 'examName',
      dataIndex: 'name',
      key: 'name',
      render: () =>
        <div>
          <span>考核人员：</span>
          <Select
            style={{ width: '150px' }}
            onChange={handleChange}
            options={[
              {
                value: 'jack',
                label: 'Jack',
              },
              {
                value: 'lucy',
                label: 'Lucy',
              }]}
          >
          </Select>
        </div>
    },
    {
      title: 'PerformanceTemplate',
      dataIndex: 'template',
      key: 'template',
      render: () =>
        <div>
          <span>绩效模板：</span>
          <Select style={{ width: '150px' }}>
          </Select>
        </div>
    },
    {
      title: 'Button',
      dataIndex: 'button',
      key: 'button',
      render: () =>
        <div>
          <Button style={{ marginRight: '20px' }} onClick={(e) => {
            console.log(e);
          }}>编辑</Button>
          <Button style={{ marginRight: '20px' }}>删除</Button>
          <Button>导入上月</Button>
        </div>
    },
  ];

  const data1: DataType[] = [
    {
      key: '1',
      examName: ['1', '2', '3'],
      performanceTemplate: ['4', '5', '6'],
    },
    {
      key: '2',
      examName: ['1', '2', '3'],
      performanceTemplate: ['4', '5', '6'],
    },
  ];

  return (
    <>
      {
        loginUserInfo != undefined && userListData != undefined && taskLogList != undefined &&
        <div>
          <Card>
            <Form
              ref={form}
              className="wb-page-form"
              name="form"
            >
              {/* 审核内容 */}
              {componentList.map((item: any, i: any) => (
                item.filterType === 'FormItem' ?
                  (
                    loginUserInfo != undefined && userListData != undefined && taskLogList != undefined &&
                    <TaskViewForm
                      formItemTitle={item.displayName}
                      form={form}
                      bizId={bizId}
                      getFormFieldsProp={getFormFieldsProp}
                      sqlData={item?.intfManDesc}//editTable表头数据
                    // pageLink={'768880110414132'}
                    // bizId={'admin'}
                    />
                  )
                  :
                  // 绩效模块
                  item.filterType === 'Performance' ?
                    // 编辑数据模块
                    (
                      <Col key={i} span={24}>
                        {/* {console.log(item?.intfManDesc)} */}
                        <fieldset className="wb-fieldset wb-standard-margin" style={{ width: '90%' }}>
                          <legend className="wb-fieldset-legend">
                            <h3 className="wb-fieldset-title">{item.displayName}</h3>
                          </legend>
                          <PreTable
                            ref={listRef}
                            id={bizId}
                            form={form}
                            sqlData={item?.intfManDesc}
                          ></PreTable>
                        </fieldset>
                      </Col>
                    )
                    :
                    item.filterType === 'TextArea' ?
                      (<fieldset className="wb-fieldset wb-standard-margin" style={{ width: '90%' }}>
                        <legend className="wb-fieldset-legend">
                          <h3 className="wb-fieldset-title">{item.displayName}</h3>
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
                      </fieldset>)
                      // 绩效模块end
                      // 绩效模板 工作表
                      :
                      // item.filterType === ' workerShow  ' ?
                      item.filterType.trim() === 'workerShow' ?
                        // 编辑数据模块
                        (
                          <fieldset className="wb-fieldset wb-standard-margin" style={{ width: '90%' }}>
                            <legend className="wb-fieldset-legend">
                              <h3 className="wb-fieldset-title">{item.displayName}</h3>
                            </legend>
                            <PreWorkerTable
                              id={bizId}
                              sqlData={item?.intfManDesc}
                            ></PreWorkerTable>
                          </fieldset>

                        )
                        // 绩效模板 工作表---end
                        :
                        (
                          item.filterType.trim() === 'SelectTable' ?
                            (
                              <fieldset className="wb-fieldset wb-standard-margin" style={{ width: '90%' }}>
                                <legend className="wb-fieldset-legend">
                                  <h3 className="wb-fieldset-title">{item.displayName}</h3>
                                </legend>
                                <div className="wb-fieldset-content">
                                  {/* {console.log(initData, '22data')} */}
                                  {taskContentField && taskContentField.length > 0 &&
                                    <EditTable
                                      ref={tableRef}
                                      id={bizId}
                                      sqlData={item?.intfManDesc}//editTable表头数据
                                      initData={initData}//下拉框数据
                                      form={form}
                                      taskContentField={taskContentField}

                                    // initData={item.intfManDesc.initDataApi}//editTable下拉框数据
                                    />
                                  }
                                </div>
                              </fieldset>
                            )

                            : (item.filterType === 'normalTable' ?
                              (<fieldset className="wb-fieldset wb-standard-margin" style={{ width: '90%' }}>
                                <legend className="wb-fieldset-legend">
                                  <h3 className="wb-fieldset-title">{item.displayName}</h3>
                                </legend>
                                <div style={{ paddingBottom: 10 }}>
                                  {loginUserInfo != undefined && userListData != undefined && taskLogList != undefined && <Table
                                    columns={columns}
                                    rowKey="id"
                                    dataSource={taskLogList}
                                  // defaultExpandedRowKeys={data.map(val=>val.id).id}
                                  />}
                                </div>
                              </fieldset>)
                              : (null)
                            )
                          // )
                        )

              ))}
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
        </div>
      }
    </>
  );
};
export default connect(
)(Step2);
