import { Statistic } from '@/components/base';
import React, { useEffect, useState, useRef } from 'react';
import { history } from 'umi';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';

/**
 * 输入框
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.value 默认值
 * @param {*} props.requestUrl 查询url
 * @param {*} props.requestMethod 请求类型
 * @return {*}
 */
interface PcStatisticProps {
  label: string;
  name: string;
  hidden: boolean;
  requestUrl: string;
  requestMethod: 'post' | 'get';
  value: string;
  title: string;
  _var: any;
}
export const PcStatistic: React.FC<PcStatisticProps> = (props) => {
  const [searchValue, setSearchValue] = useState<any>(null);
  const [statisticData, setStatisticData] = useState<any>({});

  const [loading, setLoading] = useState<any>(true);
  const renderHandle = async () => {
    const data = await judgeSucessAndGetData(
      await createRequest(props?.requestUrl, props?.requestMethod)(props?._var),
    );
    if (!data) return;
    if (data) {
      setStatisticData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    // setSearchValue({ ...history.location.query });
    console.log('props?._var', props?._var);

    renderHandle();
  }, [props?._var]);
  return (
    <div {...props}>
      <Statistic
        title={
          JSON.stringify(statisticData) !== '{}' && statisticData.title
            ? statisticData.title
            : props?.label
        }
        value={
          JSON.stringify(statisticData) !== '{}' && statisticData.value
            ? statisticData.value
            : props?.value
        }
      />
    </div>
    // <Form.Item label={props.label} name={props.name} required={props.required} hidden={props.hidden} initialValue={props.value}>
    //   <Input
    //     placeholder={props.placeholder}
    //     type={props.type}
    //     maxLength={props.maxLength}
    //   // value={props.value}
    //   // defaultValue={props.value}
    //   />
    // </Form.Item>
  );
};
