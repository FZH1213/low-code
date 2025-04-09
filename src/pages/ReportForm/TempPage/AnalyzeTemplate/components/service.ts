import request, { http_get, http_post } from '@/utils/request';

// 调规则/bpm/bizDef/execByCode/{code}
export async function execByCode(params: any,coede:any) {
    return http_post(`/api/bpm/bizDef/execByCode/${coede}`,{
        data: params,
        headers: {
            'content-type': 'application/json',
        },
    });
}

export default {
    execByCode,
};