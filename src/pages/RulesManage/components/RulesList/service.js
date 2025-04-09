import request from '@/utils/request';

export const fetchRulesData = () => {
  return request('/api/bpm/ruleDef/list');
};

export const addRule = (data) => {
  return request('/api/bpm/ruleDef/add', {
    method: 'post',
    data: data,
    requestType: 'form',
  });
};

