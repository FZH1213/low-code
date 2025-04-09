import { DotMap, registerImages } from '@ant-design/maps';

import { useEffect, useState } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { isArray } from 'lodash';

/**
 * 地图
 *
 * @param {*} props
 * @param {*} props.requestUrl  请求
 * @param {*} props.zoom  初始缩放层级
 * @param {*} props.center  初始中心经纬度
 * @param {*} props.coordinates  接口坐标字段
 */
interface PcDotMapProps {
  requestUrl: string;
  zoom: number;
  center: any;
  coordinates: string;
  _var: any;
  options: any;
  mapStyle: 'dark' | 'light' | 'normal' | 'blank';
  autoFit: boolean;
  icons: any;
  typecode: any
}
export const PcDotMap: React.FC<PcDotMapProps> = (props) => {

  const [dataList, setDataList] = useState<any>([]);

  const [items, setItems] = useState<any>([]);

  const request = createRequest(props.requestUrl, 'post');
  const renderHandle = async () => {
    if (!props.requestUrl) return;
    const data = await judgeSucessAndGetData(await request(props._var));
    if (!data) return;
    if (isArray(data)) {
      setDataList(data);
      setItems(props?.options);
    } else {
      setDataList([]);
    }
  };
  useEffect(() => {
    renderHandle();
  }, [props._var]);

  registerImages(props.icons);

  const a = {}
  a[props.typecode] = props.typecode;

  const config = {
    map: {
      type: 'mapbox',
      // type: 'amap',
      style: props?.mapStyle,
      center: [props?.center?.[0].value, props?.center?.[1].value],
      zoom: props?.zoom,
      pitch: 0,
      token: 'pk.eyJ1IjoidW5pdGVkMDA3IiwiYSI6ImNsY3BtOTkzYzFuMHczb3F6bjZlYTNyeXQifQ.paun4kKSFIeagTJyNNZhyQ'
    },
    source: {
      data: dataList,
      parser: {
        type: 'json',
        coordinates: props?.coordinates,
      },
    },
    autoFit: props?.autoFit,
    color: '#fff',
    shape: {
      field: props.typecode,
      value: (a) => a[props.typecode],
    },
    size: 10,
    tooltip: {
      items
    },
  };

  return (
    <div style={{ height: '50vw' }}>
      <DotMap {...config} />
    </div>
  );
};
