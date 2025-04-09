import { Carousel3d } from '@/components/base';

/**
 * 3d 轮播图
 *
 * @param {*} autoplay 是否自动切换
 * @param {*} autoplaySpeed 自动轮播时间
 * @param {*} dataSource 数据
 * @param {*} childMaxLength 显示轮播图数量
 * @param {*} onChange 变化方法
 * @return {*} 
 */
interface PcCarousel3dProps {
  autoplay: boolean;
  autoplaySpeed: number;
  dataSource: string[];
  childMaxLength?: number;
  onChange?: (params: any) => void;

}

export const PcCarousel3d: React.FC<PcCarousel3dProps> = (props) => {
  const { dataSource = [], childMaxLength, onChange } = props;
  return (
    <Carousel3d
      childMaxLength={childMaxLength}
      dataSource={dataSource}
      onChange={onChange}
    />
  );
};
