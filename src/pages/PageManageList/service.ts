import request from '@/utils/request';
import { jsonToFormData } from '@/utils/requestUtil';

export async function fetchPageDefList(params: any) {
  return request('/api/bpm/pageDef/list', { params });
}

export async function removeById(id: string) {
  return request('/api/bpm/pageDef/remove', { method: 'POST', data: jsonToFormData({ id }) });
}
