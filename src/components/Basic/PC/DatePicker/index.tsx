import { Form, DatePicker } from '@/components/base';
import moment from 'moment';
/**
 * 日期选择器
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.placeholder 占位符
 * @param {*} props.picker 选择器类型
 * @return {*}
 */
interface PcDatePickerProps {
  label: string;
  name: string;
  required: boolean;
  placeholder: string;
  picker: string;
}
export const PcDatePicker: React.FC<PcDatePickerProps> = (props) => {
  return (
    <Form.Item label={props?.label} name={props?.name} required={props?.required}
      getValueFromEvent={(...args) => {
        return args[1]
      }}
      getValueProps={(value) => {
        if (!value) return {}
        return { value: moment(value) }
      }}>
      <DatePicker
        placeholder={props?.placeholder}
        picker={props?.picker}
      />
    </Form.Item>
  );
};
//  default InputDemo;
