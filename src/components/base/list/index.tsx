import type { ListProps } from 'antd';
import { List } from 'antd';

export type ComponentProps<T = any> = ListProps<T>;

const FunctionComponent = List;
export default FunctionComponent;
