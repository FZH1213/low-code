import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  AutoComplete,
  Button,
  Card,
  Cascader,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tooltip,
  Upload,
  UploadProps,
  InputNumber
} from 'antd';
// import '@/theme/default/common.less';
import { SubmitButton } from '@/pages/ReportForm/TempPage/components/Button';
import { FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import moment from 'moment';
import api from './service';
import styles from './styles.less';
import { InboxOutlined, QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid'
// import RichText from '../components/richText';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Dragger } = Upload;
// 新增/编辑模板
const ModalFormProTemplate: React.FC<{}> = (props: any) => {
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
  const [imageView, setImageView] = useState<string>('')

  const [isShow, setIsShow] = useState(false)
  const [contentValue, setContentValue] = useState(null)
  const [dataSource, setDataSource] = useState<any>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [pasteFile, setPasteFile] = useState<any>([])
  //富文本RichText
  const [richTextCon, setrichTextCon] = useState<string>('');
  const [richTexthtml, setrichTexthtml] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);
  const [msg, setMsg] = useState<any>("");
  const [accept, setAccept] = useState<any>("");
  //2022-11-17 号新增内容 （通过 查找 “计算” 可寻找相应内容）
  //  新增计算属性功能:  connectList存储的是用于计算的变量，computedObject 存储的是 计算公式，
  // 计算公式转为可识别的数组 arr ,然后 通过eva() 公式 运行计算公式     
  const [connectList, setConnectList] = useState<any>([]);
  const [connectObject, setConnectObject] = useState<any>({});
  const [computedObject, setComputedObject] = useState<any>({});
  // 新增计算属性功能 -- end



  useEffect(() => {
    setFormFieldsProp([]);
    pageLink && getViewData();
  }, [pageLink]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste)
      setPasteFile([])
      setFileList([])
      setDataSource([])
    }
  }, [])
  useEffect(() => {
    if (pasteFile.length > 0) {
      if (fileList.length > 0) {
        setFileList(() => {
          return [...fileList, ...pasteFile]
        })
      } else {
        setFileList(pasteFile)
      }
    }
  }, [pasteFile])
  useEffect(() => {
    if (fileList.length > 0) {
      if (!isShow) {
        setDataSource(fileList)
      }
    }

  }, [fileList])
  useEffect(() => {
    props.recordDetial === undefined && formFieldsProp.length && getUserInfo()
  }, [formFieldsProp])
  const handleOk = () => {
    setIsShow(false)
    fileList.map((item: any) => {
      if (!item['commentInfo']) {
        item['commentInfo'] = contentValue
      }
    })
    setDataSource(fileList)
    setContentValue(null)
  }
  //获取用户信息
  const getUserInfo = () => {
    setLoading(true)
    formFieldsProp.length && formFieldsProp.map((item: any, index: any) => {
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
  const handlePaste = (e: any) => {
    var items;
    if (e.clipboardData && e.clipboardData.items) {
      items = e.clipboardData.items;
      if (items) {
        items = Array.prototype.filter.call(items, function (element) {
          return element.type.indexOf("image") >= 0;
        });
        Array.prototype.forEach.call(items, function (item) {
          var blob = item.getAsFile();
          var reader = new FileReader();
          reader.onloadend = function (event: any) {
            var imgBase64 = event.target.result;
            var dataURI = imgBase64;
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
            var byteString = atob(dataURI.split(',')[1]); //base64 解码
            var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
            var intArray = new Uint8Array(arrayBuffer); //创建视图

            for (var i = 0; i < byteString.length; i++) {
              intArray[i] = byteString.charCodeAt(i);
            }
            var blob = new Blob([intArray], { type: mimeString });
          };
          reader.readAsDataURL(blob);
          //上传文件
          var formData = new FormData();
          let btype = 'LIST_OF_COMPLIANCE'
          let fileSize = blob.size
          let name = nanoid().slice(0, 4) + '.' + blob.name.split('.')[1]
          formData.append('file', blob);
          formData.append('btype', btype)
          // 添加自定义数据
          fetch('/api/file/fileInfo/upload', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: formData,
            method: 'POST',
          }).then(res => {
            return res.json();
          }).then(data => {
            if (data.message == 'success') {
              let response: any = { ...data.data, 'size': fileSize, 'fileName': name }
              setPasteFile(() => {
                return [...pasteFile, response]
              })
              message.success('文件提交成功');
            }

          })
        });
      }
    };
  }
  const imageModal = (record: any) => {
    setModalVisible(true)
    const imgUrl: any = fileList.find((item: any) => item.uid === record.uid)
    // console.log(fileList, '123fileList');
    // console.log(imgUrl, imgUrl.fileUrlView, '123imgUrl.fileUrlView');
    // setImageView(imgUrl.fileUrlView)
    setImageView(`/api/file/fileDown/downloadFileById?fileId=${imgUrl.fileId}`)
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
        console.log(info.file, info.fileList);
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
  const dateFormatYMDHMS = 'YYYY-MM-DD HH:mm:ss';
  const columns = [
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
              record.fileName?.split(".").pop() == "jpeg" || record.fileName?.split(".").pop() == "JPEG" ||
                record.fileName?.split(".").pop() == "png" || record.fileName?.split(".").pop() == "PNG" ||
                record.fileName?.split(".").pop() == "image" || record.fileName?.split(".").pop() == "IMAGE" ||
                record.fileName?.split(".").pop() == "jpg" || record.fileName?.split(".").pop() == "JPG" ?
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
      dataIndex: 'gmtCreate',
      defaultSortOrder: 'descend',
      sorter: (a, b) => { return a.gmtCreate > b.gmtCreate ? 1 : -1 },
      render: (val: any) => <span>{moment(val).format(dateFormatYMDHMS)}</span>
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
            setDataSource(dataSource.filter((item: any) => item.fileId !== record.fileId))
          }}
            // disabled={isDisabled ? isDisabled : (!!props.disabled && props.disabled ? props.disabled : false)}
            style={{ display: isDisabled ? 'none' : 'inline' }}
          >删除</a>
        </Fragment>
      )
    }
  ]

  // 提交验证
  const onFieldFinish = async (params: any) => {
    let editData = { ...params };
    formFieldsProp.map((item: any) => {
      // 日期框值格式化
      if (item.filterType == "datePicker") {
        for (let key in editData) {
          if (key === item.tableColum && editData[key] !== undefined) {
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
        const condition: any = ['commentInfo', 'entName', 'gmtCreate', 'fileId', 'fileName', 'size', 'fileUrlView']
        for (let key in editData) {
          if (key == item.tableColum) {
            dataSource.find((item: any) => {
              for (let val in item) {
                if (!condition.includes(val))
                  delete item[val]
              }
            })
            // if (dataSource.length > 0) {
            //   editData[key] = JSON.stringify(dataSource)
            // }
            editData[key] = JSON.stringify(dataSource)
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
        // console.log(datas, label, value, attritube);
        datas.map((item: any) => {
          // console.log(editData[attritube] == datas[label],editData[attritube],datas[label],datas[value])
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
    // 删除字段值为NULL、空字符串''
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
    const res: any = await api.execByCode(JSON.stringify(submitData), subMitCode)
    // console.log(submitData)
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
  //  值改变时触发计算属性 --- start
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
  // 计算属性赋值
  const getFormComputed = (changedFields: any) => {
    let tableColum = Object.getOwnPropertyNames(changedFields)[0]
    let index = connectList.indexOf(tableColum)
    if (index > -1) {
      // 这个key是拿到数组
      let keyList = connectObject[connectList[index]].split(',');
      // console.log(keyList, '123keyList');
      keyList.map((item: any) => {
        // keyList 做遍历,遍历完拿到各自的code，也就是计算公式
        let code = computedObject[item];
        //  计算公式去做正则替换x
        // console.log(code, '123code');
        let res = code.match(/\$\{(.+?)\}/g);
        let computed = code;
        let arr: any = [];
        let res1 = res.map((item: any, index: any) => {
          computed = computed.replace(item, `arr[${index}]`)
          return item.match(/\$\{(.+?)\}/)[1];
        })
        res1.map((item: any, index: any) => {
          arr[index] = form?.current.getFieldsValue()[item];
        })
        if (eval(computed)) {
          let obj = {};
          obj[item] = eval(computed).toFixed(2)
          form?.current.setFieldsValue(obj);
        }
      })

    }
  }
  // 值改变时
  const onFieldsChange = (changedFields: any) => {
    // console.log(changedFields)
    debounce(getFormComputed(changedFields), 300)
  }
  //防抖 --end
  //  值改变时触发计算属性 --- end
  const colseModal = () => props.handleCancel(0);

  const getViewData = async () => {
    const res1: any = await getViewProps();
    res1 && pharsePageProps(res1);
    props.recordDetial && form?.current.setFieldsValue(props.recordDetial);
    res1 && props.recordDetial && props.recordDetial.fileList && setFileList(JSON.parse(props.recordDetial.fileList))
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
    let listArr: any = [];
    let connectObjects = {}
    let computedObjects = {}

    // data && data?.initDataApi && getInitData(data?.initDataApi);
    data && data?.initDataApi && setInitDataAPi(data.initDataApi);

    // 按钮解析
    data && data?.topBut.map((item: any) => {
      if (item.position.includes('3')) {
        item.type == 8 && setSubmitCode(item.code);
        botbtnArr.push(item);
      }
    });
    setBotbtnArr(botbtnArr);

    data && data?.intfIttrDescList1.map((item: any, index: any) => {

      let componentCode = JSON.parse(item.componentCode);
      let formItemProps: any = {};
      let href = "";
      for (let key in componentCode) {
        if (key == "labelCol") {
          let s = { ...componentCode[key] }
          componentCode[key] = {
            sm: { span: 24 },
            xs: { span: 24 },
            md: s
          }
        }

        if (key == "href") {
          href = componentCode[key];
        }
        if (key == "msg") {
          setMsg(componentCode[key]);
        }
        if (key == "accept" && componentCode[key] != undefined) {
          setAccept(componentCode[key]);
        }
        if (FORM_ITEM_API.includes(key)) {
          formItemProps[key] = componentCode[key];
          delete componentCode[key];
        }
        if (TABLE_COLUMN_API.includes(key) || key === 'searchSpan' || key === 'isAdd' || key === 'isEdit' || key === 'isDetial' || key === 'name' || key === 'label' || key === 'rules') {
          delete componentCode[key];
        }
      }
      // 计算属性添加进列表 -- start
      if (item.connect) {
        listArr.push(item.tableColum)
        connectObjects[item.tableColum] = item.connect
      }
      if (item.computed) {
        computedObjects[item.tableColum] = item.computed
      }
      // 计算属性添加进列表 -- end

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
        code: item.code,
        href,
      }
      fieldsArr.push(f_obj);
      // console.log(fieldsArr, '123fieldaArr');

    });
    // 计算属性添加进列表 -- start
    setConnectList(listArr);
    setConnectObject(connectObjects)
    setComputedObject(computedObjects)
    // 计算属性添加进列表 -- end
    fieldsArr.map((item: any) => {
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
    setFormFieldsProp(fieldsArr);
  }

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
  //子传父 富文本框变化回调
  const getEditorValue = (str: any, htmlstr: any) => {
    setrichTextCon(str)
    setrichTexthtml(htmlstr);
  }
  // // 获取页面下拉框子项数据
  // const getInitData = async (code: any) => {
  //   let res: any = await api.execByCode(JSON.stringify({}), code);
  //   res.response.code === 0 && setInitData(res.response.data)
  // }
  useEffect(() => {
    if (initDataApi && formFieldsProp.length) {
      getInitData(initDataApi)
    }
  }, [initDataApi, formFieldsProp])

  // 获取页面下拉框子项数据
  const getInitData = async (code: any) => {
    let res: any = await api.execByCode(JSON.stringify({}), code);
    if (res.response.code === 0) {
      setInitData(res.response.data)
      // 下拉框默认第一个值
      // !props.recordDetial && formFieldsProp.map((item: any) => {
      //   // console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
      //   if (item.filterType === 'select' && !item?.code && res.response.data[item.tableColum].length) {
      //     let valField = item.componentCode.fieldNames.value;
      //     let obj: any = {}
      //     // obj[item.tableColum] = res.response.data[item.tableColum][0][valField]
      //     !!props.treeObj && props.treeObj[item.tableColum] ? obj[item.tableColum] = props.treeObj[item.tableColum] : obj[item.tableColum] = res.response.data[item.tableColum][0][valField]
      //     form?.current.setFieldsValue({ ...obj });
      //   }
      // })
    }
  }

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
            onValuesChange={onFieldsChange}
          >
            <fieldset className="wb-fieldset wb-standard-margin">
              <div className="wb-fieldset-content">
                <Row className="area-mb-large" style={{ marginBottom: 50 }}>
                  {
                    formFieldsProp.length > 0 ? formFieldsProp.filter((it: any) => it.isDisabled != 1).map((item: any, i: any) => (
                      // console.log(item, 222),

                      <Col
                        md={item.componentCode.colspan ? item.componentCode.colspan : 24}
                        xs={24}
                        sm={24}
                        key={i} className={styles.row_label}>
                        <Form.Item {...item.formItemProps} name={item.tableColum} label={item.displayName} help={item.formItemProps.help ? item.formItemProps.help : null}
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
                        // initialValue={(props.recordDetial && props.recordDetial[item.tableColum]) ? props.recordDetial[item.tableColum] : item.filterType == "datePicker" ? moment() : undefined}
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
                                    onChange={(e) => console.log('e', e)}
                                    filterOption={(input: any, option: any) =>
                                      (item.componentCode.fieldNames.label && option[item.componentCode.fieldNames.label].toLowerCase().includes(input.toLowerCase()))
                                    }
                                    showSearch={true}
                                    disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                    options={initData && !!initData[item.tableColum] && initData[item.tableColum] && initData[item.tableColum].length > 0 ? initData[item.tableColum] : []}
                                  >
                                  </Select>
                                ) : (
                                  item.filterType == "datePicker" ?
                                    (
                                      <DatePicker
                                        style={{ width: '100%' }}
                                        getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                        {...item.componentCode}
                                        disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                      // disabledDate={item.componentCode.timeRange && item.componentCode.timeRange == 'start' ? handleStartDisabledDate : undefined}
                                      // disabledTime={item.componentCode.timeRange && item.componentCode.timeRange == 'start' ? disabledStartTime : undefined}
                                      ></DatePicker>
                                    ) :
                                    (
                                      item.filterType == "rangerPicker" ?
                                        (
                                          <RangePicker
                                            getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                            {...item.componentCode}
                                            disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                          ></RangePicker>
                                        ) : (
                                          item.filterType == "Upload" ?
                                            (<>
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
                                                    getPopupContainer={(triggerNode: any) => triggerNode.parentNode}
                                                    {...item.componentCode}
                                                    // options={[]}
                                                    options={initData && !!initData[item.tableColum] && initData[item.tableColum] && initData[item.tableColum].length > 0 ? initData[item.tableColum] : []}
                                                    onChange={(value) => { console.log(value) }}
                                                    disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                  />
                                                ) :
                                                (
                                                  item.filterType == 'TextArea' ?
                                                    <TextArea
                                                      {...item.componentCode}

                                                      style={{ height: 120, resize: 'none' }}
                                                      disabled={isDisabled ? isDisabled : (!!item.componentCode.disabled && item.componentCode.disabled ? item.componentCode.disabled : false)}
                                                      placeholder={'请输入'}

                                                    />
                                                    :
                                                    (
                                                      item.filterType == 'RichText' ?
                                                        // <RichText
                                                        //   getEditorValue={getEditorValue}
                                                        //   values={!!props.recordDetial[item.tableColum] ? props.recordDetial[item.tableColum] : null}
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
            <Card title="文件列表" className={styles.card} bordered={false}>
              <Table columns={columns} dataSource={dataSource} scroll={{ x: true }} />
            </Card>
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
                {/* <SubmitButton ref={btnSubmitRef}>提交</SubmitButton> */}
              </Space>
            </div>
          </Form>
      }

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
      <Modal visible={modalVisible}
        style={{
          maxWidth: "100vw",
          top: 0,
          paddingBottom: 0,
        }}
        bodyStyle={{
          height: "calc(100vh  - 53px)",
          overflowY: "auto",
        }}
        width="100vw"
        onCancel={() => {
          setModalVisible(false)
        }}
        footer={
          [
            <Button onClick={() => {
              setModalVisible(false)
            }}>返回</Button>]
        }
      >
        <img src={imageView} width='500px' />
      </Modal>
    </Modal >
  );
};

export default ModalFormProTemplate;