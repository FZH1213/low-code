import type { TransferProps } from 'antd';
import { Transfer } from 'antd';

export type ComponentProps<RecordType = any> = TransferProps<RecordType>;

const FunctionComponent = Transfer;

export default FunctionComponent;
