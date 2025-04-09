import { Form, Input } from '@/components/base';
import style from './index.less';

/**
 * 输入框
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
interface PcInputProps {
  label: string;
  name: string;
  required: boolean;
  hidden: boolean;
  placeholder: string;
  type: string;
  maxLength: number;
  value: string;
  disabled: boolean;
  ruleMessage: string;
  pattern: any;
}
export const PcInput: React.FC<PcInputProps> = (props) => {
  return (
    <Form.Item
      label={props.label}
      name={props.name}
      hidden={props.hidden}
      initialValue={props.value}
      required={props.required}
      rules={
        !!props.pattern && props.pattern
          ? [
            {
              required: props.required,
              message: props.ruleMessage,
              pattern: props.pattern ? new RegExp(props.pattern) : undefined,
            },
          ]
          : [
            {
              required: props.required,
              message: props.ruleMessage,
              // pattern: props.pattern ? new RegExp(props.pattern) : undefined,
            },
          ]
      }
    >
      <Input
        placeholder={props.placeholder}
        type={props.type}
        maxLength={props.maxLength}
        disabled={props.disabled}
        className={props?.disabled ? style.disabled : ''}
      // value={props.value}
      // defaultValue={props.value}
      />
    </Form.Item>
  );
};
