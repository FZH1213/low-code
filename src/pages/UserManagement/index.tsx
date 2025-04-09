import { Form, FormInstance } from '@/components/base';
import {
  Table,
  Card,
  Space,
  Modal,
  Input,
  message,
  Button,
  BizTable,
  Tabs,
  Drawer,
  Row,
  Col,
  Tag,
  Typography,
  TreeSelect,
} from '@/components/base';
import { PageContainer } from '@/components/pro/pro-layout';
import type { QueryFormInstance } from '@/components/QueryFilterForm';
import TableSearchForm, { TableSearchFormInstance } from '@/components/TableSearchForm';
// import QueryFilterForm from '@/components/QueryFilterForm';
import type { ColumnsType } from 'antd/es/table/interface';
import UserInfo from './components/UserInfo';
import UserInfoSee from './components/UserInfoSee';
import { GLOBAL_VALUE } from '@/utils/globalValue';
import MenuInfo from './components/MenuInfo';
import RoleInfo from './components/RoleInfo';
import PasswordInfo from './components/PasswordInfo';
import { history, useModel } from 'umi';
import api from '@/services/sysCompony';
// import api1 from '@/services/api';
import api1 from '../../services/api';
import styles from './index.less';
import { PlusOutlined, PropertySafetyFilled } from '@ant-design/icons';
import {
  fetchUserPage,
  addUser,
  updateUser,
  addRolesByUseId,
  updatePasswordByUserId,
} from './service';
import { judgeSucessAndGetData, judgeSucessAndGetMessage } from '@/utils/requestUtil';
import React, { useEffect, useRef, useState } from 'react';
import { formListHistory } from '@/utils/historicalPreservation';
const { TabPane } = Tabs;

export interface ComponentProps { }

// let data = formListHistory.getItemValue('HisUserPageData');
// let dataSearchFormValues = data.searchFormValues

