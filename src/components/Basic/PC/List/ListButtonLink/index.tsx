import { Button } from '@/components/base';
import { message } from '@/components/base';
import { Popconfirm } from 'antd';
import { ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
// import { ACCESS_TOKEN_KEY, PAGE_CODE } from '@/utils/constant';
import { createRequest } from '@/utils/requestUtil';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { history } from 'umi';
/**
 * 按钮
 *
 * @param {*} props
 * @param {*} props.title 按钮名称
 * @param {*} props.string 按钮事件
 * @return {*}
 */
interface PcListButtonLinkProps {
  title: string;
  type?: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default'
  linkType?: 'goBack' | 'link' | 'get' | 'post' | 'download' | 'delect'
  linkUrl?: string
  linkParams: Array<any>
  linkQueryParams: Array<any>
  selectedRows: { [title: string]: any },
  dataShowId?: string,
  set_var: any,
  _var: any,
  formUrl: string,
  isBack: boolean,
  marginLeft: number,
  isPopconfirm: boolean,
  popconfirmTitle: string,
  popconfirmOkText: string,
  popconfirmCancelText: string,
  popconfirmIcon: string,
  backgroundColor: string,
  customLinkParams: Array<any>,
  // 按钮控制状态类型、条件配置
  statusControltype: 'default' | 'hidden' | 'disabled' | 'changeText',
  statusControlConfig: Array<any>,
}
export const PcListButtonLink: React.FC<PcListButtonLinkProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // 按钮隐藏、禁用、改变文字
  const [isBtnHidden, setIsBtnHidden] = useState(false);
  const [isBtndisabled, setIsdisabled] = useState(false);
  const [isChangeText, setIsChangeText] = useState(false);
  const [btnChangeText, setbtnChangeText] = useState(props?.title);

  const showPopconfirm = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      onClick();
    }, 500);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const icon = () => {
    if (props.popconfirmIcon == 'ExclamationCircle') {
      return <ExclamationCircleOutlined style={{ color: props.backgroundColor }} />
    } else if (props.popconfirmIcon == 'QuestionCircleOutlined') {
      return <QuestionCircleOutlined style={{ color: props.backgroundColor }} />
    }
  }

  const onClick = () => {
    // console.info("PcListButtonLink", props)
    /** 返回*/
    if (props.linkType == 'goBack') {
      history.goBack()
    } else if (props.linkType == 'link') {
      let flagRow = IsRowAndParams();
      if (flagRow === false) { return false };
      let queryParams = IsQueryAndParams()
      let customLinkParams = IsQueryAndCustomParams();

      /**跳转 */
      let query = { _isBack: props.isBack, ...flagRow, ...queryParams, ...customLinkParams };
      history.push({
        pathname: props.linkUrl,
        query
      })
    } else if (props.linkType == 'download' && props.linkUrl) {
      hanlderDown();
    } else if (props.linkType == 'post' && props.linkUrl) {
      hanlderPost();
    } else if (props.linkType == 'delect' && props.linkUrl) {
      hanlderDelect();
    };
  };


  /**
   * 判断行数据只勾选一项并且获取数据
   */
  const IsRowAndParams = () => {
    if ((props?.linkParams || []).length != 0 && (Object.keys(props.selectedRows.selectedRows).length != 1)) {
      //传参且从列表中取参，
      message.error('请选中一项')   //todo  话术规整
      return false;
    };

    let query: any = {};
    props?.linkParams?.map((item) => {
      query[item.target] = props.selectedRows.selectedRows?.[0][item.source]   //跳转默认按第一个取值做跳转
    });

    return query;
  };
  /**
     * 判断url查询数据并且获取数据
     */
  const IsQueryAndParams = () => {
    let query: any = {};
    props?.linkQueryParams?.map((item) => {
      query[item.target] = history.location.query?.[item.source]
    });

    return query;
  };
  /**
   * 获取自定义参数数据
   */
  const IsQueryAndCustomParams = () => {
    let query: any = {};
    props?.customLinkParams?.map((item) => {
      query[item.source] = item.target
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
    if (flagRow === false) { return false };
    // console.info("flagRow", flagRow)
    if (props.selectedRows.selectedRows?.[0]?.ifFile != undefined && !props.selectedRows.selectedRows?.[0]?.ifFile) {
      message.error('不支持下载文件夹');
      return;
    };

    let aLink = document.createElement('a');
    aLink.style.display = 'none'
    aLink.href = props.linkUrl + (!!Object.keys(flagRow).length ? ('?' + qs.stringify(flagRow)) : '');
    aLink.setAttribute('download', props.selectedRows.selectedRows?.[0]?.fileName);
    document.body.appendChild(aLink)
    aLink.click()
    document.body.removeChild(aLink) // 下载完成移除元素
    return true;
  };

  const request = createRequest(props.linkUrl, 'get');

  const handleExport = async (sumbitData) => {
    await request(props.linkUrl, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
      params: sumbitData,
      getResponse: true,
      responseType: 'blob' // 解决乱码问题
    }).then(({ data, response }) => {
      setLoading(false);
      console.log('data', data);
      console.log('response', response);
      // console.log('data', data);
      // console.log('response', response);
      if (response && response.status === 200) {
        const fileNameMatch = response?.headers?.get('Content-disposition')?.match(/=(.*)$/)[1];
        if (!fileNameMatch || fileNameMatch.length < 1) {
          return;
        }
        const fileName = unescape(decodeURI(fileNameMatch)).replace(/\+/g, " "); //解码并替换加号为空格
        // 将二进制流转为blob
        const blob = new Blob([data], { type: 'application/octet-stream' });
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
          window.navigator.msSaveBlob(blob, decodeURI(fileName));
        } else {
          // 创建新的URL并指向File对象或者Blob对象的地址
          const blobURL = window.URL.createObjectURL(blob);
          // 创建a标签，用于跳转至下载链接
          const tempLink = document.createElement('a');
          tempLink.style.display = 'none';
          tempLink.href = blobURL;
          tempLink.setAttribute('download', decodeURI(fileName));
          // 兼容：某些浏览器不支持HTML5的download属性
          if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
          }
          // 挂载a标签
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          // 释放blob URL地址
          window.URL.revokeObjectURL(blobURL);
        }
        message.success('success');
      } else {
        message.error('fail');
      }
    });
  }

  /**
   * 增加get请求下載
   */
  const hanlderGetAndDownload = async () => {
    if (!props.linkUrl) {
      message.error('请配置url');
      return;
    }
    let queryParams = IsQueryAndParams()
    let customLinkParams = IsQueryAndCustomParams();
    let query = { _isBack: props.isBack, ...queryParams, ...customLinkParams };
    setLoading(true);
    handleExport(query);
  }

  /**
 * 增加get请求
 */
  const hanlderGet = async () => {
    let flagRow = IsRowAndParams()
    props.set_var({ ...flagRow })
  }

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
    await createRequest(props.linkUrl, 'post')(flagRow).then((res) => {
      setLoading(false);
      if (res.code === 0) {
        message.success('处理成功！');
        props.set_var({ _: "" })//刷新全局变量，触发其它地方更新
        props.set_var({ ...props._var })//刷新全局变量，触发其它地方更新
      };
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
      message.error('url传参必须只能传一个')   //todo  话术规整
      return false;
    }
    if ((Object.keys(props.selectedRows.selectedRows).length === 0)) {
      //传参且从列表中取参，
      message.error('请最少选中一项')   //todo  话术规整
      return false;
    };

    let query: any = [];

    props.selectedRows?.selectedRows?.map((item: any) => {
      const [params] = props.linkParams;
      query.push(item[params.target]);
    })
    setLoading(true);
    let res = await createRequest(props.linkUrl, 'post')(query);
    setLoading(false);
    if (res.code === 0) {
      message.success('删除成功！');
      props.set_var({ _: "" })//刷新全局变量，触发其它地方更新
      props.set_var({ ...props._var })//刷新全局变量，触发其它地方更新
    };

  };

  /**
* 按钮控制状态：default 控制 hidden 隐藏 disabled 禁用 changeText 改变文字
*/
  const buttonStatusControl = () => {
    let arr = props.selectedRows.selectedRows?.[0];
    let obj = props?.statusControlConfig?.[0];
    switch (props.statusControltype) {
      case 'default':
        setIsBtnHidden(false);
        setIsdisabled(false);
        setIsChangeText(false);
        break
      case 'hidden':

        if (obj && arr[obj.field] == obj.value) {
          setIsBtnHidden(true);
          setIsdisabled(false)
          setIsChangeText(false);
        } else {
          setIsBtnHidden(false)
          setIsdisabled(false)
          setIsChangeText(false);
        }
        break
      case 'disabled':
        if (obj && arr[obj.field] == obj.value) {
          setIsdisabled(true);
          setIsBtnHidden(false)
          setIsChangeText(false);
        } else {
          setIsdisabled(false)
          setIsBtnHidden(false)
          setIsChangeText(false);
        }
        break
      case 'changeText':
        if (obj && arr[obj.field] == obj.value) {
          setIsChangeText(true);
          setIsdisabled(false);
          setIsBtnHidden(false);
          obj.text && setbtnChangeText(obj.text);
        } else {
          setIsChangeText(false);
          setIsdisabled(false)
          setIsBtnHidden(false)
          setbtnChangeText(props.title)
        }
        break
      default:
        break
    }
  }

  useEffect(() => {
    props?.selectedRows?.selectedRows?.[0] && props?.statusControlConfig?.[0] && buttonStatusControl()
  }, [isBtnHidden, isBtndisabled, isChangeText])
  // return <Button style={{ marginLeft: props.marginLeft }} onClick={onClick} type={props.type} loading={loading} disabled={loading}>{props.title}</Button>;
  return props.isPopconfirm ?
    <Popconfirm
      title={props.popconfirmTitle}
      okText={props.popconfirmOkText}
      cancelText={props.popconfirmCancelText}
      icon={icon()}
      open={open}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
    >
      <Button
        // style={isBtnHidden ? { display: 'none' } : { padding: 0 }}
        style={isBtnHidden ? { display: 'none' } : (props.type === 'link' || props.type === 'text' ? { padding: 0 } : {})}
        onClick={showPopconfirm}
        type={props.type}
        loading={loading}
        disabled={isBtndisabled ? isBtndisabled : loading}
      >
        {isChangeText ? btnChangeText : props.title}
      </Button>
    </Popconfirm>
    :
    <Button
      style={isBtnHidden ? { display: 'none' } : (props.type === 'link' || props.type === 'text' ? { padding: 0 } : {})}
      onClick={onClick}
      type={props.type}
      loading={loading}
      disabled={isBtndisabled ? isBtndisabled : loading}
    >
      {isChangeText ? btnChangeText : props.title}
    </Button>;
};
