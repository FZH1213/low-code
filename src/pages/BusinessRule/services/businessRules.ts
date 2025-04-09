import request from '@/utils/request';

// 树状请求
export async function getBusinessTree() {
    return request('/api/bpm/actCuRule/list');
};

// 获取业务规则节点的业务
export async function getBusinessRuleList(params:any){
  return request(`/api/bpm/actCuRule/detail/${params}`
   
  )
}

// 获取业务节点列表
export async function getbusinesslist(params:any) {
  return request(`/api/bpm/actCuRuleNode/list/${params}`)
}

// 查看业务规则节点详情
export async function getbusinessRuleDet(params:any) {
  return request(`/api/bpm/actCuRuleNode/detail/${params}`)
}
// 获取业务规则
export async function getBusinessRuleDel() {
  return request('/api/bpm/actCuRuleNode/detail/{cuRuleNodeId}')
}
// 修改规则
export async function updataBusinessRules(params:any) {
  return request('/api/bpm/actCuRuleNode/update',{
    method: 'POST',
    data: params,
  })
}
// 修改业务
export async function updatabusiness(params:any) {
  return request('/api/bpm/actCuRule/add',{
    method: 'post',
    data: params
  })
}
// 新增业务
export async function addBusiness(params:any) {
  return request('/api/bpm/actCuRule/add',{
    method: 'post',
    data: params
  })
}
// 删除业务
export async function deleteBusinessRule(params:any) {
  return request('/api/bpm/actCuRule/delete/'+params,{
    method: 'post'
  })
}

export default {
    getBusinessTree,
    getBusinessRuleList,
    getbusinesslist,
    getbusinessRuleDet,
    getBusinessRuleDel,
    updataBusinessRules,
    updatabusiness,
    addBusiness,
    deleteBusinessRule
}