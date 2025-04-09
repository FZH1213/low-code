import { Button, message } from '@/components/base';
import { createRequest, judgeSucessAndGetMessage } from '@/utils/requestUtil';
import { history } from 'umi';
import { PAGE_CODE } from '@/utils/constant';
import request from '@/utils/request';
/**
 * 按钮
 *
 * @param {*} props
 * @param {*} props.title 按钮名称
 * @param {*} props.requestUrl 请求接口
 * @param {*} props.type 按钮类型
 * @param {*} props.wrapper 包装字段
 * @return {*}
 */
interface PcButtonProps {
  title: string;
  requestUrl: string;
  type: 'submit' | 'setVar' | 'reSetVar';
  set_var: any;
  _ref: any;
  _var: any;
  formName: string;
  wrapper: string;
  styleType: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
  queryParams: Array<any>;
  isExport: 'export' | 'default';
}
export const PcButton: React.FC<PcButtonProps> = (props) => {
  /**
   * 判断url查询数据并且获取数据
   */
  const IsQueryAndParams = () => {
    let query: any = {};
    props?.queryParams?.map((item) => {
      query[item.target] = history.location.query?.[item.source];
    });

    return query;
  };

  const handleExport = async(sumbitData) =>{
    await request(props.requestUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: sumbitData,
      getResponse: true,
      responseType: 'blob' // 解决乱码问题
    }).then(({ data, response }) => {
      console.log('data', data);
      console.log('response', response);
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

  const request = createRequest(props.requestUrl, 'post');
  /**
   * 表单提交
   * @param submitRequest
   * @param mapData
   */
  const onClickHandle = () => {
    props._ref[PAGE_CODE._FORM_PREFIX + props.formName].validateFields().then(async (formData) => {
      const queryParams = IsQueryAndParams();
      const sumbitData = !props.wrapper
        ? formData
        : { [props.wrapper]: { ...queryParams, ...formData } };
      if (props.type == 'submit') {
        if (props.isExport === 'export') {
          handleExport(sumbitData)
        } else {
          //提交后台
          await judgeSucessAndGetMessage(
            await request(sumbitData).then(async (response) => {
              if (response && response.code === 0) {
              } else {

              }
              return response;
            }),
          ).then(([success, msg]) => {
            if (success) {
              message.success(msg);
            } else {
              message.error(msg);
            }
          });
        }
      }
      if (props.type == 'setVar') {
        //设置全局变量
        console.info('setVar', { ...props._var, ...sumbitData });
        props.set_var({ _: '' });
        props.set_var({ ...props._var, ...sumbitData });
      }
    });

    if (props.type == 'reSetVar') {
      //设置全局变量
      props._ref[PAGE_CODE._FORM_PREFIX + props.formName].resetFields();
      const sumbitData = !props.wrapper
        ? props._ref[PAGE_CODE._FORM_PREFIX + props.formName].getFieldsValue()
        : { [props.wrapper]: props._ref[PAGE_CODE._FORM_PREFIX + props.formName].getFieldsValue() };
      props.set_var({ ...props._var, ...sumbitData });
    }
    if (history.location.query?._isBack) {
      history.goBack();
    }
  };
  return (
    <Button onClick={onClickHandle} type={props.styleType}>
      {props.title}
    </Button>
  );
};
