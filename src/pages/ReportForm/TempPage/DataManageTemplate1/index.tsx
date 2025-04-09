import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Table,
  Tooltip,
  Upload,
  UploadProps,
} from 'antd';
import '@/pages/ReportForm/theme/default/common.less';
import { SubmitButton } from "@/components/base/form/Button";
import styles from './styles.less';
import FormInfo from './components/FormInfo';
import { FILE_REQUEST_BASE } from '@/utils/constant';
import moment from 'moment';
import EditTable from './components/EditTable';
import api from './service';
import { nanoid } from 'nanoid'
import { InboxOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const { Dragger } = Upload;
let editTableData: any = {};
let delTableData: any = {};
// ERP订单编辑模板2.1
const DataManageTemplate1: React.FC<{}> = (props: any) => {
  const pageLink = props.modalPageLink && props.modalPageLink.split("page&id=")[1];
  const [loading, setLoading] = useState<boolean>(false);
  const [componentList, setComponentList] = useState<any>([]);
  const [formItemGroup, setFormItemGroup] = useState<any>([]);
  const [tableFlag, setTableFlag] = useState<any>(false)
  // 编辑表格删除数据
  // const [delTableData, setDelTableData] = useState<any>({});
  // 提交按钮
  const [botbtnArr, setBotbtnArr] = useState<any>([]);
  const [subMitCode, setSubmitCode] = useState<any>('');

  const btnSubmitRef = useRef<any>();
  const form = useRef<any>();
  const [isEditTable, setIsEditTable] = useState<boolean>(false)
  const [editTableCol, setEditTableCol] = useState<any>([])
  const [isShow, setIsShow] = useState(false)
  const [contentValue, setContentValue] = useState(null)
  const [dataSource, setDataSource] = useState<any>([])
  const [modalVisible, setModalVisible] = useState(false)
  // 文件上传
  const [fileList, setFileList] = useState<any>([]);
  const [imageView, setImageView] = useState<string>('')
  const [msg, setMsg] = useState<any>("");
  const [accept, setAccept] = useState<any>('')
  // 下拉list数据
  const [initData, setInitData] = useState(undefined);
  //文件列表标识
  const [fileListFlag, setFileListFlag] = useState<any>(false)
  // 值改变时的数组
  const [changedFields, setChangeFields] = useState<any>({});
  //是否显示表单
  const [itemname, setItemname] = useState<any>([]);
  const [ifShow, setIfShow] = useState([]);
  const [pasteFile, setPasteFile] = useState<any>([])
  useEffect(() => {
    pageLink && getViewData();
  }, [pageLink]);
  useEffect(() => {
    fileListFlag && tableFlag && window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste)
      setPasteFile([])
      setFileList([])
      setDataSource([])
    }
  }, [fileListFlag, tableFlag])
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
  // 初始化话进入页面所有数据
  const getViewData = async () => {
    setLoading(true);
    const res1: any = await getViewProps();
    res1 && setLoading(false);
    res1 && props.recordDetial && props.recordDetial.fileList && setFileList(JSON.parse(props.recordDetial.fileList))

  }

  // 获取页面配置的属性
  const getViewProps = () => {
    let pageProps: any = getSrvCode(pageLink);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(pageProps);
      }, 300);
    });
  }
  const dateFormatYMDHMS = 'YYYY-MM-DD HH:mm:ss';

  //文件列表
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
          <Divider type="vertical" style={{ display: 'inline' }} />
          <a onClick={() => {
            setFileList(fileList.filter((item: any) => item.fileId !== record.fileId))
            setDataSource(dataSource.filter((item: any) => item.fileId !== record.fileId))
          }}
          // disabled={isDisabled ? isDisabled : (!!props.disabled && props.disabled ? props.disabled : false)}
          // style={{ display: 'inline' }}
          >删除</a>
        </Fragment>
      )
    }
  ]
  // 根据页面id获取页面各个模块配置属性
  const getSrvCode = async (id: any) => {
    const res0 = await api.getTreeDetailById({ id: id });
    if (res0.code === 0 && res0.data) {
      let componentArr: any = [];
      let formItemArr: any = [];
      let bbtnArr: any = [];
      let editTableColArr: any = []
      let fillterDefault: any = {};
      // 页面元素属性遍历
      res0.data.intfIttrDescList1.map((item: any, index: any) => {
        const condition = ['FormItem', 'EditTable'];
        if (condition.includes(item.filterType) && item.isDisabled != 1) {
          let obj = {
            key: index,
            sortKey: item.sortNumber ? Number(item.sortNumber) : index,
            ...item
          }
          componentArr.push(obj);
          if (item.filterType == 'FormItem' && item.componentCode && !JSON.parse(item.componentCode).isDisabled) {
            // if (item.filterType == 'FormItem') {
            if (JSON.parse(item.componentCode).fileListFlag) {
              setFileListFlag(true)
            }
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
          if (item.filterType == 'EditTable') {
            setIsEditTable(true)
            let delTableIndex: any = index
            editTableData[`editTable${index++}`] = [];

            delTableData[`del${delTableIndex}`] = [];
          }
        }
      });
      // 底部提交按钮属性
      res0.data && res0.data?.topBut.map((item: any) => {
        if (item.position.includes('3')) {
          item.type == 8 && setSubmitCode(item.code);
          bbtnArr.push(item);
        }
      });
      let flag = componentArr.every((item: any) => {
        return item.filterType === 'FormItem'
      })
      setTableFlag(flag)
      res0.data && res0.data?.initDataApi && getInitData(res0.data.initDataApi)
      setBotbtnArr(bbtnArr);
      setEditTableCol(editTableColArr)
      setComponentList(componentArr);
      setFormItemGroup(formItemArr);
      //删选有标识的字段
      let li: any = []
      componentArr && componentArr.map((item: any, index: any) => {
        if (item.filterType === 'FormItem') {
          item.intfManDesc.intfIttrDescList1.map((arr: any) => {
            let comcode = JSON.parse(arr.componentCode)

            if (comcode.hasOwnProperty('isNull') && comcode.isNull) {
              li.push(arr.tableColum)
              //  console.log(333,arr.columId);
            }
          })
        }
        setItemname(li)
      })

      return true;
    } else {
      res0.code !== 0 && message.error(res0.message || '操作失败')
      return false;
    }
  };
  const [inputvalue, setInputvalue] = useState({})
  const handleinputvalue = (value: any) => {
    setInputvalue(value)
  }
  //筛选要隐藏的表单
  useEffect(() => {
    let showprops: any = []
    componentList && componentList.map((item: any, index: any) => {
      showprops[index] = true
      let relaitemcode = JSON.parse(item.componentCode)

      // &&relaitemcode.relativeShow==itemname
      if (relaitemcode.hasOwnProperty('relativeShow')) {
        itemname.map((ite: any) => {
          if (relaitemcode.relativeShow == ite && (inputvalue[ite] == 0 || !inputvalue[ite])) {
            // showprops.push(false)
            showprops[index] = false

          }
        })


      }
      //  {showprops[index]=true}

    })
    setIfShow(showprops)
  }, [inputvalue])
  // 获取页面下拉框子项数据
  const getInitData = async (code: any) => {
    let res: any = await api.execByCode(JSON.stringify({}), code);
    if (res.response.code === 0) {
      setInitData(res.response.data);
    } else {
      message.error(res.response.message || '操作失败')
    }

  }

  // 设置编辑、详情页数据
  const getFormItemValue = (record: any) => {
    if (record) {
      let newRowDetail = { ...record }
      formItemGroup.forEach((item: any) => {
        if (item.filterType == 'datePicker') {
          if (!!newRowDetail[item.tableColum] && newRowDetail[item.tableColum]) {
            newRowDetail[item.tableColum] = moment(newRowDetail[item.tableColum])
          } else {
            newRowDetail[item.tableColum] = moment()
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
            if (newRowDetail[item.tableColum] instanceof Array) {
              newRowDetail[item.tableColum] = newRowDetail[item.tableColum]
            } else {
              newRowDetail[item.tableColum] = [newRowDetail[item.tableColum]]
            }

          }
        }
      })
      return newRowDetail
    } else {
      return undefined;
    }
  }

  // 编辑表格数据
  const getEditTableData = (tableData: any, tableIndex: any) => {
    // let newData = tableData.map((item: any) => {
    //   let o = { ...item };
    //   delete o.key;
    //   delete o.index;
    //   return o;
    // });
    // let obj = {}
    // obj[`editTable${tableIndex++}`] = newData;
    // delete tableData.key;
    // delete tableData.index;
    let index: any = editTableData[`editTable${tableIndex}`].findIndex((item: any) => { return item.key == tableData.key });
    if (index > -1) {
      editTableData[`editTable${tableIndex}`][index] = tableData
    } else {
      editTableData[`editTable${tableIndex}`].push(tableData)
    }

  }

  // 删除表格数据
  const getDeleteTableData = (row: any, tableIndex: any) => {
    console.log(row);
    let o = { ...row };
    let obj = { ...delTableData }
    let index = editTableData[`editTable${tableIndex}`].findIndex((item: any) => { return item.key == o.key })
    // 他新增数据，肯定有值传过来编辑，所以必须是>-1.如果大于-1，则
    if (index > -1) {
      editTableData[`editTable${tableIndex}`].splice(index, 1);
      // if(row.id != null) {
      //   obj[`del${tableIndex}`].push(o);
      // }else {
      //   return;
      // }
    }
    if (row.id != null) {
      obj[`del${tableIndex}`].push(o);
    }

  }


  // 提交验证
  const onFieldFinish = async (params: any) => {
    let editData = { ...params };
    formItemGroup.map((item: any) => {
      // 日期框值格式化
      if (item.filterType == "datePicker") {
        for (let key in editData) {
          if (key == item.tableColum) {
            let dp = moment(editData[key]._d).format("YYYY-MM-DD")
            editData[key] = dp
          }
        }
      }
      // 时间范围日期值格式化
      if (item.filterType == "rangerPicker") {
        for (let key in editData) {
          if (key == item.tableColum) {
            let rp1 = moment(editData[key][0]._d).format("YYYY-MM-DD")
            let rp2 = moment(editData[key][1]._d).format("YYYY-MM-DD")
            delete editData[key]
            editData.inStartTime = rp1
            editData.inEndTime = rp2
          }
        }
      }
      // 上传文件框值格式化
      // if (item.filterType == 'Upload') {
      //   for (let key in editData) {
      //     if (key == item.tableColum) {
      //       let arr: any = [];
      //       if (editData[key]) {
      //         editData[key] && editData[key].forEach((it: any) => {
      //           if (it.status === 'defalut') {
      //             let o = {
      //               name: it.name,  // 文件名
      //               fileId: it.fileId, // 服务端，文件id
      //               type: it.type,
      //             }
      //             arr.push(o)
      //           } else {
      //             let o = {
      //               name: it.name,  // 文件名
      //               fileId: it.response.data.fileId, // 服务端，文件id
      //               type: it.type,    //保存文件类型
      //             }
      //             arr.push(o)
      //           }
      //         });
      //         editData[key] = JSON.stringify(arr);
      //       }
      //     }
      //   }
      // }
      // 上传文件框值格式化
      if (item.filterType == 'Upload') {
        const condition: any = ['commentInfo', 'entName', 'entTime', 'fileId', 'fileName', 'size', 'fileUrlView']
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
          if (key == item.tableColum) {
            let arr = editData[key];
            editData[key] = arr[arr.length - 1];
          }
        }
      }
    });
    if (isEditTable) {
      // 字段值为NULL,转换为空字符串''
      for (let key in editData) {
        if (editData[key] === null) {
          editData[key] = '';
        }
      }
      editData = {
        ...editData,
      }

      let paramlist: any = {
        'formInfo': editData,
        ...editTableData,
        ...delTableData,
      };
      let flag = false;
      for (let key in paramlist) {
        if (key != 'formInfo') {
          if (paramlist[key].length > 0) {
            flag = true
            paramlist[key].map((item: any) => {
              delete item.key;
              delete item.index;
              return item;
            })
          }
        }
      }
      console.log('提交params', JSON.parse(JSON.stringify(paramlist)), subMitCode);

      if (flag) {
        const res: any = await api.execByCode(JSON.stringify(paramlist), subMitCode);
        if (res.response.code == 0) {
          message.success(res.response.message);
          props.handleCancel(1);
        } else {
          message.error(res.response.message || '操作失败');
          // for(let key in editTableData) {
          //   editTableData[key] = []
          // }
          // for(let key in delTableData) {
          //   delTableData[key] = []
          // }
          btnSubmitRef.current.reset();
        }
      } else {
        props.handleCancel(0);
        //  btnSubmitRef.current.reset();
      }
    } else {
      // 删除字段值为NULL、空字符串''
      for (let key in editData) {
        if (!editData[key]) {
          delete editData[key]
        } else if (!editTableCol.includes(key)) {
          delete editData[key]
        }
      }
      editData = {
        ...editData,
      }
      let submitData: any = {
        bizMap: editData
      };
      console.log('提交params', JSON.parse(JSON.stringify(submitData)), subMitCode);
      const res: any = await api.execByCode(JSON.stringify(submitData), subMitCode)
      if (res.response.code === 0) {
        message.success(res.response.message);
        props.handleCancel(1);
      } else {
        message.error(res.response.message);
        btnSubmitRef.current.reset();
      }
    }
  }

  const onFieldFail = () => {
    btnSubmitRef.current.reset();
  }
  //  值改变时传参
  const getFormInfo = (changedFields: any) => {
    console.log(changedFields)
    setChangeFields(changedFields)
  }
  const onFieldsChange = (changedFields: any) => {
    getFormInfo(changedFields)
  }
  // 值改变时传参 ---end
  //上传文件弹窗
  const handleModal = (flag: any) => {
    flag && setIsShow(true)
  }
  // 关闭弹窗 
  const colseModal = () => props.handleCancel(0);
  const formItemLayout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 22,
    },
  };
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
  const getChildNodeData = (fileAccept: any, msg: any) => {
    setAccept(fileAccept)
    setMsg(msg)
  }
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
  //预览图片弹窗
  const imageModal = (record: any) => {
    setModalVisible(true)
    const imgUrl: any = fileList.find((item: any) => item.uid === record.uid)
    setImageView(imgUrl.fileUrlView)
  }


  return (
    <Modal
      title={props.modalTitle ? props.modalTitle : 'Title'}
      visible={true}
      width="80%"
      maskClosable={false}
      destroyOnClose={true}
      onCancel={colseModal}
      footer={false}
      bodyStyle={{ paddingTop: 0 }}
    >
      <Form
        ref={form}
        // className="wb-page-form"
        name="form"
        preserve={false}
        onFinish={onFieldFinish}
        onFinishFailed={onFieldFail}
        onValuesChange={onFieldsChange}
      >
        <Row style={{ marginBottom: 50 }}>
          {
            loading ?
              <Col span={24}>
                <div className={styles.spinCss}>
                  <Spin />
                </div>
              </Col>
              :
              componentList.map((item: any, i: any) => (
                item.filterType === 'FormItem' ?
                  (
                    <Col key={i} span={24} >
                      <fieldset className="wb-fieldset wb-standard-margin" style={{ width: '90%', margin: '10px auto' }}>
                        <legend className="wb-fieldset-legend">
                          <h3 className="wb-fieldset-title">{item.displayName}</h3>
                        </legend>
                        <FormInfo
                          handleinputvalue={handleinputvalue}
                          sqlData={item?.intfManDesc}
                          isDisabled={false}
                          form={form}
                          formData={getFormItemValue(props.recordDetial)}
                          colSpan={JSON.parse(item.componentCode)?.widthSpan}
                          initData={initData}
                          expand={JSON.parse(item.componentCode)?.expand ? JSON.parse(item.componentCode)?.expand : false}
                          handleModal={handleModal}
                          getChildNodeData={getChildNodeData}
                          changedFields={changedFields}//值改变时
                        />
                      </fieldset>
                    </Col>
                  ) : (
                    item.filterType === 'EditTable' ?
                      (
                        <Col key={i} span={24}>
                          <fieldset className="wb-fieldset wb-standard-margin" style={{ width: '90%' }}>
                            <legend className="wb-fieldset-legend">
                              <h3 className="wb-fieldset-title">{item.displayName}</h3>
                            </legend>
                            <EditTable
                              CreatorButtonText={JSON.parse(item.componentCode)?.CreatorButtonText}
                              sqlData={item?.intfManDesc}
                              recordDetial={props.recordDetial}
                              getEditTableData={getEditTableData}
                              getDeleteTableData={getDeleteTableData}
                              tableIndex={i}
                              initData={initData}

                            />
                          </fieldset>
                        </Col>
                      ) : null
                  )
              ))
          }
        </Row>
        {
          tableFlag && fileListFlag ? <Card title="文件列表" className={styles.card} bordered={false}>
            <Table columns={columns} dataSource={dataSource} scroll={{ x: true }} />
          </Card>
            : null
        }

        <div className={styles.cardAffix}>
          <Space>
            <Button onClick={() => { colseModal() }}>返回</Button>
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
    </Modal>
  );
};

export default DataManageTemplate1;