import request from '@/utils/request';

// 根据数据源Id查找table
export const getDataDdlTables = (params) => {
  return request('/api/bpm/dataDdlRelation/get/tables', {
    method: 'get',
    params,
  });
};

// 根据数据源Id查找关系
export const getDataDdlRelation = (params) => {
  return request('/api/bpm/dataDdlRelation/gets', {
    method: 'get',
    params,
  });
};

// 添加关系数据
export const addDdlRelation = (data) => {
  return request('/api/bpm/dataDdlRelation/add', {
    method: 'post',
    data,
    requestType: 'form',
  });
};

// 删除关系数据
export const removeDdlRelationByIds = (data) => {
  return request('/api/bpm/dataDdlRelation/remove/ids', {
    method: 'post',
    data,
    requestType: 'form',
  });
};