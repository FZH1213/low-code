import { Form, Switch } from '@/components/base';

/**
 * 开关
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.defaultChecked 默认值
 * @return {*}
 */
interface PcSwitchProps {
  label: string;
  name: string;
  required: boolean;
  defaultChecked: boolean;
}
export const PcSwitch: React.FC<PcSwitchProps> = (props) => {
  return (
    <Form.Item label={props.label} name={props.name} required={props.required} initialValue={props.defaultChecked}>
      <Switch
        defaultChecked={props.defaultChecked}
      />
    </Form.Item>
  );
};
