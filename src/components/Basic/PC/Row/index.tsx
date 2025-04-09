import { Row } from '@/components/base';

/**
 * 行
 *
 * @param {*} props
 * @param {*} props.align    垂直对齐方式	
 * @param {*} props.justify  水平排列方式	
 * @param {*} props.hgutter  栅格间隔	 horizontal
 * @param {*} props.vgutter  栅格间隔	 vertical
 * @return {*}
 */

interface PcRowProps {
  align: any;
  justify: any;
  hgutter: any;
  vgutter: any;

}
export const PcRow: React.FC<PcRowProps> = (props) => {
  return (
    <Row
      align={props.align}
      justify={props.justify}
      gutter={[props.hgutter, props.vgutter]}
    >
      {props.children}
    </Row>
  );
};
