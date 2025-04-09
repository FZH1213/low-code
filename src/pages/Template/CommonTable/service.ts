import request from '@/utils/request';
import { jsonToFormData } from '@/utils/requestUtil';

export async function fetchRolePage(params: any) {
  return request('/api/base/role', { params });
}

export async function addRole(data: any) {
  return request('/api/base/role/add', { method: 'POST', data: jsonToFormData(data) });
}

export async function updateByRoleId(data: any) {
  return request('/api/base/role/update', { method: 'POST', data: jsonToFormData(data) });
}

export async function removeByRoleId(roleId: string) {
  return request('/api/base/role/remove', { method: 'POST', data: jsonToFormData({ roleId }) });
}
export async function grantAuthByRoleId(data: any) {
  return request('/api/base/authority/role/grant', {
    method: 'POST',
    data: jsonToFormData(data),
  });
}

export async function addUsersToRoleId(data: any) {
  return request('/api/base/role/users/add', {
    method: 'POST',
    data: jsonToFormData(data),
  });
}
