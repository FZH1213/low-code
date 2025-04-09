import request from '@/utils/request';

// table LIst
export const getTableData = (params) => {
  return request('/api/bpm/ruleDef/listChild', {
    method: 'get',
    params: params,
  });
};
export const deleteRuleApi = (data) => {
  return request('/api/bpm/ruleDef/remove', {
    method: 'post',
    data: data,
    requestType: 'form',
  });
};

export const updataNameApi = (data) => {
  return request('/api/bpm/ruleDef/updateName', {
    method: 'post',
    data: data,
    requestType: 'form',
  });
};
export const ruleApplyApi = (params) => {
  // ?rule_json_like=
  return request('/api/bpm/bizDef/list', {
    method: 'get',
    params,
  });
};

export const updataApi = (data) => {
  return request('/api/bpm/ruleDef/update', {
    method: 'post',
    data: data,
    requestType: 'form',
  });
};

export async function updateData(data) {
  return request('/api/wrapper/serviceInfo/update', {
    method: 'POST',
    data,
  });
}
