import request, { http_get, http_post } from '@/utils/request';
import { FILE_REQUEST_BASE } from '@/utils/constant';

// 获取模板详情
export async function fetchTempList({ params }) {
  return http_get('/api/studio/infoNameCfg/getInfoNameList', {
    params,
  });
}
// 更改/新增报表模板
export async function submitTemp(params) {
  return http_post('/api/wrapper/tplInfo/addOrUpdate', { data: params });
}
// 新增类型
export async function submitTempType(params) {
  return http_post('/api/wrapper/tplTyp/addOrUpdate', { data: params });
}
// 删除类型
export async function deleteTempType(id: any) {
  return http_post(`/api/wrapper/tplTyp/remove/${id}`, {});
}
// 删除模板
export async function deleteTemp(params) {
  return http_post(`/api/wrapper/tplInfo/removeByTplTypId`, { params });
}

// 获取模板类型
export async function fetchTempTypeList() {
  return request('/api/wrapper/tplTyp/getTplTree');
}

// // 获取供应商
// export async function getCompanyList() {
//   return request('/api/studio/companyBase/company/list');
// }

// // 更改资讯名称
// export async function updateName(params) {
//   return http_post('/api/studio/infoNameCfg/updateInfoNameCfg', { data: params });
// }
// // 删除名称配置
// export async function deleteTemp(params) {
//   return http_post('/api/studio/infoNameCfg/batchDelInfoName', { data: params });
// }

//根据模板类型ID获取模板详情
export async function getTemplateDetail(params) {
  return http_get('/api/wrapper/tplInfo/getTplDetailById', {
    params,
  });
}
// /api/file/fileDown/downloadFileById?fileId=
// 下载、获取文件(示例图)
export async function downloadFileById(id) {
  return request(FILE_REQUEST_BASE, {
    method: 'GET',
    params: { fileId: id },
    responseType: 'blob',
  });
}
export default {
  fetchTempList,
  // getCompanyList,
  // updateName,
  // deleteTemp,
  submitTemp,
  submitTempType,
  fetchTempTypeList,
  getTemplateDetail,
  downloadFileById,
  deleteTempType,
  deleteTemp,
};