const FunctionComponent: React.FC<ComponentProps> = (props) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  // console.log(initialState)
  // TableSearchForm的ref
  const searchFormRef: any = useRef<TableSearchFormInstance | undefined>(undefined);
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  // 切换的key
  const [tabKey, setTabKey] = useState<number>(1);
  // 显示的弹窗
  const [operate, setOperate] = useState<number>(0);
  // 页面列表数据
  // const [pageData, setPageData] = useState<any>(undefined);
  // 搜索框ref
  const queryFormRef = useRef<TableSearchFormInstance | undefined>(undefined);
  // 用户信息权限弹窗ref
  const userInfoRef = useRef<FormInstance | undefined>(undefined);
  // 分配角色权限弹窗ref
  const passwordInfoRef = useRef<FormInstance | undefined>(undefined);
  // 分配权限权限弹窗ref
  const roleInfoRef = useRef<FormInstance | undefined>(undefined);
  // 修改获取修改
  const [userInfo, setUserInfo] = useState<any>(undefined);
  // 防多次点击 置灰
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  //公司列表
  const [company, setCompany] = useState<any>([]);
  //角色列表
  const [role, setRole] = useState<any>([]);
  // 归属区的下拉选择树状框
  const [treeSelectData, setTreeSelectData] = useState([]);
  // 归属区的下拉选择树状框
  const [regionCode, setRegionCode] = useState('');
  //查询条件
  const [searchFormValues, setSearchFormValues] = useState<any>({});
  const [searchFormValues2, setSearchFormValues2] = useState<any>({});
  // 删除列表数据
  const [removeList, setRemoveList] = useState<any>([]);
  // 查看的弹窗显示隐藏
  const [viewDetailsShow, setViewDetailsShow] = useState<any>(false);
  // const pageData:any = useRef(null)
  // 获取页码数
  const [userPageData, setUserPageData] = useState<any>({});
  // 从缓存获取缓存数据
  const [allUserPageData, setAllUserPageData] = useState<any>({});
  const [searchValue, setSearchValue] = useState<any>(true);
  // 重置标志位
  const [flag, setFlag] = useState<any>(false);
  // 重置密码弹窗
  const [reSetPassWordShow, setReSetPassWordShow] = useState<any>(false);
  const [respdw, setResPdw] = useState<any>(false);
  let Pdata = { pageData: {}, searchFormValues: {} };

  useEffect(() => {
    getResPassWord();
  }, []);
  // 是否含有重置密码权限
  const getResPassWord = () => {
    // console.log(initialState.authorities,1111)
    console.log(initialState);
    // debugger;

    const data = initialState?.currentUser.authorities;
    if (data.length > 0) {
      data.map((item) => {
        if (item.authority == 'ACTION_resetPassWord') {
          setResPdw(true);
        }
      });
    }
  };
  useEffect(() => {
    // getPageFromSession();
    // console.log(pageData)
    Pdata.pageData = userPageData;
    Pdata.searchFormValues = searchFormValues;
    // console.log(Pdata);
    return () => {
      // 缓存数据
      // console.log(11111111111)

      formListHistory.setItemValue('HisUserPageData', Pdata);
      // getPageData()
    };
  }, [userPageData, searchFormValues]);

  useEffect(() => {
    getPageFromSession();
    // getData();
  }, []);

  // 从缓存取页码/历史搜索的关键字数据
  const getPageFromSession = async () => {
    // debugger
    // let data: any = {pageData: {},searchFormValues: {}};
    let data = formListHistory.getItemValue('HisUserPageData');
    console.log(data);
    if (data && data.pageData && JSON.stringify(data.pageData) != '{}') {
      await setAllUserPageData(data.pageData);
    }
    if (data && data.searchFormValues && JSON.stringify(data.searchFormValues) != '{}') {
      // console.log(data.searchFormValues);
      await setSearchFormValues2(data.searchFormValues);
      // setSearchFormValues(data.searchFormValues)
    }
    // setSearchFormValues(data.searchFormValues)
  };

  // 获取表格选择的页码数据
  const getPageData = (data: any) => {
    setUserPageData(data);
  };

  // 最终页码
  // const dataPage = () => {
  //   // debugger
  //   if (pageData.current) {
  //     console.log(pageData.current.getPageData())
  //     return pageData.current.getPageData()
  //   }
  //   return null
  // }

  // 树形数据
  // const getData = async () => {
  //   let res = await api.getRegionTreeData();
  //   // console.log('树形数据 =>', res)
  //   if (res.code === 0) {
  //     setTreeSelectData(res.data);
  //   }
  // };

  // 勾选表格
  const tableChange = (selectedRowKeys: any) => {
    setRemoveList(selectedRowKeys);
  };
  // 搜索框的表单
  const queryFieldsProp = [
    // {
    //   label: '归属区',
    //   name: 'regionCode',
    //   components: (
    //     <TreeSelect
    //       allowClear
    //       placeholder="请选择"
    //       treeData={treeSelectData}
    //       showSearch
    //       filterTreeNode={(input: any, node: any) => {
    //         if (typeof node.title === 'string') {
    //           if (node.title.indexOf(input) !== -1) {
    //             return true;
    //           } else {
    //             return false;
    //           }
    //         } else {
    //           if (node.name.indexOf(input) !== -1) {
    //             return true;
    //           } else {
    //             return false;
    //           }
    //         }
    //       }}
    //       onChange={(value: string, title: any) => {
    //         searchFormRef.current?.setFuekdsValue({ regionCode: title[0] });
    //       }}
    //     />
    //   ),
    // },
    {
      label: '昵称/账号',
      name: 'userName',
      components: <Input placeholder="请输入昵称/账号" allowClear />,
    },
    {
      label: '手机号',
      name: 'mobile',
      components: <Input placeholder="请输入手机号" allowClear />,
    },
    {
      label: '邮箱',
      name: 'email',
      components: <Input placeholder="请输入邮箱" allowClear />,
    },
  ];

  // 新增方法
  const handleAdd = () => {
    setOperate(1);
  };

  // 修改方法
  const handleUpdate = (data: any) => {
    setOperate(2);
    setUserInfo(data);
  };
  // 查看用户信息
  const handleUpdateUser = (data: any) => {
    setViewDetailsShow(true);
    setUserInfo(data);
  };

  // 重置密码弹窗
  const handleResetPasw = (data: any) => {
    setReSetPassWordShow(true);
    setUserInfo(data);
  };
  // 重置密码
  const reSetPassWord = () => {
    // console.log(value)
    passwordInfoRef.current?.validateFields().then(async (values: any) => {
      // console.log(values)
      setBtnLoading(true);
      const [flag, msg] = await judgeSucessAndGetMessage(updatePasswordByUserId(values));
      if (flag) {
        message.success(msg || '操作成功');
        // setOperate(0);
      } else {
        message.error(msg || '操作失败');
      }
      setBtnLoading(false);
    });
  };
  // 关闭方法
  const handleCancel = () => {
    setOperate(0);
    setTabKey(1);
    setUserInfo(undefined);
    userInfoRef.current?.resetFields();
    passwordInfoRef.current?.resetFields();
    roleInfoRef.current?.resetFields();
  };

  //获取公司列表方法
  // const companylist = async () => {
  //   let res = await api.getCompanyList();
  //   if (res.code == 0) {
  //     setCompany(res.data);
  //   }
  // };

  //获取角色列表方法
  const rolelist = async () => {
    let res = await api1.getRoleList();
    if (res.code == 0) {
      setRole(res.data);
    }
  };

  // 切换内容封装
  const TAB_OPTION = [
    {
      key: 1,
      name: '用户信息',
      width: 700,
      okHandle: () => {
        userInfoRef.current?.validateFields().then(async (values: any) => {
          setBtnLoading(true);
          // console.log("添加/修改用户的信息values2==", values)
          for (let key in values) {
            if (values[key] == undefined) {
              delete values[key];
            }
          }
          console.log('添加/修改用户的信息values==', values);
          const [flag, msg] = await judgeSucessAndGetMessage(
            operate === 2 ? updateUser(values) : addUser(values),
          );
          if (flag) {
            // 如果修改自己的信息需要等下登录
            if (values.userId === initialState?.currentUser.userId && props.dispatch) {
              countDown(msg);
            } else {
              message.success(msg || '操作成功');
            }
            queryFormRef.current?.onSearchExec();
            if (operate === 1) handleCancel();
            setOperate(0);
          } else {
            message.error(msg || '操作失败');
          }
          setBtnLoading(false);
        });

        const countDown = (msg: any) => {
          let secondsToGo = 5;
          const modal = Modal.success({
            title: '提示',
            content: `${msg || '操作成功'}，你修改了当前账号信息, ${secondsToGo}秒后重新登录.`,
            onOk: () => {
              clearInterval(timerClear);
              props.dispatch({
                type: 'login/logout',
              });
            },
          });
          const timer = setInterval(() => {
            secondsToGo -= 1;
            modal.update({
              content: `${msg || '操作成功'}，你修改了当前账号信息, ${secondsToGo}秒后重新登录.`,
            });
          }, 1000);
          const timerClear = setTimeout(() => {
            clearInterval(timer);
            props.dispatch({
              type: 'login/logout',
            });
            modal.destroy();
          }, secondsToGo * 1000);
        };
      },
    },
    {
      key: 2,
      name: '分配角色',
      width: 800,
      okHandle: () => {
        roleInfoRef.current?.validateFields().then(async (values: any) => {
          setBtnLoading(true);
          const nVals = {
            userId: values.userId,
            roleIds: values.grantRoles ? values.grantRoles.join(',') : undefined,
          };
          const [flag, msg] = await judgeSucessAndGetMessage(addRolesByUseId(nVals));
          if (flag) {
            message.success(msg || '操作成功');
          } else {
            message.error(msg || '操作失败');
          }
          setBtnLoading(false);
        });
      },
    },
    { key: 3, name: '分配权限', width: 800 },
    {
      key: 4,
      name: '修改密码',
      width: 800,
      okHandle: () => {
        passwordInfoRef.current?.validateFields().then(async (values: any) => {
          setBtnLoading(true);
          const [flag, msg] = await judgeSucessAndGetMessage(updatePasswordByUserId(values));
          if (flag) {
            message.success(msg || '操作成功');
            // setOperate(0);
          } else {
            message.error(msg || '操作失败');
          }
          setBtnLoading(false);
        });
      },
    },
  ];

  // 保存方法
  const handleOk = () => {
    setSubmitDisabled(true);
    setTimeout(() => {
      setSubmitDisabled(false);
    }, 2000);
    const okHandle = TAB_OPTION.find((item) => item.key === tabKey)?.okHandle;
    if (okHandle) {
      okHandle();
      // setTabKey(1);
    }
  };

  // 表头
  const tableColumns: ColumnsType<any> = [
    {
      title: '登录名',
      dataIndex: 'userName',
      key: 'userName',
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      key: 'nickName',
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
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
      title: '用户类型',
      dataIndex: 'userType',
      key: 'userType',
      ellipsis: true,
    },

    {
      title: '角色',
      dataIndex: 'roleList',
      key: 'roleList',
      ellipsis: true,
      // render: (text) => {
      //   let roleName: any = [];

      //   // console.log('role =>', role);

      //   if (text == null) {
      //     return <span>role</span>;
      //   }

      //   role && role.map != null
      //     ? role.map((item: any) => {
      //       text != null &&
      //         text.map != null &&
      //         text.map((i: any) => {
      //           if (item.roleId === i) {
      //             roleName.push(item.roleName);
      //           }
      //         });
      //     })
      //     : undefined;
      //   return roleName.toString();
      // },
    },

    {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'userDesc',
      key: 'userDesc',
      ellipsis: true,
      render: (res: any, record: any) => {
        return res && res != 'undefined' ? res : '';
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: respdw ? 150 : 130,
      fixed: 'right',
      render: (_, record: any) => {
        return (
          <>
            <Typography.Link
              style={{ marginRight: '8px' }}
              onClick={() => handleUpdateUser(record)}
            >
              查看
            </Typography.Link>
            <Typography.Link
              style={respdw ? { marginRight: '8px' } : { marginRight: '0px' }}
              onClick={() => handleUpdate(record)}
            >
              修改
            </Typography.Link>
            {respdw && (
              <Typography.Link onClick={() => handleResetPasw(record)}>重置密码</Typography.Link>
            )}
          </>
        );
      },
    },
  ];

  // 切换方法
  const handleTabChange = (key: string) => {
    setTabKey(parseInt(key, 10));
  };

  // // 请求列表数据方法
  // const getTableData = async (params?: any) => {
  //   if(params && params.regionCode){
  //     setRegionCode(params.regionCode)
  //   }else{
  //     setRegionCode("")
  //   }
  //   const data = await judgeSucessAndGetData(fetchUserPage(params));
  //   // console.log(data);

  //   setPageData(data || {});
  // };

  // 初始化
  useEffect(() => {
    queryFormRef.current?.onSearchExec();
    // companylist();
    rolelist();
  }, []);

  // 关闭查看用户抽屉
  const handleCancelUser = () => {
    setViewDetailsShow(false);
  };
  const setVal = async () => {
    if (JSON.stringify(searchFormValues) == '{}' && JSON.stringify(searchFormValues2) == '{}') {
      console.log(1111);
      setSearchFormValues({});
      // setFlag(true);
    } else {
      // let obj:any = {}
      // obj.searchFormValues = {}
      // obj.flag = true
      // setFormValues(obj)
      // console.log(2222)
      await setSearchFormValues2({});
      await setSearchFormValues({});
      setFlag(true);
    }
  };
  // /**
  //  *  请求分页数据
  //  *
  //  * @param {*} pagination
  //  * @param {*} filters
  //  * @param {*} sorter
  //  */
  // const handleTableChange = async (pagination: any, filters: any, sorter: any) => {
  //   // debugger
  //   console.log(regionCode);

  //   if(regionCode){
  //     await getTableData({ page: pagination.current, limit: pagination.pageSize , regionCode})
  //   }else{
  //     await getTableData({ page: pagination.current, limit: pagination.pageSize })
  //   }
  //   // console.log(pagination, filters, sorter)
  // }
  return (
    <>
      {/* 搜索表单 */}
      <TableSearchForm
        ref={queryFormRef}
        queryFieldsProp={queryFieldsProp}
        // onReset={() => {
        //   getTableData();

        // }}
        // onSearch={(values) => {
        //   setSearchFormValues(values)
        //   // debugger
        //   getTableData(values);
        // }}
        onSearch={async (values) => {
          // await setSearchFormValues2({});
          setSearchFormValues(values);
          console.log(values);
          // Pdata.searchFormValues = values
        }}
        onReset={async () => {
          // await setSearchFormValues2({});
          // await setSearchFormValues({});
          // setFlag(true);
          setVal();
          // setAllUserPageData({});
        }}
      />

      {/* 主内容 */}
      <Card
        className={styles.UserManagementCard}
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
          rowKey="userId"
          dataSource={pageData ? pageData.records : []}
          onChange={handleTableChange}
          pagination={{
            pageSize: pageData ? pageData.limit : 10,
            total: pageData ? pageData.total : 0,
            current: pageData ? pageData.page : 1,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total, range) => GLOBAL_VALUE.TABLE_SHOWTOTAL(total, range),
          }}
        /> */}
        {/* 表格 */}
        {/* {console.log('===>', searchFormValues2,searchFormValues)} */}
        {
          <BizTable
            PageData={allUserPageData}
            flag={flag}
            getPageData={getPageData}
            // ref={pageData}
            columns={tableColumns}
            listService={fetchUserPage}
            rowKey="userId"
            searchFormValues={
              JSON.stringify(searchFormValues2) != '{}' ? searchFormValues2 : searchFormValues
              // searchFormValues
            }
            rowSelection={{
              type: 'checkbox',
              onChange: tableChange,
            }}
          />
        }
      </Card>

      <Drawer
        visible={operate !== 0}
        width={TAB_OPTION.find((item) => item.key === tabKey)?.width}
        title={TAB_OPTION.find((item) => item.key === tabKey)?.name}
        onClose={handleCancel}
        maskClosable={false}
        destroyOnClose
        footer={
          <div className={styles.UserManagementDrawer}>
            <Button
              className={styles.UserManagementBtn}
              type="primary"
              disabled={submitDisabled}
              loading={submitDisabled}
              onClick={handleOk}
            >
              保存
            </Button>
            <Button className={styles.UserManagementBtn} onClick={handleCancel}>
              关闭
            </Button>
          </div>
        }
      >
        <Tabs activeKey={tabKey.toString()} onChange={handleTabChange}>
          <TabPane tab={TAB_OPTION[0].name} key={TAB_OPTION[0].key}>
            <UserInfo
              operate={operate}
              ref={userInfoRef}
              infoData={userInfo}
              company={company}
              role={role}
            />
          </TabPane>

          {/* <TabPane tab={TAB_OPTION[1].name} key={TAB_OPTION[1].key} disabled={operate === 1}>
            <RoleInfo ref={roleInfoRef} infoData={userInfo} />
          </TabPane> */}
          {/* <TabPane tab={TAB_OPTION[2].name} key={TAB_OPTION[2].key}>
            <MenuInfo operate={operate} />
          </TabPane> */}
          {/* <TabPane tab={TAB_OPTION[3].name} key={TAB_OPTION[3].key} disabled={operate === 1}>
            <PasswordInfo ref={passwordInfoRef} infoData={userInfo} />
          </TabPane> */}
        </Tabs>
      </Drawer>
      {
        // console.log('========',role)
      }
      {viewDetailsShow && (
        <Drawer
          title="用户信息"
          visible={viewDetailsShow}
          onClose={handleCancelUser}
          width={520}
          footer={
            <div
            // className={styles.UserManagementDrawer}
            >
              <Button
                // className={styles.UserManagementBtn}
                onClick={handleCancelUser}
              >
                关闭
              </Button>
            </div>
          }
        >
          {/* 查看用户信息 */}
          <UserInfoSee
            operate={operate}
            ref={userInfoRef}
            infoData={userInfo}
            company={company}
            role={role}
          />
        </Drawer>
      )}
      {reSetPassWordShow && (
        <Drawer
          width={520}
          title="重置密码"
          visible={reSetPassWordShow}
          onClose={() => {
            setReSetPassWordShow(false);
          }}
          footer={
            <div className={styles.UserManagementDrawer}>
              <Button
                className={styles.UserManagementBtn}
                htmlType="submit"
                type="primary"
                disabled={submitDisabled}
                loading={submitDisabled}
                onClick={reSetPassWord}
              >
                保存
              </Button>
              <Button
                className={styles.UserManagementBtn}
                onClick={() => {
                  setReSetPassWordShow(false);
                }}
              >
                关闭
              </Button>
            </div>
          }
        >
          {/* <Form 
            onFinish={reSetPassWord}
          >
            <Form.Item
              initialValue={userInfo.userName}
              label="用户名"
              name="userName"
            >
              <Input disabled/>
            </Form.Item>
            <Form.Item
              label="请输入新密码"
              name="password"
              rules={[{ required: true, message: "请输入大小写字母+数字+特殊字符包含4类中三种类型，长度为8位以上的密码", pattern: new RegExp('^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,30}$'), }]}
            >
              <Input/>
            </Form.Item>
            <Form.Item
              label="请再次输入密码"
              name="reSetPassword"
              rules={[{ required: true, message: "请输入大小写字母+数字+特殊字符包含4类中三种类型，长度为8位以上的密码", pattern: new RegExp('^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\\W_!@#$%^&*`~()-+=]+$)(?![0-9\\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\\W_!@#$%^&*`~()-+=]{8,30}$'), }]}
            >
              <Input/>
            </Form.Item>
            <Form.Item>

            </Form.Item>
          </Form> */}
          <PasswordInfo ref={passwordInfoRef} infoData={userInfo} />
        </Drawer>
      )}
    </>
  );
};

// export default FunctionComponent;
export default FunctionComponent;
