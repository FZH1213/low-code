import type { CalendarProps } from 'antd';
import { Calendar } from 'antd';

export type ComponentProps<DateType> = CalendarProps<DateType>;

const FunctionComponent = Calendar;

export default FunctionComponent;
