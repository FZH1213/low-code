import request from '@/utils/request';
import { http_get, http_post } from '@/utils/request';

// export async function pageList(params: any) {
//   debugger
//   return request('/api/base/userExtension/list', {
//     params,
//   });
// }
// export async function pageList(params: any) {
//   return request('/api/base/userExtension/userCombineList', { params });
// }
export async function pageList(params: any) {
    return request('/api/task/job', { params });
  }
// export async function pageList(params) {
//   return http_get('/api/task/job', {
//     params,
//   });
// }
// 获取所有接口
export async function allApi() {
  return request('/api/base/api/all');
}

/* 查看人员信息 */
export async function userDetail(params) {
  return request(`/api/base/userExtension/get?id=${params}`);
}

// 根据节点类型类型获取岗位数据
export async function fetchStationByNodeType(nodeType: string) {
  return request('/api/base/station/getByNodeType', { params: { nodeType } });
}

export async function getRoleTree() {
  return request('/api/base/role/treeList');
}
// 获取岗位列表
export async function getStationSelectList() {
  return request('/api/base/station/getStationSimple');
}
// Excel导出
export async function getUserExcel() {
  return request('/api/base/userExtension/exportExcel', {
    responseType: 'blob',
    getResponse: true,
  }).then(({ data, response }) => {
    const fileNameMatch = response?.headers?.get('Content-disposition')?.match(/filename\*=(.*)/);
    if (!fileNameMatch || fileNameMatch.length < 1) {
      return;
    }
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
// 删除
export async function deleteTask(params: any) {
  return request('/api/task/job/delete', {
    method: 'POST',
    params,
  });
}
// 更新
export async function updateById(data: any) {
  return request('/api/task/job/update/http', {
    method: 'POST',
    data,
  });
}
// 新增
export async function createTask(data: any) {
  return request('/api/task/job/add/http', {
    method: 'POST',
    data,
  });
}
// 暂停
export async function pauseTask(params: any) {
  return request('/api/task/job/pause', {
    method: 'POST',
    params,
  });
}

// 恢复
export async function resumeTask(params: any) {
  return request('/api/task/job/resume', {
    method: 'POST',
    params,
  });
}
export default {
  pageList,
};
