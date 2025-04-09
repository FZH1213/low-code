import request, { http_post } from '@/utils/request';

// 获取按钮列表接口
export async function getButtonList(params) {
    return request(`/api/base/findActionList`, {
        params: params,
        method: 'GET',
    });
}

export default {
    getButtonList
};