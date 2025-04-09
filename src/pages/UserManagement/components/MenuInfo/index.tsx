import React, { forwardRef, useEffect, useState } from 'react';
import { Form } from '@/components/base';

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

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

const FunctionComponent: React.FC<ComponentProps> = forwardRef(({ operate = 3, infoId }, ref) => {
  return (
    <>
      <Form {...layout} ref={ref}>
        <Form.Item label="过期时间"></Form.Item>
      </Form>
    </>
  );
});

export default FunctionComponent;
