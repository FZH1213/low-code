import request from '@/utils/request';

export async function fetchAllMenu() {
  return request('/api/base/menu/all');
}
