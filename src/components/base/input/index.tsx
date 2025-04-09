import type { InputProps } from 'antd';
import { Input } from 'antd';

export type ComponentProps = InputProps;

const FunctionComponent = Input;

export default FunctionComponent;

export function createInput(
    placeholder = "请输入",
    allowClear = true
) {
    return (<Input placeholder={placeholder} allowClear={allowClear} />)
}