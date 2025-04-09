import { Form, Select } from '@/components/base';
import { useEffect, useState, } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';

/**
 * 下拉框
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
interface PcSelectProps {
  label: string;
  name: string;
  required: boolean;
  placeholder: string;
  mode: "multiple" | "tags"
  options: any;
  requestUrl: any;
  _var: any;
  optionRequstParams: any;
}
export const PcSelect: React.FC<PcSelectProps> = (props) => {
  const form = Form.useFormInstance();
  const [data, setData] = useState<any>([]);
  const request = createRequest(props.requestUrl, 'post');

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
    if (!props?._var.hasOwnProperty('_')) {
      renderHandle()
    }
  }, [props._var, optionReqParams])
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
      <Select
        options={data}
        mode={props?.mode}

      />
    </Form.Item>
  );
};
