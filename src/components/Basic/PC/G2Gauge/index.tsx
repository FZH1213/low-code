import { Gauge } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { isArray } from 'lodash';
/**
 * 仪表盘
 *
 * @param {*} props
 * @param {*} props.requestUrl 请求接口
 */
interface PcG2GaugeProps {
  requestUrl: string;
  _var: any;
}
export const PcG2Gauge: React.FC<PcG2GaugeProps> = (props) => {
  const [data, setData] = useState<any>([]);
  const request = createRequest(props.requestUrl, 'post');
  const renderHandle = async () => {
    if (!props.requestUrl) return;
    const data = await judgeSucessAndGetData(await request(props._var));
    if (!data) return;
    if (isArray(data)) {
      setData([]);
    } else {
      setData(data);
    }
  };
  useEffect(() => {
    renderHandle();
  }, [props._var]);
  return (
    <Gauge
      percent={data}
      statistic={{
        content: {
          formatter: ({ percent }) => `Rate: ${(percent * 100).toFixed(0)}%`,
        },
      }}
    />
  );
};
