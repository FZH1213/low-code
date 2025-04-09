import React, { forwardRef, useEffect, useState } from 'react';
import { DatePicker, Form, Input } from '@/components/base';
import RoleCheckTable from '@/pages/MenuManagement/components/RoleCheckTable';
import { fetchAuthByRoleId } from './service';
import { judgeSucessAndGetData } from '@/utils/requestUtil';
import moment from 'moment';
import styles from './style/index.less'
export interface ComponentProps {
  /**
   * 角色数据
   */
  infoData?: any;
  ref?: any;
}

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
};

const FunctionComponent: React.FC<ComponentProps> = forwardRef(({ infoData }, ref) => {
  const [form] = Form.useForm();

  const getAuhtByRoleId = async (userId: string) => {
    const data = await judgeSucessAndGetData(fetchAuthByRoleId(userId));
    if (data && data instanceof Array && data.length > 0) {
      form.setFieldsValue({
        grantMenus: data.map((item) => item.authorityId),
        expireTime: data[0].expireTime ? moment(data[0].expireTime) : undefined,
      });
    }
  };

  useEffect(() => {
    if (infoData && infoData.roleId) {
      getAuhtByRoleId(infoData.roleId);
    }
  }, [infoData]);

  useEffect(() => {
    if (infoData) {
      form.setFieldsValue(infoData);
    }
  }, [infoData]);

  return (
    <>
      <Form {...layout} ref={ref} form={form}>
        <Form.Item name="roleId" hidden>
          <Input />
        </Form.Item>
        <Form.Item label="过期时间" name="expireTime">
          <DatePicker className={styles.roleManagementJurisdiction} />
        </Form.Item>
        <Form.Item label="功能菜单" name="grantMenus">
          <RoleCheckTable />
        </Form.Item>
      </Form>
    </>
  );
});

export default FunctionComponent;
