import React, { forwardRef, useEffect, useState } from 'react';
import { fetchAllRoles, fetchRolesByUserId } from './service';
import { judgeSucessAndGetData } from '@/utils/requestUtil';
import { Checkbox, Form, Input } from '@/components/base';
import styles from './style/index.less';

export interface ComponentProps {
  /**
   * 用户数据
   */
  infoData?: any;
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const FunctionComponent: React.FC<ComponentProps> = forwardRef(({ infoData }, ref) => {
  const [allRoles, setAllRoles] = useState<any[]>([]);
  const [form] = Form.useForm();

  const getAllRoles = async () => {
    const data = await judgeSucessAndGetData(fetchAllRoles());
    setAllRoles(data || []);
  };
  const getRolesByUserId = async (userId: string) => {
    const data = await judgeSucessAndGetData(fetchRolesByUserId(userId));

    if (data && data instanceof Array) {
      form.setFieldsValue({ grantRoles: data.map((item) => item.roleId) });
    }
  };

  useEffect(() => {
    getAllRoles();
  }, []);

  useEffect(() => {
    if (infoData && infoData.userId) {
      getRolesByUserId(infoData.userId);
      form.setFieldsValue(infoData);
    }
  }, [infoData]);

  return (
    <>
      <Form {...layout} ref={ref} form={form}>
        <Form.Item name="userId" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="grantRoles" label="分配角色" className={styles['overload-checkbod']}>
          <Checkbox.Group>
            {allRoles.map((item) => (
              <Checkbox key={item.roleId} value={item.roleId}>
                {item.roleName}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </>
  );
});

export default FunctionComponent;
