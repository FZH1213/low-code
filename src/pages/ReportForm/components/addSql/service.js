import request, { http_get } from '@/utils/request';

// 获取模板类型
export async function fetchTempTypeList() {
  return request('/api/wrapper/tplTyp/getTplTree');
}

// 获取属性配置

export async function getAttrList(params) {
  return request('/api/wrapper/tplAttrDesc/getAttrByTplTypId', { params });
}
// 根据ID获取详情
export async function getDetailById(params) {
  return request('/api/wrapper/intfManDesc/get', { params });
}
// 解析sql
export async function analysisSql(params) {
  return request('/api/wrapper/intfManDesc/analysisSql', { method: 'POST', data: params });
}
// SQL添加，修改
export async function addOrUpdate(params) {
  return request('/api/wrapper/intfManDesc/addOrUpdate', { method: 'POST', data: params });
}
export default {
  fetchTempTypeList,
  getAttrList,
  getDetailById,
  analysisSql,
  addOrUpdate,
};
