// 表格组件
import React, { useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';

import { Button, message, Modal, Form, Input, Spin, Table, Pagination, Popconfirm } from 'antd';

import { EditOutlined } from '@ant-design/icons';

import { getTableData, execByCode } from './service';

import styles from './styles.less';

// 导入 执行配置 抽屉
import ConfPage from './ConfPage';

import { history } from 'umi';

const MainTable = React.forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      refresh: () => {
        refresTable();
      },
    };
  });

  // 加载标志位
  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState(null);

  //   每页条数
  const [limit, setLimit] = useState(10);

  // 第几页
  const [page, setPage] = useState(1);

  // 总条数
  const [total, setTotal] = useState(0);

  // 抽屉编辑的初始数据
  const [initData, setInitData] = useState(null);

  // 列表请求数据时loading 状态
  const [loadings, setLoadings] = useState(true);
  // 抽屉关闭方法
  const close = () => {
    // 在接口成功的回调里面，先将数据合并到本地的 tableData 中，不通过接口，然后关闭抽屉

    // 关闭抽屉
    setVisible(false);
  };

  // 刷新列表数据
  const refresTable = () => {
    fetchTablesData(limit, page);
  };

  useEffect(() => {
    if (props.selectKey != null && props.selectItem) {
      console.log('selectKey ', props.selectKey);
      console.log('selectItem ', props.selectItem);

      //   改变前重置每页条数，页数
      setLimit(10);
      setPage(1);

      //   请求表格数据
      fetchTablesData(limit, page);
    }
  }, [props.selectItem, props.selectKey]);

  //   请求表格数据的方法
  const fetchTablesData = (limit, page) => {
    setLoadings(true);
    console.log(props.selectItem);
    if (props.selectItem.children.length > 0) {
      getTableData({ pid: `${props.selectItem.key}`, limit, page }).then((res) => {
        console.log('获取分页数据 =>', res);
        if (res.code === 0) {
          setTableData(res.data.records);
          setTotal(res.data.total);
          setPage(res.data.page);
          setLoadings(false);
        }
      });
    } else {
      getTableData({ id: `${props.selectItem.key}`, limit, page }).then((res) => {
        console.log('获取分页数据 =>', res);
        if (res.code === 0) {
          setTableData(res.data.records);
          setTotal(res.data.total);
          setPage(res.data.page);
          setLoadings(false);
        }
      });
    }
  };

  // 打开 执行配置 页面
  const openConfigPage = (row) => {
    // console.log('row =>', row);

    props.openConfPage && props.openConfPage(row);

    setInitData(row);
  };

  // 打开复制弹窗
  const openCopyPage = (row) => {
    console.log(row);
    props.openCopyPage && props.openCopyPage(row);
  };
  const openDeletePage = (row) => {
    console.log(row);
    props.openDeletePage && props.openDeletePage(row);
  };
  //   表格columns
  const tableColumns = [
    {
      title: '页面编码',
      key: 'code',
      dataIndex: 'code',
    },
    {
      title: '页面路径',
      dataIndex: 'pageUrl',
      key: 'pageUrl',
    },
    {
      title: '标题',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      width: '200px',
      render: (value, row) => {
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              // justifyContent: 'space-between',
            }}
          >
            <div
              onClick={() => {
                openCopyPage(row);
              }}
              style={{ marginRight: '5px' }}
            >
              <a>复制</a>
            </div>
            {/* <div>
              <a>内容定义</a>
            </div> */}

            {/* <div
              onClick={() => {
                console.log('业务初始数据 =>', row);
                openConfigPage(row);
              }}
              style={{ marginRight: '5px' }}
            >
              <a>执行配置</a>
            </div> */}
            <>
              {props.showDelete.length > 0 && props.showDelete.includes(row.id) && (
                <>
                  <div
                    onClick={() => {
                      history.push({
                        pathname: '/page-design',
                        query: {
                          code: row.code,
                          id: row.id,
                          name: row.name,
                        },
                      });
                    }}
                    style={{ marginRight: '5px' }}
                  >
                    <a>设计页面</a>
                  </div>

                  <Popconfirm
                    title={`确定删除吗？`}
                    okText="确认"
                    cancelText="关闭"
                    showCancel
                    onConfirm={() => {
                      openDeletePage(row);
                    }}
                  >
                    <div
                      onClick={() => {
                        console.log('业务初始数据 =>', row);
                      }}
                    >
                      <a>删除</a>
                    </div>
                  </Popconfirm>
                </>
              )}
            </>
          </div>
        );
      },
    },
  ];

  return (
    <div
      style={{
        height: 'calc(100vh - 214px)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* 表格部分 */}
      <div
        style={{
          // flex: '1',
          padding: '16px',
          height: 'calc(100vh - 276px)',
          overflow: 'hidden',
        }}
      >
        <div className={styles.table_wrapper}>
          <div>
            {tableData != null && (
              <Table
                columns={tableColumns}
                size="small"
                dataSource={tableData}
                bordered={true}
                pagination={false}
                loading={loadings}
                rowKey={(record) => record.id}
              ></Table>
            )}
          </div>
        </div>
      </div>
      {/* 分页展示部分 */}
      <div
        style={{
          // flex: '0 0 48px',
          position: 'absolute',
          bottom: '0px',
          height: '48px',
          lineHeight: '48px',
          // borderTop: '1px solid #f1f2f4',
          paddingLeft: '16px',
          paddingRight: '16px',
          flexDirection: 'row-reverse',
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'row-reverse',
          width: '100%',
        }}
      >
        <Pagination
          total={total}
          current={page}
          showTotal={(total) => `共${total}条`}
          onChange={(p) => {
            fetchTablesData(limit, p);
          }}
        ></Pagination>
      </div>
    </div>
  );
});

export default MainTable;
