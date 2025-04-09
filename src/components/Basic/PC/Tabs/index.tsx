import { Tabs } from '@/components/base';

import React, { useEffect } from 'react';
/**
 * 标签页
 */
interface PcTabsProps {
}
export const PcTabs: React.FC<PcTabsProps> & {
  PcTabItemType?: React.FC<any>
} = (props) => {
  const items = []
  React.Children.map(props.children, (child: any, index) => {
    //todo 对于多子节点情况可能存在多一层情况，增加判断，为啥多一层待研究
    const label = child.props.label ? child.props.label : child.props.children.props.label
    const item = {
      label: label,
      key: index,   //少一层props是因为组件写死key是加载项？
      children: child
    }
    items.push(item)
  })
  return (
    <Tabs
      items={items}
    >
    </Tabs>
  );
};
PcTabs.PcTabItemType = (props) => {
  return <>{props.children}</>
}