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
    data: data.variables,
    // requestType: 'form',
  });
};

// 生成expose_json
export const generateExposeJson = (data) => {
  return request('/api/bpm/bizDef/generateExposeJson', {
    method: 'post',
    data: data,
    // headers: {
    //   'content-type': 'application/json',
    // },
    requestType: 'form',
  });
};

// 获取树形选项数据
export const getTreeSelectOptions = () => {
  // debugger;
  return request('/api/bpm/ruleDef/list');
};
