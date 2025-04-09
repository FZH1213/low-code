import type { FormInstance } from '@/components/base';
import type { ActionApiInfRef } from './components/ActionApiInfo';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Table,
} from '@/components/base';
import { PlusOutlined, PropertySafetyFilled } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table/interface';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import ActionInfo from './components/ActionInfo';
import ActionApiInfo from './components/ActionApiInfo';
import { judgeSucessAndGetData, judgeSucessAndGetMessage } from '@/utils/requestUtil';
import { fetchActionByMenuId, removeByActionId, addAction, updateByActionId } from './service';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export interface ComponentProps {
  /**
   * 菜单数据
   */
  infoData?: any;
  /**
   *菜单树
   */
  menuTree?: any[];
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const FunctionComponent: React.FC<ComponentProps> = forwardRef(({ infoData, menuTree }, ref) => {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const [tableData, setTableData] = React.useState<any[] | undefined>([]);
  const [operate, setOperate] = useState<number>(0);
  const [apiModalVisable, setApiModalVisable] = useState<boolean>(false);
  const [actionInfo, setActionInfo] = useState<any>(undefined);
  const [actionId, setActionIdo] = useState<string | undefined>(undefined);
  const actionInfoRef = useRef<FormInstance | undefined>(undefined);
  const actionApiInfoRef = useRef<ActionApiInfRef | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const getActionByMenuId = async (menuId: string) => {
    const data = await judgeSucessAndGetData(fetchActionByMenuId(menuId));
    if (data && data instanceof Array) {
      setTableData(data);
    }
  };

  useEffect(() => {
    if (infoData && infoData.menuId) {
      getActionByMenuId(infoData.menuId);
    } else {
      setTableData([]);
    }
  }, [infoData]);

  const handleAdd = () => {
    if (infoData && infoData.menuId) {
      setOperate(1);
      setActionInfo({ menuId: infoData.menuId });
    } else {
      message.error('请选择需要添加功能的菜单');
    }
  };

  const handleUpdate = (data: any) => {
    setActionInfo(data);
    setOperate(2);
  };

  const handleCancel = () => {
    setOperate(0);
    setActionInfo(undefined);
    actionInfoRef.current?.resetFields();
  };

  const handleDelete = (data: any) => {
    Modal.confirm({
      title: '确定删除吗？',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        if (data.actionId) {
          const [flag, msg] = await judgeSucessAndGetMessage(removeByActionId(data.actionId));
          if (flag) {
            message.success(msg || '操作成功');
            getActionByMenuId(infoData.menuId);
            handleCancel();
          } else {
            message.error(msg || '操作失败');
          }
        }
      },
    });
  };

  const handleApiCancel = () => {
    setActionIdo(undefined);
    setApiModalVisable(false);
  };

  const handleApiAdd = (data: any) => {
    if (data && data.actionId) {
      setActionIdo(data.actionId);
    }
    setApiModalVisable(true);
  };

  const handleOk = () => {
    actionInfoRef.current?.validateFields().then(async (values: any) => {
      Modal.confirm({
        title: `确定修改功能名称为【${values.actionName}】的配置吗？`,
        icon: <ExclamationCircleOutlined />,
        onOk: async () => {
          setBtnLoading(true);
          const [flag, msg] = await judgeSucessAndGetMessage(
            operate === 2 ? updateByActionId(values) : addAction(values),
          );
          if (flag) {
            message.success(msg || '操作成功');
            getActionByMenuId(infoData.menuId);
            handleCancel();
          } else {
            message.error(msg || '操作失败');
          }
          setBtnLoading(false);
        },
      });
    });
  };

  const handleApiOk = async () => {
    setLoading(true);
    if (actionApiInfoRef) {
      const flag = await actionApiInfoRef.current?.apiSave();
      if (flag) {
        setApiModalVisable(false);
      }
    }
    setLoading(false);
  };

  const tableColumns: ColumnsType<any> = [
    {
      title: '功能名称',
      dataIndex: 'actionName',
      key: 'actionName',
    },
    {
      title: '功能编码',
      dataIndex: 'actionCode',
      key: 'actionCode',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      fixed: 'right',
      width: 100,
      render: (_, record) => {
        return (
          <Space>
            <a onClick={() => handleUpdate(record)}>编辑</a>
            {/* <a onClick={() => handleApiAdd(record)}>权限接口</a> */}
            <a onClick={() => handleDelete(record)}>删除</a>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <Button style={{ marginBottom: 10 }} icon={<PlusOutlined />} onClick={handleAdd} type="primary">
        添加功能按钮
      </Button>
      <Table
        size="small"
        columns={tableColumns}
        // scroll={{ y: 'calc(100vh - 210px)' }}
        defaultExpandAllRows
        dataSource={tableData}
        pagination={false}
      />
      <Modal
        visible={operate !== 0}
        title={operate === 1 ? '新增功能按钮' : '更新功能按钮'}
        onCancel={handleCancel}
        maskClosable={false}
        okText="保存"
        okButtonProps={{ loading: btnLoading }}
        cancelText="关闭"
        onOk={handleOk}
        destroyOnClose
      >
        <ActionInfo menuTree={menuTree} infoData={actionInfo} ref={actionInfoRef} />
      </Modal>
      <Modal
        visible={apiModalVisable}
        title="接口授权"
        onCancel={handleApiCancel}
        maskClosable={false}
        okText="保存"
        okButtonProps={{ loading }}
        cancelText="关闭"
        onOk={handleApiOk}
        width={800}
        destroyOnClose
      >
        <ActionApiInfo infoId={actionId} ref={actionApiInfoRef} />
      </Modal>
    </>
  );
});

export default FunctionComponent;
