import request from '@/utils/request';

export async function fetchAllRoles() {
  return request('/api/base/role/all');
}
