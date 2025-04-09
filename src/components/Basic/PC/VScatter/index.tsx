import { Scatter } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { isArray } from 'lodash';
import { demoData } from './data';

interface PcVScatterProps {
  requestUrl: string;
  xField: string;
  yField: string;
  colorField: string;
  sizeField: string;
  shape: string;
  height: number;
  xBaseline: number;
  yBaseline: number;
  sizeMin: number;
  sizeMax: number;
  _var: any;
}
export const PcVScatter: React.FC<PcVScatterProps> = (props) => {
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
    <Scatter
      xField={props.xField}
      yField={props.yField}
      colorField={props.colorField}
      sizeField={props.sizeField}
      shape={props.shape}
      height={props.height}
      quadrant={{
        xBaseline: props.xBaseline,
        yBaseline: props.yBaseline,
      }}
      size={[props.sizeMin, props.sizeMax]}
      data={data}
    />
  );
};
