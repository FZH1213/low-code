import { Form, Checkbox, Row, Col } from '@/components/base';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { useEffect, useState } from 'react';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

/**
 * 输入框
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.options 可选项
 * @return {*}
 */
interface PcCheckboxProps {
  label: string;
  name: string;
  required: boolean;
  options: any;
  requestUrl: string;
  optionRequstParams: any;
  _var: any;
  span: number;
  isShowAll: boolean;
}
export const PcCheckbox: React.FC<PcCheckboxProps> = (props) => {
  const form = Form.useFormInstance();
  const [data, setData] = useState<any>([]);
  const request = createRequest(props?.requestUrl, 'post');

  // 选项内容联动过滤参数
  const [updateOption, setUpdateOption] = useState<any>(false);
  const [optionReqParams, setOptionReqParams] = useState<any>({});

  const [plainOptions, setPlainOptions] = useState<any>([]);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

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
    let arr: any = [];
    if (data.length > 0) {
      data.map((item) => {
        arr.push(item.value);
      })
      setPlainOptions(arr);
    }
  }, [data]);

  useEffect(() => {
    renderHandle();
  }, [props?._var, optionReqParams]);

  const onChange = (list: CheckboxValueType[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked)
  };

  useEffect(() => {
    form.setFieldsValue({ [props.name]: checkedList });
  }, [checkedList])

  return (
    <div>
      {props?.isShowAll &&
        <Col style={{ position: 'absolute', left: '25%', top: '-30%' }} span={props.span ? props.span : 6}>
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            全选
          </Checkbox>
        </Col>
      }
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
      // hidden={data.length ? true : false}
      >
        {/* <Checkbox.Group options={data} /> */}
        <Checkbox.Group style={{ width: '100%' }} value={checkedList} onChange={onChange}>
          <Row>
            {data.map((item) => (
              <Col span={props.span ? props.span : 6}>
                <Checkbox value={item.value}>{item.label}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>

      </Form.Item>
    </div>
  );
  // return (
  //   <Form.Item label={props?.label} name={props?.name} required={props?.required}>
  //     <Checkbox.Group options={props?.options} />
  //   </Form.Item>
  // );
};
//  default InputDemo;
