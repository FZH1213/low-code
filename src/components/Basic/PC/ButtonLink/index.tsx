import { Button } from '@/components/base';
import { message } from '@/components/base';
import { ACCESS_TOKEN_KEY, PAGE_CODE } from '@/utils/constant';
import { createRequest } from '@/utils/requestUtil';
import qs from 'qs';
import { useState } from 'react';
import { history } from 'umi';
import request from '@/utils/request';
/**
 * 按钮
 *
 * @param {*} props
 * @param {*} props.title 按钮名称
 * @param {*} props.string 按钮事件
 * @return {*}
 */
interface PcButtonLinkProps {
  title: string;
  type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
  linkType?: any;
  linkUrl: any;
  linkParams: Array<any>;
  linkQueryParams: Array<any>;
  selectedRows: { [title: string]: any };
  dataShowId?: string;
  set_var: any;
  _var: any;
  formUrl: string;
  isBack: boolean;
  _clear: any;
  disabled: any;
  wrapper: any;
  mType: any;
  linkParamsSelf: any;
  fileID: any;
}
export const PcButtonLink: React.FC<PcButtonLinkProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onClick = () => {
    // 判断使用条件
    if (props.disabled) {
      if (props.disabled.length > 0) {
        let flag = true; // 只要有一个不能使用，就为false;
        console.log(props.selectedRows.selectedRows);

        if (props.selectedRows.selectedRows.length > 0) {
          let list = props.disabled;
          // 只要有一个不能使用就为false

          props.selectedRows.selectedRows.map((record: any) => {
            let evelFlag = false; //  单个不能使用
            list.map((item: any) => {
              if (item.children.length > 0) {
                let itflag = true; // 只要有一个
                item.children.map((it: any) => {
                  if (record[it.filed] != it.value) {
                    itflag = false;
                  }
                });
                if (itflag && record[item.filed] == item.value) {
                  evelFlag = true;
                }
              }
              console.log(
                '为true',
                record[item.filed] == item.value,
                record[item.filed],
                item.value,
              );
              if (record[item.filed] == item.value && item.children.length == 0) {
                evelFlag = true;
              }
            });
            if (!evelFlag) {
              flag = evelFlag; // 只要有一个不能使用即为false
              console.log(evelFlag, flag);
            }
          });
        } else {
          message.error('请选中一项');
          return false;
        }
        if (!flag) {
          message.error(`请检查选中项是否满足${props.title}条件`);
          return false;
        }
      }
    }
    if (props.selectedRows && props.selectedRows.selectedRows) {
      if (props.selectedRows.selectedRows.length == 0) {
        message.error('请选中一项');
        return false;
      }
    }

    /** 返回*/
    if (props.linkType == 'goBack') {
      history.goBack();
    } else if (props.linkType == 'openLink') {
      window.open(props.linkUrl);
    } else if (props.linkType == 'link') {
      let flagRow = IsRowAndParams();
      if (flagRow === false) {
        return false;
      }
      let queryParams = IsQueryAndParams();
      /**跳转 */
      let query = { _isBack: props.isBack, ...flagRow, ...queryParams };
      history.push({
        // pathname: props.linkUrl ? props.linkUrl : props.selectedRows.selectedRows?.[0]?.formUrl ? props.selectedRows.selectedRows?.[0]?.formUrl : '',
        pathname: props.selectedRows.selectedRows?.[0]?.formUrl
          ? props.selectedRows.selectedRows?.[0]?.formUrl
          : props.linkUrl,
        query,
      });
    } else if (props.linkType == 'defaulLink' && props.linkUrl) {
      let query = { _isBack: props.isBack };
      if (props.linkParamsSelf) {
        if (props.linkParamsSelf.length > 0) {
          props.linkParamsSelf.map((linkParamsSelf: any) => {
            query[linkParamsSelf['filed']] = linkParamsSelf['value'];
          });
        }
      }
      if (props.linkUrl.includes('http')) {
        window.location.href = props.linkUrl;
      } else {
        history.push({ pathname: props.linkUrl, query });
      }
    } else if (props.linkType == 'download' && props.linkUrl) {
      hanlderDown();
    } else if (props.linkType == 'post' && props.linkUrl) {
      hanlderPost();
    } else if (props.linkType == 'delect' && props.linkUrl) {
      hanlderDelect();
    } else if (props.linkType == 'cancel') {
      sessionStorage.removeItem('isShowDrawer')
    } else if (props.linkType == 'Mpost' && props.linkUrl) {
      // { label: '包裹字符串格式', value: 'string' },
      // { label: '包裹字符串数组', value: 'stringarray' },
      // { label: '包裹JSON字符串数组', value: 'JsonStringarray' },
      // { label: '包裹对象数组', value: 'object' },
      // { label: '包裹JSON对象数组', value: 'JsonObject' },
      // { label: '直传数组对象', value: 'array' },
      // { label: '直传JSON数组对象', value: 'JsonObjArray' },
      // { label: '直传数组字符串', value: 'strArray' },
      // { label: '直传JSON数组字符串', value: 'JsonStrArray' },
      // {pro: ',,,,'}
      // {pro:[,,,,,,]},
      // {pro:[{},{},{}]}
      // j{pro:[,,,,,,]},
      // j{pro:[{},{},{}]}
      //j [,,,,,,]
      //j [{},{},{}]
      // [,,,,,,]
      // [{},{},{}]
      console.log(props.mType);
      let array: any = [];
      let strdata: any = '';
      // {pro: ',,,,'}
      if (props.mType == 'string') {
        props.selectedRows.selectedRows.map((record: any) => {
          if (props.linkParams) {
            props.linkParams.map((linkParams: any) => {
              strdata += `${record[linkParams.source]},`;
            });
          }
        });
        if (props.linkParams) {
          strdata.substring(0, strdata.length - 1);
        }
      }
      // {pro:[,,,,,,]}, j{pro:[,,,,,,]},j [,,,,,,], [,,,,,,]
      if (
        props.mType == 'stringarray' ||
        props.mType == 'JsonStringarray' ||
        props.mType == 'strArray' ||
        props.mType == 'JsonStrArray'
      ) {
        props.selectedRows.selectedRows.map((record: any) => {
          if (props.linkParams) {
            props.linkParams.map((linkParams: any) => {
              array.push(record[linkParams.source]);
            });
          }
        });
      }
      if (
        props.mType == 'object' ||
        props.mType == 'JsonObject' ||
        props.mType == 'array' ||
        props.mType == 'JsonObjArray'
      ) {
        console.log(props.mType, props.selectedRows.selectedRows);
        props.selectedRows.selectedRows.map((record: any) => {
          let obj = {};
          if (props.linkParams) {
            props.linkParams.map((linkParams: any) => {
              console.log(record[linkParams.source]);
              obj[linkParams['target']] = record[linkParams.source];
            });
          }
          if (props.linkQueryParams) {
            props.linkQueryParams.map((linkQueryParams: any) => {
              obj[linkQueryParams['target']] = history.location.query?.[linkQueryParams.source];
            });
          }
          if (props.linkParamsSelf) {
            props.linkParamsSelf.map((linkParamsSelf: any) => {
              obj[linkParamsSelf['filed']] = linkParamsSelf['value'];
            });
          }

          array.push(obj);
        });
      }
      const fetch = (data) => {
        return request(props.linkUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
          data,
        });
      };
      if (props.mType == 'string' || props.mType == 'stringarray' || props.mType == 'object') {
        let obj = {};
        if (props.mType == 'string') {
          obj[props.wrapper] = strdata;
          fetch(obj).then((res: any) => {
            if (res.code == 0) {
              message.success(`${props.title}成功`);
              props.set_var({ _: '' }); //刷新全局变量，触发其它地方更新
              props.set_var({ ...props._var }); //刷新全局变量，触发其它地方更新
            } else {
              message.error(`${props.title}成功`);
            }
          });
        }
        if (props.mType == 'stringarray' || props.mType == 'object') {
          obj[props.wrapper] = array;
          fetch(obj).then((res: any) => {
            if (res.code == 0) {
              message.success(`${props.title}成功`);
              props.set_var({ _: '' }); //刷新全局变量，触发其它地方更新
              props.set_var({ ...props._var }); //刷新全局变量，触发其它地方更新
            } else {
              message.error(`${props.title}成功`);
            }
          });
        }
      }
      if (props.mType == 'JsonStringarray' || props.mType == 'JsonObject') {
        let obj = {};
        obj[props.wrapper] = array;
        fetch(JSON.stringify(obj)).then((res: any) => {
          if (res.code == 0) {
            message.success(`${props.title}成功`);
            props.set_var({ _: '' }); //刷新全局变量，触发其它地方更新
            props.set_var({ ...props._var }); //刷新全局变量，触发其它地方更新
          } else {
            message.error(`${props.title}成功`);
          }
        });
      }
      if (props.mType == 'array' || props.mType == 'strArray') {
        fetch(array).then((res: any) => {
          if (res.code == 0) {
            message.success(`${props.title}成功`);
            props.set_var({ _: '' }); //刷新全局变量，触发其它地方更新
            props.set_var({ ...props._var }); //刷新全局变量，触发其它地方更新
          } else {
            message.error(`${props.title}成功`);
          }
        });
      }
      if (props.mType == 'JsonObjArray' || props.mType == 'JsonStrArray') {
        fetch(JSON.stringify(array)).then((res: any) => {
          if (res.code == 0) {
            message.success(`${props.title}成功`);
            props.set_var({ _: '' }); //刷新全局变量，触发其它地方更新
            props.set_var({ ...props._var }); //刷新全局变量，触发其它地方更新
          } else {
            message.error(`${props.title}成功`);
          }
        });
      }
    }
  };

  /**
   * 判断行数据只勾选一项并且获取数据
   */
  const IsRowAndParams = () => {
    if (
      (props?.linkParams || []).length != 0 &&
      Object.keys(props.selectedRows.selectedRows).length != 1
    ) {
      //传参且从列表中取参，
      message.error('请选中一项'); //todo  话术规整
      return false;
    }

    let query: any = {};
    props?.linkParams?.map((item) => {
      query[item.target] = props.selectedRows.selectedRows?.[0][item.source]; //跳转默认按第一个取值做跳转
    });

    return query;
  };
  /**
   * 判断url查询数据并且获取数据
   */
  const IsQueryAndParams = () => {
    let query: any = {};
    props?.linkQueryParams?.map((item) => {
      query[item.target] = history.location.query?.[item.source];
    });

    return query;
  };
  /**
   * 文件下载
   * @returns
   */
  const hanlderDown = async () => {
    if (!props.linkUrl) {
      message.error('请配置url');
      return;
    }
    let flagRow = IsRowAndParams();
    if (flagRow === false) {
      return false;
    }
    console.info('flagRow', flagRow);
    if (
      props.selectedRows.selectedRows?.[0]?.ifFile != undefined &&
      !props.selectedRows.selectedRows?.[0]?.ifFile
    ) {
      message.error('不支持下载文件夹');
      return;
    }
    let aLink = document.createElement('a');
    aLink.style.display = 'none';
    aLink.href = props.linkUrl + (!!Object.keys(flagRow).length ? '?' + qs.stringify(flagRow) : '');
    aLink.setAttribute('download', props.selectedRows.selectedRows?.[0]?.fileName);
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink); // 下载完成移除元素
    return true;
  };

  /**
   * 增加post请求
   */
  const hanlderPost = async () => {
    if (!props.linkUrl) {
      message.error('请配置url');
      return;
    }
    let flagRow = IsRowAndParams();
    if (flagRow === false) return;
    setLoading(true);
    await createRequest(
      props.linkUrl,
      'post',
    )(flagRow).then((res) => {
      setLoading(false);
      if (res.code === 0) {
        message.success('处理成功！');
        props.set_var({ _: '' }); //刷新全局变量，触发其它地方更新
        props.set_var({ ...props._var }); //刷新全局变量，触发其它地方更新
      }
    });
  };

  /**
   * 删除的特殊处理
   */
  const hanlderDelect = async () => {
    if (!props.linkUrl) {
      message.error('请配置url');
      return;
    }
    if (props?.linkParams?.length !== 1) {
      message.error('url传参必须只能传一个'); //todo  话术规整
      return false;
    }
    if (Object.keys(props.selectedRows.selectedRows).length === 0) {
      //传参且从列表中取参，
      message.error('请最少选中一项'); //todo  话术规整
      return false;
    }

    let query: any = [];

    props.selectedRows?.selectedRows?.map((item: any) => {
      const [params] = props.linkParams;
      query.push(item[params.target]);
    });
    setLoading(true);
    let res = await createRequest(props.linkUrl, 'post')(query);
    setLoading(false);
    if (res.code === 0) {
      message.success('删除成功！');
      props.set_var({ _: '' }); //刷新全局变量，触发其它地方更新
      props.set_var({ ...props._var }); //刷新全局变量，触发其它地方更新
    }
  };

  return (
    <>
      {props.linkType != 'defaultDownLoad' && (
        <Button onClick={onClick} type={props.type} loading={loading} disabled={loading}>
          {' '}
          {props.title}
        </Button>
      )}
      {props.linkType == 'defaultDownLoad' && (
        <Button
          onClick={onClick}
          type={props.type}
          href={`/api/file/fileDown/downloadFileById?fileId=${props.fileID}`}
        >
          {' '}
          {props.title}
        </Button>
      )}
    </>
  );
};
