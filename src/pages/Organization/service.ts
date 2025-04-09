import request from '@/utils/request';
import { jsonToFormData } from '@/utils/requestUtil';

export async function fetchOrgPage() {
  return request('/api/base/baseOrg/orgSelect');
}
export async function addOrg(data: Record<string, any>) {
  return request('/api/base/baseOrg/add', {
    method: 'POST',
    data: jsonToFormData(data),
  });
}
export async function updateOrg(data: Record<string, any>) {
  return request('/api/base/baseOrg/update', {
    method: 'POST',
    data: jsonToFormData(data),
  });
}
export async function removeOrgById(id: string) {
  return request('/api/base/baseOrg/removeNoSubordinate', { method: 'POST', data: jsonToFormData({ id }) });
}
export async function removeManyOrgById(id: string) {
  return request('/api/base/baseOrg/batch/remove', { method: 'POST', data: jsonToFormData({ ids:id }) });
}
export async function fetchRoleUserPage(params: any) {
  return request('/api/base/baseRoleUser/list', { params });
}
export async function addRoleUser(data: Record<string, any>) {
  return request('/api/base/baseRoleUser/add', {
    method: 'POST',
    data: jsonToFormData(data),
  });
}
export async function updateRoleUser(data: Record<string, any>) {
  return request('/api/base/baseRoleUser/update', {
    method: 'POST',
    data: jsonToFormData(data),
  });
}
export async function removeRoleUserById(id: string) {
  return request('/api/base/baseRoleUser/remove', { method: 'POST', data: jsonToFormData({ id }) });
}


