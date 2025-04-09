import request from '@/utils/request';
import { jsonToFormData } from '@/utils/requestUtil';



export async function bizExecByCode(data: any) {
  return request(`/api/bpm/bizDef/execByCode/${data._code}`, {
    method: 'post',
    data: data,
  });
}
