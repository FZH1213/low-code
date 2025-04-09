import { Card } from '@/components/base';

import { history } from 'umi';
/**
 *
 *
 * @param {*} props
 * @param {*} props.title 卡片标题
 * @param {*} props.bordered 卡片边框
 * @return {*}
 */
interface PcCardProps {
  title: string;
  bordered: boolean;
  size: 'default' | 'small';
  onClickLinkUrl?: string;
  onClickLinkNewtag?: string;
  backgroundColor?: any;
  backgroundImage?: any;
  backgroundRepeat?: any;
  backgroundSize?: any;
}
export const PcCard: React.FC<PcCardProps> = (props) => {
  const { backgroundColor, backgroundImage, backgroundSize, backgroundRepeat } = props
  return (
    <Card
      style={{ backgroundColor, backgroundImage, backgroundSize, backgroundRepeat }}
      title={props.title}
      bordered={props.bordered}
      size={props.size}
      // bodyStyle={{ ...props }}
      onClick={() => {
        !!props.onClickLinkUrl
          ? props.onClickLinkNewtag === '新标签跳转'
            ? window.open(props.onClickLinkUrl)
            : history.push({ pathname: props.onClickLinkUrl })
          : '';
      }}
    >
      {props.children}
      {/*  */}
    </Card>
  );
};
