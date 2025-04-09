import { Form, Rate } from '@/components/base';

/**
 * 评分
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @return {*}
 */
interface PcRateProps {
  label: string;
  name: string;
  required: boolean;
}
export const PcRate: React.FC<PcRateProps> = (props) => {
  return (
    <Form.Item label={props?.label} name={props?.name} required={props?.required}>
      <Rate />
    </Form.Item>
  );
};
