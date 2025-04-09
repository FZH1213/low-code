import type { TimePickerProps, TimeRangePickerProps } from 'antd';
import { TimePicker } from 'antd';

export type ComponentProps = TimePickerProps;
export type ComponentRangeProps = TimeRangePickerProps;

const FunctionComponent = TimePicker;

export default FunctionComponent;
