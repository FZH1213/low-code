import type { TreeSelectProps } from 'antd';
import { TreeSelect } from 'antd';

export type ComponentProps<T = any> = TreeSelectProps<T>;

const FunctionComponent = TreeSelect;
export default FunctionComponent;
