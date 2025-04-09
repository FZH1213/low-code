import request from '@/utils/request';

export const getByCode = (data) => {
  return request(`/api/bpm/pageDef/getByCode?code=${data}`, {
    method: 'GET',
  });
};
