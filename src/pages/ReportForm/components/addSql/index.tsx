import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import TableSearchForm, { TableSearchFormInstance } from '@/components/TableSearchForm';
import {
  Card,
  Select,
  Input,
  Table,
  Form,
  Row,
  Col,
  Button,
  Space,
  Popconfirm,
  Divider,
  Cascader,
  message,
} from 'antd';
import {
  colLayout1,
  formItemLayout1,
  colLayout2,
} from '@/theme/default/layout/formLayout/formLayout';
import '@/theme/default/common.less';
import BottomAffix from '@/components/BottomAffix';
import { IndexModelState, Loading, connect } from 'umi';
// import { LOCAL_STORE_KEYS } from '@/utils/constant';
import EditTable from './../../components/editTable/index';
import api from './service';
import { encryption, Decrypt } from '@/utils/stringUtil';

import styles from './styles.less';

// 新增，编辑SQL接口

const { Option } = Select;
const { TextArea } = Input;

const TableList: React.FC<{}> = (props: any) => {
  const { addSqlTableData } = props.reportFormCreate;
  const [form] = Form.useForm();
  const pageTable = useRef<any>(null);
  const [SQLValue, setSQLValue] = useState<any>(
    '请输入SQL接口：（例）SELECT user_name userName_ffff,nick_name nickName_ffff from bas_usr',
  );
  const [detail, setDetail] = useState<any>();
  const [tableData, setTableData] = useState<any>([]);
  const [typeList, setTypeList] = useState<any>([]);
  const [attrColumns, setAttrColumns] = useState<any>([]);
  const [intId, setIntid] = useState(props.location.query.id);

  useEffect(() => {
    const Func = async () => {
      await getTypeList();
    };
    Func();
  }, []);
  useEffect(() => {
    const Func = async () => {
      getSqlDetail();
    };
    Func();
  }, [typeList]);

  // 获取页面详情
  const getSqlDetail = async () => {
    let res: any = await api.getDetailById({ id: intId });
    // tplId

    if (res.code === 0) {
      // 获取属性配置字段
      getAttrList({ tplTypId: res.data.tplId });
      let arr: any = [];
      typeList.length > 0 &&
        typeList.map((item: any) => {
          item.children.length > 0 &&
            item.children.map((ite: any) => {
              if (ite.value === res.data.tplId) {
                arr = [item.value, ite.value];
              }
            });
        });
      res.data.tplId = arr;
      setDetail(res.data);
      let deVal = Decrypt('1234567890123456', res.data.intVal);
      setSQLValue(deVal);
      setTableData(res.data.intfIttrDescList.reverse());
      form.setFieldsValue(res.data);
    }
  };
  // 获取模板类型
  const getTypeList = async () => {
    let res = await api.fetchTempTypeList();
    if (res.code === 0) {
      let arr = fixData(res.data);

      setTypeList(arr);
    }
  };
  // 处理返回的模板类型树
  const fixData = (data: any) => {
    data.map((item: any) => {
      if (!item.children || item.children.length < 1) {
        item.disabled = true;
      }
    });
    return data;
  };
  const handleDelete = async (key: React.Key) => {
    const dataSource = tableData.filter((item: any) => item.columId !== key);
    setTableData(dataSource);
    // props.dispatch({
    //   type: 'reportFormCreate/setSqlPageLevel',
    //   payload: {
    //     sqlData: [...sqlData],
    //   },
    // });
  };
  const save = () => {
    // console.log(tableData);
    form.validateFields().then(async (val) => {
      let obj = { ...detail, ...val };
      let jmVal = encryption('1234567890123456', SQLValue);
      obj.intfIttrDescList = addSqlTableData;

      obj.intVal = jmVal;
      obj.tplId = form.getFieldValue('tplId')[1];
      let res = await api.addOrUpdate(obj);

      if (res.code === 0) {
        message.success(res.message);
      } else {
        message.error(res.message || res.status);
      }
    });
  };
  const onConfirmSQL = async () => {
    // console.log(SQLValue);
    let tplTypId = form.getFieldValue('tplId');
    let jmVal = encryption('1234567890123456', SQLValue);
    let res = await api.analysisSql({ intVal: jmVal, tplTypId: tplTypId[1] });
    if (res.code === 0) {
      form.validateFields().then(async (val) => {
        let obj = {};
        let newArr = [...columns, ...attrColumns];
        newArr.map((ite) => {
          ite.key ? (obj[ite.key] = '') : null;
        });
        res.data.mapList.map((item: any, i: number) => {
          res.data.mapList[i] = { ...obj, ...item };
        });
        // val.intfIttrDescList = res.data.mapList;

        // val.intLvl = form.getFieldValue('intLvl');
        // val.attrId = '';
        // val.intVal = SQLValue;

        // let arr = [val];
        // debugger;
      });
    } else {
      message.error(
        res.message || (res.status && res.status === 403) ? '权限不足，拒绝访问！' : '未知错误！',
      );
    }
  };
  // 获取属性配置字段
  const getAttrList = async (id: object) => {
    let newArr: any = [];
    let res = await api.getAttrList(id);
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
              newArr.push(obj);
            });
        });
      // console.log(newArr);
    }
    // let filter =
    //   (newArr.length &&
    //     newArr.filter((item: any) => item.attrTyp === '0' || item.attrTyp === sqlPageLevel + '')) ||
    //   [];
    // let arr = Array.from(new Set(filter));
    setAttrColumns(newArr);
  };
  const attr_columns: any = [
    {
      title: '属性（说明）',
      dataIndex: 'attrName',
      key: 'attrName',
      align: 'left',
      ellipsis: true,
      width: '50%',
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
      width: '50%',
      editable: true,
      render: (val: any, record: any) => (
        <div style={{ margin: -8 }}>
          {val.map((item: any, i: number) => (
            <div
              style={{
                borderBottom: i === 2 ? '' : '1px solid #f0f0f0',
              }}
            >
              <div style={{ padding: '5px 16px' }}>
                {item.parmVal && `${item.parmVal}(${item.parmDesc})`}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

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
      width: 180,

      // render: (val: React.ReactNode, record: any) => (
      //   <a
      //     onClick={() => {
      //       setDetailVisible(true);
      //       setDetailData(record);
      //     }}
      //   >
      //     {' '}
      //     {val}
      //   </a>
      // ),
    },
    {
      title: '显示名称',
      dataIndex: 'displayName',
      key: 'displayName',
      align: 'left',
      ellipsis: true,
      width: 180,
      editable: true,
    },
    // {
    //   title: '跳转链接',
    //   dataIndex: 'linkPath',
    //   key: 'linkPath',
    //   align: 'left',
    //   ellipsis: true,
    //   width: '120px',
    //   editable: true,
    // },

    ...attrColumns,
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: { key: React.Key }) => (
        <Popconfirm title="确定要删除此行数据吗?" onConfirm={() => handleDelete(record.key)}>
          <a>删除</a>
        </Popconfirm>
      ),
    },
  ];

  // 模板类型选择后如何渲染
  const displayRender = (label: any) => {
    return label[label.length - 1];
  };
  // 模板类型选择触发
  const onChange = (v: any) => {
    let id = v[v.length - 1];
    getAttrList({ tplTypId: id });
    // debugger;
  };
  return (
    <div style={{ margin: '12px 16px' }}>
      {/* {detailVisible?<InstitutionalView visible={detailVisible} id={detailData.companyId} institutionLabel="数据来源" onClose={() => setDetailVisible(false)} />:undefined} */}

      <Card style={{ height: `calc(100vh - ${135}px)` }}>
        <Form
          form={form}
          style={{ margin: '0 0 12px' }}
          labelCol={{ xl: { span: 3, offset: 0 } }}
          wrapperCol={{
            md: 20,
            xl: 18,
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              padding: '0 0px 8px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              marginTop: -10,
            }}
          >
            编辑接口
          </div>
          <Row className="rowStyle" style={{ margin: '12px 0 0 0px' }}>
            <Col {...colLayout1}>
              <Form.Item label="模板类型：" name="tplId">
                <Cascader
                  fieldNames={{ label: 'title' }}
                  options={typeList}
                  expandTrigger="hover"
                  // displayRender={displayRender}
                  onChange={onChange}
                />
                {/* <Select placeholder="请选择" onChange={() => {}}>
                  {typeList.map((item) => (
                    <Option value={item}>{item}</Option>
                  ))}
                </Select> */}
              </Form.Item>
            </Col>
            <Col {...colLayout1}>
              <Form.Item
                label="级别"
                name="intLvl"
                wrapperCol={{
                  md: 20,
                  xl: 18,
                }}
              >
                <Select placeholder="请选择" onChange={() => { }}>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Option value={item}>{item}级</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row className="rowStyle">
            <Col {...colLayout1}>
              <Form.Item label="标题：" name="intName">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col {...colLayout1}>
              <Form.Item label="编码：" name="intCode">
                <Input placeholder="请输入" disabled={true} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '30%' }}>
            <div style={{ fontSize: 16, margin: '12px 0 0 12px' }}>属性说明</div>

            <Table
              size="small"
              className={styles.attr}
              bordered
              columns={attr_columns}
              dataSource={attrColumns}
              pagination={false}
            />
          </div>

          <div style={{ width: '100%', marginLeft: 12 }}>
            <div style={{ fontSize: 16, margin: '12px 0 0 12px' }}>输入SQL</div>
            <TextArea
              value={SQLValue}
              onChange={(v) => setSQLValue(v.target.value)}
              placeholder="请输入SQL接口：（例）SELECT user_name userName_ffff,nick_name nickName_ffff from bas_usr"
              autoSize={{ minRows: 8, maxRows: 12 }}
              style={{ background: '#F2F2F2' }}
            />

            <div style={{ margin: '6px 12px ' }}>
              <Button type="primary" onClick={() => onConfirmSQL()}>
                确定
              </Button>
            </div>
            <Divider dashed />
            <div style={{ margin: '6px 12px', fontSize: 16 }}>属性配置</div>
            <EditTable
              columns={columns}
              dataSource={tableData}
              from="addSql"
            // saveSource={(v: []) => setTableData(v)}
            />
          </div>
        </div>
        <BottomAffix>
          <Space>
            <Button
              style={{ width: '10vw', borderRadius: 6, height: 32 }}
              onClick={() => {
                window.history.go(-1);
              }}
            >
              返回
            </Button>
            <Button
              onClick={() => save()}
              type="primary"
              style={{ width: '10vw', borderRadius: 6, height: 32 }}
            >
              提交
            </Button>
          </Space>
        </BottomAffix>
      </Card>
    </div>
  );
};

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
)(TableList);
