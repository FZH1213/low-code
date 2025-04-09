import request from '@/utils/request';

// 获取权限
export async function getAuthority(params?: { serviceId: string }) {
  return request('/api/base/authority/api', {
    params,
  });
}

// 获取选中的权限
export async function getAuthorityAction(params: { actionId: string }) {
  return request('/api/base/authority/action', {
    params,
  });
}

// 提交选中的权限
export async function getAuthorityGrant(params: any) {
  return request('/api/base/authority/action/grant', { method: 'POST', data: params });
}
