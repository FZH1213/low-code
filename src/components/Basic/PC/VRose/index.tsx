import { Rose } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { isArray } from 'lodash';
import { demoData } from './data';

interface PcVRoseProps {
  requestUrl: string;
  xField: string;
  yField: string;
  height: number;
  _var: any;
}
export const PcVRose: React.FC<PcVRoseProps> = (props) => {
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
    <Rose
      data={data}
      xField={props.xField}
      yField={props.yField}
      seriesField={props.xField}
      height={props.height}
      radius={0.8}
    />
  );
};
