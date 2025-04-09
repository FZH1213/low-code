import { FormInstance, message } from '@/components/base';
import {
  Table,
  Card,
  Space,
  Modal,
  Input,
  Drawer,
  BizTable,
  Button,
  Tabs,
  Tag,
  Checkbox,
  Divider,
  Row,
  Col,
  Cascader,
} from '@/components/base';
import { PageContainer } from '@/components/pro/pro-layout';
import type { QueryFormInstance } from '@/components/QueryFilterForm';
import QueryFilterForm from '@/components/QueryFilterForm';
import TableSearchForm, { TableSearchFormInstance } from '@/components/TableSearchForm';
import type { ColumnsType } from 'antd/es/table/interface';
import MenuInfo from './components/MenuInfo';
import RoleInfo from './components/RoleInfo';
import UserInfo from './components/UserInfo';
import { PlusOutlined, PropertySafetyFilled } from '@ant-design/icons';
import {
  fetchRolePage,
  addRole,
  updateByRoleId,
  removeByRoleId,
  grantAuthByRoleId,
  addUsersToRoleId,
} from './service';
import { judgeSucessAndGetData, judgeSucessAndGetMessage } from '@/utils/requestUtil';
import React, { useEffect, useRef, useState } from 'react';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';
import { GLOBAL_VALUE } from '@/utils/globalValue';
import { Typography } from 'antd';
import { formListHistory } from '@/utils/historicalPreservation';
const { TabPane } = Tabs;
const CheckboxGroup = Checkbox.Group;
const { Search } = Input;
export interface ComponentProps {}

