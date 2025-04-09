import request, { http_get } from '@/utils/request';

export async function fetchPageList({ params }) {
  return http_get('/api/studio/companyBase/list', {
    params,
  });
}
export async function getindustrytreelist() {
  return http_get('/api/stock/baseIndustry/getindustrytreelist');
}

export async function getDetailByCompanyId(params) {
  return request(`/api/studio/companyBase/companyBaseDetail?companyId=${params}`);
}

// 获取模板类型
export async function fetchTempTypeList() {
  return request('/api/wrapper/tplTyp/getTplTree');
}

export default {
  fetchPageList,
  getindustrytreelist,
  getDetailByCompanyId,
  fetchTempTypeList,
};
