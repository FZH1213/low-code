import { Form, Input, message, Radio, Select, Transfer } from '@/components/base';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { getAuthority, getAuthorityAction, getAuthorityGrant } from './service';
import { judgeSucessAndGetData, judgeSucessAndGetMessage } from '@/utils/requestUtil';

export interface ComponentProps {
  /**
   * 操作类型编码
   * 1:新增
   * 2:编辑
   * 3:查看
   */
  operate?: number;
  /**
   * 编辑/查询时的id
   */
  infoId?: string;
}

export interface ActionApiInfRef {
  apiSave: () => Promise<boolean>;
}

const FunctionComponent: React.FC<ComponentProps> = forwardRef(({ operate = 3, infoId }, ref) => {
  const [tranData, setTranData] = useState<any[]>([]);
  const [targetKeys, setTargetKeys] = useState<any[]>([]);

  const getTranData = async () => {
    const data = await judgeSucessAndGetData(getAuthority());
    setTranData(data || []);
  };

  // 获取选中的权限
  const getAuthAction = async (actionId: string) => {
    const data = await judgeSucessAndGetData(getAuthorityAction({ actionId }));
    if (actionId) {
      const key = data.map((item:any) => item.authorityId);
      setTargetKeys(key);
    }
  };

  // 提交选中的权限
  const getAuthGrant = async () => {
    if (!infoId) {
      return false;
    }
    const [flag, msg] = await judgeSucessAndGetMessage(
      getAuthorityGrant({
        actionId: infoId,
        authorityIds: targetKeys,
      }),
    );
    message.success(msg);
    return flag;
  };

  useImperativeHandle(
    ref,
    (): ActionApiInfRef => ({
      apiSave: async () => {
        return getAuthGrant();
      },
    }),
  );

  useEffect(() => {
    if (infoId) {
      // 获取api列表
      getTranData();
      // 获取改按钮关联的api列表
      getAuthAction(infoId);
    }
  }, [infoId]);

  const filterOption = (inputValue:any, option:any) => option.description.indexOf(inputValue) > -1;

  const handleChange = (tks:any) => {
    setTargetKeys(tks);
  };

  const handleSearch = (dir:any, value:any) => {
    console.log('search:', dir, value);
  };

  return (
    <>
      <Transfer
        dataSource={tranData}
        showSearch
        render={(item) => `${item.path}-${item.apiName}`}
        rowKey={(record) => record.authorityId}
        // filterOption={filterOption}
        targetKeys={targetKeys}
        onChange={handleChange}
        onSearch={handleSearch}
        pagination
        listStyle={{ width: 350 }}
      />
    </>
  );
});

export default FunctionComponent;
