import request from '@/utils/request';

// export const getTableData = (params) => {
//   return request('/api/bpm/pageDef/allList', {
//     method: 'get',
//     params: params,
//   });
// };

export const getTableData = (params) => {
  return request('/api/bpm/pageDef/list', {
    method: 'get',
    params: params,
  });
};

export const getPageInfo = (params) => {
  return request('/api/bpm/pageDef/get', {
    method: 'get',
    params: params,
  });
};
