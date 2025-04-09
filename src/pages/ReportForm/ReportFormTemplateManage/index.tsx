import { PlusOutlined, ExclamationCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, message, Input, Modal, Form, Select, Divider, Row, Col, Upload, Menu, Dropdown, Tree, Card } from 'antd';
import React, { useState, useEffect } from 'react';
import { guid, getBase64 } from '@/utils/stringUtil';
import api from './service';
import styles from './styles.less';
import { ACCESS_TOKEN_KEY } from '@/utils/constant';
const { Option } = Select;
const { TreeNode } = Tree;
const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 18 },
};
const { Search } = Input;

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [form] = Form.useForm();
  const [form_detail] = Form.useForm();
  const [modalVisible, changeModalVisible] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<any>('');
  const [expandedKeys, setExpandedKeys] = useState<any>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any>([]);
  const [addFileList, setAddFileList] = useState<any>([]);
  const [modalType, setModalType] = useState<string>('');
  const [formItemDisabled, setFormItemDisabled] = useState<boolean>(true);
  const [attrList, setAttrList] = useState<any>([]);

  const [addAttrList, setAddAttrList] = useState<any>([]);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [tempTreeList, setTempTreeList] = useState<any>([]);
  const [reset, setReset] = useState<any>(false);

  const [templateDetail, setTemplateDetail] = useState<any>(false);
  const [typeValue, setTypeValue] = useState<any>();

  const [clickTreeKey, setClickTreeKey] = useState<any>('');

  //给子级添加父级Key
  const addParentKeyWrapper = (tree: any) => {
    //深度克隆
    const data = JSON.parse(JSON.stringify(tree));
    function addParentKey(data: any, parentKey: any) {
      data.length &&
        data.forEach((ele: any) => {
          const { children, key } = ele;
          ele.parent_key = parentKey;
          if (children) {
            //如果唯一标识不是code可以自行改变
            addParentKey(children, key);
          }
        });
    }
    addParentKey(data, null); //一开始为null,根节点没有父级
    return data;
  };

  useEffect(() => {
    form.setFieldsValue({});
    fetchTempTypeList(reset);
    setReset(false);
  }, []);
  useEffect(() => {
    if (reset) {
      form.setFieldsValue({});
      fetchTempTypeList(reset);
      setReset(false);
    }
  }, [reset]);
  const fetchTempTypeList = async (reset: boolean) => {
    let res: any = await api.fetchTempTypeList();

    if (res.code === 0) {
      let arr = res.data;
      let isCsan = true;
      arr.length &&
        arr.map((item: any) => {
          if (item.children && item.children.length && isCsan) {
            isCsan = false;
            getDetail(reset ? clickTreeKey : item.children[0].value);
          }
        });
      setTempTreeList(addParentKeyWrapper(arr));
    }
  };

  // 获取详情
  const getDetail = async (key: any) => {
    let res: any = await api.getTemplateDetail({ id: key });
    setClickTreeKey(key);
    if (res.response.code === 0) {
      let obj: any = {};
      obj = res.response.data;
      if (obj.fileIds.length) {
        let arr: any = [];
        obj.fileIds.map((item: any) => {

          arr.push({
            fileId: item,
            name: `示例图${item}`,
            url: `/api/file/fileDown/downloadFileById?fileId=${item}`,
          });
        });

        setFileList(arr);
      } else {
        setFileList([]);
      }
      setTemplateDetail(res.response.data);
      setAttrList(obj.tplAttrDtos);
      form_detail.setFieldsValue({
        tplTit: obj.tplTit,
        tplDesc: obj.tplDesc,
        tplUrl: obj.tplUrl,
        fileIds: obj.fileIds,
        tplAttrDtos: obj.tplAttrDtos,
        attrDesc: obj.attrDesc,
        tplVer: obj.tplVer,
      });
    }
  };

  // 图片上传等
  const handleChange = async ({ file, fileList }: any) => {
    if (file.status === 'removed') {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        content: '确定要删除此文件吗？',
        onOk: async () => {
          if (file.response && file.response.code != 0) {
            message.error(file.response.message);
            return;
          }
          modalType === 'temp' ? setAddFileList(fileList) : setFileList(fileList);
          let tempDetail = templateDetail
          tempDetail.fileIds = []
          setTemplateDetail(tempDetail)

        },
        onCancel() { },
      });

    } else {
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
      modalType === 'temp' ? setAddFileList([...curFileList]) : setFileList([...curFileList]);
    }
  };
  const handleCancel = () => setPreviewVisible(false);

  // 打开modal框
  const openAddTypeModal = (key: string) => {
    if (key === 'temp' && !tempTreeList.length) {
      message.warn('请先新增模板类型！');
      return;
    }
    form.setFieldsValue({});
    form.resetFields();
    let arr = [
      {
        attrLvl: '0',
        attrTypName: '通用属性',
        id: guid(),
        tplAttrDescList: [
          {
            attrName: 'filterType',
            attrDesc: '控件类型',
            attrId: guid(),
            tplParmDtos: [
              {
                parmDesc: '下拉框',
                parmVal: 'select',
                parmId: guid(),
              },
              {
                parmDesc: '输入框',
                parmVal: 'input',
                parmId: guid(),
              },
              {
                parmDesc: '日期',
                parmVal: 'datePicker',
                parmId: guid(),
              },
              {
                parmDesc: '日期区间',
                parmVal: 'rangerPicker',
                parmId: guid(),
              },
              {
                parmDesc: '勾选框',
                parmVal: 'Checkbox',
                parmId: guid(),
              },
            ],
          },
        ],
      },
      {
        attrLvl: '0.5',
        attrTypName: '整体属性',
        id: guid(),
        tplAttrDescList: [

        ],
      },
    ];
    setAddAttrList(arr);
    setFormItemDisabled(true);
    changeModalVisible(true);
    setModalType(key);
    // if (key === 'temp') {
    //   setOldFileList(fileList);
    //   setFileList([]);
    // }
  };

  // 树
  const getParentKey: any = (value: any, tree: any) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children && node.children.length > 0) {
        if (node.children.some((item: any) => item.value === value)) {
          parentKey = node.value;
        } else if (getParentKey(value, node.children)) {
          parentKey = getParentKey(value, node.children);
        }
      } else {
        parentKey = node.value;
      }
    }
    return parentKey;
  };
  // 树搜索
  const onChange = (e: any) => {
    //search变化
    const { value } = e.target;
    const dataList: any = [];
    let searchElement: any = [];
    let allParentkey: any = [];
    if (value) {
      const generateList = (data: any) => {
        //tree树片扁平化
        for (let i = 0; i < data.length; i++) {
          const node = data[i];
          const { key, title, parent_key } = node;
          dataList.push({ key, title: title, parent_key: parent_key });
          if (node.children) {
            generateList(node.children);
          }
        }
      };
      generateList(tempTreeList);

      const getParentKey: any = (key: any, tree: any) => {
        //获取父元素key
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
          const node = tree[i];
          if (node.children) {
            if (node.children.some((item: any) => item.key === key)) {
              parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
              parentKey = getParentKey(key, node.children);
            }
          }
        }
        return parentKey;
      };
      //上级元素
      const getParentElementKey = (searchElement: any, dataList: any) => {
        for (let i = 0; i < searchElement.length; i++) {
          for (let j = 0; j < dataList.length; j++) {
            if (searchElement[i] == dataList[j].key) {
              allParentkey.push(dataList[j].key);
              getParentElementKey([dataList[j].parent_key], dataList);
            }
          }
        }
      };
      const expandedKeys = dataList
        .map((item: any) => {
          if (item.title.indexOf(value) > -1) {
            searchElement.push(item.key);
            return getParentKey(item.key, tempTreeList);
          }
          return null;
        })
        .filter((item: any, i: number, self: any) => item && self.indexOf(item) === i);
      getParentElementKey(searchElement, dataList);
      setExpandedKeys(expandedKeys);
      setSearchValue(value);
      setAutoExpandParent(true);
    }
  };

  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  // modal框数据提交
  const submitModalValue = () => {
    if (modalType === 'type') {
      form.validateFields(['typeName']).then(async (val) => {
        let res: any = await api.submitTempType({
          typName: val.typeName,
          typId: typeValue,
        });
        if (res.response.code === 0) {
          fetchTempTypeList();
          setTypeValue('');
          form.setFieldsValue({
            typeName: '',
          });
        }
        changeModalVisible(false);
      });
    } else {
      onsubmit('add');
    }
  };
  // 删除模板
  const deleteTemp = async (value: any) => {
    let res: any = await api.deleteTemp({ tplTypId: value });
    if (res.response.code === 0) {
      message.success('删除成功！');
      fetchTempTypeList();
    } else {
      message.error(res.response.message);
    }
  };
  // 提交--模板
  const onsubmit = (status: any) => {
    (modalVisible ? form : form_detail).validateFields().then(async (thisValues) => {
      let obj: any = {};
      if (fileList.length > 0 || addFileList.length > 0) {
        thisValues.fileIds = (status === 'edit' ? fileList : addFileList).map(
          (item: any) => item.fileId || item.response.data.fileId,
        );
      }
      thisValues.tplAttrDtos = status === 'edit' ? attrList : addAttrList;
      obj = status === 'edit' ? { ...templateDetail, ...thisValues } : { ...thisValues };
      const resp: any = await api.submitTemp(obj);
      if (resp.response.code === 0) {
        message.success(`${obj.tplId ? '编辑' : '新增'}模板成功`);
        changeModalVisible(false);
        setAddAttrList([]);
        setModalType('');
        form.resetFields();

        setReset(true);
        setFormItemDisabled(true);
      } else {
        message.error(resp.response.message);
      }
    });
  };

  const num = (n: number) => {
    let obj = {
      0: '通用',
      0.5: '整体',
      1: '一',
      2: '二',
      3: '三',
      4: '四',
      5: '五',
      6: '六',
      7: '七',
      8: '八',
      9: '九',
      10: '十',
    };
    return obj[n] || n;
  };
  // 添加级别
  const addLevel = () => {
    let arr: any = JSON.parse(JSON.stringify(modalType === 'temp' ? addAttrList : attrList));
    if (arr.length < 6) {
      arr.push({
        attrLvl: arr.length + '',
        attrTypName: num(arr.length) + '级属性',
        id: guid(),
        tplAttrDescList: [
          {
            attrName: '',
            attrDesc: '',
            attrId: guid(),
            tplParmDtos: [
              {
                parmVal: '',
                parmDesc: '',
                parmId: guid(),
              },
            ],
          },
        ],
      });
      modalType === 'temp' ? setAddAttrList([...arr]) : setAttrList([...arr]);
    } else {
      message.warn('最多只能添加5级！');
      return;
    }
  };

  // 添加属性、参数
  const addElement = (v: string, id: string, type: string) => {
    let arr: any;
    arr = JSON.parse(JSON.stringify(modalType === 'temp' ? addAttrList : attrList));
    arr.map((item: any, i: number) => {
      if (item.attrLvl === id) {
        switch (type) {
          case 'add':
            arr[i].tplAttrDescList.push({
              attrName: '',
              attrDesc: '',
              attrId: guid(),
              tplParmDtos: [
                {
                  parmVal: '',
                  parmDesc: '',
                  parmId: guid(),
                },
              ],
            });
            break;
          case 'delete':
            arr[i].tplAttrDescList.splice(i, 1);

            item.attrLvl = i + '';

            if (arr[i].tplAttrDescList.length < 1) {
              arr.splice(i, 1);
            }
            break;
          case 'attrName':
            item.attrName = v;
            break;
          case 'attrDesc':
            item.attrDesc = v;
            break;
          default:
            break;
        }
      } else if (item.tplAttrDescList) {
        item.tplAttrDescList.map((ite: any, idx: number) => {
          if (ite.attrId === id) {
            if (type === 'add') {
              item.tplAttrDescList[idx].tplParmDtos.push({
                parmName: '',
                parmDesc: '',
                parmId: guid(),
              });
            } else if (type === 'delete') {
              if (ite.attrId === id) {
                item.tplAttrDescList.splice(idx, 1);

                if (item.tplAttrDescList.length < 1) {
                  arr.splice(i, 1);
                  arr.map((obj: any, i: number) => {
                    obj.attrLvl = i + '';
                  });
                }
              }
            } else {
              ite[type] = v;
            }
          } else if (ite.tplParmDtos) {
            ite.tplParmDtos.map((it: any, indx: number) => {
              if (it.parmId === id) {
                if (type === 'delete') {
                  ite.tplParmDtos.splice(indx, 1);
                } else {
                  it[type] = v;
                }
              }
            });
          }
        });
      }
      modalType === 'temp' ? setAddAttrList([...arr]) : setAttrList([...arr]);
      return;
    });
  };
  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  // 树节点点击触发
  const onNodeSelect = async (
    key: any,
    e: { selected: boolean; selectedNodes: any; node: any; event: any },
  ) => {
    if (e.node.dataRef.nodeType !== '1') {
      getDetail(key);
    }
  };
  // 属性配置表
  const AttrForm = (arr: any, v: string) =>
    arr.map((item: any, i: number) => (
      <Form.Item label=" ">
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 5 }}>
          {' '}
          {num(item.attrLvl)}
          {item.attrLvl === '0' || item.attrLvl === '0.5' ? null : '级'}属性
        </div>
        {item.tplAttrDescList &&
          item.tplAttrDescList.map((ite: any, index: number) =>
            !formItemDisabled || v === 'temp' ? (
              <div className={styles.grid} style={{ marginBottom: "30px" }}>
                <div className={styles.item}>
                  <div style={{ textAlign: 'left', width: 100 }}>
                    {index === 0 && i === 0 ? <b style={{ color: 'red' }}>*</b> : null} 属性
                    {index + 1}:
                  </div>
                  <Input
                    style={{ width: '30%', marginRight: "10px" }}
                    placeholder="请输入"
                    defaultValue={ite.attrName}
                    disabled={item.attrLvl === '0' && index === 0 ? true : false}
                    onChange={(e) => addElement(e.target.value, ite.attrId, 'attrName')}
                  />
                  <Input
                    style={{ width: '35%', marginRight: "10px" }}
                    placeholder="请输入"
                    defaultValue={ite.attrDesc}
                    disabled={item.attrLvl === '0' && index === 0 ? true : false}
                    onChange={(e) => addElement(e.target.value, ite.attrId, 'attrDesc')}
                  />
                  <Select
                    style={{ width: '20%' }}
                    placeholder="请选择类型,默认input"
                    className={styles.select}
                    defaultValue={ite.type}
                    onChange={(v: any) => addElement(v, ite.attrId, 'type')}
                  >
                    {['select', 'datePicker', 'rangePicker', 'input', 'radio', 'check'].map(
                      (item: any) => (
                        <Option value={item}>{item}</Option>
                      ),
                    )}
                  </Select>
                  {index === 0 && i === 0 ? null : (
                    <a
                      href="javascript:;"
                      style={{ marginLeft: 5 }}
                      onClick={() => addElement('', ite.attrId, 'delete')}
                    >
                      删除
                    </a>
                  )}
                </div>
                <Divider style={{ margin: '10px 0' }} />
                {ite.tplParmDtos &&
                  ite.tplParmDtos.map((it: any, index: number) => (
                    <div className={styles.item}>
                      <div>参数{index + 1}</div>
                      <Input
                        style={{ width: '45%', marginRight: "10px" }}
                        placeholder="请输入"
                        value={it.parmVal}
                        onChange={(e) => addElement(e.target.value, it.parmId, 'parmVal')}
                      />
                      <Input
                        style={{ width: '45%', marginRight: "10px" }}
                        placeholder="请输入"
                        value={it.parmDesc}
                        onChange={(e) => addElement(e.target.value, it.parmId, 'parmDesc')}
                      />
                      <a href="javascript:;" onClick={() => addElement('', it.parmId, 'delete')}>
                        删除
                      </a>
                    </div>
                  ))}
                <Button
                  type="primary"
                  ghost
                  style={{ marginTop: 10 }}
                  onClick={() => addElement('', ite.attrId, 'add')}
                >
                  添加参数
                </Button>
              </div>
            ) : (
              <div>
                <Row>
                  <Col
                    style={{
                      width: 220,
                      textAlign: 'center',
                      height: 40,
                      background: '#F2F2F2',
                      border: '1px solid #797979',
                      lineHeight: '40px',
                    }}
                  >
                    属性（说明）
                  </Col>
                  <Col
                    style={{
                      width: 280,
                      textAlign: 'center',
                      height: 40,
                      background: '#F2F2F2',
                      border: '1px solid #797979',
                      lineHeight: '40px',
                    }}
                  >
                    参数（说明）
                  </Col>
                </Row>

                <Row style={{ marginBottom: 20 }}>
                  <Col
                    style={{
                      width: 220,
                      lineHeight: 22 * ite.tplParmDtos.length + 'px',
                      border: '1px solid #797979',
                    }}
                  >
                    <span style={{ paddingLeft: 7 }}>{ite.attrName + `（${ite.attrDesc}）`}</span>
                  </Col>
                  <Col style={{ width: 280 }}
                  >
                    {ite.tplParmDtos.map((it: any) => (
                      <Row
                        style={{
                          border: '1px solid #797979',
                          lineHeight: 22 + 'px',
                        }}
                      >
                        <span style={{ paddingLeft: 7 }}>{it.parmVal + `（${it.parmDesc}）`}</span>
                      </Row>
                    ))}
                  </Col>
                </Row>
              </div>
            ),
          )}
        {(!formItemDisabled || v === 'temp') && (
          <Button
            type="primary"
            style={{ marginTop: 10 }}
            onClick={() => addElement('', item.attrLvl, 'add')}
          >
            添加属性
          </Button>
        )}
        <Divider style={{ margin: '12px 0' }} />
      </Form.Item>
    ));

  // form表单
  const CommonForm = (v: any) => (
    <Form {...layout} form={form} preserve={false}>
      {v === 'temp' && (
        <Form.Item
          label="模板类型"
          name="tplTypParId"
          rules={[{ required: true, message: '模板类型必选!' }]}
        >
          <Select placeholder="请选择">
            {tempTreeList.length &&
              tempTreeList.map((item: any) => <Option value={item.value}>{item.title}</Option>
              )
            }
          </Select>
        </Form.Item>
      )}

      <Form.Item label="标题" name="tplTit" rules={[{ required: true, message: '标题必填!' }]}>
        <Input disabled={v === 'temp' ? false : formItemDisabled} />
      </Form.Item>
      <Form.Item label="版本" name="tplVer">
        <Input disabled={v === 'temp' ? false : formItemDisabled} />
      </Form.Item>

      <Form.Item label="描述" name="tplDesc">
        <Input disabled={v === 'temp' ? false : formItemDisabled} />
      </Form.Item>

      <Form.Item label="路径链接" name="tplUrl">
        <Input disabled={v === 'temp' ? false : formItemDisabled} />
      </Form.Item>

      <Form.Item label="示例图">
        <Upload
          className={styles.upload}
          action="/api/file/fileInfo/upload"
          listType="picture-card"
          accept=".jpg,.jpeg,.png,.svg"
          onPreview={handlePreview}
          onChange={handleChange}
          data={{ btype: 'customer_images' }}
          fileList={addFileList}
          headers={{
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
          }}
          disabled={v === 'temp' ? false : formItemDisabled}
        >
          {(!formItemDisabled || v === 'temp') && addFileList.length < 1 && (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传</div>
            </div>
          )}
        </Upload>
      </Form.Item>
      <Form.Item label="属性说明" name="attrDesc">
        <Input disabled={v === 'temp' ? false : formItemDisabled} />
      </Form.Item>
      {v === 'temp' ? AttrForm(addAttrList, v) : AttrForm(attrList, v)}
      {(!formItemDisabled || v === 'temp') && (
        <Form.Item label=" ">
          <Button type="primary" style={{ marginTop: 10 }} onClick={() => addLevel()}>
            添加级别
          </Button>
        </Form.Item>
      )}
    </Form>
  );
  // 树-父节点点击编辑，删除
  const handleMenuClick = async (e: any, item: any) => {
    if (e.key === 'edit') {
      openAddTypeModal('type');
      setTypeValue(item.value);
      form.setFieldsValue({
        typeName: item.title,
      });
    } else if (e.key === 'delete') {
      let res: any = await api.deleteTempType(item.value);
      if (res.response.code === 0) {
        message.success('删除成功！');
        setReset(true);
      } else {
        message.error(res.response.message);
      }
    }
  };
  const renderTreeNodes = (data: any) => {
    //生成树结构函数
    if (data.length == 0) {
      return;
    }
    return data.map((item: any) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);

      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: 'red' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );
      if (item.pid == '0') {
        const menu = (
          <Menu onClick={(e) => handleMenuClick(e, item)}>
            <Menu.Item key="edit">编辑</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        );
        return (
          <TreeNode
            title={
              <Row style={{ width: '15.5vw' }}>
                <Col span={22}>{title}</Col>
                <Col span={2}>
                  <Dropdown overlay={menu}>
                    <MoreOutlined />
                  </Dropdown>
                </Col>
              </Row>
            }
            key={item.key}
            dataRef={item}
          >
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={<Row>{title}</Row>} key={item.key} dataRef={item} />;
    });
  };

  return (
    <>
      {/* 照片预览 */}
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
      {/* form---modal */}
      <>
        <Modal
          destroyOnClose={true}
          maskClosable={false}  //点击蒙层是否允许关闭
          centered
          title={modalType === 'type' ? `${typeValue ? '编辑' : '新增'}类型` : '新增模板'}
          visible={modalVisible}
          onOk={() => submitModalValue()}
          onCancel={() => {
            changeModalVisible(false);
            setModalType('');
            typeValue &&
              form.setFieldsValue({
                typeName: '',
              });
            setTypeValue('');
          }}
          okText="确定"
          cancelText="取消"
          className={styles.modal}
          getContainer={false}
          width={modalType === 'temp' ? '65%' : 550}
          style={modalType === 'temp' ? { height: (window.innerHeight * 85) / 100 } : {}}
        >
          <div
            className={styles.content}
            style={{ overflow: 'auto', height: modalType === 'temp' ? '75vh' : 'auto' }}
          >
            {modalType === 'type' ? (
              <Form form={form} preserve={false}>
                <Form.Item
                  label="类型名称："
                  name="typeName"
                  rules={[{ required: true, message: '名称必填!' }]}
                >
                  <Input />
                </Form.Item>
              </Form>
            ) : (
              CommonForm('temp')
            )}
          </div>
        </Modal>
      </>

      <Card style={{ minHeight: `calc(100vh - ${115}px)` }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <div style={{ fontSize: 16, fontWeight: 500 }}>模板属性配置管理</div>
            <div style={{ textAlign: 'right' }}>
              <a href="javascript:;" onClick={() => openAddTypeModal('type')}>
                增类型
              </a>
              <a
                href="javascript:;"
                style={{ margin: '0 8px' }}
                onClick={() => openAddTypeModal('temp')}
              >
                增模板
              </a>
            </div>
            <Search style={{ margin: '8px 0' }} placeholder="搜索" onChange={(v) => onChange(v)} />
            {(tempTreeList.length && (
              <Tree
                defaultExpandAll={true}
                height="calc(100vh - 150px)"
                onExpand={(v) => onExpand(v)}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onSelect={(selectedKeys, e) => {
                  onNodeSelect(selectedKeys, e);
                }}
              >
                {renderTreeNodes(tempTreeList)}
              </Tree>
            )) ||
              null}
          </Col>

          <Col span={18}>
            <Card
              title={templateDetail.tplTit}
              extra={
                <div>
                  {formItemDisabled ? (
                    <Button
                      type="primary"
                      onClick={() => {
                        setFormItemDisabled(false);
                      }}
                      style={{ margin: '0 8px' }}
                    >
                      编辑
                    </Button>
                  ) : (
                    <span>
                      <Button
                        type="default"
                        onClick={() => {
                          setReset(true);
                          setFormItemDisabled(true);
                        }}
                      >
                        取消
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => onsubmit('edit')}
                        style={{ margin: '0 8px' }}
                      >
                        提交
                      </Button>
                    </span>
                  )}

                  <Button type="primary" danger onClick={() => deleteTemp(templateDetail.tplTypId)}>
                    删除
                  </Button>
                </div>
              }
              style={{ height: '100%' }}
            >
              <Divider style={{ margin: '12px 0' }} />
              <Form {...layout} form={form_detail} preserve={false}>
                <Form.Item
                  label="标题"
                  name="tplTit"
                  rules={[{ required: true, message: '标题必填!' }]}
                >
                  <Input
                    disabled={formItemDisabled}
                  />
                </Form.Item>
                <Form.Item label="版本" name="tplVer">
                  <Input disabled={formItemDisabled} />
                </Form.Item>

                <Form.Item label="描述" name="tplDesc">
                  <Input disabled={formItemDisabled} />
                </Form.Item>

                <Form.Item label="路径链接" name="tplUrl">
                  <Input disabled={formItemDisabled} />
                </Form.Item>

                <Form.Item label="示例图">
                  <Upload
                    className={styles.upload}
                    action="/api/file/fileInfo/upload"
                    listType="picture-card"
                    accept=".jpg,.jpeg,.png,.svg"
                    onPreview={handlePreview}
                    onChange={handleChange}
                    data={{ btype: 'customer_images' }}
                    fileList={fileList}
                    headers={{
                      Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
                    }}
                    disabled={formItemDisabled}
                  >
                    {!formItemDisabled && fileList.length < 1 && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>

                <Form.Item label="属性说明" name="attrDesc">
                  <Input disabled={formItemDisabled} />
                </Form.Item>
                {AttrForm(attrList, 'normal')}

                {!formItemDisabled && (
                  <Form.Item label=" ">
                    <Button type="primary" style={{ marginTop: 10 }} onClick={() => addLevel()}>
                      添加级别
                    </Button>
                  </Form.Item>
                )}
              </Form>
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default TableList;
