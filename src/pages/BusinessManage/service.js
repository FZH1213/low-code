import request from '@/utils/request';

export const updateJson = (data) => {
  return request('/api/bpm/bizDef/updateName', {
    method: 'post',
    data: data,
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
