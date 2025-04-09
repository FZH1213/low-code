import { Card } from 'antd';

/**
 * 
 *
 * @param {*} props
 * @param {*} props.title 卡片标题
 * @param {*} props.bordered 卡片边框
 * @return {*}
 */
interface Cardprops {
  title: string;
  bordered: string;
}
export const TextAreaH5: React.FC<Cardprops> = (props) => {
  return (
    <Card
      title={props.title}
      bordered={props.bordered}
    >
      {props.children}
    </Card>
  );
};
//  default InputDemo;
