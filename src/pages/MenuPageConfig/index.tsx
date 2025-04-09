import { Card, Col, Row, Table, Tag } from '@/components/base';
import { PageContainer } from '@/components/pro/pro-layout';
import type { ColumnsType } from 'antd/es/table/interface';
import { judgeSucessAndGetData } from '@/utils/requestUtil';
import { fetchAllMenu, fetchAllMenuH5 } from './service';
import React, { useEffect, useState } from 'react';
import MenuInfo from '../MenuPageConfig/components/MenuInfo';
import ActionList from './components/ActionList';
import Preview from '@/pages/MenuPage';
import styles from './style/index.less';
import { history } from '@/.umi/core/history';

export interface ComponentProps { }
const FunctionComponent: React.FC<ComponentProps> = (props: { [key: string]: any }) => {
  const [tableData, setTableData] = useState<any[] | undefined>(undefined);
  const [rowData, setRowData] = useState<any | undefined>(undefined);
  const [clientWidth, setClientWidth] = useState<number>(document.body.clientWidth);
  const [clientHeight, setClientHeight] = useState<number>(document.body.clientHeight);
  const [flag, setFlag] = useState(true);

  // 列表每一项
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


  /**
   * 点击交互
   */
  const rowSelection = {
    onChange: (_selectedRowKeys: React.Key[], selectedRows: any[]) => {
      setRowData(selectedRows[0]);
    },
  };

  /**
   *  树形数据组合方法
   * @param parentNode 
   * @param allNode 
   */
  const buildSubRecu = (parentNode: any[], allNode: any[]) => {
    parentNode.forEach((pNode) => {
      const fNode = allNode.filter((node) => pNode.menuId === node.parentId);
      if (fNode && fNode.length > 0) {
        pNode.children = fNode;
        buildSubRecu(fNode, allNode);
      }
    });
  };

  /**
   * 树形数据组合方法
   */
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


  /**
   * 获取菜单列表数据
   */
  const getTableData = async () => {
    const data = await judgeSucessAndGetData(fetchAllMenuH5());
    if (data && data.length > 0) {
      const tmpD = buildTreeData(data);
      setTableData(tmpD);
    }
  };

  // 数据刷新
  const handleDataReload = (operate: number) => {
    setFlag(false)
    getTableData();
    if (operate !== 2) {
      setRowData({});
      setFlag(true)
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

  let location = {
    query: {
      token: 123123
    }
  }

  return (
    <PageContainer title={false}>
      <Row>
        {/* H5展示预览 */}
        <Col span={8} className={styles.menuManagementCardLeft}>
          <Card>
            <div className={styles.h5card}>414x896</div>
            <div className={styles.h5card}>
              {
                flag && (
                  <div className={styles.h5cardBorder}>
                    <Preview location={location} />
                  </div>
                )
              }
            </div>
          </Card>
        </Col>
        {/* H5菜单列表*/}
        <Col span={6}>
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
                scroll={{ y: 'calc(100vh - 250px)' }}
                defaultExpandAllRows
                dataSource={tableData}
                pagination={false}
              />
            )}
          </Card>
        </Col>
        {/* H5操作列表*/}
        <Col span={10} className={styles.menuManagementCard}>
          <Card>
            <MenuInfo
              menuTree={tableData}
              infoData={rowData}
              opoerateSuccessCallback={handleDataReload}
            />
          </Card>
        </Col>
        {/* <Col span={8} className={styles.menuManagementCard}>
          <Card>
            <ActionList menuTree={tableData} infoData={rowData} />
          </Card>
        </Col> */}
      </Row>
    </PageContainer>
  );
};

export default FunctionComponent;
