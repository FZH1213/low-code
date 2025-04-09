import request from '@/utils/request';

export async function fetchAllUser() {
  return request('/api/base/user/all');
}

export async function fetchUserByRoleId(roleId: string) {
  return request('/api/base/role/users', { params: { roleId } });
}
