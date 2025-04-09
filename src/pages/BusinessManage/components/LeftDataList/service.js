import request, { http_post } from '@/utils/request';

export const getDataList = (params) => {
  return request('/api/bpm/bizDef/allList', {
    method: 'get',
    params,
  });
};
export async function execByCode(params, coede) {
  return http_post(`/api/bpm/bizDef/execByCode/${coede}`, {
    data: params,
    headers: {
      'content-type': 'application/json',
    },
  });
}

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
