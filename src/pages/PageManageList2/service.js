import request from '@/utils/request';
import { jsonToFormData } from '@/utils/requestUtil';

export const updateJson = (data) => {
  return request('/api/bpm/pageDef/update', {
    method: 'post',
    data: data,
    requestType: 'form',
  });
};

// 删除
export const removeById = (id) => {
  return request('/api/bpm/pageDef/remove', {
    method: 'post',
    data: jsonToFormData({ id })
  });
};
