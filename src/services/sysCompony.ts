import request from '@/utils/request';

// 获取列表表格数据接口
export async function listCompony(params: any) {
    return request('/api/biz/sysCompany/list', {
        params
    });
};

// 获取归属区的树形下拉框选项
export async function getRegionTreeData() {
    return request('/api/biz/sysRegion/getRegionTree');
}

// 添加公司接口 /biz/sysCompany/add
export async function addCompany(params: any) {
    return request('/api/biz/sysCompany/add', {
        method: 'POST',
        data: params
    })
}

// 修改接口 /biz/sysCompany/update
export async function editCompony(params: any) {
    return request('/api/biz/sysCompany/update', {
        method: 'POST',
        data: params,
    })
}

// 单个的删除接口
export async function delItem (params: any) {
    return request(`/api/biz/sysCompany/remove/${params.id}`, {
        method: 'POST',
    })
}

// 批量删除/biz/sysCompany/batch/remove
export async function delMoreItem (params: any) {
    return request('/api/biz/sysCompany/batch/remove', {
        method: 'POST',
        data: params
    })
}

// 获取公司下拉
export async function getCompanyList() {
    return request('/api/biz/sysCompany/companyList', {
        method: 'GET',
    })
}

// 获取全国的省份
export async function provinceData() {
    return request('/api/biz/sysRegion/province-nodes',{
        method: 'GET'
    });
}
export default {
    listCompony,
    getRegionTreeData,
    addCompany,
    editCompony,
    delItem,
    delMoreItem,
    getCompanyList,
    provinceData
}