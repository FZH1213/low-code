import { Liquid } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { isArray } from 'lodash';
/**
 * 水波图
 *
 * @param {*} props
 * @param {*} props.requestUrl 请求接口
 */
interface PcG2LiquidProps {
  requestUrl: string;
  _var: any;
}
export const PcG2Liquid: React.FC<PcG2LiquidProps> = (props) => {
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
  return <Liquid percent={data} />;
};
