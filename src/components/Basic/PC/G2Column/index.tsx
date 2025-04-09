import { Column } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { isArray } from 'lodash';
/**
 * 柱状图
 *
 * @param {*} props
 * @param {*} props.padding
 * @param {*} props.xField  x轴
 * @param {*} props.yField  y轴
 * @param {*} props.xAxis   x轴配置
 * @param {*} props.yAxis   y轴配置
 * @param {*} props.seriesField  分类关键字
 */
interface PcG2ColumnProps {
  requestUrl: string;
  padding: string;
  xField: string;
  yField: string;
  xAxis: any;
  yAxis: any;
  seriesField: string;
  _var: any;
}
export const PcG2Column: React.FC<PcG2ColumnProps> = (props) => {
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
    <Column
      data={data}
      xField={props?.xField}
      yField={props?.yField}
      xAxis={props?.xAxis}
      yAxis={props?.yAxis}
      seriesField={props?.seriesField}
    />
  );
};
