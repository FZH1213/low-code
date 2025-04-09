import { Form, Cascader } from '@/components/base';
import { useEffect, useState } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';

/**
 * Cascader 级联选择
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.placeholder 占位符
 * @param {*} props.mode 模式
 * @param {*} props.options 可选项
 * @param {*} props.requestUrl 请求url
 * @return {*}
 */
interface PcCascaderProps {
  label: string;
  name: string;
  required: boolean;
  placeholder: string;
  mode: 'multiple' | 'tags';
  options: any;
  requestUrl: any;
  _var: any;
  // onChange: any;
}
export const PcCascader: React.FC<PcCascaderProps> = (props) => {
  const [data, setData] = useState<any>([]);
  const request = createRequest(props.requestUrl, 'post');
  const renderHandle = async () => {
    if (!props.requestUrl) {
      console.info('options', props?.options);
      setData(props?.options);
      return;
    }
    const data = await judgeSucessAndGetData(await request(props._var));
    if (!data) return;
    setData(data);
  };
  useEffect(() => {
    renderHandle();
  }, [props._var]);
  const cascaderOnchange = (value, selector) => {
    console.log('@@@', value);
    console.log('@@@', selector);
    console.log('@@@', props._var);
  };
  return (
    <Form.Item label={props?.label} name={props?.name} required={props?.required}>
      <Cascader
        options={data}
        onChange={(value, selector) => {
          cascaderOnchange(value, selector);
        }}
      />
    </Form.Item>
  );
};
