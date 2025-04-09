import { DualAxes } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { isArray } from 'lodash';
import { demoData1, demoData2 } from './data';

interface PcVDualAxesProps {
  requestUrl1: string;
  requestUrl2: string;
  xField: string;
  yField1: string;
  yField2: string;
  geometry1: string;
  geometry2: string;
  seriesField1: string;
  seriesField2: string;
  height: number;
  _var: any;
}
export const PcVDualAxes: React.FC<PcVDualAxesProps> = (props) => {
  const [data1, setData1] = useState<any>([]);
  const [data2, setData2] = useState<any>([]);
  const request1 = createRequest(props.requestUrl1, 'post');
  const request2 = createRequest(props.requestUrl2, 'post');
  const renderHandle1 = async () => {
    if (!props.requestUrl1) {
      setData1(demoData1);
      return;
    }
    const data = await judgeSucessAndGetData(await request1(props._var));
    if (!data) return;
    if (isArray(data)) {
      setData1(data);
    } else {
      setData1([]);
    }
  };
  const renderHandle2 = async () => {
    if (!props.requestUrl2) {
      setData2(demoData2);
      return;
    }
    const data = await judgeSucessAndGetData(await request2(props._var));
    if (!data) return;
    if (isArray(data)) {
      setData2(data);
    } else {
      setData2([]);
    }
  };
  useEffect(() => {
    renderHandle1();
    renderHandle2();
  }, [props._var]);
  return (
    <DualAxes
      data={[data1, data2]}
      height={props.height}
      xField={props.xField}
      yField={[props.yField1, props.yField2]}
      geometryOptions={[
        {
          geometry: ['column', 'mulColumn'].includes(props.geometry1) ? 'column' : 'line',
          seriesField: props.seriesField1,
          // columnWidthRatio: 0.1,
        },
        {
          geometry: ['column', 'mulColumn'].includes(props.geometry2) ? 'column' : 'line',
          seriesField: props.seriesField2,
        },
      ]}
    />
  );
};
