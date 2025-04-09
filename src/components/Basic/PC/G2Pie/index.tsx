import { Pie } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { isArray } from 'lodash';
/**
 * 饼图
 *
 * @param {*} props
 * @param {*} props.requestUrl  请求名称
 * @param {*} props.angleField   值
 * @param {*} props.colorField  字段名
 * @param {*} props.radius    半径
 * @param {*} props.innerRadius   内半径
 */
interface PcG2PieProps {
  requestUrl: string;
  angleField: string;
  colorField: string;
  radius: number;
  innerRadius: number;
  _var: any;
}
export const PcG2Pie: React.FC<PcG2PieProps> = (props) => {
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
    <Pie
      data={data}
      angleField={props?.angleField}
      colorField={props?.colorField}
      radius={props?.radius}
      innerRadius={props?.innerRadius}
    />
  );
};
