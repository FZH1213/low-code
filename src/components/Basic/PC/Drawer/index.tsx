import React, { useEffect, useState, useRef } from 'react';
import type { ActionType } from '@/components/base/Pro/pro-table';
import { Drawer, Button } from 'antd';
import { createRequest } from '@/utils/requestUtil';
import { history } from 'umi';
/**
 * 抽屉
 *
 * @param {*} props
 * @param {*} props.title 抽屉名称
 * @param {*} props.width 抽屉宽度
 * @param {*} props.clickButton 按钮名称
 * @param {*} props.styleType 按钮样式
 * @param {*} props.placement 抽屉方向
 * @return {*}
 */
interface PcDrawerProps {
  title: string;
  width: string;
  placement: any;
  linkParams: any
  selectedRows: any
  set_var: any
  _var: any
  footer: any
  styleType: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
  clickButton: string;
  iframeUrl: string;
}


export const PcDrawer: React.FC<PcDrawerProps> & {
  Content?: React.FC<any>
} & {
  OptionBar?: React.FC<any>
} = (props) => {
  const [searchValue, setSearchValue] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState('');

  useEffect(() => {
    setSearchValue({ ...history.location.query, ...props });
    let urlParamsObj = { ...history.location.query, ...props._var };
    if (Object.keys(urlParamsObj).length > 0 && !!props.iframeUrl) {
      let urlParams = turnUrlStr(urlParamsObj);
      setLink(props.iframeUrl + '?' + urlParams);
    } else {
      setLink(props.iframeUrl);
    }
  }, [props._var]);

  const turnUrlStr = function (data) {
    let getData = '';
    for (const key in data) {
      getData += key + '=' + data[key] + '&';
    }
    getData = getData.substring(0, getData.length - 1);
    return getData;
  };

  useEffect(() => {
    const id = setInterval(() => {
      let isShowDrawer = sessionStorage.getItem('isShowDrawer');
      if (!!isShowDrawer) {
        // handleOpen()
      } else {
        handleClose()
      }
    }, 300);
    return () => clearInterval(id);
  }, [])

  const handleOpen = () => {
    let query: any = {};
    props.linkParams?.map((item) => {
      props.selectedRows?.selectedRows?.map((it: any) => {
        query[item.target] = it?.[item.source]
      })
    });
    props.set_var({ ...query })
    sessionStorage.setItem('isShowDrawer', 'true')
    setOpen(true);
  };

  const handleClose = () => {
    sessionStorage.removeItem('isShowDrawer')
    setOpen(false);
  };

  const iframe = () => {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {link != null && (
          <iframe src={link} frameBorder="0" style={{ width: '100%', height: '100%' }}></iframe>
        )}
      </div>
    )
  }

  return (
    <>
      <Button type={props.styleType} onClick={handleOpen} {...props}>
        {props.clickButton}
      </Button>
      <Drawer
        placement={props.placement}
        title={props.title}
        width={props.width}
        onClose={handleClose}
        open={open}
        // footer={props.children?.[1]}
        footer={props?.iframeUrl ? false : props.children?.[1]}
      >
        {/* {props.children?.[0]} */}
        {props?.iframeUrl ? iframe() : props.children?.[0]}
      </Drawer>
    </>
  );
};

PcDrawer.Content = (props) => {
  return <>{props.children}</>
}

PcDrawer.OptionBar = (props) => {
  return <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
    {props.children}
  </div>
}