import { plainOptions } from './optionsDataDemo';
const FunctionComponent: React.FC<ComponentProps> = (props: { [key: string]: any }) => {
  /* 不配送地区模拟 */

  const [checkedFinalList, setCheckedFinalList] = useState<any>([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [indeterminate1, setIndeterminate1] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const onCheckBox1 = (list) => {
    let checkedListCopy = [...checkedFinalList];
    if (list.target.checked) {
      checkedListCopy.push([list.target.value]);
    } else {
      checkedListCopy = checkedListCopy.filter((item) => item != list.target.value);
    }
    setCheckedFinalList(checkedListCopy);
  };
  const onCheckBox2 = (list) => {
    let checkedListCopy = [...checkedFinalList];
    plainOptions.map((item, index) => {
      item.children.map((it, i) => {
        if (it.value === list.target.value) {
          if (list.target.checked) {
            checkedListCopy.push([item.value, list.target.value]);
          } else {
            let arr = [...checkedFinalList];
            arr.map((ll) => {
              //   debugger;
              if (JSON.stringify(ll) == JSON.stringify([item.value])) {
                checkedListCopy.splice(index, 1);
                item.children.map((aa) => {
                  if (aa.value != list.target.value) {
                    checkedListCopy.push([item.value, aa.value]);
                  }
                });
                return;
              }
            });

            checkedListCopy.map((a, b) => {
              if (JSON.stringify([item.value, list.target.value]) == JSON.stringify(a)) {
                checkedListCopy.splice(b, 1);
              }
            });
          }
        }
      });
    });
    setCheckedFinalList(checkedListCopy);
  };
  const cascaderChange = (e) => {
    let checkedListCopy = [...checkedFinalList];
    plainOptions.map((item, index) => {
      item.children.map((ite, inde) => {
        ite.children.map((ii, xx) => {
          // checkedListCopy.map((cc)=>{
          //   if(JSON.stringify([item.value, ite.value].concat(e))==JSON.stringify(cc)){

          //   }

          // })
          e.map((eee) => {
            if (JSON.stringify(eee) == JSON.stringify([ii.value])) {
              // debugger;
              checkedListCopy.push([item.value, ite.value].concat(eee));
              let newArr = [];
              for (let i = 0; i < checkedListCopy.length; i++) {
                // 设置一个开关，如果是true，就存进去，不是就不存
                let flag = true;
                for (let j = 0; j < newArr.length; j++) {
                  // 原数组和新数组作比较，如果一致，开关变为 false
                  JSON.stringify(checkedListCopy[i]) === JSON.stringify(newArr[j])
                    ? (flag = false)
                    : flag;
                }
                flag ? newArr.push(checkedListCopy[i]) : newArr;
              }
              // debugger;
              checkedListCopy = [...newArr];
            }
          });
          // ii.children;
        });
      });
    });
    setCheckedFinalList(checkedListCopy);
  };
  const onCheckAllChange = (e) => {
    let allCheckedList = plainOptions.map((a) => [a.value]);
    setCheckedFinalList(e.target.checked ? allCheckedList : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  /* 不配送地区模拟 */

  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState<number>(1);
  const [operate, setOperate] = useState<number>(0);
  // const [pageData, setPageData] = useState<any>(undefined);
  const [roleInfo, setRoleInfo] = useState<any>(undefined);
  // const queryFormRef = useRef<QueryFormInstance | undefined>(undefined);
  const queryFormRef = useRef<TableSearchFormInstance | undefined>(undefined);
  const userInfoRef = useRef<FormInstance | undefined>(undefined);
  const roleInfoRef = useRef<FormInstance | undefined>(undefined);
  const menuInfoRef = useRef<FormInstance | undefined>(undefined);

  // 删除列表数据
  // const [removeList, setRemoveList] = useState<any>([]);

  //查询条件
  const [searchFormValues, setSearchFormValues] = useState<any>({});

  // 防多次点击 置灰
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);

  // 获取页码数
  const [userPageData, setUserPageData] = useState<any>({});
  // 从缓存获取缓存数据
  const [allUserPageData, setAllUserPageData] = useState<any>({});
  const [searchValue, setSearchValue] = useState<any>(true);
  // 重置标志位
  const [flag, setFlag] = useState<any>(false);
  let Pdata = { pageData: {}, searchFormValues: {} };

  useEffect(() => {
    // getPageFromSession();
    // console.log(pageData)
    Pdata.pageData = userPageData;
    Pdata.searchFormValues = searchFormValues;
    // console.log(Pdata);
    return () => {
      // 缓存数据
      // console.log(11111111111)
      formListHistory.setItemValue('HisRolePageData', Pdata);
      // getPageData()
    };
  }, [userPageData, searchFormValues]);

  // 从缓存取页码/历史搜索的关键字数据
  const getPageFromSession = async () => {
    // debugger
    let data: any = { pageData: {}, searchFormValues: {} };
    data = formListHistory.getItemValue('HisRolePageData');
    // console.log(data);
    if (data && data.pageData && JSON.stringify(data.pageData) != '{}') {
      await setAllUserPageData(data.pageData);
    }
    if (data && data.searchFormValues && JSON.stringify(data.searchFormValues) != '{}') {
      console.log(data.searchFormValues);
      await setSearchFormValues(data.searchFormValues);
      // setSearchFormValues(data.searchFormValues)
    }
    // setSearchFormValues(data.searchFormValues)
  };

  // 获取表格选择的页码数据
  const getPageData = (data: any) => {
    setUserPageData(data);
  };
  const queryFieldsProp = [
    {
      label: '角色名称',
      name: 'roleName',
      components: <Input placeholder="请输入角色名称" allowClear />,
    },
    {
      label: '角色编码',
      name: 'roleCode',
      components: <Input placeholder="请输入角色编码" allowClear />,
    },
  ];

  const handleAdd = () => {
    setOperate(1);
  };

  const handleUpdate = (data: any) => {
    console.info(data);
    setRoleInfo(data);
    setOperate(2);
  };

  const handleDelete = (data: any) => {
    Modal.confirm({
      title: '确定删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        if (data.roleId) {
          setBtnLoading(true);
          const [flag, msg] = await judgeSucessAndGetMessage(removeByRoleId(data.roleId));
          if (flag) {
            message.success(msg || '操作成功');
            queryFormRef.current?.onSearchExec();
          } else {
            message.error(msg || '操作失败');
          }
          setBtnLoading(false);
        }
      },
    });
  };

  const handleCancel = () => {
    setOperate(0);
    setTabKey(1);
    setRoleInfo(undefined);
    userInfoRef.current?.resetFields();
    menuInfoRef.current?.resetFields();
    roleInfoRef.current?.resetFields();
  };

  const TAB_OPTION = [
    {
      key: 1,
      name: '角色信息',
      width: 800,
      okHandle: () => {
        roleInfoRef.current?.validateFields().then(async (values: any) => {
          setBtnLoading(true);
          for (let key in values) {
            if (values[key] == undefined) {
              delete values[key];
            }
          }
          console.log('添加角色的信息values==', values);
          const [flag, msg] = await judgeSucessAndGetMessage(
            operate === 2 ? updateByRoleId(values) : addRole(values),
          );
          if (flag) {
            message.success(msg || '操作成功');
            queryFormRef.current?.onSearchExec();
            handleCancel();
          } else {
            message.error(msg || '操作失败');
          }
          setBtnLoading(false);
        });
      },
    },
    {
      key: 2,
      name: '分配权限',
      width: 800,
      okHandle: () => {
        menuInfoRef.current?.validateFields().then(async (values: any) => {
          setBtnLoading(true);
          const nVals = {
            roleId: values.roleId,
            expireTime: values.expireTime
              ? moment(values.expireTime).format('YYYY-MM-DD HH:mm:ss')
              : '',
            authorityIds: values.grantMenus ? values.grantMenus.join(',') : undefined,
          };
          const [flag, msg] = await judgeSucessAndGetMessage(grantAuthByRoleId(nVals));
          if (flag) {
            message.success(msg || '操作成功');
            handleCancel();
          } else {
            message.error(msg || '操作失败');
          }
          setBtnLoading(false);
        });
      },
    },
    {
      key: 3,
      name: '角色成员',
      width: 800,
      okHandle: () => {
        userInfoRef.current?.validateFields().then(async (values: any) => {
          const nVals = {
            roleId: values.roleId,
            userIds: values.userIds ? values.userIds.join(',') : undefined,
          };
          const [flag, msg] = await judgeSucessAndGetMessage(addUsersToRoleId(nVals));
          if (flag) {
            message.success(msg || '操作成功');
            handleCancel();
          } else {
            message.error(msg || '操作失败');
          }
        });
      },
    },
  ];

  const handleOk = () => {
    setSubmitDisabled(true);
    setTimeout(() => {
      setSubmitDisabled(false);
    }, 2000);
    const okHandle = TAB_OPTION.find((item) => item.key === tabKey)?.okHandle;
    if (okHandle) {
      okHandle();
    }
  };

  const tableColumns: ColumnsType<any> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '角色编码',
      dataIndex: 'roleCode',
      key: 'roleCode',
      width: '10%',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      ellipsis: true,
      render: (text) => {
        if (text === 0) {
          return <Tag color="error">禁用</Tag>;
        }

        if (text === 2) {
          return <Tag color="warning">锁定</Tag>;
        }

        return <Tag color="success">正常</Tag>;
      },
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: '20%',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'roleDesc',
      key: 'roleDesc',
      width: '30%',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      width: '15%',
      render: (_, record) => {
        return (
          <Space>
            <Typography.Link onClick={() => handleUpdate(record)}>修改</Typography.Link>
            <Typography.Link onClick={() => handleDelete(record)}>删除</Typography.Link>
          </Space>
        );
      },
    },
  ];

  const handleTabChange = (key: string) => {
    setTabKey(parseInt(key, 10));
  };

  // const getTableData = async (params?: any) => {
  //   const data = await judgeSucessAndGetData(fetchRolePage(params));
  //   console.log(data);

  //   setPageData(data || {});
  // };

  useEffect(() => {
    queryFormRef.current?.onSearchExec();
    getPageFromSession();
  }, []);

  //   /**
  //  *  请求分页数据
  //  *
  //  * @param {*} pagination
  //  * @param {*} filters
  //  * @param {*} sorter
  //  */
  //    const handleTableChange = async (pagination: any, filters: any, sorter: any) => {
  //     await getTableData({ page: pagination.current, limit: pagination.pageSize })
  //     // console.log(pagination, filters, sorter)
  //   }
  //  // 勾选表格
  //  const tableChange = (selectedRowKeys: any) => {
  //   setRemoveList(selectedRowKeys);
  // };
  return (
    <>
      {/* <QueryFilterForm
        ref={queryFormRef}
        queryFieldsProp={queryFieldsProp}
        onSearch={(values) => {
          getTableData(values);
        }}
        onReset={() => {
          getTableData();
        }}
      /> */}

      <TableSearchForm
        ref={queryFormRef}
        queryFieldsProp={queryFieldsProp}
        // onSearch={(values) => {
        //   getTableData(values);
        // }}
        // onReset={() => {
        //   getTableData();
        // }}
        onSearch={(values) => {
          setSearchFormValues(values);
        }}
        onReset={() => {
          setSearchFormValues({});
          setFlag(true);
        }}
      />
      <Card
        className={styles.newMarginCard}
        title={
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              新增
            </Button>
          </Space>
        }
      >
        {/* <div style={{ paddingBottom: 7 }}>
          <Space>
            <Button type="primary" onClick={handleAdd}>
              添加
            </Button>
          </Space>
        </div> */}

        {/* <Table
          columns={tableColumns}
          size={GLOBAL_VALUE.TABLE_SISE}
          dataSource={pageData ? pageData.records : []}
          onChange={handleTableChange}
          rowKey="roleId"
          pagination={{
            pageSize: pageData ? pageData.limit : 10,
            total: pageData ? pageData.total : 0,
            current: pageData ? pageData.page : 1,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) => GLOBAL_VALUE.TABLE_SHOWTOTAL(total,range),
          }}
        /> */}

        {/* 表格 */}
        <BizTable
          PageData={allUserPageData}
          flag={flag}
          getPageData={getPageData}
          columns={tableColumns}
          listService={fetchRolePage}
          rowKey="roleId"
          searchFormValues={searchFormValues}
          rowSelection={{
            type: 'checkbox',
            // onChange: tableChange
          }}
        />
      </Card>

      <Drawer
        visible={operate !== 0}
        title={TAB_OPTION.find((item) => item.key === tabKey)?.name}
        onClose={handleCancel}
        // maskClosable={false}
        // okText="保存"
        // onOk={handleOk}
        // okButtonProps={{ loading: btnLoading }}
        // cancelText="关闭"
        width={TAB_OPTION.find((item) => item.key === tabKey)?.width}
        destroyOnClose
        footer={
          <div className={styles.roleManagementDrawer}>
            <Button
              className={styles.roleManagementBtn}
              type="primary"
              disabled={submitDisabled}
              loading={submitDisabled}
              onClick={handleOk}
            >
              保存
            </Button>
            <Button className={styles.roleManagementBtn} onClick={handleCancel}>
              关闭
            </Button>
          </div>
        }
      >
        <Tabs activeKey={tabKey.toString()} onChange={handleTabChange}>
          <TabPane tab={TAB_OPTION[0].name} key={TAB_OPTION[0].key}>
            <RoleInfo operate={operate} ref={roleInfoRef} infoData={roleInfo} />
          </TabPane>
          <TabPane tab={TAB_OPTION[1].name} key={TAB_OPTION[1].key} disabled={operate === 1}>
            <MenuInfo ref={menuInfoRef} infoData={roleInfo} />
          </TabPane>
          {/* <TabPane
              tab={TAB_OPTION[2].name}
              key={TAB_OPTION[2].key}
              disabled={operate === 1}
            >
            <UserInfo
              ref={userInfoRef}
              infoData={roleInfo}
            />
          </TabPane> */}
        </Tabs>
      </Drawer>

      {/* 不配送地区模拟 */}
      {/* <div>
        <Card title={<span>设置不配送地区</span>}>
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            全选（{checkedFinalList.length}）
          </Checkbox>
          <Divider />
          {plainOptions.map((item, index) => (
            <div>
              <Checkbox
                // indeterminate={indeterminate1}
                checked={checkedFinalList
                  .map((ll) => JSON.stringify(ll))
                  .includes(JSON.stringify([item.value]))}
                value={item.value}
                onChange={onCheckBox1}
              >
                {item.label}
              </Checkbox>
              <div>
                {item.children.map((ite, ind) => (
                  <div style={{ display: 'inline-block' }}>
                    <Checkbox
                      value={ite.value}
                      checked={
                        checkedFinalList
                          .map((ll) => JSON.stringify(ll))
                          .includes(JSON.stringify([item.value])) ||
                        checkedFinalList
                          .map((ll) => JSON.stringify(ll))
                          .includes(JSON.stringify([item.value, ite.value]))
                      }
                      onChange={onCheckBox2}
                    >
                      {ite.label}
                    </Checkbox>
                    <DownOutlined />
                    {console.log(
                      'cascader前',
                      ite.children.map((aaa) => (aaa = [aaa.value])),
                    )}
                    <Cascader
                      value={
                        checkedFinalList
                          .map((ll) => JSON.stringify(ll))
                          .includes(JSON.stringify([item.value, ite.value]))
                          ? ite.children.map((aaa) => (aaa = [aaa.value]))
                          : []
                      }
                      onChange={cascaderChange}
                      placement="topRight"
                      className={styles.cascaderCustStyle}
                      style={{ width: 20, height: 20 }}
                      options={ite.children}
                      multiple
                      bordered={false}
                      allowClear={false}
                      expandTrigger="hover"
                      dropdownRender={(e) => {
                        return (
                          <div style={{ width: 270, padding: 8 }}>
                            <Search style={{ width: 160 }} />
                            <Divider style={{ marginTop: 4, marginBottom: 4 }} />
                            {React.cloneElement(e, ite.children)}
                          </div>
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
              <Divider />
            </div>
          ))}
        </Card>
      </div> */}
      {/* 不配送地区模拟 */}
    </>
  );
};

export default FunctionComponent;
