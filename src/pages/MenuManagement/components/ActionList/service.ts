import request from '@/utils/request';
import { jsonToFormData } from '@/utils/requestUtil';

export async function fetchActionByMenuId(menuId?: string) {
  return request('/api/base/menu/action', { params: { menuId } });
}

export async function addAction(data?: any) {
  return request('/api/base/action/add', { method: 'POST', data: jsonToFormData(data) });
}

export async function removeByActionId(actionId: string) {
  return request('/api/base/action/remove', { method: 'POST', data: jsonToFormData({ actionId }) });
}
export async function updateByActionId(data?: any) {
  return request('/api/base/action/update', { method: 'POST', data: jsonToFormData(data) });
}
