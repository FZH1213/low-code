import { Row, Col } from '@/components/base';
import React, { useEffect } from 'react';
import { useTreeNode } from '@designable/react';

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

interface PcFormGridProps {
  align: any;
  justify: any;
  hgutter: any;
  vgutter: any;
}
export const PcFormGrid: React.FC<PcFormGridProps> = (props) => {
  const items = [];
  React.Children.map(props.children, (child: any, index) => {
    const item = {
      label: child.props.label,
      props: child.props,
      key: index, //ant的key加载好多问题
      children: child.props.children.props.children,
    };
    items.push(item);
  });
  return (
    <Row
      align={props.align}
      justify={props.justify}
      gutter={[props.hgutter || 0, props.vgutter || 0]}
    >
      {items.map((item) => (
        <Col span={item.props.span || item.props.children.props.span}>{item.children}</Col>
      ))}
    </Row>
  );
};
