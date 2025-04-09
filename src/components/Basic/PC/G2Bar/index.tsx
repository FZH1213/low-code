import { Bar } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { isArray } from 'lodash';
/**
 * 条形图
 *
 * @param {*} props
 * @param {*} props.requestUrl  请求
 * @param {*} props.xField  x轴
 * @param {*} props.yField  y轴
 * @param {*} props.seriesField  分类关键字
 */
interface PcG2BarProps {
  requestUrl: string;
  xField: string;
  yField: string;
  seriesField: string;
  _var: any;
}
export const PcG2Bar: React.FC<PcG2BarProps> = (props) => {
  const [data, setData] = useState<any>([]);
  const request = createRequest(props.requestUrl, 'post');
  const renderHandle = async () => {
    if (!props.requestUrl) return;
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
    <Bar
      data={data}
      xField={props?.xField}
      yField={props?.yField}
      seriesField={props?.seriesField}
      legend={{ position: 'top-left' }}
    />
  );
};
