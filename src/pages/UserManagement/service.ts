import request from '@/utils/request';
import { jsonToFormData } from '@/utils/requestUtil';

export async function fetchUserPage(params: any) {
  return request('/api/base/user', { params });
}

export async function addUser(data: Record<string, any>) {
  return request('/api/base/user/add', {
    method: 'POST',
    data: jsonToFormData(data),
  });
}
export async function updateUser(data: Record<string, any>) {
  return request('/api/base/user/update', {
    method: 'POST',
    data: jsonToFormData(data),
  });
}

export async function addRolesByUseId(data: Record<string, any>) {
  return request('/api/base/user/roles/add', {
    method: 'POST',
    data: jsonToFormData(data),
  });
}

export async function updatePasswordByUserId(data: Record<string, any>) {
  return request('/api/base/user/update/password', {
    method: 'POST',
    data: jsonToFormData(data),
  });
}
