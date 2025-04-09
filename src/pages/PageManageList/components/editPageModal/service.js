import request from '@/utils/request';

// 添加库表
export const EditPage = (data) => {
  return request('/api/bpm/pageDef/update', {
    method: 'post',
    data,
    requestType: 'form',
  });
};
