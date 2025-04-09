import request from '@/utils/request';
// table LIst 
export const getTableData = (params) => {
    return request('/api/bpm/ruleDef/listChild', {
      method: 'get',
      params: params,
    });
  };