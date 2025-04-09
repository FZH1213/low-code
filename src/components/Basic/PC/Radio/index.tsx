import { Col, Form, Radio, Row } from '@/components/base';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { useEffect, useState } from 'react';

/**
 * 单选框
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.options 可选项
 * @return {*}
 */
interface PcRadioProps {
  label: string;
  name: string;
  required: boolean;
  options: any;
  requestUrl: string;
  optionRequstParams: any;
  _var: any;
  span: number;
}
export const PcRadio: React.FC<PcRadioProps> = (props) => {

  const form = Form.useFormInstance();
  const [data, setData] = useState<any>([]);
  const request = createRequest(props?.requestUrl, 'post');

  // 选项内容联动过滤参数
  const [updateOption, setUpdateOption] = useState<any>(false);
  const [optionReqParams, setOptionReqParams] = useState<any>({});

  // 获取选项内容过滤字段
  const IsParamsArray = () => {
    let arrField: any = [];
    props?.optionRequstParams?.map((item) => {
      arrField.push(item.sourceFiled);
    });
    return arrField;
  };

  // 构建传参过滤选项内容
  const IsQueryAndParams = () => {
    let query: any = {};
    props?.optionRequstParams?.map((item) => {
      if (form.getFieldValue(item.sourceFiled)) {
        query[item.targetFiled] = form.getFieldValue(item.sourceFiled);
      }
    });
    return query;
  };

  // 渲染下拉框子项内容
  const renderHandle = async () => {
    if (!props?.requestUrl) {
      setData(props?.options)
      return
    }
    if (updateOption) {
      const data = await judgeSucessAndGetData(await request({ ...props?._var, ...optionReqParams }));
      if (!data) return
      form.resetFields([props.name]);
      setData(data);
    } else {
      const query = IsQueryAndParams();
      const data = await judgeSucessAndGetData(await request({ ...props?._var, ...query }));
      if (!data) return
      setData(data);
    }
  }

  useEffect(() => {
    renderHandle();
  }, [props?._var, optionReqParams]);

  return (
    <Form.Item
      label={props?.label}
      name={props?.name}
      required={props?.required}
      shouldUpdate={(prevValue, curValue): any => {
        let flag: any = false;
        const arr_param = IsParamsArray();
        const query = IsQueryAndParams();
        arr_param.map((item: any) => {
          if (prevValue[item] === curValue[item]) {
            flag = false;
          } else {
            flag = true;
            setOptionReqParams(query)
          }
        });
        flag && setUpdateOption(flag)
        return flag;
      }}
    >
      {/* <Radio.Group options={props?.options} /> */}
      <Radio.Group style={{ width: '100%' }} >
        <Row>
          {data.map((item) => (
            <Col span={props.span ? props.span : 6}>
              <Radio value={item.value}>{item.label}</Radio>
            </Col>
          ))}
        </Row>
      </Radio.Group>
    </Form.Item>
  );
};
//  default InputDemo;
