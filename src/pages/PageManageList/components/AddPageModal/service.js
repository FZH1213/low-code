import request from '@/utils/request';

// 添加数据
export const addPage = (data) => {
  return request('/api/bpm/pageDef/add', {
    method: 'post',
    data,
    requestType: 'form',
  });
};
