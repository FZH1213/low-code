import { Form, Input } from 'antd';

/**
 * H5输入框
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.placeholder 占位符
 * @param {*} props.value 默认内容
 * @param {*} props.type input输入类型
 * @param {*} props.disabled 是否可用
 * @param {*} props.readOnly 是否只读
 * @param {*} props.clearable 是否可以清除
 * @param {*} props.maxLength 最大长度
 * @return {*}
 */
interface Inputprops {
  label: string;
  name: string;
  required: boolean;
  placeholder: string;
  value: string;
  type: string;
  disabled: boolean;
  readOnly: boolean;
  clearable: boolean;
  maxLength: number;
}
export const InputDemo: React.FC<Inputprops> = (props) => {
  // const InputDemo: React.FC<{ comparams; formitemparams }> = ({ comparams, formitemparams }) => {
  // const node = useTreeNode();
  return (
    <Form.Item label={props?.label} name={props?.name} required={props?.required}>
      <Input
        placeholder={props?.placeholder}
        type={props.type}
        value={props.value}
        readOnly={props.readOnly}
        disabled={props.disabled}
        maxLength={props.maxLength}
      // clearable={props.clearable}
      />
    </Form.Item>
  );
};
//  default InputDemo;
