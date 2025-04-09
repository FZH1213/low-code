
import {
  BizTable,
  Button,
  Card, Col, Form, Input, Modal, Row, Select, Space, Spin, Table, Tree, TreeSelect, Typography,
} from '@/components/base';
import React, { useEffect, useRef, useState } from 'react';

import { SubmitButton } from '@/components/base/form/Button';
import { addOrg, fetchOrgPage, removeOrgById, removeRoleUserById } from './service';
const { Search } = Input;
import { DataNode } from 'antd/es/tree';
import { message } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less'
import TableSearchForm, { TableSearchFormInstance } from '@/components/TableSearchForm';
import api from '@/services/api';
import { fetchRoleUserPage } from './service';
import { ColumnsType } from 'antd/lib/table/interface';
import UpdateModal from './components/UpdateModal';
import UserInfoModalItem from './components/UserInfoModalItem';
import { judgeSucessAndGetMessage } from '@/utils/requestUtil';
export interface ComponentProps { }

const FunctionComponent: React.FC<ComponentProps> = (props: { [key: string]: any }) => {
  const [AddVisible, setAddVisible] = useState<any>(false)
  const [updateOrgVisible, setUpdateOrgVisible] = useState<any>(false)
  const [loading, setLoading] = useState<any>(false)
  const queryFormRef1 = useRef<TableSearchFormInstance | undefined>(undefined);
  // 提交
  const btnSubmitRef = useRef<any>();
  const [title, setTitle] = useState<any>('')
  //人员查询条件
  const [searchFormValues3, setSearchFormValues3] = useState<any>({});
  const [searchFormValues4, setSearchFormValues4] = useState<any>({});
  //树列表
  const [treeDataList, setTreeDataList] = useState<any>([])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [selectTreeKey, setSelectTreeKey] = useState<any>(undefined)
  const [selectKey, setSelectKey] = useState<any>([])
  const formRef = useRef<any>(null);
  const [addOrupdateUserInfoVisible, setAddOrUpdateUserInfoVisible] = useState<any>(false)
  const [roleUserRecordDetail, setRoleUserRecordDetail] = useState<any>(undefined)
  const [flag1, setFlag1] = useState<any>(false);
  const [roleUserPageData, setRoleUserPageData] = useState<any>({});
  const [currentOrg, setCurrentOrg] = useState<any>({})
  const [orgRecordDetail, setOgrRecordDetail] = useState<any>(undefined)
  const [pname, setPname] = useState<any>('')
  const [orgTypeListData, setOrgTypeListData] = useState<any>([])
  // 归属区的下拉选择树状框
  const [treeSelectData, setTreeSelectData] = useState<any>([]);
  //角色列表
  const [role, setRole] = useState<any>([]);
  const [userNameListData, setUserNameListData] = useState<any>([])
  const getTreeData = () => {
    fetchOrgPage().then(res => {
      if (res.code == 0) {
        setTreeDataList(res.data)
        setTreeSelectData(res.data)
      } else {
        message.error('加载失败，请重试！')
      }
    })
  }
  useEffect(() => {
    getTreeData()
    rolelist()
    orgTypeList()
    userNameList()
  }, [])
  //查看人员弹窗
  const handleUserVisible = (record: any) => {
    if (record) {
      let OrgObj = {}
      OrgObj['id'] = record.key
      OrgObj['name'] = record.title
      if (JSON.stringify(searchFormValues4) != '{}') {
        setSearchFormValues4({ 'orgId': record.key })
        setSearchFormValues3({ 'orgId': record.key });
      } else {
        setSearchFormValues3({ 'orgId': record.key });
      }
      setCurrentOrg(OrgObj)
    } else {
      setSearchFormValues3({})
      setCurrentOrg({})
    }

  }
  // 获取人员表格选择的页码数据
  const getRoleUserPageData = (data: any) => {
    setRoleUserPageData(data);
  };
  const setVal2 = async () => {
    await setSearchFormValues4(searchFormValues3);
    setFlag1(true);
  }
  //获取机构类型列表方法
  const userNameList = async () => {
    let res = await api.getUserNameList()
    if (res.code == 0) {
      let data: any = []
      res.data.userName.map((item: any, index: any) => {
        let obj: any = {}
        obj['label'] = item.userName
        obj['value'] = item.userId
        data.push(obj)
      })
      setUserNameListData(data)
    }
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAutoExpandParent(true);
    setExpandedKeys(getExpandedKeys(value));
    setSearchValue(value);
  };
  const getExpandedKeys = (searchValue: any) => {
    const dataList: any = []
    const loop = (data: DataNode[]) =>
      data.map(item => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        if (index > -1) {
          dataList.push(item.key)
        }
        if (item.children) {
          loop(item.children);
        }
      });
    loop(treeDataList);
    return dataList;
  }
  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  const onSelect = async (selectedKeys: any, e: any) => {
    setSelectKey(selectedKeys)
    setSelectTreeKey(selectedKeys[0])
    queryFormRef1.current?.setFuekdsValue({ userId: undefined })
    setOgrRecordDetail(e.selectedNodes[0])
    //查看人员弹窗
    handleUserVisible(e.selectedNodes[0])
  }
  const titleRender = (node: any) => {
    const strTitle = node.title as string;
    const index = strTitle.indexOf(searchValue);
    const beforeStr = strTitle.substring(0, index);
    const afterStr = strTitle.slice(index + searchValue.length);
    return (
      <>
        {index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{strTitle}</span>
        )}
      </>

    )
  }
  //人员新增或修改弹窗
  const handleUserAddOrUpdate = (record: any, title: any) => {
    setAddOrUpdateUserInfoVisible(true)
    setTitle(title)
    setRoleUserRecordDetail(record)
  }
  //机构修改取消弹窗
  const handleOrgUpdateCancel = (flag: any, params: any) => {
    if (flag) {
      setUpdateOrgVisible(false)
      getTreeData()
      if (params.name && params.id) {
        setCurrentOrg({ id: params.id, name: params.name })
        setOgrRecordDetail({ ...params, key: params.id })
      }
    } else {
      setUpdateOrgVisible(false)
    }
  }
  //人员搜索表单
  const queryFieldsProp1 = [
    {
      label: '登录名',
      name: 'userId',
      components: <Select placeholder="请选择" allowClear style={{ minWidth: '150px' }} options={userNameListData} showSearch
        filterOption={(input: any, option: any) =>
          (option?.label ?? '').includes(input)
        }
      />,
    },
  ]
  //获取角色列表方法
  const rolelist = async () => {
    let res = await api.getRoleList();
    if (res.code == 0) {
      setRole(res.data);
    }
  };
  const TableColumns: ColumnsType<any> = [
    {
      title: '登录名',
      dataIndex: 'userName',
      key: 'userName',
      ellipsis: true,
    },
    {
      title: '角色',
      dataIndex: 'roleId',
      key: 'roleId',
      ellipsis: true,
      render: (text: any, record: any) => {
        let value = undefined
        role.map((item: any, index: any) => {
          if (record.roleId == item.roleId) {
            value = item.roleName
          }
        })
        return <span>{value}</span>
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      render: (_, record: any) => {
        return (
          <Space>
            <Typography.Link
              onClick={() => handleUserAddOrUpdate(record, '修改人员信息')}
            >
              修改
            </Typography.Link>
            <Typography.Link onClick={() =>
              handleUserDel(record)
            }>删除</Typography.Link>
          </Space >
        );
      },
    },
  ]
  //人员删除方法
  const handleUserDel = (record: any) => {
    Modal.confirm({
      title: '确定删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        if (record.id) {
          const [flag, msg] = await judgeSucessAndGetMessage(removeRoleUserById(record.id));
          if (flag) {
            message.success(msg || '操作成功');
            queryFormRef1.current?.onSearchExec();
          } else {
            message.error(msg || '操作失败');
          }
        }
      },
    });
  }
  //获取机构类型列表方法
  const orgTypeList = async () => {
    let res = await api.getOrgTypeList({ category: 'org.type' })
    if (res.code == 0) {
      let data: any = []
      res.data.records.map((item: any, index: any) => {
        let obj: any = {}
        obj['label'] = item.name
        obj['value'] = item.value
        data.push(obj)
      })
      setOrgTypeListData(data)
    }
  }
  //人员新增或修改取消弹窗
  const handleUserInfoCancel = (flag: any) => {
    if (flag) {
      setAddOrUpdateUserInfoVisible(false)
      queryFormRef1.current?.onSearchExec();
    } else {
      setAddOrUpdateUserInfoVisible(false)
    }
  }
  return (
    <>
      <Row gutter={[10, 0]}>
        <Col span={8}>
          <Card
            title='机构管理'
            extra={
              <React.Fragment>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setAddVisible(true)
                  }}
                >
                  新增
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setUpdateOrgVisible(true)
                  }}
                  disabled={selectTreeKey ? false : true}
                >
                  修改
                </Button>
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    //机构删除方法
                    Modal.confirm({
                      title: '确定删除吗？',
                      icon: <ExclamationCircleOutlined />,
                      onOk: async () => {
                        if (selectTreeKey) {
                          const [flag, msg] = await judgeSucessAndGetMessage(removeOrgById(selectTreeKey));
                          if (flag) {
                            message.success(msg || '操作成功');
                            setSelectKey([])
                            setCurrentOrg({})
                            setSelectTreeKey(undefined)
                            getTreeData()
                          } else {
                            message.error(msg || '操作失败');
                          }
                        }
                      },
                    });
                  }}
                  disabled={selectTreeKey ? false : true}
                >
                  删除
                </Button>
              </React.Fragment>
            }
          >
            <>
              <Search style={{ marginBottom: 8 }} placeholder="请输入" allowClear onChange={onChange} />
              <Tree
                onExpand={onExpand}
                treeData={treeDataList}
                autoExpandParent={autoExpandParent}
                expandedKeys={expandedKeys}
                titleRender={titleRender}
                onSelect={onSelect}
                selectedKeys={selectKey}
              />
            </>
          </Card>
        </Col>
        <Col span={16}>
          <Card title={currentOrg.name ? `${currentOrg.name}人员信息` : '人员信息'} className={styles.cardTitle}>
          </Card>
          <TableSearchForm
            ref={queryFormRef1}
            queryFieldsProp={queryFieldsProp1}
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
              await setSearchFormValues4({ ...values, ...searchFormValues3 });
              // Pdata.searchFormValues = values
            }}
            onReset={async () => {
              // await setSearchFormValues2({});
              // await setSearchFormValues({});
              // setFlag(true);
              setVal2();
              // setAllUserPageData({});
            }}
          />

          <Card
            style={{ border: 'none' }}
            title={
              <Space>
                <Button type="primary" disabled={selectTreeKey ? false : true} icon={<PlusOutlined />} onClick={() => handleUserAddOrUpdate(undefined, '新增人员')}>
                  新增
                </Button>
              </Space>
            }
          >
            {
              selectTreeKey ?
                <BizTable
                  PageData={roleUserPageData}
                  flag={flag1}
                  getPageData={getRoleUserPageData}
                  // ref={pageData}
                  columns={TableColumns}
                  listService={fetchRoleUserPage}
                  rowKey="id"
                  searchFormValues={
                    JSON.stringify(searchFormValues4) != '{}' ? searchFormValues4 : searchFormValues3
                  }
                /> :
                <Table
                  columns={TableColumns}
                  dataSource={[]}
                />
            }
          </Card>
        </Col>
      </Row>
      {
        <Modal
          open={AddVisible}
          title='新增机构'
          maskClosable={false}
          destroyOnClose
          onCancel={() => {
            setAddVisible(false)
          }}
          footer={false}
        >
          <Form
            ref={formRef}
            name='form'
            layout="vertical"
            onFinish={() => {
              formRef.current?.validateFields().then(async (values: any) => {
                for (let key in values) {
                  if (values[key] == undefined) {
                    delete values[key];
                  }
                }
                values['pname'] = pname
                const [flag, msg] = await judgeSucessAndGetMessage(addOrg(values));
                if (flag) {
                  message.success(msg || '操作成功');
                  getTreeData()
                  setAddVisible(false)
                } else {
                  message.error(msg || '操作失败');
                  btnSubmitRef.current.reset();
                }
              });
            }}
            onFinishFailed={() => {
              btnSubmitRef.current.reset();
            }}
          >
            <Form.Item
              name="pid"
              label="所属机构"
              rules={[{ required: true, message: '请选择所属机构' }]}
              colon={false}
            >
              <TreeSelect
                allowClear
                placeholder="请选择"
                treeData={treeSelectData}
                showSearch
                filterTreeNode={(input: any, node: any) => {
                  if (typeof node.title === 'string') {
                    if (node.title.indexOf(input) !== -1) {
                      return true;
                    } else {
                      return false;
                    }
                  } else {
                    if (node.name.indexOf(input) !== -1) {
                      return true;
                    } else {
                      return false;
                    }
                  }
                }}
                onSelect={(value: any, node: any, extra: any) => {
                  node.title && setPname(node.title)
                }}
              />
            </Form.Item>
            <Form.Item
              name="name"
              label="机构名称"
              rules={[{ required: true, message: '请填写机构名称' }]}
              colon={false}
            >
              <Input placeholder='请填写'></Input>
            </Form.Item>
            <Form.Item
              name="type"
              label="机构类型"
              rules={[{ required: true, message: '请填写机构类型' }]}
              colon={false}
            >
              <Select
                allowClear
                options={orgTypeListData}
              />
            </Form.Item>
            <div className={styles.cardAffix}>
              <Space>
                <Button onClick={() => { setAddVisible(false) }}>返回</Button>
                <SubmitButton ref={btnSubmitRef}>提交</SubmitButton>
              </Space>
            </div>
          </Form>
        </Modal>
      }
      {
        updateOrgVisible ?
          <UpdateModal visible={updateOrgVisible} handleOrgUpdateCancel={handleOrgUpdateCancel} recordDetail={orgRecordDetail} treeSelectData={treeSelectData} orgTypeListData={orgTypeListData} />
          : null
      }
      {
        addOrupdateUserInfoVisible ?
          <UserInfoModalItem visible={addOrupdateUserInfoVisible} handleUserInfoCancel={handleUserInfoCancel} roleList={role} recordDetail={roleUserRecordDetail} title={title} currentOrg={currentOrg} userNameList={userNameListData} />
          : null
      }
      <Modal mask={true} visible={loading} footer={[]} closable={false} className={styles.spinBox} style={{ zIndex: 100 }}>
        <Spin spinning={true} delay={500} size='large' tip={'保存中'} style={{ position: 'absolute', top: '50%', left: '50%', translate: '-50% -25%' }} />
      </Modal>
    </>
  );
};
export default FunctionComponent;
