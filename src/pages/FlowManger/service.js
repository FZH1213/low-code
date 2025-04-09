import request from '@/utils/request';

export const getActFlowDefBriefList = (params) => {
  return request('/api/bpm/actFlowDef/briefList', {
    method: 'get',
    params
  });
};

export const getActFlowDefByFlowCode = (params) => {
  return request('/api/bpm/actFlowDef/getBriefByCode', {
    method: 'get',
    params
  });
};

export const saveReleaseFlow = (data) => {
  return request('/api/bpm/actFlowDef/saveReleaseFlow', {
    method: 'post',
    data: data,
  });
};

export const actFlowDefAdd = (data) => {
  return request('/api/bpm/actFlowDef/add', {
    method: 'post',
    data: data,
  });
};

export const actFlowDefUpdate = (data) => {
  return request('/api/bpm/actFlowDef/update', {
    method: 'post',
    data: data,
  });
};

export const fetchPageDefList = (params) => {
  // return request('/api/bpm/pageDef/list', { 
  return request('/api/bpm/pageDef/processPageList', {
    method: 'get',
    params
  });
}
