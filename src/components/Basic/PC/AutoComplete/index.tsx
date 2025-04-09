import { Form, AutoComplete } from '@/components/base';

/**
 * 自动完成
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.placeholder 占位符
 * @param {*} props.type input输入类型
 * @param {*} props.maxLength 最大长度
 * @param {*} props.value 默认值
 * @return {*}
 */
interface PcAutoCompleteProps {
  label: string;
  name: string;
  required: boolean;
  options: any;
}
export const PcAutoComplete: React.FC<PcAutoCompleteProps> = (props) => {
  return (
    <Form.Item label={props.label} name={props.name} required={props.required}>
      <AutoComplete options={props?.options} />
    </Form.Item>
  );
};
