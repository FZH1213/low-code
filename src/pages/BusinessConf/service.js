import request from '@/utils/request';

export const updateJson = (data) => {
  return request('/api/bpm/bizDef/update', {
    method: 'post',
    data: data,
    requestType: 'form',
  });
};

// 执行验证方法
export const validateDataApi = (data) => {
  return request(`/api/bpm/bizDef/execByCode/${data.code}`, {
    method: 'post',
    data: data,
    // requestType: 'form',
  });
};
