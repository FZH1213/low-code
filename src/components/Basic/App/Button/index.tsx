import { Form, Input, Button } from 'antd-mobile';

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
interface ButtonH5props {
  label: string;
  name: string;
  required: boolean;
  placeholder: string;
  value: string;
  title: string;
  onClick: any;
}
export const ButtonH5: React.FC<ButtonH5props> = (props) => {
  console.log(props);

  return <Button onClick={eval(props.onClick)}>{props.title}</Button>;
};
