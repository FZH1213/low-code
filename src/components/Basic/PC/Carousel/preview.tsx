import { Carousel, Image } from '@/components/base';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import React, { useEffect, useState, useRef } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';

export const PcCarousel: DnFC<{}> = observer((props) => {
  const [carouselList, setCarouselList] = useState<any>([]);
  const node = useTreeNode();
  const renderHandle = async (params) => {
    const data = await judgeSucessAndGetData(
      await createRequest(node.props?.requestUrl, node.props?.requestMethod)(params),
    );
    if (!data) return;
    if (data.records) {
      setCarouselList(data.records);
    }
  };
  useEffect(() => {
    renderHandle({});
  }, []);
  return (
    <>
      <Carousel
        autoplay={node.props?.autoPlay}
        style={{ textAlign: 'center' }}
        dots={node.props?.dots}
        dotPosition={node.props?.dotPosition}
      >
        {carouselList.map((item) => (
          <div>
            {item.fileId ? (
              <Image
                style={{
                  height: node.props?.height,
                  objectFit: 'scale-down',
                  textAlign: 'center',
                }}
                src={`/api/file/fileDown/downloadFileById?fileId=${item.fileId}`}
                preview={false}
              />
            ) : (
              <h3
                style={{
                  height: node.props?.height,
                  lineHeight: node.props?.height,
                  color: '#fff',
                  textAlign: 'center',
                  background: '#364d79',
                  fontSize: '18px',
                }}
              >
                {item.title}
              </h3>
            )}
          </div>
        ))}
      </Carousel>
    </>
  );
});

PcCarousel.Behavior = createBehavior({
  name: 'PcCarousel',
  selector: 'PcCarousel',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        'field-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '字段属性',
          //formitem属性
          properties: {
            name: {
              //字段
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            formName: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            requestUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
            requestMethod: {
              enum: ['get', 'post'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'post',
              },
            },
            queryType: {
              enum: ['默认无条件', '自定义查询条件', '用户信息'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: '自定义查询条件',
              },
            },
          },
        },
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          //input属性
          properties: {
            isLinkToUrl: {
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            autoPlay: {
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            dots: {
              type: 'boolean',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            dotPosition: {
              enum: ['top', 'bottom', 'left', 'right'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'bottom',
              },
            },
            height: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'SizeInput',
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
        name: '标识',
        formName: '绑定表单',
        autoPlay: '自动轮播',
        requestUrl: '接口url',
        requestMethod: '请求类型',
        height: '高度',
        isLinkToUrl: '是否开启点击跳转',
        dots: '是否显示指示点',
        dotPosition: '指示点位置',
        queryType: '数据来源查询',
      },
    },
  },
});

PcCarousel.Resource = createResource({
  //默认值
  icon: '/pageDesign/CarouseIcon.png',
  elements: [
    {
      componentName: 'PcCarousel',
      props: {
        name: '',
        requestUrl: '/api/bpm/bizDef/execByCode/test.Carousel',
        isLinkToUrl: false,
        autoPlay: true,
        dots: true,
        queryType: '默认无条件',
      },
    },
  ],
});
