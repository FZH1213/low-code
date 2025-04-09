import request from '@/utils/request';

export async function fetchAuthMenu() {
  return request('/api/base/authority/menu');
}

export async function fetchAuthByRoleId(roleId: string) {
  return request('/api/base/authority/role', { params: { roleId } });
}
