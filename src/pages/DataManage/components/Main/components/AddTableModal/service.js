import request from '@/utils/request';

// 添加库表
export const addTable = (data) => {
  return request('/api/bpm/dataDdl/add', {
    method: 'post',
    data,
    // requestType: 'form',
  });
};
