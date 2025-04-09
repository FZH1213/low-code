import request, { http_get, http_post } from '@/utils/request';
import { FILE_REQUEST_BASE } from '@/utils/constant';

//获取List信息  无数据显示no data  已配置
export async function fetchReportList(params) {
  return request('/api/wrapper/tplIntRel/list', {
    params,
  });
}
// 获取供应商
export async function getCompanyList() {
  return request('/api/studio/companyBase/company/list');
}

// 更改资讯名称   已配置
export async function updateName(params) {
  return http_post('/api/studio/infoNameCfg/updateInfoNameCfg', { data: params });
}
// 删除
export async function deleteData(params) {
  return http_post(`/api/wrapper/intfManDesc/remove/${params}`);
}

export default {
  fetchReportList,
  getCompanyList,
  updateName,
  deleteData,
};
