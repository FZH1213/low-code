import { http_get, http_post } from '@/utils/request';

// 请求 规则 下拉框选项的接口
export async function fetchRuleSelectOption () {
    return http_get(`/api/bpm/cuRule/getListByType`)
}

// 请求 模版 下拉框选项的接口
export async function fetchModalSelectOption () {
    return http_get(`/api/sys/msgService/tpls`)
}
 
export default {
    fetchRuleSelectOption,
    fetchModalSelectOption
}