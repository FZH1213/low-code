import { message } from '@/components/base';
import { useEffect, useRef } from 'react';

/**
 * 解析href
 * @param name 指定url上参数名称
 * @returns
 */
export const getUrlParam = (name: any) => {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  var result = window.location.search.substr(1).match(reg);
  return result ? decodeURIComponent(result[2]) : null;
};

/**
 * 防抖
 * @param fun 回调
 * @param delay 时间
 * @returns
 */
export const debounce = (fun: any, delay: any) => {
  let timer: any = null;
  return function (this: any) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fun.call(this);
    }, delay);
  };
};

/**
 *
 * @param param {data: 数据, key: 键, value?: 值, setData: 重新设置数据}
 * @returns
 */
export const _refOptSetVal = ({
  data,
  key,
  value,
  setData,
}: {
  data: any;
  key?: string;
  value?: any;
  setData: any;
}) => {
  if (!key) return;
  let params = { ...data };
  params[key].option = value;
  setData(params);
};

interface downloadFileProps {
  fileName?: string;
  fileUrl?: string;
}
export const downloadFile = ({ fileName, fileUrl }: downloadFileProps) => {
  if (!fileName || !fileUrl) {
    message.error(`文件名或者文件路径不能为空`);
    return;
  }
  const a = document.createElement('a');
  a.style.display = 'none';
  a.setAttribute('target', '_blank');
  a.setAttribute('download', fileName);
  a.href = fileUrl;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const useIsMount = () => {
  const isMountRef = useRef<boolean>(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};

export default {
  getUrlParam,
  debounce,
  downloadFile,
};
