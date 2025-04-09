import request from '@/utils/request';

export async function fetchAllRoles() {
  return request('/api/base/role/all');
}

export async function fetchRolesByUserId(userId: string) {
  return request('/api/base/user/roles', { params: { userId } });
}
