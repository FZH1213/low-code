import request from '@/utils/request';

// 新增数据库接口
export const addDataSource = (data) => {
  return request('/api/bpm/dataSources/add', {
    method: 'post',
    data: data,
    requestType: 'form',
  });
};
