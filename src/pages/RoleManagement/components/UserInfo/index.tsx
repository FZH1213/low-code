import { Form, Input, Radio, Select, Transfer } from '@/components/base';
import React, { forwardRef, useEffect, useState } from 'react';
import { fetchAllUser, fetchUserByRoleId } from './service';
import { judgeSucessAndGetData } from '@/utils/requestUtil';

export interface ComponentProps {
  /**
   * 角色数据
   */
  infoData?: any;
}

const FunctionComponent: React.FC<ComponentProps> = forwardRef(({ infoData }, ref) => {
  const [tranData, setTranData] = useState<any[]>([]);
  const [targetKeys, setTargetKeys] = useState<any[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (infoData) {
      form.setFieldsValue(infoData);
    }
  }, [infoData]);

  const getTranData = async () => {
    const data = await judgeSucessAndGetData(fetchAllUser());
    setTranData(data || []);
  };

  const gethUserByRoleId = async (roleId: string) => {
    const data = await judgeSucessAndGetData(fetchUserByRoleId(roleId));
    if (data && data instanceof Array) {
      setTargetKeys(data.map((item) => item.userId) || []);
    }
  };

  useEffect(() => {
    getTranData();
  }, []);

  useEffect(() => {
    if (infoData && infoData.roleId) {
      gethUserByRoleId(infoData.roleId);
    }
  }, [infoData]);

  const filterOption = (inputValue, option) => {
    let val = `${option.userName}(${option.nickName})`;
    return val.indexOf(inputValue) > -1;
  };
    // option.description.indexOf(inputValue) > -1

  const handleChange = (tks) => {
    setTargetKeys(tks);
  };

  useEffect(() => {
    form.setFieldsValue({ userIds: targetKeys });
  }, [targetKeys]);

  const handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };

  return (
    <Form ref={ref} form={form}>
      <Form.Item name="roleId" hidden>
        <Input />
      </Form.Item>
      <Form.Item name="userIds" hidden>
        <Input />
      </Form.Item>
      <Transfer
        dataSource={tranData}
        showSearch
        rowKey={(item) => item.userId}
        filterOption={filterOption}
        targetKeys={targetKeys}
        onChange={handleChange}
        onSearch={handleSearch}
        render={(item) => (
          <>
            {item.userName}({item.nickName})
          </>
        )}
        listStyle={{ width: 300, height: 500 }}
      />
    </Form>
  );
});

export default FunctionComponent;
