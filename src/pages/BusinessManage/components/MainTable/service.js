import request from '@/utils/request';

export const getTableData = (params) => {
  return request('/api/bpm/bizDef/list', {
    method: 'get',
    params: params,
  });
};
