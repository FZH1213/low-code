import React, {
  useState,
  // useRef,
  useMemo,
  useEffect,
  // useImperativeHandle,
  forwardRef,
} from 'react';
import {
  Card,
  Select,
  Input,
  Table,
  Form,
  Row,
  Col,
  Button,
  // Space,
  Tabs,
  Popconfirm,
  Divider,
  AutoComplete,
  message,
  // Spin,
  Checkbox,
  TreeSelect
  // Modal,
} from 'antd';
// import { colLayout1, colLayout2 } from '@/theme/default/layout/formLayout/formLayout';
// import '@/theme/default/common.less';
import EditTable from './../../../components/editTable/index';
// import ModalTableEdit from './ModalTableEdit/index';
import CustEditTable from './CustEditTable/index';
import api from './../service';
import { encryption, Decrypt } from '@/utils/stringUtil';
import {
  IndexModelState,
  // ConnectRC, 
  Loading,
  connect
} from 'umi';
import ButtonEditTable from './ButtonEditTable';

// 新增，编辑SQL接口
const ChoiceSQLComp = (props: any, ref: any) => {
  const { sqlPageLevel, sqlData, tableColum, intfList, remark } = props.reportFormCreate;
  const [form] = Form.useForm();
  const [SQLValue, setSQLValue] = useState<any>();
  const [tableData, setTableData] = useState<any>([]);
  const [attrColumns, setAttrColumns] = useState<any>([]);
  const [tplTypId, setSqlId] = useState(props.query.tplTypId);
  const [tplTitle, setTplTitle] = useState(props.query.tplTitle);
  const [loading, setLoading] = useState(false);
  const [defaultSelect, setDefaultSelect] = useState(false);
  const [modalVisible, setModalVisible] = useState<any>(false);
  const [rules, setRules] = useState<any>([]);
  const [defaultComponent, setDefaultComponent] = useState<any>([]);
  const [curentEditId, setCurentEditId] = useState<any>();
  const [topButData, setTopButData] = useState<any>([]);
  const [opeButData, setOpeButData] = useState<any>([]);
  const [apiRule, setapiRule] = useState<any>([]);

  useEffect(() => {
    const Func = async () => {
      getSqlDetail(sqlPageLevel);
    };
    Func();
  }, [sqlPageLevel, sqlData]);
  // 获取规则
  const getRules = async () => {
    const resp = await api.getRules();
    if (resp.code === 0) {
      let arr: any = [];
      resp.data.map((item: any) => {
        arr.push({
          parmVal: item.title,  //规则
          parmDesc: item.name,  //规则名称
          parmId: item.id,    //规则id
          unlike: true,
        });
      });

      const loop = (data: any) => {
        return data.map((item: any) => {
          if (item.children.length > 0) {
            loop(item.children)
          }
          item.title = `${item.title} ${item.value}`
          return item
        })
      }
      const arrays: any = loop(resp.data);

      setapiRule(arrays)
      setRules(arr);
    }
  };
  // 初始化
  useMemo(async () => {
    getRules();    //获取规则列表
    let id = props.query.id;
    if (id) {
      setLoading(true);
      let res = await api.getSqlDetail({ id });
      if (res.code === 0) {
        if (res && res.data && res.data.length > 0) {
          res.data[0].intType == '1' ? setDefaultSelect(true) : setDefaultSelect(false);
        }
        props.dispatch({
          type: 'reportFormCreate/setSqlTableData',
          payload: { sqlData: res.data },
        });
        setLoading(false);
      }
    }
  }, []);
  // 获取属性配置字段
  const getAttrList = async (id: string, type: any) => {
    let newArr: any = [];
    let res = await api.getAttrList({ tplTypId, requestType: type });
    if (res.code === 0) {
      res.data.length &&
        res.data.map((item: any) => {
          item.tplAttrDescList.length &&
            item.tplAttrDescList.map((ite: any) => {
              let obj = {
                ...ite,
                title: ite.attrDesc,
                list: ite.tplParmDtos,
                key: ite.attrName,
                dataIndex: ite.attrName,
                align: 'left',
                ellipsis: true,
                width: '110px',
                editable: true,
                type: ite.type,
              };
              if (obj.key == 'componentCode') {
                // obj.editable = false;
              }
              if (obj.key == 'componentAPI') {

                obj.editable = false;
                obj = {
                  ...obj,
                  render: (text: any, record: any, index: number) => {
                    if (record.filterType !== "") {
                      return (
                        <>
                          <a
                            href="javascript:;"
                            onClick={async (text: any) => {
                              setCurentEditId(record.columId)
                              if (sqlPageLevel === 1) {
                                if (record.componentAPI !== "") {
                                  let initAPI = []
                                  let ttt = typeof (record.componentAPI)
                                  ttt == "string" ? (initAPI = JSON.parse(record.componentAPI)) : (initAPI = record.componentAPI)
                                  setDefaultComponent(initAPI)
                                }
                              } else {
                                sqlData.map((item: any, index: any) => {
                                  if (item.attrId === tableColum && index > 0) {
                                    let filterValue = item.intfIttrDescList.find((it: any) => it.columId === record.columId)
                                    let initAPI = []
                                    let ttt = typeof (filterValue.componentAPI)
                                    ttt == "string" && filterValue.componentAPI !== "" ? (initAPI = JSON.parse(filterValue.componentAPI)) : (initAPI = filterValue.componentAPI)
                                    setDefaultComponent(initAPI)
                                  }
                                });
                              }
                              setModalVisible(true);

                            }}
                          >
                            查看/修改
                          </a>
                        </>
                      );
                    }
                  },
                };
              }
              newArr.push(obj);
            });
        });
    }
    let filter =
      (newArr.length &&
        newArr.filter((item: any) => item.attrTyp === '0' || item.attrTyp === '0.5' || item.attrTyp === sqlPageLevel + '')) ||
      [];
    let arr = Array.from(new Set(filter));
    setAttrColumns(arr);

    return arr;
  };
  //输入SQL-解密
  // 获取页面详情
  const getSqlDetail = async (sqlPageLevel: any) => {
    let obj = {};
    let requestType = defaultSelect ? 'API' : 'SQL';
    let arr = await getAttrList('', requestType);
    let newArr = arr ? [...columns, ...arr] : [...columns];
    newArr.map((ite) => {
      ite.key ? (obj[ite.key] = '') : null;
    });
    if (sqlPageLevel === 1) {
      let deVal = Decrypt('1234567890123456', sqlData[sqlPageLevel - 1].intVal);
      sqlData[sqlPageLevel - 1].intVal && setSQLValue(deVal || sqlData[sqlPageLevel - 1].intVal);
      form.setFieldsValue(sqlData[sqlPageLevel - 1]);
      if (sqlData[sqlPageLevel - 1].intVal) {
        setTableData(sqlData[sqlPageLevel - 1].intfIttrDescList);
      }
      (sqlData[sqlPageLevel - 1].intfIttrDescList.length &&
        sqlData[sqlPageLevel - 1].intfIttrDescList.map((item: any) => {
          item = { ...obj, ...item };
        })) ||
        sqlData[sqlPageLevel - 1].intfIttrDescList.push(obj);
      setOpeButData(sqlData[sqlPageLevel - 1].opeBut)
      setTopButData(sqlData[sqlPageLevel - 1].topBut)
    } else {
      sqlData.map((item: any, index: any) => {
        if (item.attrId === tableColum && index > 0) {
          let deVal = Decrypt('1234567890123456', sqlData[index].intVal.replace(/[\r\n]/g, '')); //替换换行符
          setSQLValue(deVal);
          form.setFieldsValue(item);
          setTableData(item.intfIttrDescList);
          item.intfIttrDescList.length &&
            item.intfIttrDescList.map((ite: any, i: number) => {
              item.intfIttrDescList[i] = { ...obj, ...ite };
            });
          setOpeButData(item.opeBut)
          setTopButData(item.topBut)
        }
      });
    }
  };

  const handleDelete = async (key: React.Key) => {
    // await deleteMap(sqlData, key);
    if (sqlPageLevel === 1) {
      const dataSource = sqlData[sqlPageLevel - 1].intfIttrDescList.filter(
        (item: any) => item.columId !== key,
      );
      sqlData[sqlPageLevel - 1].intfIttrDescList = dataSource;
      setTableData(dataSource);
    } else {
      sqlData.map((item: any, index: any) => {
        if (item.attrId === tableColum && index > 0) {
          const dataSource = item.intfIttrDescList.filter(
            (it: any) => it.columId !== key,
          );
          item.intfIttrDescList = dataSource;
          setTableData(dataSource);
        }
      });
    }

    props.dispatch({
      type: 'reportFormCreate/setSqlPageLevel',
      payload: {
        sqlData: [...sqlData],
      },
    });
  };
  const onConfirmSQL = async (type: any) => {
    let jmVal = encryption('1234567890123456', SQLValue);
    let dbNameId = '';
    let intIds = '';
    if (sqlPageLevel === 1) {
      dbNameId = sqlData[sqlPageLevel - 1].dbNameId; //数据库id
      intIds = !!sqlData[sqlPageLevel - 1].intId && sqlData[sqlPageLevel - 1].intId ? sqlData[sqlPageLevel - 1].intId : '';
    } else {
      sqlData.map((item: any, index: any) => {
        if (item.attrId === tableColum && index > 0) {
          dbNameId = item.dbNameId;
          intIds = !!item.intId && item.intId ? item.intId : '';
        }
      });
    }
    let res = await api.analysisSql({
      tplTypId,
      intId: intIds,
      bizId: dbNameId,
    });
    if (res.code === 0) {
      form.validateFields().then(async (val) => {
        let obj = {};
        let newArr = [...columns, ...attrColumns];
        newArr.map((ite) => {
          ite.key ? (obj[ite.key] = '') : null;
        });
        res.data &&
          res.data.mapList.map((item: any, i: number) => {
            res.data.mapList[i] = { ...obj, ...item };
          });
        val.intfIttrDescList = res.data.mapList;
        val.opeBut = res.data.paramList;
        val.topBut = topButData;
        val.intLvl = sqlPageLevel;
        val.attrId = tableColum;
        val.intVal = jmVal;
        val.intId = intIds;
        val.intType = 1;
        val.initDataApi = res.data.initDataApi; //页面下拉框子数据集接口 
        let arr: any = [];
        sqlData.map((item: any, i: any) => {
          if (sqlPageLevel === 1 && i === 0) {
            sqlData[0] = val
          } else if (sqlPageLevel > 1 && item.attrId === val.attrId) {
            sqlData.splice(i, 1)
            arr = [val];
          }
        });
        props.dispatch({
          type: 'reportFormCreate/setSqlTableData',
          payload: { sqlData: [...sqlData, ...arr] },
        });
      });
    } else {
      message.error(
        res.message || (res.status && res.status === 403) ? '权限不足，拒绝访问！' : '未知错误！',
      );
    }
  };
  const deleteMap = async (data: any, key: any) => {
    data.map((item: any, i: number) => {
      if (item.attrId === key) {
        item.intfIttrDescList.length &&
          item.intfIttrDescList.map(async (ite: any) => await deleteMap(data, ite.columId));
        sqlData.splice(i, 1);
      }
    });
    props.dispatch({
      type: 'reportFormCreate/setSqlPageLevel',
      payload: {
        sqlData: [...data],
      },
    });
  };
  const attr_columns: any = [
    {
      title: '属性',
      dataIndex: 'attrName',
      key: 'attrName',
      align: 'left',
      // ellipsis: true,
      width: '40%',
      render: (text: React.ReactNode, record: any) => (
        <div>
          {text}({record.attrDesc})
        </div>
      ),
    },
    {
      title: '参数（说明）',
      dataIndex: 'tplParmDtos',
      key: 'tplParmDtos',
      align: 'left',
      ellipsis: true,
      width: '60%',
      editable: true,
      render: (val: any, record: any) => (
        <div style={{ margin: -8 }}>
          {val.map((item: any, i: number) => (
            <div
              style={{
                borderBottom: i === 2 ? '' : '1px solid #f0f0f0',
              }}
            >
              <div
                style={{
                  padding: '5px 16px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.parmVal && `${item.parmVal}(${item.parmDesc})`}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];
  const [attrIdExp, setAttrIdExp] = useState('');

  // 列表属性配置columns
  const columns: any = [
    {
      title: '序号',
      dataIndex: 'name',
      // key: 'name',
      align: 'center',
      width: 60,
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    {
      title: '表单字段',
      dataIndex: 'tableColum',
      key: 'tableColum',
      align: 'left',
      ellipsis: true,
      width: '180px',
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      key: 'displayName',
      align: 'left',
      ellipsis: true,
      width: '100px',
      editable: true,
    },
    {
      title: '添加sql',
      dataIndex: 'stkCode',
      // key: 'stkCode',
      align: 'left',
      width: '110px',
      render: (text: any, record: any, index: number) => {
        let str: any = '添加';
        sqlData.map((item: any) => {
          if (item.intLvl === sqlPageLevel + 1 && item.attrId.includes(record.columId)) {
            str = '修改';
          }
        });
        return (
          <>
            <a
              href="javascript:;"
              onClick={async (text: any) => {
                if (sqlPageLevel < 5) {
                  let res = {
                    rptName: '',
                    intLvl: sqlPageLevel + 1,
                    intName: '',
                    attrId: record.columId,
                    intVal: '',
                    intfIttrDescList: [],
                    atrName: '',
                    dbNameId: '',
                    tableName: '',
                    topBut: [],
                    opeBut: [],
                  };
                  setAttrIdExp(res.attrId);
                  if (str == '添加') {
                    sqlData.push(res);
                    sqlData.map((item: any) => {
                      if (item.intLvl == sqlPageLevel && item.attrId === record.columId) {
                        item.intVal =
                          '请输入SQL接口：（例）SELECT ID_FFFF FROM (select id ID_FFFF FROM bctp_biz_pos_voucher_manage)n WHERE 1=1';
                      }
                    });
                  }
                  props.dispatch({
                    type: 'reportFormCreate/setSqlPageLevel',
                    payload: {
                      sqlPageLevel: sqlPageLevel + 1,
                      sqlData: [...sqlData],
                      tableColum: record.columId,
                    },
                  });
                } else {
                  message.warn('最多只能添加5级！');
                  return;
                }
              }}
            >
              {str}
            </a>
            {str === '修改' && (
              <a
                href="javascript:;"
                onClick={async () => {
                  if (sqlData.length > 1) {
                    deleteMap(sqlData, record.columId);
                  }
                }}
                style={{ color: 'red', marginLeft: 10 }}
              >
                删除
              </a>
            )}
          </>
        );
      },
    },
    ...attrColumns,
    {
      title: '规则',
      dataIndex: 'code',
      key: 'code',
      align: 'left',
      ellipsis: true,
      editable: true,
      width: '180px',
      type: 'treeSelect',
      list: apiRule,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 80,
      render: (_: any, record: { columId: React.Key }) => (
        <Popconfirm title="确定要删除此行数据吗?" onConfirm={() => handleDelete(record.columId)}>
          <a>删除</a>
        </Popconfirm>
      ),
    },
  ];

  const getModalTableData = (data: any) => {
    let preTableData = tableData
    preTableData.map((item: any) => {
      data.map((ite: any) => {
        if (item.columId == ite.rid) {
          item.componentAPI = ite.compData
          item.componentCode = " "
        }
      })
    })
    setTableData(preTableData)
  }
  const getModalVisible = (zf: any) => {
    setModalVisible(zf)
  }


  const getDetailByIntId = async (v: any) => {
    let intId =
      (intfList.length && intfList.filter((item: any) => item.intName === v)[0].intId) || null;
    if (intId) {
      setLoading(true);
      let res = await api.getDetailByIntId({ intId });
      if (res.code === 0) {
        let n = sqlData.filter((item: any) => item.intLvl == 1)[0].rptName || '';
        res.data.length &&
          res.data.reverse().map((item: any, index) => {
            item.intfIttrDescList.reverse();
            if (item.intLvl === 1 && index == 0) {
              item.rptName = n;
            }
          });
        props.dispatch({
          type: 'reportFormCreate/setSqlTableData',
          payload: { sqlData: res.data.reverse() },
        });
        setLoading(false);
      }
    }
  };

  const colLayout10 = {
    xl: 11,
    md: 24,
  };

  const colLayout11 = {
    xl: 8,
    md: 24,
  };
  const colLayout12 = {
    xl: 6,
    md: 24,
  };

  return (
    <Card
      // style={{ height: `calc(100vh - ${10}px)` }}
      style={{ paddingBottom: 30 }}
      loading={loading}>
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          padding: '0 0px 8px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          marginTop: -10,
          marginBottom: '10px',
        }}
      >
        {tplTitle ? `${tplTitle}` : null}
      </div>

      <div style={{ paddingTop: 10 }}>
        <Form
          ref={ref}
          form={form}
          style={{ margin: '0 0 12px' }}
          labelCol={{ xl: { span: sqlPageLevel === 1 ? 3 : 4, offset: 0 } }}
          wrapperCol={{
            md: 24,
            xl: 22,
          }}
        >
          <Row className="rowStyle" style={{ marginTop: 12 }}>
            <Col {...colLayout11} style={{ display: 'none' }}>
              <Form.Item
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                label="接口名称"
                name="intName"
                rules={sqlPageLevel === 1 ? [{ required: false, message: '主接口必填！' }] : []}
              >
                {sqlPageLevel === 1 ? (
                  <AutoComplete
                    dataSource={intfList}
                    children={<Input />}
                    onSelect={(v: any) => {
                      getDetailByIntId(v);
                    }}
                    onChange={(v) => {
                      sqlData.length &&
                        sqlData.map((item: any) => {
                          if (item.intLvl === sqlPageLevel) {
                            item.intName = v;
                          }
                        });
                      props.dispatch({
                        type: 'reportFormCreate/setSqlPageLevel',
                        payload: {
                          sqlData: [...sqlData],
                        },
                      });
                    }}
                  />
                ) : (
                  <Input
                    onChange={(value) => {
                      sqlData.length &&
                        sqlData.map((item: any, index: any) => {
                          if (item.intLvl === sqlPageLevel && item.attrId === attrIdExp) {
                            item.intName = value.target.value;
                          }
                        });
                      props.dispatch({
                        type: 'reportFormCreate/setSqlPageLevel',
                        payload: {
                          sqlData: [...sqlData],
                        },
                      });
                    }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col {...colLayout12} style={sqlPageLevel !== 1 ? { display: 'none' } : {}}>
              <Form.Item
                label="标题"
                name="rptName"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                rules={sqlPageLevel === 1 ? [{ required: true, message: '标题必填！' }] : []}
              >
                <Input
                  placeholder="请输入"
                  onChange={(v) => {
                    sqlData.length &&
                      sqlData.map((item: any) => {
                        if (item.intLvl === sqlPageLevel) {
                          item.rptName = v.target.value;
                        }
                      });
                    props.dispatch({
                      type: 'reportFormCreate/setSqlPageLevel',
                      payload: {
                        sqlData: [...sqlData],
                      },
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col {...colLayout10}>
              <Form.Item
                label="选择API接口"
                name="dbNameId"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                rules={[{ required: true, message: '请选择规则' }]}
              >
                <TreeSelect
                  showSearch
                  treeNodeFilterProp="title"
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择API接口"
                  treeDefaultExpandAll
                  treeData={apiRule}
                  fieldNames={{ label: 'title', value: 'key', children: 'children' }}
                  onSelect={(value: any, node: any) => {
                    setSQLValue(node.value)
                    sqlData.length &&
                      sqlData.map((item: any) => {
                        if (sqlPageLevel === 1) {
                          item.dbNameId = node.key;
                          item.intVal = encryption('1234567890123456', node.value);
                        } else {
                          if (item.intLvl === sqlPageLevel && item.attrId === attrIdExp) {
                            item.dbNameId = node.key;
                            item.intVal = encryption('1234567890123456', node.value);
                          }
                        }
                      });
                  }}
                >

                </TreeSelect>
              </Form.Item>
            </Col>
            <Col {...colLayout12}>
              <Form.Item
                label="下拉框list接口"
                name="initDataApi"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
              >
                <Input
                  placeholder="请输入"
                  onChange={(v) => {
                    sqlData.length &&
                      sqlData.map((item: any) => {
                        if (sqlPageLevel === 1) {
                          item.initDataApi = v.target.value;
                        } else {
                          if (item.intLvl === sqlPageLevel && item.attrId === attrIdExp) {
                            item.initDataApi = v.target.value;
                          }
                        }
                      });
                    props.dispatch({
                      type: 'reportFormCreate/setSqlPageLevel',
                      payload: {
                        sqlData: [...sqlData],
                      },
                    });
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
            <div style={{ width: `25%` }}>
              <div style={{ fontSize: 16, margin: '0 0 0 12px' }}>属性说明</div>
              <Input placeholder="搜索属性" style={{ marginBottom: 5 }} />
              <Table
                size="small"
                bordered
                columns={attr_columns}
                dataSource={attrColumns}
                pagination={false}
                scroll={{ y: 600 }}
              />
            </div>
            <div style={{ width: '75%', marginLeft: '20px' }}>
              <Row className="rowStyle" style={{ marginTop: 12 }}>
                <Col {...colLayout11}>
                  <Button type="primary" onClick={() => onConfirmSQL(2)}>
                    检查
                  </Button>
                </Col>
              </Row>
              <Divider dashed style={{ margin: '12px 0' }} />
              <div style={{ margin: '9px 12px', fontSize: 16 }}>属性配置</div>
              <div>
                <EditTable columns={columns} dataSource={tableData} />
              </div>
              <Divider dashed style={{ margin: '12px 0' }} />
              <div>
                <ButtonEditTable buttonName="添加按钮" butTableData={topButData}
                />
              </div>
              <Divider dashed style={{ margin: '12px 0' }} />
              <div>
                <ButtonEditTable buttonName="接口参数" butTableData={opeButData} />
              </div>
            </div>
          </div>
        </Form>
      </div>
      {
        modalVisible &&
        <CustEditTable initDefault={defaultComponent} totalTable={tableData} curentEditId={curentEditId} getModalTableData={getModalTableData} modalVisible={modalVisible} getModalVisible={getModalVisible} />
      }

    </Card>
  );
};
const WrappedForm = forwardRef(ChoiceSQLComp);
export default connect(
  ({
    reportFormCreate,
    loading,
    user,
  }: {
    reportFormCreate: IndexModelState;
    loading: Loading;
    user: any;
  }) => ({
    reportFormCreate,
    loading: loading.models.reportFormCreate,
    user,
  }),
)(WrappedForm);
