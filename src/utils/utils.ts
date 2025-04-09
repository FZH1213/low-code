import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

//树节点解析方法
export const parseSelectKeyToparams = (selectKey: any) => {
  if (!!selectKey.length) {
    let params = {
      storageId: selectKey && selectKey.split('.')[0] ? selectKey.split('.')[0] : '',
      // type: (selectKey && selectKey.slice(-1)) ? selectKey.slice(-1) : '',
      type:
        selectKey && selectKey.slice(-1)
          ? selectKey.slice(-1) !== 'E'
            ? selectKey.slice(-1)
            : ''
          : '',
    };
    return params;
  }
  return {};
};

// 用来过来json字符串中的 /r/n
export const filterJson = (jsonstr) => {
  jsonstr = jsonstr.replace('\\r\\n', '\\n');
  //        jsonstr=jsonstr.replace("\\r\\n\\r\\n", "\\n");
  return jsonstr;
};

export const deepClone = (obj: any) => {
  const newObj = JSON.stringify(obj);
  const objClone = JSON.parse(newObj);
  return objClone;
};
