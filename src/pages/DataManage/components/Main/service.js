import request from '@/utils/request';

// 根据数据库id，查询数据库相关信息
// /bpm/dataSources/get
export const getDataDetail = (id) => {
  return request(`/api/bpm/dataSources/get?id=${id}`);
};

// 根据数据源id获取其下库表
export const getTableList = (params) => {
  return request('/api/bpm/dataDdl/list', {
    method: 'get',
    params,
  });
};

// 更新数据
export const updata = (data) => {
  return request('/api/bpm/dataDdl/update', {
    method: 'post',
    data: data,
    requestType: 'form',
  });
};

// 删除表单项
export const deleteTable = (data) => {
  return request('/api/bpm/dataDdl/remove', {
    method: 'post',
    data,
    requestType: 'form',
  });
};

// 后台刷新数据
export const refreshTableDataApi = (params) => {
  return request('/api/bpm/dataDdl/refleshDdls', {
    method: 'get',
    params: params,
  });
};
