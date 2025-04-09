import { Space } from '@/components/base';

/**
 * 间距
 *
 * @param {*} props
 * @param {*} props.align    对齐方式	
 * @param {*} props.direction  间距方向	
 * @param {*} props.size  间距大小	
 * @param {*} props.wrap  是否换行	
 * @return {*}
 */

interface PcSpaceProps {
  align: 'start' | 'end' | 'center' | 'baseline';
  direction: 'vertical' | 'horizontal';
  size: any;
  wrap: boolean;
}
export const PcSpace: React.FC<PcSpaceProps> = (props) => {
  return (
    <Space
      align={props.align}
      direction={props.direction}
      size={props.size}
      wrap={props.wrap}
    >
      {props.children}
    </Space>
  );
};
