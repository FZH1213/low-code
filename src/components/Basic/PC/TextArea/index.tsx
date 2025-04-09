import { Form } from '@/components/base';
import { Input } from 'antd';
/**
 * 文本输入框
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.placeholder 占位符
 * @param {*} props.maxLength 最大长度
 * @param {*} props.showCount 是否展示字数
 * @return {*}
 */
interface PcTextAreaProps {
    label: string;
    name: string;
    required: boolean;
    hidden: boolean;
    placeholder: string;
    showCount: boolean;
    maxLength: number;
}
const { TextArea } = Input;
export const PcTextArea: React.FC<PcTextAreaProps> = (props) => {
    return (
        <Form.Item label={props.label} name={props.name} required={props.required} hidden={props.hidden}>
            <TextArea
                showCount={props.showCount}
                placeholder={props.placeholder}
                maxLength={props.maxLength}
            />
        </Form.Item>
    );
};
