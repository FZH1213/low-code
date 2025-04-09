import request from '@/utils/request';
import { jsonToFormData } from '@/utils/requestUtil';

export async function fetchAllRoles() {
  return request('/api/base/role/all');
}

export async function updateByMenuId(data: any) {
  return request('/api/base/menu/update', { method: 'POST', data: jsonToFormData(data) });
}

export async function addMenu(data: any) {
  return request('/api/base/menu/add', { method: 'POST', data: jsonToFormData(data) });
}

export async function removeByMenuId(menuId: string) {
  return request('/api/base/menu/remove', { method: 'POST', data: jsonToFormData({ menuId }) });
}
