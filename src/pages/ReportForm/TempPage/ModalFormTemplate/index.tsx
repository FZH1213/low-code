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
  Space,
  Spin,
  Upload,
  InputNumber,
  Checkbox
  // Upload,
} from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
// import '@/theme/default/common.less';
import { SubmitButton } from '@/pages/ReportForm/TempPage/components/Button';
// import { getTreeDetailById } from '@/services/api';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE, FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import moment from 'moment';
import api from './service';
import styles from './styles.less';
import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { rearg } from 'lodash';
// import RichText from '../components/richText/index';

const { RangePicker } = DatePicker;
// const { Option } = Select;
const { TextArea } = Input;

// 新增/编辑模板
const ModalFormTemplate: React.FC<{}> = (props: any) => {
  const pageLink = props.modalPageLink && props.modalPageLink.split("page&id=")[1];
  const isDisabled = props.isDisabled ? props.isDisabled : false;
  //下拉框子数据集
  const [initDataApi, setInitDataAPi] = useState<any>(undefined);
  const [initData, setInitData] = useState<any>(undefined);
  // 底部提交按钮
  const [botbtnArr, setBotbtnArr] = useState<any>([]);
  const [subMitCode, setSubmitCode] = useState<any>('');
  // 表单属性解析
  const [formFieldsProp, setFormFieldsProp] = useState([]);
  // 提交
  const btnSubmitRef = useRef<any>();
  const form = useRef<any>();
  // 文件上传
  const [fileList, setFileList] = useState<any>([]);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');

  //富文本RichText
  const [richTextCon, setrichTextCon] = useState<string>('');
  const [richTexthtml, setrichTexthtml] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);

  // 时间属性，添加下拉框
  const [isTimeList, setIsTimeList] = useState<any>({});
  const [isTimeOptionList, setIsTimeOptionList] = useState<any>({});

  // 加数据会显
  const [codeList, setCodeList] = useState<any>([]);
  const [TCName, setTCName] = useState<any>([]);
  const [timeReserveList, setTimeReserveList] = useState<any>([]);

  // 级联回显
  const [CascaderList, setCascaderList] = useState<any>(undefined);
  const [CascaderObject, setCascaderObject] = useState<any>(undefined);
  const [FieldNamesValueList, setFieldNamesValueList] = useState<any>(undefined);
  //级联默认值

  const [cascaderDefaultValue, setCascaderDefaultValue] = useState<any>([]);

  // 值改变时的数组
  const [changedField, setChangeField] = useState<any>({});

  useEffect(() => {
    setFormFieldsProp([]);
    pageLink && getViewData();
  }, [pageLink]);


  useEffect(() => {
    props.recordDetial === undefined && formFieldsProp.length && getUserInfo()
  }, [formFieldsProp])

  // 操作列调规则赋值
  useEffect(() => {
    getActionColumnRules()
  }, [])

  //回显接口赋值
  useEffect(() => {
  }, [TCName, codeList])

  useEffect(() => {
    // console.log(props.recordDetial, CascaderObject, CascaderList, "========")
    if (CascaderList && CascaderObject && FieldNamesValueList && props.recordDetial) {
      let object = { ...props.recordDetial }
      if (CascaderList.length > 0 && JSON.stringify(CascaderObject) != "{}" && props.recordDetial && FieldNamesValueList.length > 0) {
        CascaderList.map((item: any, index: any) => {
          if (props.recordDetial[item] != "" && props.recordDetial[item] != undefined && props.recordDetial[item] != null) {
            let array = arrayFilter(CascaderObject[item], props.recordDetial[item], FieldNamesValueList[index])
            // console.log(array, 2)
            let list = Returnarray(array, FieldNamesValueList[index]);
            // console.log(list, 1)
            setCascaderDefaultValue(list)
            object[item] = list
          }
        })
        // console.log(object, '000000000000');

        form?.current.setFieldsValue(object)
      } else {
        form?.current.setFieldsValue(object)

      }
    }
  }, [CascaderList, CascaderObject, FieldNamesValueList])

  // 首次props.recordDetial 赋值时，如果有改变的内容，就调接口
  useEffect(() => {
    console.log(TCName, codeList, props.recordDetial, '+++++');
    if (codeList && TCName && props.recordDetial) {
      if (TCName.length > 0 && codeList.length > 0) {
        for (let key in props.recordDetial) {
          if (codeList.indexOf(key) > -1) {
            let obj = {};
            let index = codeList.indexOf(key);
            let code = TCName[index];
            obj[key] = props.recordDetial[key];
            api.execByCode(obj, code).then((res: any) => {
              // console.log(res, 'data')
              // res.response.code === 0 ? obj[item.tableColum] = res.response.data : message.error(res.response.message || '操作失败')
              if (res.response.code === 0) {
                let data = { ...res.response.data[0] };
                timeReserveList.map((item: any) => {
                  if (data[item]) {
                    data[item] = moment(data[item]);
                  }
                })
                // console.log(data);
                form?.current.setFieldsValue({ ...data });
              }
              // 设置datepick的值
            })

          }
        }
      }
    }
  }, [TCName, codeList])

  //回显接口
  useEffect(() => {
    let flag = true;
    for (let key in changedField) {
      if (!changedField[key]) {
        flag = false
      }
    }
    // console.log(TCName, codeList, changedField, '============');
    if (TCName.length > 0 && codeList.length > 0 && changedField && JSON.stringify(changedField) != '{}' && flag) {
      let code = TCName[0]; //回显接口
      let data = { ...changedField }
      // console.log(data, '123data');//{id: '123'}
      api.execByCode(data, code).then((res: any) => {
        if (res.response.code === 0) {
          let data = { ...res.response.data[0] };
          timeReserveList.map((item: any) => {
            if (data[item]) {
              data[item] = moment(data[item]);
            }
          })
          form?.current.setFieldsValue({ ...data });
        }
      })
    }
  }, [changedField, TCName, codeList])

  const getViewData = async () => {
    const res1: any = await getViewProps();
    res1 && pharsePageProps(res1);
  }
  // 数组过滤 data 是那个数组， recordDetail=["136"],返回一个数组 ["124","64","136"]
  const arrayFilter = (data: any, recordDetial: any, value: any) => {
    let array: any = [];
    // console.log(data, recordDetial, value, '-----------');
    array = data.filter((item: any) => {
      if (item.children.length > 0) {
        item.children = arrayFilter(item.children, recordDetial, value);
        // return item[value] == recordDetial[0] || item.children.length > 0
        return item[value] == recordDetial || item.children.length > 0
      }
      if (item.children.length == 0) {
        // return item[value] == recordDetial[0]
        return item[value] == recordDetial
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
  //获取用户信息
  const getUserInfo = () => {
    setLoading(true)
    formFieldsProp.length && formFieldsProp.map((item: any, index: any) => {
      // console.log(item, '789item');
      //顶部按钮调取规则赋值
      if (!!item.code && item.code) {
        let obj: any = {}
        api.execByCode(JSON.stringify({}), item.code).then((res: any) => {
          if (res.response.code === 0) {
            if (item?.componentCode?.showTime) {
              obj[item.tableColum] = moment(res.response.data)
            } else {
              obj[item.tableColum] = res.response.data
            }
          } else {
            message.error(res.response.message || '操作失败')
          }
          form?.current.setFieldsValue({ ...obj });
          // console.log({ ...obj }, '123getUserInfo');
        })
      }
    })
    setLoading(false)
  }

  const getViewProps = () => {
    let pageProps: any = getSrvCode(pageLink)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(pageProps);
      }, 300);
    });
  }

  // 根据页面id获取页面配置属性
  const getSrvCode = async (id: any) => {
    const res0 = await api.getTreeDetailById({ id: id });
    if (res0.code === 0) {
      return res0.data;
    } else {
      message.error(res0.message || '操作失败')
      return undefined;
    }
  };
  let startTimeCol: any = undefined
  let showTime: any = undefined
  let endtimeArr: any = []
  // 属性解释
  const pharsePageProps = (data: any) => {
    let botbtnArr: any = [];
    let fieldsArr: any = [];
    // 级联回显 ---start
    let CascaderList: any = [];
    let FieldNamesValue: any = [];

    // 级联回显 ----end
    // 动态赋值
    let list: any = [];
    let obj: any = {}
    // 动态赋值 --- end
    //默认值
    let defaultValueObj: any = {};
    // data && data?.initDataApi && setInitDataAPi(data.initDataApi);
    data && data?.initDataApi && setInitDataAPi(data.initDataApi);
    // 按钮解析
    data && data?.topBut.map((item: any) => {
      //权限控制隐藏与显示
      if (item.permissionCode && item.isShow == 1 || !item.isShow) {
        if (item.position.includes('3')) {
          item.type == 8 && setSubmitCode(item.code);
          botbtnArr.push(item);
        }
      }
    });
    setBotbtnArr(botbtnArr);

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
        if (item.filterType == 'Cascader' && key == "fieldNames") {
          FieldNamesValue.push(componentCode[key].value);
        }
        //默认值
        if (key == 'defaultValue') {
          if (item.filterType == "datePicker") {
            defaultValueObj[item.tableColum] = moment(componentCode[key])
          } else {
            defaultValueObj[item.tableColum] = componentCode[key]
          }
          delete componentCode[key]

        }
      }
      // 动态赋值
      // if (item.code) {
      // }
      // 动态赋值 --- end

      // 添加codeList ，用于数据会显
      if (item.EchoCode) {
        let list = [...codeList];
        let tclist = [...TCName];
        list.push(item.tableColum);
        tclist.push(item.EchoCode);
        setCodeList(list);
        setTCName(tclist);
        // console.log(list)
      }
      // 添加codeList ，用于数据会显 -- end
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
        defaultValue: item.defaultValue,
        code: item.code
      }
      fieldsArr.push(f_obj);
    });
    // 数据回显数组
    let timeList: any = []
    fieldsArr.map((item: any) => {
      if (item.filterType == "datePicker") {
        let list = { ...isTimeOptionList }

        timeList.push(item.tableColum);
        // console.log(timeList)
        list[item.tableColum] = moment();
        setIsTimeOptionList(list)

      }
      if (item.filterType == "datePicker" && item.componentCode.IsOption) {
        item.isOption = item.componentCode.IsOption;
        let list = { ...isTimeList };
        list[item.tableColum] = false;
        // console.log(list)
        if (props.recordDetial && props.recordDetial[item.tableColum] == "永久") {
          list[item.tableColum] = true;
        }
        setIsTimeList(list)
      }
      // 判断  是不是那个 Cascader  usestate 去赋值
      if (item.filterType == 'Cascader') {
        CascaderList.push(item.tableColum);
        // console.log(CascaderList, '123CascaderList');//['businessSubjectId']

      }
      if (item.filterType == "datePicker" && item.componentCode.timeRange) {
        if (item.componentCode.timeRange == 'start') {
          showTime = item.componentCode.showTime
          startTimeCol = item.tableColum
        }
        else if (item.componentCode.timeRange.indexOf('end') > -1) {
          item.formItemProps.rules.push({ validator: compareEndTime })
          endtimeArr.push({ 'order': item.componentCode.timeRange.split('end')[1], 'tableCol': item.tableColum })
        }
      } else if (item.filterType == 'LimitInput') {
        item.formItemProps.rules.push({ validator: limitInputValue })
      }
    })
    setCascaderList(CascaderList);
    setFieldNamesValueList(FieldNamesValue)
    // console.log(FieldNamesValue, '123FieldNamesValue');//['key']
    form?.current.setFieldsValue(CascaderList)

    setTimeReserveList(timeList);
    setFormFieldsProp(fieldsArr);
    // 动态赋值
    // setDynamicList(list);  

    // 动态赋值 --- end
    // console.log(fieldsArr, '123fieldsArr');
    form?.current.setFieldsValue(defaultValueObj)

  }

  useEffect(() => {
    if (initDataApi && formFieldsProp.length) {
      getInitData(initDataApi)
    }
  }, [initDataApi, formFieldsProp])

  const limitInputValue = (rule: any, value: any) => {
    let rules = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5.]/g
    // value = value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5.]/g,'')
    let flag = rules.test(value)
    if (flag) {
      return Promise.reject('非法字符，请重新输入！')
    } else {
      return Promise.resolve()
    }
  }

  //操作列规则赋值
  const getActionColumnRules = async () => {
    const res1: any = await getViewProps();//获取页面数据
    res1 && res1?.intfIttrDescList1.map((item: any, index: any) => {
      //操作列调规则赋值
      if (item.code) {
        // console.log(item.code, '7777777777item.code');
        let obj: any = {}
        api.execByCode(JSON.stringify({}), item.code).then((res: any) => {
          if (res.response.code === 0) {
            if (JSON.parse(item?.componentCode).showTime) {
              obj[item.tableColum] = moment(res.response.data)
            } else {
              obj[item.tableColum] = res.response.data
            }
          } else {
            message.error(res.response.message || '操作失败')
          }
          form?.current.setFieldsValue({ ...obj });
        })
      }
    })
  }

  // 获取页面下拉框子项数据
  const getInitData = async (code: any) => {
    let res: any = await api.execByCode(JSON.stringify({}), code);
    if (res.response.code === 0) {
      let arrList: any = {};
      // 级联回显 ---start
      CascaderList.map((item: any, index: any) => {
        if (res.response.data[item]) {
          arrList[item] = JSON.parse(JSON.stringify(res.response.data[item]))
        }
      })
      setCascaderObject(arrList);
      // 级联回显 ---END

      setInitData(res.response.data)

      // 下拉框默认第一个值
      // !props.recordDetial && formFieldsProp.map((item: any) => {
      //   // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      //   if (item.filterType === 'select' && !item?.code && res.response.data[item.tableColum].length) {
      //     let valField = item.componentCode.fieldNames.value;
      //     let obj: any = {}
      //     !!props.treeObj && props.treeObj[item.tableColum] ? obj[item.tableColum] = props.treeObj[item.tableColum] : obj[item.tableColum] = res.response.data[item.tableColum][0][valField]
      //     form?.current.setFieldsValue({ ...obj });
      //   }
      // })
    }
  }
  // 开始时间可选范围
  // const handleStartDisabledDate = (current: any) => {
  //   if (current !== '') {
  //     return current < moment().startOf('days')
  //   } else {
  //     return null;
  //   }
  // }
  // const range = (start: any, end: any) => {
  //   const result = [];
  //   for (let i = start; i <= end; i++) {
  //     result.push(i);
  //   }
  //   return result;
  // }
  // //当日只能选择当前时间之后的时间点
  // const disabledStartTime = (date: any) => {
  //   let currentDay = moment().date();    //当下的时间
  //   let currentHours = moment().hours();
  //   let currentMinutes = moment().minutes();  //设置的时间
  //   let currentSeconds = moment().seconds()
  //   let settingHours = moment(date).hours();
  //   let settingDay = moment(date).date();
  //   let settingMinutes = moment(date).minutes()
  //   if (date && settingDay === currentDay && settingHours === currentHours && settingMinutes === currentMinutes) {
  //     return {
  //       disabledHours: () => range(0, currentHours - 1),         //设置为当天现在这小时，禁用该小时，该分钟之前的时间
  //       disabledMinutes: () => range(0, currentMinutes - 1),
  //       disabledSeconds: () => range(0, currentSeconds - 1)
  //     };
  //   } else if (date && settingDay === currentDay && settingHours === currentHours && settingMinutes > currentMinutes) {
  //     return {
  //       disabledHours: () => range(0, currentHours - 1),
  //       disabledMinutes: () => range(0, currentMinutes - 1),
  //     };
  //   } else if (date && settingDay === currentDay && settingHours > currentHours) {
  //     return {
  //       disabledHours: () => range(0, currentHours - 1),      //设置为当天现在这小时之后，只禁用当天该小时之前的时间 
  //     };
  //   } else if (date && settingDay === currentDay && settingHours < currentHours) {
  //     return {
  //       disabledHours: () => range(0, currentHours - 1),      //若先设置了的小时小于当前的，再设置日期为当天，需要禁用当天现在这小时之前的时间和所有的分
  //       disabledMinutes: () => range(0, 59),
  //       disabledSeconds: () => range(0, 59)
  //     }
  //   } else if (date && settingDay > currentDay) {
  //     return {
  //       disabledHours: () => [],                     //设置为当天之后的日期，则不应有任何时间分钟的限制
  //       disabledMinutes: () => [],
  //       disabledSeconds: () => []
  //     }
  //   }
  // }

  const compareEndTime = (rule: any, value: any) => {
    let startTime = undefined
    endtimeArr.map((item: any) => {
      if (rule.field === item.tableCol) {
        if (item.order == 1) {
          startTime = form?.current.getFieldValue(startTimeCol)
        } else if (item.order > 1) {
          let index = endtimeArr.findIndex((ite: any) => ite.order == item.order - 1)
          startTime = form?.current.getFieldValue(endtimeArr[index].tableCol)
        }
      }
    })
    let startYear = moment(startTime).year()
    let startMonth = moment(startTime).month()
    let startDay = moment(startTime).date()
    let startHours = moment(startTime).hours();
    let startMinutes = moment(startTime).minutes();
    let startSeconds = moment(startTime).seconds()

    let endYear = value.year()
    let endMonth = value.month()
    let endDay = value.date()
    let endHours = value.hours()
    let endMinutes = value.minutes()
    let endSeconds = value.seconds()
    if (startTime) {
      if (showTime) {
        if (endYear > startYear) {
          // 通过验证
          return Promise.resolve()
        } else if (endYear === startYear && endMonth > startMonth) {
          return Promise.resolve()
        } else if (endYear === startYear && endMonth === startMonth && endDay > startDay) {
          return Promise.resolve()
        } else if (endYear === startYear && endMonth === startMonth && endDay === startDay && endHours > startHours) {
          return Promise.resolve()
        } else if (endYear === startYear && endMonth === startMonth && endDay === startDay && endHours === startHours && endMinutes > startMinutes) {
          return Promise.resolve()
        } else if (endYear === startYear && endMonth === startMonth && endDay === startDay && endHours === startHours && endMinutes === startMinutes && endSeconds > startSeconds) {
          return Promise.resolve()
        } else {
          return Promise.reject('结束日期不能先于开始日期！')
        }
      } else {
        if (endYear > startYear) {
          // 通过验证
          return Promise.resolve()
        } else if (endYear === startYear && endMonth > startMonth) {
          return Promise.resolve()
        } else if (endYear === startYear && endMonth === startMonth && endDay >= startDay) {
          return Promise.resolve()
        } else {
          return Promise.reject('结束日期不能先于开始日期！')
        }
      }
    } else {
      return Promise.reject('未配置日期标识！')
    }
  }

  // 提交验证
  const onFieldFinish = async (params: any) => {
    let editData = { ...params };
    formFieldsProp.map((item: any) => {
      // 日期框值格式化
      if (item.filterType == "datePicker") {
        for (let key in editData) {
          if (key == item.tableColum && editData[key] !== undefined && editData[key] !== '' && editData[key] !== null && !isTimeList[item.tableColum]) {
            let dp: any = undefined;
            item?.componentCode?.showTime ? dp = moment(editData[key]._d).format("YYYY-MM-DD HH:mm:ss") : dp = moment(editData[key]._d).format("YYYY-MM-DD")
            if (item?.componentCode?.picker) {
              if (item?.componentCode?.picker == 'month') {
                dp = moment(editData[key]._d).format("YYYYMM")
              }
            }
            editData[key] = dp
          }
        }
        // console.log(editData[item.tableColum]);
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
            let arr = editData[key];

            editData[key] = arr[arr.length - 1];
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
      // 下拉框edittable【value】 == label 修改时间 ：2022-10-18
      if (item.filterType === 'select' && item.componentCode?.fieldNames) {
        const { label, value } = item.componentCode?.fieldNames;
        let datas = initData[item.tableColum];
        let attritube = item.tableColum;
        datas.map((item: any) => {
          if (editData[attritube] == item[label]) {
            editData[attritube] = item[value];
          }
        })
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
    let obj = { ...props.treeObj }
    let arr = []
    if (!!props.treeObj) {
      for (let i in editData) {
        for (let j in props.treeObj) {
          if (i === j && editData[i] == undefined || (editData[i] && editData[i].length == 0)) {
            editData = {
              ...editData,
              ...obj,
            }
          }
          if (i === j && editData[i] !== undefined && editData[i].length) {
            delete obj[j]
            editData[i] = editData[i].split(',')
            for (let index in editData[i]) {
              let editObj = { ...editData, ...obj }
              editObj[i] = editData[i][index]
              arr.push(editObj)
            }
            editData = arr
          }
        }
      }
    } else {
      editData = {
        ...editData,
      }
    }
    let submitData: any = {
      bizMap: editData
    };
    // console.log(submitData, 123456);
    // 网路请求暂时取消
    const res: any = await api.execByCode(JSON.stringify(submitData), subMitCode)
    if (res.response.code === 0) {
      message.success(res.response.message);
      props.handleCancel(1);
    } else {
      message.error(res.response.message || '操作失败');
      btnSubmitRef.current.reset();
    }
  }

  // 提交失败，取消保存按钮 loading
  const onFieldFail = () => {
    btnSubmitRef.current.reset();
  }
  // 提交回显内容：
  // 防抖
  const debounce = (fn: any, wait: any) => {
    var timer: any = null;
    return function () {
      if (timer !== null) {
        clearTimeout(timer);
      }
      timer = setTimeout(fn, wait);
    }
  }
  //下拉回显
  const getFormInfo = (changedFields: any) => {//多选回显
    // console.log(changedFields, codeList, '123changedFields');
    if (codeList.indexOf(Object.getOwnPropertyNames(changedFields)[0]) > -1) {
      let index = codeList.indexOf(Object.getOwnPropertyNames(changedFields)[0]);
      let code = TCName[index];
      let data = { ...changedFields }
      // console.log(data, TCName, '123datacode');
      api.execByCode(data, code).then((res: any) => {
        if (res.response.code === 0) {
          // console.log(res.data, '123res');
          let data = { ...res.response.data };
          // let data = { ...res.response.data[0] };
          timeReserveList.map((item: any) => {
            if (data[item]) {
              data[item] = moment(data[item]);
            }
          })
          // console.log(data, '789data');
          // form?.current.setFieldsValue({ ...data });//
          form?.current.setFieldsValue(data);//
        }
      })
    }
  }
  // 值改变时
  const onFieldsChange = (changedFields: any) => {
    debounce(getFormInfo(changedFields), 300)//下拉/input回显
    setChangeField(changedFields)
    console.log(changedFields, '456changedFields');//值改变时对象

  }
  // 提交回显内容end

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
            ref={form}
            className="wb-page-form"
            name="form"
            preserve={false}
            onFinish={onFieldFinish}
            onFinishFailed={onFieldFail}
            onValuesChange={onFieldsChange}//值改变时
          >
            <fieldset className="wb-fieldset wb-standard-margin">
              <div className="wb-fieldset-content">
                <Row className="area-mb-large" style={{ marginBottom: 50, width: "100%" }} >
                  {
                    formFieldsProp.length > 0 ? formFieldsProp.filter((it: any) => it.isDisabled != 1).map((item: any, i: any) => (

                      <Col
                        md={item.componentCode.colspan ? item.componentCode.colspan : 24}
                        xs={24}
                        sm={24}
                        key={i} className={styles.row_label}>
                        {/* 首先先判断是否不是 datePicker 且包含值就这个*/}
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
                                    {...item.componentCode}
                                    getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                    onChange={(e) => console.log(e)
                                    }
                                    filterOption={(input: any, option: any) =>
                                      (item.componentCode.fieldNames.label && option[item.componentCode.fieldNames.label] && option[item.componentCode.fieldNames.label].toLowerCase().includes(input.toLowerCase()))
                                    }
                                    showSearch={true}
                                    disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                    options={initData && !!initData[item.tableColum] && initData[item.tableColum] && initData[item.tableColum].length > 0 ? initData[item.tableColum] : []}
                                  >
                                  </Select>
                                ) : (
                                  item.filterType == "datePicker" && item.isOption ?
                                    (
                                      <>
                                        <Row>
                                          {
                                            item.isOption &&
                                            <Col span={3}>
                                              <Checkbox defaultChecked={props.recordDetial && props.recordDetial[item.tableColum] == "永久" && true} onChange={(e: CheckboxChangeEvent) => {
                                                let value = e.target.checked ? "永久" : isTimeOptionList[item.tableColum];
                                                item.isTimeDisabled = e.target.checked;
                                                let list = { ...isTimeList };
                                                list[item.tableColum] = e.target.checked;
                                                setIsTimeList(list)
                                                form.current.setFieldsValue({ [item.tableColum]: value });
                                              }}>永久</Checkbox>
                                            </Col>
                                          }
                                          <Col span={item.isOption ? 21 : 24}>
                                            <DatePicker
                                              {...item.componentCode}
                                              getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                              style={{ width: '100%' }}
                                              onChange={(date: any) => {
                                                let time = { ...isTimeOptionList };
                                                time[item.tableColum] = date;
                                                setIsTimeOptionList(time);
                                                form.current.setFieldsValue({ [item.tableColum]: date });
                                              }}
                                              defaultValue={(props.recordDetial && props.recordDetial[item.tableColum] && props.recordDetial[item.tableColum] != "永久") ? moment(props.recordDetial[item.tableColum], "YYYY-MM-DD HH:MM:SS") : null}
                                              disabled={isTimeList[item.tableColum] ? isTimeList[item.tableColum] : isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                            ></DatePicker>
                                          </Col>
                                        </Row>

                                      </>
                                    ) :
                                    item.filterType == "datePicker" ?
                                      (
                                        <DatePicker
                                          style={{ width: '100%' }}
                                          {...item.componentCode}
                                          getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                          disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
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
                                                    <div>
                                                      <Cascader
                                                        {...item.componentCode}
                                                        key={cascaderDefaultValue}
                                                        getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                                        options={initData && !!initData[item.tableColum] && initData[item.tableColum] && initData[item.tableColum].length > 0 ? initData[item.tableColum] : []}
                                                        onChange={(value) => { console.log(value) }}
                                                        defaultValue={cascaderDefaultValue && cascaderDefaultValue.length > 0 ? cascaderDefaultValue : []}//默认值
                                                        disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                      />
                                                    </div>
                                                  ) :
                                                  (
                                                    item.filterType == 'TextArea' ?
                                                      <TextArea
                                                        {...item.componentCode}
                                                        style={{ height: 120 }}
                                                        disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                      />
                                                      : (
                                                        item.filterType == 'RichText' ?
                                                          // <RichText
                                                          //   getEditorValue={getEditorValue}
                                                          //   values={!!props.recordDetial[item.tableColum] ? props.recordDetial[item.tableColum] : null}
                                                          //   isreadOnly={isDisabled}
                                                          // />
                                                          <Input />
                                                          : (
                                                            item.filterType == 'ISelect' ?
                                                              <AutoComplete
                                                                {...item.componentCode}
                                                                getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                                                filterOption={(input: any, option: any) =>
                                                                  (item.componentCode.fieldNames.label && option[item.componentCode.fieldNames.label] && option[item.componentCode.fieldNames.label].toLowerCase().includes(input.toLowerCase()))
                                                                }
                                                                disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                                options={initData && !!initData[item.tableColum] && initData[item.tableColum] && initData[item.tableColum].length > 0 ? initData[item.tableColum] : []}
                                                              >
                                                              </AutoComplete>
                                                              :
                                                              (
                                                                item.filterType == 'LimitInput' ?
                                                                  <Input  {...item.componentCode}
                                                                    disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                                    allowClear />
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
                {
                  botbtnArr.length > 0 && botbtnArr.map((ite: any, i: any) => (
                    ite.type == 8 ? (
                      <SubmitButton key={i} ref={btnSubmitRef}>{ite.name}</SubmitButton>
                    ) :
                      null
                  ))
                }
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

export default ModalFormTemplate;