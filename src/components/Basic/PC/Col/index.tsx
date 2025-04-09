import { Col } from '@/components/base';

/**
 * 列
 *
 * @param {*} props
 * @param {*} props.span 
 * @param {*} props.xs 
 * @param {*} props.sm 
 * @param {*} props.md 
 * @param {*} props.lg 
 * @param {*} props.xl
 * @param {*} props.xxl 
 * @return {*}
 */
declare type ColSpanType = number | string;
interface PcColProps {
  span: ColSpanType;
  xs: ColSpanType;
  sm: ColSpanType;
  md: ColSpanType;
  lg: ColSpanType;
  xl: ColSpanType;
  xxl: ColSpanType;
}
export const PcCol: React.FC<PcColProps> = (props) => {
  return (
    <Col
      span={props?.span}
      xs={props?.xs}
      sm={props?.sm}
      md={props?.md}
      lg={props?.lg}
      xl={props?.xl}
      xxl={props?.xxl}
    >
      {props.children}
    </Col>
  );
};
