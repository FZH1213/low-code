/** Request 网络请求工具 更详细的 api 文档: https://github.com/umijs/umi-request */
import { extend } from 'umi-request';
import { notification } from 'antd';

const ACCESS_TOKEN_KEY = 'access_token';

export function isEmpty(value: string | null | undefined) {
  if (
    value === undefined ||
    value === null ||
    value === 'undefined' ||
    value === 'null' ||
    value === ''
  ) {
    return true;
  }
  return false;
}

export function isNotEmpty(value: string | null | undefined) {
  return !isEmpty(value);
}

const codeMessage: { [status: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一 个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/** 异常处理程序 */
const errorHandler = async (error: { response: any }) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    // const { status, url } = response;
    // response.status !== 401 &&
    //   notification.error({
    //     message: `请求错误 ${status}: ${url}`,
    //     description: errorText,
    //   });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response.json();
};

/** 配置request请求时的默认参数 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});
// sessionStorage
request.interceptors.request.use((url, options) => {
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);

  // console.log('token =>', token);

  if (isEmpty(token)) {
    return {
      url,
      options,
    };
  }
  const { headers } = options;
  const newHeaders = { ...headers, Authorization: `Bearer ${token}` };
  return {
    url,
    options: { ...options, headers: newHeaders },
  };
});

// http请求方法封装
const http = (path, opts) => {
  let invokeListener = (data) => (func) => func(data);
  if (opts.pathvars) {
    let pathvars = opts.pathvars;
    for (let key in pathvars) {
      path = path.replace(`:${key}`, pathvars[key]);
    }
    delete opts.pathvars;
  }

  return new Promise((resolve, reject) => {
    request(path, opts).then((response) => {
      //没有返回code表示接口调用过程中出现业务以外的异常
      //因为request包本身封装了
      if (response.code === undefined) {
        resolve({ response });
        return;
      }

      if (response.code === 0) {
        resolve({
          response,
          success: invokeListener(response.data),
        });
      } else {
        let { code, extra, message, path } = response;
        resolve({
          response,
          other: invokeListener({
            code,
            extra,
            message,
            path,
          }),
        });
      }
    });
  });
};

const http_get = (path, opts) => {
  return http(
    path,
    Object.assign({}, opts, {
      method: 'GET',
    }),
  );
};

const http_post = (path, opts) => {
  return http(
    path,
    Object.assign({}, opts, {
      method: 'POST',
    }),
  );
};

export default request;

export { http_get, http_post };
