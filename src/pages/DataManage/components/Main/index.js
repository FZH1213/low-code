// 右侧主体内容区域
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Form,
  Tree,
  Input,
  Space,
  Typography,
  Modal,
  Spin,
  Select,
  Row,
  Col,
  Table,
  Tag,
  Drawer,
  Popconfirm,
  Pagination,
  message,
  Upload,
} from 'antd';

import styles from './styles.less';

// import baseUrl from '../../../../../config';

import {
  EditOutlined,
  RedoOutlined,
  SearchOutlined,
  UploadOutlined,
  PlusOutlined,
  AreaChartOutlined,
} from '@ant-design/icons';

import { getDataDetail, getTableList, updata, deleteTable, refreshTableDataApi } from './service';

// 导入数据库详情编辑弹框
import DataEditModal from './components/DataEditModal';

// 导入模拟数据
import { mockData } from './mockData/mockData';

import AddTableModal from './components/AddTableModal';

import EditTableModal from './components/EditTableModal';
import ErModal from './components/ErModal';

const Main = (props) => {
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [DataEditModalVisible, setDataEditModalVisible] = useState(false);

  const [dataTableData, setDataTableData] = useState(null);

  const [dataSourceDetail, setDataSourceDetail] = useState(null);

  // 头部数据库详情加载标志位
  const [topLoading, setTopLoading] = useState(false);

  // 每页条数
  const [limit, setLimit] = useState(10);

  // 当前页数
  const [page, setPage] = useState(1);

  // 表格数据总数
  const [total, setTotal] = useState(0);

  // ddl 展示抽屉 显示标志位
  const [ddlVisible, setDdlVisible] = useState(false);

  // 选择的 展示 的ddl 数据
  const [ddlShowData, setDdlShowData] = useState(null);

  // 搜索表单数据
  const [searchData, setSearchData] = useState(null);

  // 添加表弹框显示标志位
  const [addTableModalVisible, setAddTableModalVisible] = useState(false);

  // 添加表弹框显示标志位
  const [editTableModalVisible, setEditTableModalVisible] = useState(false);

  const [tableFormData, setTableFormData] = useState(null);

  // er图弹窗
  const [erModalVisible, setErModalVisible] = useState(false);

  // 搜索数据改变的时候，触发请求分页数据
  useEffect(() => {
    if (searchData != null) {
      // debugger;
      let params = null;

      if (searchData == null) {
        // debugger;
        params = { dataSourceId: `${props.selectedKeys}`, limit: 10, page: 1 };
      } else {
        // debugger;
        // params = Object.assign(
        //   {},
        //   {
        //     dataSourceId: `${props.selectedKeys}`,
        //     limit: 10,
        //     page: 1,
        //     state: searchData.state != null ? searchData.state : null,
        //     tableName: searchData.tableName != null ? searchData.tableName : '',
        //   },
        //   // searchData,
        // );

        params = { dataSourceId: `${props.selectedKeys}`, limit: 10, page: 1 };

        if (searchData.state != null) {
          params = { ...params, state: searchData.state };
        }

        if (
          searchData.tableName != null &&
          searchData.tableName.length != null &&
          !!searchData.tableName.length
        ) {
          params = { ...params, tableName: searchData.tableName };
        }
      }

      console.log('params =>', params);
      // debugger;

      // 添加排序字段
      params.order = 'desc';

      params.sort = 'gmt_create';

      getTableList(params).then((res) => {
        console.log('根据数据库id，获取库表列表 =>', res);
        if (res.code === 0) {
          setDataTableData(res.data.records);
          setTotal(res.data.total);
          setPage(res.data.page);
        }
      });
    }
  }, [searchData]);

  const finishEdit = () => {
    if (props.selectedKeys != null) {
      setTopLoading(true);

      setTimeout(() => {
        setTopLoading(false);
      }, 5000);
      console.log('props =>', props.selectedKeys);
      // 触发重渲染，loading 标志展示

      // 触发请求，根据选中数据库 id 获取数据库 相关数据
      getDataDetail(`${props.selectedKeys}`).then((res) => {
        console.log('根据数据库id， 获取详情 =>', res);
        setTopLoading(false);
        if (res.code === 0) {
          setDataSourceDetail(res.data);
        }
      });
    }

    // 再调用父组件方法，刷新树状图
    props.refreshTree && props.refreshTree();
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     setDataTableData(mockData);
  //   }, 200);
  // }, []);

  useEffect(() => {
    console.log('dataTableData =>', dataTableData);
  }, [dataTableData]);

  useEffect(() => {
    if (props.selectedKeys != null) {
      setTopLoading(true);

      setTimeout(() => {
        setTopLoading(false);
      }, 5000);
      console.log('props =>', props.selectedKeys);
      // 触发重渲染，loading 标志展示

      // 触发请求，根据选中数据库 id 获取数据库 相关数据
      getDataDetail(`${props.selectedKeys}`).then((res) => {
        console.log('根据数据库id， 获取详情 =>', res);
        setTopLoading(false);
        if (res.code === 0) {
          setDataSourceDetail(res.data);
        }
      });

      // 重置页码状态
      setLimit(10);

      setPage(1);

      // 获取数据源下的库表的列表数据
      getTableList({
        dataSourceId: `${props.selectedKeys}`,
        limit: 10,
        page: 1,
        order: 'desc',
        sort: 'gmt_create',
      }).then((res) => {
        console.log('根据数据库id，获取库表列表 =>', res);
        if (res.code === 0) {
          setDataTableData(res.data.records);
          setTotal(res.data.total);
        }
      });
    }
  }, [props.selectedKeys]);

  //   打开数据库编辑弹框
  const openDataEditModal = () => {
    console.log('打开数据库编辑弹框');
    setDataEditModalVisible(true);
  };

  //   关闭数据库编辑弹框
  const closeDataEditModal = () => {
    setDataEditModalVisible(false);
  };

  const getDataDetailItemRender = (label, value, flexValue) => {
    return (
      <div
        style={{
          fontSize: '14px',
          flex: flexValue != null ? flexValue : '1',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          marginTop: '6px',
          marginBottom: '6px',
        }}
      >
        <span
          style={{
            color: '#999',
          }}
        >
          {label}
        </span>
        <span>{value}</span>
      </div>
    );
  };

  // 打开 ddl 展示抽屉
  const openDdlDrawer = (row) => {
    console.log('row =>', row);
    setDdlVisible(true);
    setDdlShowData(row.createTable);
  };

  // 关闭ddl展示抽屉
  const closeDdlDrawer = () => {
    setDdlVisible(false);
    setDdlShowData(null);
  };

  // 打开编辑表窗口
  const openTableEditModal = (row) => {
    setEditTableModalVisible(true);
    setTableFormData(row);
  };

  // 关闭编辑表窗口
  const closeTableEditModal = () => {
    setEditTableModalVisible(false);
    setTableFormData(null);
  };

  const closeErModal = () => {
    setErModalVisible(false);
  };

  // 改变状态
  const changeItemStatus = (status, row) => {
    console.log(status);
    console.log(row);

    updata({
      createTable: row.createTable,
      dataSourceId: row.dataSourceId,
      id: row.id,
      state: status,
      tableName: row.tableName,
    }).then((res) => {
      if (res.code === 0) {
        // 直接改变本地数据，相当于状态保存
        let copyData = [...dataTableData];

        let resData = [];

        resData = copyData.map((item) => {
          if (item.id === row.id) {
            return {
              ...item,
              state: status,
            };
          } else {
            return item;
          }
        });

        console.log('resData =>', resData);

        setDataTableData(resData);
      }
    });
  };

  // 删除 表单 项
  const deleteTableItem = (row) => {
    console.log('row =>', row);

    deleteTable({ id: row.id }).then((res) => {
      if (res.code === 0) {
        message.success('删除成功！');
        // 刷新列表

        // 添加排序字段
        // params.order = 'desc';

        // params.sort = 'gmt_create';
        // fetch
        getTableList({
          dataSourceId: `${props.selectedKeys}`,
          limit: 10,
          page: page,
          order: 'desc',
          sort: 'gmt_create',
        }).then((res) => {
          console.log('根据数据库id，获取库表列表 =>', res);
          if (res.code === 0) {
            setDataTableData(res.data.records);
            setTotal(res.data.total);
            setPage(res.data.page);
          }
        });
      } else {
        message.error('服务器繁忙，请稍后再试！');
      }
    });
  };

  const dataColumns = [
    {
      title: '表名称',
      dataIndex: 'tableName',
      ellipsis: true,
    },
    {
      title: '创建日期',
      dataIndex: 'gmtCreate',
      width: '160px',
      render: (value) => {
        return <span>{value.slice(0, 16)}</span>;
      },
    },
    // {
    //   title: '备注',
    //   dataIndex: 'backup',
    //   ellipsis: true,
    // },
    {
      title: '表状态',
      dataIndex: 'state',
      width: '100px',
      render: (val) => {
        return <div>{val === 1 ? <Tag color="green">启用</Tag> : <Tag color="red">停用</Tag>}</div>;
      },
    },
    {
      title: '操作',
      dataIndex: 'tableName',
      width: '240px',
      render: (val, row) => {
        return (
          <div
            style={{
              display: 'flex',
            }}
          >
            <div
              style={{
                flex: '1',
              }}
              onClick={() => {
                openDdlDrawer(row);
              }}
            >
              <a>DDL展示</a>
            </div>
            <div
              style={{
                flex: '1',
                textAlign: 'center',
              }}
              onClick={() => {
                openTableEditModal(row);
              }}
            >
              <a>编辑</a>
            </div>
            <div
              style={{
                flex: '1',
                textAlign: 'center',
              }}
            >
              <Popconfirm
                title={`确定要停用吗?`}
                okText="确认"
                cancelText="关闭"
                onConfirm={() => {
                  deleteTableItem(row);
                }}
              >
                <a
                  style={
                    {
                      // marginLeft: '16px',
                    }
                  }
                >
                  删除
                </a>
              </Popconfirm>
            </div>
            <div
              style={{
                flex: '1',
                textAlign: 'center',
              }}
            >
              {row.state === 1 ? (
                <>
                  <span>
                    <Popconfirm
                      title={`确定要停用吗?`}
                      okText="确认"
                      cancelText="关闭"
                      onConfirm={() => {
                        // changeItemStatus(val == 1 ? 0 : 1);
                        changeItemStatus(0, row);
                      }}
                    >
                      <a>停用</a>
                    </Popconfirm>
                  </span>
                </>
              ) : (
                <>
                  <span>
                    <Popconfirm
                      title={`确定要启用吗?`}
                      okText="确认"
                      cancelText="关闭"
                      onConfirm={() => {
                        // changeItemStatus(val == 1 ? 0 : 1);
                        changeItemStatus(1, row);
                      }}
                    >
                      <a>启用</a>
                    </Popconfirm>
                  </span>
                </>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  const onTableSearch = () => {
    console.log('搜索 =>', formRef.current.getFieldsValue());

    let formData = formRef.current.getFieldsValue();

    console.log({
      tableName: formData.tableName,
      state: formData.tableStatus,
    });

    setSearchData({
      tableName: formData.tableName,
      state: formData.tableStatus,
    });
  };

  // 重置搜索
  const onResetTable = () => {
    console.log('重置');
    setSearchData({});

    formRef.current.setFieldsValue({});
    formRef.current.resetFields();
  };

  // 关闭添加表弹框
  const closeAddTableModal = () => {
    setAddTableModalVisible(false);
  };

  const refreshTable = () => {
    onResetTable();
  };

  // 后台刷新
  const refreshTableData = () => {
    refreshTableDataApi({ id: `${props.selectedKeys}` }).then((res) => {
      if (res.code === 0) {
        message.success('刷新成功！');
        refreshTable();
      } else {
        message.error('服务器繁忙，请稍后再试！');
      }
    });
  };

  const clusterUpload = {
    name: 'file',
    // action: url.IMPORT_EVILIPS,
    // action: `${baseUrl}/test`,

    action: () => {
      return new Promise((resolve, reject) => {
        console.log('参数id =>', props.selectedKeys);

        resolve(`http://192.168.30.108:8000/api/bpm/dataDdl/import/sql`);
      });
    },

    showUploadList: false,
    data: (file) => {
      console.log('上传文件file =>', file);

      return {
        // sqlFile: file.name,
        id: props.selectedKeys,
      };
    },

    // method: 'post',

    headers: {
      Authorization: `Bearer ${window.localStorage.getItem('access_token')}`,
    },
    beforeUpload: (file, fileList) => {
      // 将加载标志位置为true
      console.log('before-file', file);
      console.log('before-fileList', fileList);
    },
    onChange: (info) => {
      console.log('info', info);
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name}导入成功`);

        // 刷新页面，返回第一页
        refreshTableData();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name}导入失败`);
      }
    },
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 表添加弹框 */}
      {addTableModalVisible && (
        <>
          <AddTableModal
            visible={addTableModalVisible}
            onClose={closeAddTableModal}
            id={props.selectedKeys}
            refreshTable={refreshTable}
          ></AddTableModal>
        </>
      )}
      {editTableModalVisible && (
        <>
          <EditTableModal
            visible={editTableModalVisible}
            onClose={closeTableEditModal}
            id={props.selectedKeys}
            refreshTable={refreshTable}
            tableFormData={tableFormData}
          ></EditTableModal>
        </>
      )}
      {/* ddl 数据展示抽屉 */}
      {ddlVisible && (
        <>
          <Drawer visible={ddlVisible} onClose={closeDdlDrawer} title="DDL">
            <div>{ddlShowData}</div>
          </Drawer>
        </>
      )}

      {/* 头部数据库详情展示 */}
      <div>
        <div
          style={{
            fontSize: '18px',
            fontWeight: '18px',
            height: '48px',
            lineHeight: '48px',
            borderBottom: '1px solid #f1f1f4',
          }}
        >
          <span
            style={{
              fontWeight: 'bold',
              marginLeft: '16px',
            }}
          >
            数据库详情
          </span>
          <span
            style={{
              fontSize: '12px',
              color: 'rgb(24, 144, 255)',
              fontWeight: 'bold',
              marginLeft: '16px',
            }}
          >
            <EditOutlined
              style={{
                fontSize: '14px',
                cursor: 'pointer',
              }}
              onClick={() => {
                openDataEditModal();
              }}
            />
            <span
              style={{
                cursor: 'pointer',
              }}
              onClick={() => {
                if (dataSourceDetail != null) {
                  openDataEditModal();
                }

                console.log('当前编辑数据 =>', dataSourceDetail);
              }}
            >
              编辑
            </span>
          </span>
        </div>
        {/* 数据库详情展示 */}
        {topLoading != null && topLoading === true ? (
          <>
            <div
              style={{
                height: '88px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Spin spinning={true}></Spin>
            </div>
          </>
        ) : (
          <>
            {dataSourceDetail != null ? (
              <>
                <div
                  style={{
                    padding: '10px 16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    {getDataDetailItemRender('数据库名称：', dataSourceDetail.dbName, '2')}
                    {/* {getDataDetailItemRender('端口：', '10000')} */}
                    {getDataDetailItemRender('IP：', dataSourceDetail.ip)}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    {getDataDetailItemRender(
                      '数据库类型：',
                      dataSourceDetail.dbType === '1' ? 'Mysql' : 'Hive',
                    )}
                    {getDataDetailItemRender(
                      '数据来源：',
                      dataSourceDetail.dbType === '1' ? 'Mysql数据库' : 'Hive数据库',
                    )}
                    {getDataDetailItemRender('端口：', dataSourceDetail.port)}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    padding: '10px 16px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '88px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#888',
                    }}
                  >
                    请选择数据源
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      {/* 中间的分隔灰色背景 */}
      <div
        style={{
          height: '16px',
          backgroundColor: '#f1f2f4',
        }}
      ></div>
      {/* 底部库表展示 */}
      <div
        style={{
          flex: '1',
          //   paddingLeft: '16px',
          //   paddingRight: '16px',
        }}
      >
        {/* 头部搜索 */}
        <div
          style={{
            display: 'flex',
            border: '1px solid #f1f2f4',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          <div
            style={{
              flex: '1',
            }}
          >
            <Form ref={formRef}>
              <Row
                style={{
                  height: '64px',
                  lineHeight: '64px',
                  paddingTop: '16px',
                }}
              >
                <Col
                  span={16}
                  style={{
                    paddingRight: '24px',
                  }}
                >
                  <Form.Item name="tableName" label="表名">
                    <Input></Input>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="tableStatus" label="表状态">
                    <Select>
                      <Select.Option key={1} value={1}>
                        启用
                      </Select.Option>
                      <Select.Option key={0} value={0}>
                        禁用
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div
            style={{
              flex: '0 0 200px',
              paddingLeft: '16px',
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'row-reverse',
            }}
            className={styles.self_button_1}
          >
            <Button
              type="ghost"
              onClick={() => {
                onResetTable();
              }}
            >
              重置
            </Button>
            <Button
              type="primary"
              style={{
                marginRight: '8px',
              }}
              icon={<SearchOutlined />}
              onClick={() => {
                onTableSearch();
              }}
            >
              查询
            </Button>
          </div>
        </div>

        {/* 底部表格 */}
        <div
          style={{
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          {/* 表格头部 */}
          <div
            style={{
              paddingTop: '16px',
              paddingBottom: '16px',
              display: 'flex',
            }}
          >
            <Button
              style={{
                marginRight: '8px',
              }}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setAddTableModalVisible(true);
              }}
            >
              添加表
            </Button>
            <div className={styles.self_button_2}>
              <Upload {...clusterUpload}>
                <Button
                  style={{
                    marginRight: '8px',
                  }}
                  type="primary"
                  icon={<UploadOutlined />}
                >
                  导入表
                </Button>
              </Upload>
            </div>
            <div className={styles.self_button_3}>
              <Button
                style={{
                  marginRight: '8px',
                }}
                type="ghost"
                icon={<RedoOutlined />}
                className={styles.self_button_3}
                onClick={() => {
                  refreshTableData();
                }}
              >
                刷新
              </Button>
            </div>
            <div className={styles.self_button_3}>
              <Button
                style={{
                  marginRight: '8px',
                }}
                type="primary"
                icon={<AreaChartOutlined />}
                className={styles.self_button_3}
                onClick={() => {
                  setErModalVisible(true);
                }}
              >
                查看ER图
              </Button>
            </div>
          </div>
          {/* 表格 */}
          <div
            style={{
              position: 'relative',
            }}
          >
            <div
              style={{
                height: 'calc(100vh - 440px)',
                // border: '1px solid #f1f2f4',
                overflow: 'hidden',
              }}
            >
              <div className={styles.table_wrapper}>
                <div>
                  {dataTableData != null && dataTableData.length != null && !!dataTableData.length && (
                    <Table
                      // hideOnSinglePage={true}
                      columns={dataColumns}
                      bordered={true}
                      size="small"
                      dataSource={dataTableData}
                      pagination={false}
                    ></Table>
                  )}
                </div>
              </div>
            </div>
            {/* 分页 */}
            <div
              style={{
                bottom: '-60px',
                height: '54px',
                lineHeight: '54px',
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'row-reverse',
                width: '100%',
                paddingTop: '12px',
              }}
            >
              <Pagination
                hideOnSinglePage={true}
                total={total}
                current={page}
                showTotal={(total) => `共${total}条`}
                onChange={(p) => {
                  let params = null;

                  if (searchData == null) {
                    params = { dataSourceId: `${props.selectedKeys}`, limit: 10, page: p };
                  } else {
                    params = { dataSourceId: `${props.selectedKeys}`, limit: 10, page: p };

                    if (searchData.state != null) {
                      params = { ...params, state: searchData.state };
                    }

                    if (
                      searchData.tableName != null &&
                      searchData.tableName.length != null &&
                      !!searchData.tableName.length
                    ) {
                      params = { ...params, tableName: searchData.tableName };
                    }
                  }

                  // 添加排序字段
                  params.order = 'desc';

                  params.sort = 'gmt_create';

                  getTableList(params).then((res) => {
                    console.log('根据数据库id，获取库表列表 =>', res);
                    if (res.code === 0) {
                      setDataTableData(res.data.records);
                      setTotal(res.data.total);
                      setPage(p);
                    }
                  });
                }}
              ></Pagination>
            </div>
          </div>
        </div>
      </div>

      {/* 数据库编辑弹框 */}
      {dataSourceDetail != null && (
        <DataEditModal
          close={closeDataEditModal}
          visible={DataEditModalVisible}
          initialData={dataSourceDetail}
          finishEdit={finishEdit}
        ></DataEditModal>
      )}
      {/* er图弹框 */}
      {erModalVisible && (
        <>
          <ErModal
            visible={erModalVisible}
            id={props.selectedKeys}
            onClose={closeErModal}
            refreshTable={refreshTable}
          ></ErModal>
        </>
      )}
    </div>
  );
};

export default Main;
