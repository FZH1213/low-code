import React, { useState, useRef, useEffect } from 'react';
import TableSearchForm, { TableSearchFormInstance } from '@/components/TableSearchForm';
import Toast from '@/components/Toast';
import { Card, Input, Button, Popconfirm, Modal, message, DatePicker, Table, Tooltip, Space, Drawer } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { LOCAL_STORE_KEYS } from '@/utils/constant';
import api from './service';
import moment from 'moment';

import styles from './styles.less';
import ChoiceTemplate from './ChoiceTemplate';

// 报表管理页面
let limit: number
const { RangePicker } = DatePicker;
const queryFieldsProp = [
  {
    label: '创建时间',
    name: 'time',
    components: <RangePicker style={{ width: '100%' }} allowClear />,
    colSize: 4,
    span: 12,
  },
  {
    label: '标题',
    name: 'title',
    components: <Input placeholder="请输入" />,
    span: 6,
  },
  {
    label: '页面ID',
    name: 'id',
    components: <Input placeholder="请输入" />,
    span: 6,

  },
];

const TableList: React.FC<{}> = (props: any) => {
  // const [search, setSearch] = useState({});
  const [nameInfo, setNameInfo] = useState<object>({});

  const [modalVisible, changeModalVisible] = useState<boolean>(false);
  const searchFormRef = useRef<TableSearchFormInstance | undefined>(undefined);
  const [tData, setData] = useState([])
  const [loading, setLoading] = useState<boolean>(false);
  const [pageDetail, setPage] = useState<any>({
    // pageSize: 10,
    // limit: 10,
    // page: 1,
    // total: 0,
  });
  const [filterFFFF, setFilterFFFF] = useState<any>({});

  const onSearch = async (e: React.SetStateAction<{}>) => {
    // await setSearch(e);
    const filter: any = searchFormRef.current?.getFormValues();
    if (filter.time) {
      filter.startTime = moment(filter.time[0]).format('YYYY-MM-DD');
      filter.endTime = moment(filter.time[1]).format('YYYY-MM-DD');
      delete filter.time;
    }
    for (let key in filter) {
      if (filter[key] == undefined) {
        delete filter[key]
      }
    }
    setFilterFFFF(filter)
    let res: any = await api.fetchReportList({ ...filter });
    if (res.code === 0) {
      setData(res.data.records)
      setPage(res.data);
    }

  };

  const onReset = async () => {
    setFilterFFFF({})
    fetchReportList()
  };
  useEffect(() => {
    (async function Func() {
      setLoading(false);
      fetchReportList();

    })();

  }, []);

  const fetchReportList = async () => {
    let res: any = await api.fetchReportList({ limit: limit, page: pageDetail.page });
    if (res.code === 0) {
      setData(res.data.records)
      setPage(res.data);
    }
  }

  //  ** 新增功能*/
  const onTableChange = async (pagination: any, filter: any, sorter: any) => {
    let params = { ...filterFFFF, page: pagination.current, limit: pagination.pageSize }
    const resp = await api.fetchReportList(params);
    if (resp.code === 0) {
      setData(resp.data.records);
      setPage(resp.data);
    }
  };

  // 资讯名称输入框值发生改变
  const handleMessageChange = (e: any) => {
    setNameInfo({ ...nameInfo, infoName: e.target.value });
  };
  // 更改名称确认
  const confirmName = async () => {
    // 获取最新值并上传到后台
    if (JSON.stringify(nameInfo) === '{}') {
      message.warn('请先输入名称');
      return;
    }
    let { success }: any = await api.updateName(nameInfo);
    Toast[success ? 'success' : 'error'](success ? '更改成功！' : '请求出现问题，请检查！');
    success &&
      success(async () => {
        onReset();
      });
    setNameInfo({});
    changeModalVisible(false);
  };

  // 批量删除
  const batchDelete = async (record: any) => {
    let { success }: any = await api.deleteData(record.id);
    Toast[success ? 'success' : 'error'](success ? '删除成功！' : '删除失败');
    success &&
      success(async () => {
        onReset();
      });
  };

  const columns: any = [
    {
      title: '序号',
      align: 'center',
      width: 45,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '标题',
      dataIndex: 'rptName',
      key: 'rptName',
      // align: 'center',
      ellipsis: true,
      width: 150,
    },
    {
      title: '模板',
      dataIndex: 'tplTit',
      key: 'tplTit',
      align: 'center',
      ellipsis: true,
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'intSts',
      key: 'intSts',
      align: 'center',
      ellipsis: true,
      width: 60,
      render: (val: any) => <div>{val === '1' ? '已发布' : '未发布'}</div>,
    },
    {
      title: '页面ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 120,
      ellipsis: true,
    },
    {
      title: '页面URL',
      dataIndex: 'tplUrl',
      key: 'tplUrl',
      align: 'center',
      width: 220,
      ellipsis: { showTitle: false },
      render: (val: any, record: any) => {
        if (!!record && record.tplUrl != '') {
          return (
            <Tooltip placement="topLeft" title={record.tplUrl + record.id}>
              {record.tplUrl + '?' + 'id' + '=' + record.id}
            </Tooltip>)
        } else {
          return null;
        }
      }
    },
    {
      title: '创建时间',
      dataIndex: 'entTime',
      key: 'entTime',
      align: 'center',
      width: 140,
      ellipsis: true,
      render: (text: any, record: any) => {
        return text
      }
    },

    {
      key: 'option ',
      title: '操作',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: (text: any, record: any) => {
        return (
          <Space>
            <a
              onClick={() => {
                props.history.push({
                  pathname: 'manage-page/choice-sql',
                  query: { tplTypId: record.tplId, title: record.tplTit, id: record.id },
                })
              }}
            >编辑</a>
            <Popconfirm
              title="你确定要删除这行内容吗?"
              onConfirm={() => batchDelete(record)}
              okText="确定"
              cancelText="取消"
              icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Space
      size={10}
      direction="vertical"
    >
      {/* 更改名称modal */}
      <Modal
        centered
        title="更改名称"
        visible={modalVisible}
        onOk={confirmName}
        onCancel={() => changeModalVisible(false)}
        okText="确定"
        cancelText="取消"
        className={styles.modal}
        getContainer={false}
      >
        <div className={styles.content}>
          <span>资讯名称：</span>
          <Input
            style={{ width: '80%' }}
            value={nameInfo.infoName && nameInfo.infoName}
            onChange={handleMessageChange}
          />
        </div>
      </Modal>
      <TableSearchForm
        ref={searchFormRef}
        // localStoreKey={LOCAL_STORE_KEYS.CustomerContact}
        queryFieldsProp={queryFieldsProp}
        onSearch={onSearch}
        onReset={onReset}
      />
      <Card
        style={{ marginTop: 10 }}
        title={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={showDrawer}>新增</Button>
          </Space>
        }
      >
        <Table
          className="wp-table area-mt"
          size='small'
          bordered={false}
          rowKey="id"
          columns={columns}
          loading={loading}
          locale={{
            emptyText: loading
              ? () => (
                <div style={{ lineHeight: '150px' }}>
                  <div style={{ marginTop: '20px' }}>正在加载中</div>
                </div>
              )
              : '',
          }}
          dataSource={tData}
          onChange={onTableChange}
          pagination={{
            size: 'small',
            pageSize: pageDetail ? pageDetail.pageSize : 10,
            total: pageDetail ? pageDetail.total : 0,
            current: pageDetail ? pageDetail.page : 1,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `第 ${range[0]} 项 - 第 ${range[1]} 项  /  共 ${total} 项`,
          }}
        />
        <Drawer
          title="选择模板"
          placement="right"
          onClose={onClose}
          open={open}
          width={720}
          footer={
            <div className={styles.ReportFormManageDrawer}>
              <Button
                className={styles.ReportFormManageBtn}
                onClick={onClose}
              >
                关闭
              </Button>
            </div>
          }
        >
          <ChoiceTemplate />
        </Drawer>
      </Card>
    </Space>
  );
};

export default TableList;
