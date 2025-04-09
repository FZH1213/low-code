import { Area } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { isArray } from 'lodash';
import { demoData } from './data';

interface PcVAreaProps {
  requestUrl: string;
  xField: string;
  yField: string;
  height: number;
  _var: any;
}
export const PcVArea: React.FC<PcVAreaProps> = (props) => {
  const [data, setData] = useState<any>([]);
  const request = createRequest(props.requestUrl, 'post');
  const renderHandle = async () => {
    if (!props.requestUrl) {
      setData(demoData);
      return;
    }
    const data = await judgeSucessAndGetData(await request(props._var));
    if (!data) return;
    if (isArray(data)) {
      setData(data);
    } else {
      setData([]);
    }
  };
  useEffect(() => {
    renderHandle();
  }, [props._var]);
  return (
    <Area
      data={data}
      xField={props.xField}
      yField={props.yField}
      height={props.height}
      xAxis={{
        range: [0, 1],
      }}
    />
  );
};
