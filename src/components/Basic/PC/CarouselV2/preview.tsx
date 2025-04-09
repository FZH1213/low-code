import { PcCarouselV2 as Carousel } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
export const PcCarouselV2: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <Carousel autoplay={node.props?.autoplay} autoplaySpeed={node.props?.autoplaySpeed}>
        {props.children}
      </Carousel>
    </div>
  );
});

PcCarouselV2.Behavior = createBehavior({
  name: 'PcCarouselV2',
  selector: 'PcCarouselV2',
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
      title: '走马灯',
      settings: {
        autoplay: '是否自动切换',
        autoplaySpeed: '自动切换时长(0.1s)',
      },
    },
  },
});

PcCarouselV2.Resource = createResource({
  //默认值
  icon: '/pageDesign/CarouseIcon.png',
  elements: [
    {
      componentName: 'PcCarouselV2',
      props: {
        label: '走马灯',
        autoplay: true,
        autoplaySpeed: 30,
      },
    },
  ],
});
