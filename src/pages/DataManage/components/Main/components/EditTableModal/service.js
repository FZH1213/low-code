import request from '@/utils/request';

// 编辑库表
export const editTable = (data) => {
  return request('/api/bpm/dataDdl/ddl/update', {
    method: 'post',
    data,
    // requestType: 'form',
  });
};

// 获取详情
export const getDataDdlColumn = (params) => {
  return request('/api/bpm/dataDdlColumn/gets', {
    method: 'get',
    params,
  });
};

// ddl数据同步到库
export const addDdl = (data) => {
  return request('/api/bpm/dataDdl/add/ddl', {
    method: 'post',
    data,
    requestType: 'form',
  });
};
