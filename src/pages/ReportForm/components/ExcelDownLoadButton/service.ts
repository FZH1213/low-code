import request from '@/utils/request';

// download
export async function getExportFile({
  url,
  params,
  reqData,
  method,
}: {
  url: string;
  params?: any;
  reqData?: any;
  method?: string;
}) {
  return request(url, {
    responseType:'blob',
    getResponse: true,
    method: method || 'POST',
    // params,
    // headers: {
    //   'content-type': 'application/json',
    // },
    body: JSON.stringify(params),
    data: method && method === 'POST' ? reqData : undefined,
  }).then(({ data, response }) => {
    const fileNameMatch = response?.headers?.get('Content-disposition')?.match(/filename\*=(.*)/);
    if (!fileNameMatch || fileNameMatch.length < 1) {
      return;
    }
    console.log(response.status,'ssss');
    
    const [decodeC, fileEncodeContent] = fileNameMatch[1].split("''");
    const fileName = decodeURI(fileEncodeContent);
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
  });
}
