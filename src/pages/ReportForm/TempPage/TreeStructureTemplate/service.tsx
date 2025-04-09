import request, { http_get, http_post } from '@/utils/request';

// 调规则/bpm/bizDef/execByCode/{code}
export async function execByCode(params: any, coede: any) {
    return http_post(`/api/bpm/bizDef/execByCode/${coede}`, {
        data: params,
        headers: {
            'content-type': 'application/json',
        },
    });
}

// 获取页面配置属性
export async function getTreeDetailById(params) {
    return request(`/api/wrapper/intfManDesc/getTreeDetailById`, {
        params: params,
        method: 'GET'
    });
    // return request('/api/wrapper/intfManDesc/getTreeDetailById', { params });
}

// 获取SQLs数据-BYBizCode
export async function getDataByBizCode(params) {
    return http_post('/api/wrapper/intfManDesc/getDataByBizCode', {
        data: params,
    });
}

//获取图片
export async function downloadFileById(params) {
    return request(`/api/file/fileDown/downloadFileById`, {
        params: params,
        method: 'GET',
        responseType: 'blob',
    });
    // return request('/api/wrapper/intfManDesc/getTreeDetailById', { params });
}

export default {
    execByCode,
    getTreeDetailById,
    getDataByBizCode,
    downloadFileById
};