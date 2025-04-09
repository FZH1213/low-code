import { PcDotMap as DotMap } from './index';
import { observer } from '@formily/react';
import { createBehavior, createResource } from '@designable/core';
import { DnFC, useTreeNode } from '@designable/react';
import { Treeselect } from '@/components/base/Designable/NewTreeSelect/treeselect';
import { DataSourceSetter } from '@designable/formily-setters';

export const PcDotMap: DnFC<{}> = observer((props) => {
  const node = useTreeNode();
  return (
    <div {...props}>
      <DotMap
        requestUrl={node.props?.requestUrl}
        zoom={node.props?.zoom}
        center={node.props?.center}
        coordinates={node.props?.coordinates}
        mapStyle={node.props?.mapStyle}
        _var={{}}
        options={node.props?.options}
        autoFit={node.props?.autoFit}
        typecode={node.props?.typecode}
        icons={node.props?.icons}
      />
    </div>
  );
});

PcDotMap.Behavior = createBehavior({
  name: 'PcDotMap',
  selector: 'PcDotMap',
  designerProps: {
    propsSchema: {
      type: 'object',
      properties: {
        'component-group': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: '组件属性',
          properties: {
            zoom: {
              type: 'number',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
            },
            coordinates: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            mapStyle: {
              enum: ['normal', 'dark', 'light', 'blank'],
              'x-decorator': 'FormItem',
              'x-component': 'Select',
              'x-component-props': {
                defaultValue: 'normal',
              },
            },
            center: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
            },
            requestUrl: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': Treeselect,
            },
            options: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
            },
            autoFit: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            typecode: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            icons: {
              'x-decorator': 'FormItem',
              'x-component': DataSourceSetter,
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'zh-CN': {
      title: '地图图标',
      settings: {
        zoom: '初始缩放层级',
        center: '初始中心经纬度',
        coordinates: '接口坐标字段',
        mapStyle: '内置样式',
        requestUrl: '请求接口',
        options: '数据悬浮提示可选项',
        typecode: '图标分类字段',
        icons: '图标配置可选项',
        autoFit: '是否自适应显示',
      },
    },
  },
});

PcDotMap.Resource = createResource({
  //默认值
  icon: '/pageDesign/map.png',
  elements: [
    {
      componentName: 'PcDotMap',
      props: {
        zoom: 13,
        center: [
          {
            title: '经度',
            value: 116.473168,
          },
          {
            title: '纬度',
            value: 39.993015,
          },
        ],
        coordinates: 'location',
        mapStyle: 'normal',
        requestUrl: '/api/bpm/bizDef/execByCode/test.maplist',
        options: [
          {
            alias: '名称',
            field: 'name',
          },
          {
            alias: '地址',
            field: 'address',
          },
          {
            alias: '联系电话',
            field: 'tel',
          },
        ],
        autoFit: false,
        typecode:'typecode',
        icons: [
          {
            id: '160104',
            image: 'https://gw.alipayobjects.com/zos/antfincdn/tWx6gaMr9P/zhongguoyinhang.png',
          },
          {
            id: '160139',
            image: 'https://gw.alipayobjects.com/zos/antfincdn/KDjael3M3h/youzhengyinhang.png',
          },
          {
            id: '160105',
            image: 'https://gw.alipayobjects.com/zos/antfincdn/Cxwxb%265wn7/gongshangyinhang.png',
          },
          {
            id: '160106',
            image: 'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
          },
          {
            id: '160107',
            image: 'https://gw.alipayobjects.com/zos/antfincdn/hITtoj%2672C/nongyeyinhang.png',
          },
          {
            id: '160108',
            image: 'https://gw.alipayobjects.com/zos/antfincdn/KHWJyfcPJu/jiaotongyinhang.png',
          },
          {
            id: '160109',
            image: 'https://gw.alipayobjects.com/zos/antfincdn/%247VfhYcrfu/zhaoshangyinhang.png',
          },
          {
            id: '160111',
            image: 'https://gw.alipayobjects.com/zos/antfincdn/pgo8%261emOy/guangdayinhang.png',
          },
        ]
      },
    },
  ],
});
