import request from '@/utils/request';

export const editDataSource = (data) => {
  return request('/api/bpm/dataSources/update', {
    method: 'post',
    data: data,
    requestType: 'form',
  });
};
