import request from '@/utils/request';

export const getDataList = (params) => {
  return request('/api/bpm/bizDef/allList', {
    method: 'get',
    params,
  });
};

// 新增
export const add = (data) => {
  return request('/api/bpm/bizDef/add', {
    method: 'post',
    data,
    requestType: 'form',
  });
};

// 删除
export const deleteItem = (data) => {
  return request('/api/bpm/bizDef/remove', {
    method: 'post',
    data: data,
    requestType: 'form',
  });
};
