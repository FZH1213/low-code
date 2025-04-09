import { Card, Col, Row, Table, Tag } from '@/components/base';
import { PageContainer } from '@/components/pro/pro-layout';
import type { ColumnsType } from 'antd/es/table/interface';
import { judgeSucessAndGetData } from '@/utils/requestUtil';
import { fetchAllMenu } from './service';
import React, { useEffect, useState } from 'react';
import MenuInfo from '../MenuManagement/components/MenuInfo';
import ActionList from './components/ActionList';
import styles from './style/index.less';
import { history } from '@/.umi/core/history';

export interface ComponentProps { }

const FunctionComponent: React.FC<ComponentProps> = (props: { [key: string]: any }) => {
  const [tableData, setTableData] = useState<any[] | undefined>(undefined);
  const [rowData, setRowData] = useState<any | undefined>(undefined);
  const [clientWidth, setClientWidth] = useState<number>(document.body.clientWidth);
  const [clientHeight, setClientHeight] = useState<number>(document.body.clientHeight);
  const tableColumns: ColumnsType<any> = [
    {
      title: '菜单',
      dataIndex: 'menuName',
      key: 'menuName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (text) => {
        if (text === 0) {
          return <Tag color="error">禁用</Tag>;
        }
        return <Tag color="success">启用</Tag>;
      },
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (_selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setRowData(selectedRows[0]);
    },
  };

  const buildSubRecu = (parentNode: any[], allNode: any[]) => {
    parentNode.forEach((pNode) => {
      // menuId
      const fNode = allNode.filter((node) => pNode.menuId === node.parentId);
      if (fNode && fNode.length > 0) {
        pNode.children = fNode;
        buildSubRecu(fNode, allNode);
      }
    });
  };

  const buildTreeData = (data: any[]) => {
    if (!data || data.length <= 0) {
      return [];
    }
    const rootNode = data.filter((item) => item.parentId === '0');
    if (rootNode.length > 0) {
      buildSubRecu(rootNode, data);
    }

    return rootNode;
  };

  const getTableData = async () => {
    const data = await judgeSucessAndGetData(fetchAllMenu());

    if (data && data.length > 0) {
      const tmpD = buildTreeData(data);
      setTableData(tmpD);
    }
  };

  const handleDataReload = (operate: number) => {
    getTableData();
    // 更新操作重写请求数据
    if (operate !== 2) {
      setRowData({});
    }
  };

  useEffect(() => {
    // debugger;

    console.log('渲染');

    getTableData();
  }, []);

  // xs	屏幕 < 576px 响应式栅格，可为栅格数或一个包含其他属性的对象	number | object	-
  // sm	屏幕 ≥ 576px 响应式栅格，可为栅格数或一个包含其他属性的对象	number | object	-
  // md	屏幕 ≥ 768px 响应式栅格，可为栅格数或一个包含其他属性的对象	number | object	-
  // lg	屏幕 ≥ 992px 响应式栅格，可为栅格数或一个包含其他属性的对象	number | object	-
  // xl	屏幕 ≥ 1200px 响应式栅格，可为栅格数或一个包含其他属性的对象	number | object	-
  // xxl

  // useEffect(() => {
  //   console.log(document.body.clientWidth);
  // }, [document.body.clientWidth]);

  // window.onresize = () => {
  //   setClientWidth(document.body.clientWidth);
  //   setClientHeight(document.body.clientHeight);
  // };

  return (
    <Row gutter={[8, 8]}>
      <Col {...{ xl: 7, lg: 10, md: 10, sm: 24 }}>
        <Card>
          {tableData && (
            <Table
              size="small"
              rowKey="menuId"
              rowSelection={{
                type: 'radio',
                ...rowSelection,
              }}
              columns={tableColumns}
              // scroll={{ y: clientWidth >= 1200 ? 'calc(100vh - 230px)' : 472 }}
              scroll={{ y: 'calc(100vh - 250px)' }}
              defaultExpandAllRows
              dataSource={tableData}
              pagination={false}
            />
          )}
        </Card>
      </Col>
      <Col {...{ xl: 9, lg: 14, md: 14, sm: 24 }} className={styles.menuManagementCard}>
        <Card>
          <MenuInfo
            menuTree={tableData}
            infoData={rowData}
            opoerateSuccessCallback={handleDataReload}
          />
        </Card>
      </Col>
      <Col {...{ xl: 8, lg: 24, md: 24, sm: 24 }} className={styles.menuManagementCard}>
        <Card>
          <ActionList menuTree={tableData} infoData={rowData} />
        </Card>
      </Col>
    </Row>
  );
};

export default FunctionComponent;
