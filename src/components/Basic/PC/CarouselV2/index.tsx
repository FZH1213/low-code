import { Carousel } from '@/components/base';

/**
 * 走马灯
 *
 * @param {*} props
 * @param {*} props.autoplay 是否自动切换
 * @return {*}
 */
interface PcCarouselV2Props {
  autoplay: boolean;
  autoplaySpeed: number;
}
export const PcCarouselV2: React.FC<PcCarouselV2Props> = (props) => {
  return (
    <Carousel autoplay={props.autoplay} autoplaySpeed={props.autoplaySpeed}>
      {props.children}
    </Carousel>
  );
};
