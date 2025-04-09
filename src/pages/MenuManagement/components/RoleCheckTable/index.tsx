import { Checkbox, Skeleton, Space, Table } from '@/components/base';
import React, { useEffect, useState } from 'react';
import { judgeSucessAndGetData } from '@/utils/requestUtil';
import { fetchAuthMenu } from './service';
import type { ColumnsType } from 'antd/es/table/interface';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ConsoleSqlOutlined } from '@ant-design/icons';

export interface ComponentProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

const FunctionComponent: React.FC<ComponentProps> = ({ value, onChange }) => {
  const [checkStrictly, setCheckStrictly] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any[] | undefined>(undefined);
  const [menuIds, setMenuIds] = useState<string[]>([]);
  const [menuList, setMenuList] = useState<any[]>([]);
  const [selectKeys, setSelectKeys] = useState<string[]>([]);

  const handleActionCheck = (id: string, e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setSelectKeys([...selectKeys, id]);
    } else {
      setSelectKeys(selectKeys.filter((item) => item !== id));
    }
  };

  const tableColumns: ColumnsType<any> = [
    {
      title: '菜单',
      dataIndex: 'menuName',
      key: 'menuName',
      width: 150,
      fixed: 'left',
    },
    {
      title: '操作',
      dataIndex: 'actionList',
      key: 'actionList',
      width: 880,
      render: (item) => {
        if (item && item instanceof Array) {
          return (
            <Space>
              {item.map((i) => (
                <Checkbox
                  key={i.authorityId}
                  value={i.authorityId}
                  onChange={(e) => handleActionCheck(i.authorityId, e)}
                  checked={selectKeys.indexOf(i.authorityId) !== -1}
                >
                  {i.actionName}
                </Checkbox>
              ))}
            </Space>
          );
        }
        return '';
      },
    },
  ];

  const triggerChange = (changedValue: string[]) => {
    onChange?.(changedValue);
  };

  const rowSelection = {
    // onChange: (selectedRowKeys: string[], selectedRows: any[]) => {
    // const actionIds = selectKeys.filter((item) => menuIds.indexOf(item) === -1);
    // setSelectKeys([...selectedRowKeys, ...actionIds]);
    // },
    onSelect: (reocrd: any, checked: boolean) => {
      if (reocrd.authorityId) {
        const operateKeys = reocrd.actionList
          ? [reocrd.authorityId, ...reocrd.actionList.map((item: any) => item.authorityId)]
          : [reocrd.authorityId];
        if (checked) {
          setSelectKeys([...selectKeys, ...operateKeys]);
          // selectKeys.filter((item) => item != reocrd.authorityId);
        } else {
          setSelectKeys(selectKeys.filter((item) => operateKeys.indexOf(item) === -1));
        }
      }
    },
    onSelectAll: (checked: boolean) => {
      if (checked) {
        const nkeys: string[] = [];
        if (tableData) {
          menuList.forEach((item) => {
            if (item.authorityId) {
              nkeys.push(item.authorityId);
              if (item.actionList && item.actionList instanceof Array) {
                item.actionList.forEach((i) => {
                  if (i.authorityId) {
                    nkeys.push(i.authorityId);
                  }
                });
              }
            }
          });
        }
        setSelectKeys(nkeys);
      } else {
        setSelectKeys([]);
      }
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
    const data = await judgeSucessAndGetData(fetchAuthMenu());
    if (data && data.length > 0) {
      setMenuIds(data.map((item: any) => item.authorityId));
      setMenuList(data);
      const tmpD = buildTreeData(data);
      setTableData(tmpD);
    }
  };

  useEffect(() => {
    getTableData();
  }, []);

  useEffect(() => {
    if (value && selectKeys.length <= 0) {
      setSelectKeys(value);
    }
  }, [value]);

  useEffect(() => {
    if (selectKeys !== value) {
      triggerChange(selectKeys);
    }
  }, [selectKeys]);

  return tableData ? (
    <Table
      size="small"
      rowKey="authorityId"
      columns={tableColumns}
      defaultExpandAllRows
      scroll={{ y: 500 }}
      rowSelection={{
        ...rowSelection,

        selectedRowKeys: selectKeys.filter((item) => menuIds.indexOf(item) !== -1),
      }}
      dataSource={tableData}
      pagination={false}
    />
  ) : (
    <Skeleton active />
  );
};

export default FunctionComponent;
