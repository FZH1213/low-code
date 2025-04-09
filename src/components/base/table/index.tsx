import type {
  TableProps,
  TablePaginationConfig,
  TableColumnGroupType,
  TableColumnType,
  TableColumnProps,
} from 'antd';
import { Table } from 'antd';

export type ComponentProps<RecordType = any> = TableProps<RecordType>;

export type ComponentPaginationConfig = TablePaginationConfig;
export type ComponentColumnGroupType<RecordType = any> = TableColumnGroupType<RecordType>;
export type ComponentColumnType<RecordType = any> = TableColumnType<RecordType>;
export type ComponentColumnProps<RecordType = any> = TableColumnProps<RecordType>;

const FunctionComponent = Table;

export default FunctionComponent;
