import type { FormInstance, FormProps, FormItemProps } from 'antd';
import { Form } from 'antd';

export type ComponentProps<Values = any> = FormProps<Values>;

export type ComponentInstance<Values = any> = FormInstance<Values>;

export type ComponentItemProps<Values = any> = FormItemProps<Values>;

const FunctionComponent = Form;

export default FunctionComponent;
