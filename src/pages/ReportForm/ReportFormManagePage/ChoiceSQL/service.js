import request, { http_get, http_post } from '@/utils/request';

// 获取模板类型
export async function fetchTempTypeList() {
  return request('/api/wrapper/tplTyp/getTplTree');
}

// 获取属性配置
export async function getAttrList(params) {
  return request('/api/wrapper/tplAttrDesc/getAttrByTplTypId', { params });
}
// 获取选择sql页面详情
export async function getSqlDetail(params) {
  return request('/api/wrapper/intfManDesc/getDetailById', { params });
}
// 解析sql
export async function analysisSql(params) {
  return request('/api/wrapper/intfManDesc/analysisSql', { method: 'POST', data: params });
}
// 选择SQL页面添加，修改
export async function addOrUpdateList(params) {
  return request('/api/wrapper/intfManDesc/addOrUpdateList', { method: 'POST', data: params });
}

// 获取接口下拉选择数据
export async function getIntfList(params) {
  return request('/api/wrapper/intfManDesc/getIntfList', { params });
}

// 获取接口下拉选择数据
export async function getDetailByIntId(params) {
  return request('/api/wrapper/intfManDesc/getDetailByIntId', { params });
}

// 获取模板说明
export async function getRemarkByTplId(params) {
  return request('/api/wrapper/intfManDesc/getRemarkByTplId', { params });
}

// add获取数据库列表
export async function getDataBseList(params) {
  return request('/api/wrapper/databaseInfo/list', { params });
}

// 获取流程标识
export async function getflowIdentify() {
  return request('/api/bpm/actReDefine/list');
}
// 获取规则
export async function getRules() {
  return request('/api/bpm/bizDef/allList');
}
// /wrapper/pythonInfo/list     GET
// 这是选择API方式，下拉框显示的数据
export async function getPythonInfoList() {
  return request('/api/base/api/all');
}
export async function getPythonInfoList1(params) {
  return request('/api/wrapper/pythonInfo/httpRequest', { method: 'POST', params });
}

// 获取控件属性方法
export async function getCompAttr(params) {
  return request('/api/wrapper/intfComp/getCompAttr', { method: 'POST', params });
}

export default {
  fetchTempTypeList,
  getSqlDetail,
  getAttrList,
  analysisSql,
  addOrUpdateList,
  getIntfList,
  getDetailByIntId,
  getRemarkByTplId,
  getDataBseList,
  getflowIdentify,
  getPythonInfoList,
  getPythonInfoList1,
  getRules,
  getCompAttr,
};
