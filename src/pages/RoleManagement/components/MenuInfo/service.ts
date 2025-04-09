import request from '@/utils/request';

export async function fetchAuthByRoleId(roleId: string) {
  return request('/api/base/authority/role', { params: { roleId } });
}
