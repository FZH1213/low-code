import { observer } from '@formily/react';
import { DnFC, useTreeNode } from '@designable/react';
import { createBehavior, createResource } from '@designable/core';
import { PcCarousel3d as Carousel } from './index';
export const PcCarousel3d: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <Carousel
        autoplay={node.props?.autoplay}
        autoplaySpeed={node.props?.autoplaySpeed}
        dataSource={node.props?.dataSource}
      />
    </div>
  );
});

PcCarousel3d.Behavior = createBehavior({
  name: 'PcCarousel3d',
  selector: 'PcCarousel3d',
  designerProps: {
    droppable: true,
    propsSchema: {
      type: 'object',
      properties: {
        'component-group': {
          type: 'void',
          'x-component': 'CarousellapseItem',
          title: '组件属性',
          properties: {
            autoplay: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            autoplaySpeed: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '3D轮播图',
      settings: {
        autoplay: '是否自动切换',
        autoplaySpeed: '自动切换时长(s)',
      },
    },
  },
});

PcCarousel3d.Resource = createResource({
  //默认值
  icon: '/pageDesign/CarouseIcon.png',
  elements: [
    {
      componentName: 'PcCarousel3d',
      props: {
        label: '3D轮播图',
        autoplay: true,
        autoplaySpeed: 1.5,
        dataSource: [
          'https://zos.alipayobjects.com/rmsportal/DGOtoWASeguMJgV.png',
          'https://zos.alipayobjects.com/rmsportal/PDiTkHViQNVHddN.png',
          'https://zos.alipayobjects.com/rmsportal/QJmGZYJBRLkxFSy.png',
          'https://zos.alipayobjects.com/rmsportal/pTfNdthdsUpLPLJ.png',
          'https://zos.alipayobjects.com/rmsportal/TDIbcrKdLWVeWJM.png',
          'https://zos.alipayobjects.com/rmsportal/dvQuFtUoRmvWLsZ.png',
        ],
      },
    },
  ],
});
