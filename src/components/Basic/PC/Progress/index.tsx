import { Progress, Form } from '@/components/base';
import React, { useState } from 'react';
import {} from 'module';
/**
 *
 * @return {*}
 */
interface PcProgressProps {
  label: string;
  name: string;
  hidden: boolean;
  value: number;
  size: string;
}
export const PcProgress: React.FC<PcProgressProps> = (props) => {
  const [percentNum, setProcessNum] = useState(null);

  return (
    <Form.Item
      label={props.label}
      name={props.name}
      hidden={props.hidden}
      initialValue={props.value}
      getValueFromEvent={(...args) => {
        console.log('getValueFromEvent', args);
      }}
      getValueProps={(value) => {
        setProcessNum(value);
        if (!value) return {};
        return value;
      }}
    >
      <Progress percent={percentNum ? percentNum : props?.value} size={props?.size} {...props} />
    </Form.Item>
  );
};
