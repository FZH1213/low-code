import type { SelectProps } from 'antd';
import { Select } from 'antd';

export type ComponentProps<VT = any> = SelectProps<VT>;
const FunctionComponent = Select;
export default FunctionComponent;
