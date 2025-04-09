import { Form } from '@/components/base';
import React, { useEffect } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { history } from 'umi';
import { PAGE_CODE } from '@/utils/constant';
/**
 *
 *
 * @param {*} props
 * @param {*} props.requestUrl 查询接口
 * @param {*} props.requestParams 查询入参
 * @return {*}
 */
interface BaseFormProps {
  requestUrl: string;
  requestParams: [];
  _ref: any;
  _var: any;
  name: string;
  layout: 'horizontal' | 'vertical' | 'inline';
  labelCol: Number;
  wrapperCol: Number;
  value?: any;
  onChange?: (value: any) => void;
}
export const BaseForm: React.FC<BaseFormProps> = (props) => {
  const [form] = Form.useForm();
  const request = createRequest(props.requestUrl, 'post');
  const initHandle = async () => {
    if (!props.name) return;
    props._ref[PAGE_CODE._FORM_PREFIX + props.name] = form; //是否有简单写法
  };
  const renderHandle = async () => {
    if (!props.requestUrl) return;
    const data = await judgeSucessAndGetData(
      await request({ ...history.location.query, ...props._var }),
    );
    form.setFieldsValue(data);
  };
  useEffect(() => {
    initHandle(), renderHandle();
  }, [props._var]);
  // debugger;
  return (
    <Form
      form={form}
      layout={props.layout}
      labelCol={{ span: props.labelCol }}
      wrapperCol={{ span: props.wrapperCol }}
      initialValues={props.value}
    >
      {props.children}
    </Form>
  );
};
