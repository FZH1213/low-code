import request from 'umi-request';
import { http_post } from '@/utils/request';

//获取当前登录用户信息
export async function getLoginUser() {
  return request('/api/admin/current/user');
}

// 根据页面Id获取动态表单字段配置
export async function getSrvCode(params: any) {
  // return request('/api/wrapper/intfManDesc/getDetailById', { params });
  return request('/api/wrapper/intfManDesc/getTreeDetailById', { params });
}

// 获取动态表单具体内容-接口2
export async function getSrvCodeDetail(params: any) {
  return http_post('/api/wrapper/intfManDesc/getDataBySrvCode', {
    data: params,
  });
}

//审核操作接口--通过/不通过等操作
export async function completeTask(params: any) {
  return http_post('/api/bpm/processTask/completeTask', {
    data: params,
  });
}

//获取审批按钮类型列表
export async function getButtonList() {
  return request(`/api/base/bctpSysDict/batch/getDictName?pidCode=buttonType`, {
    method: 'GET',
  });
}

//获取人员列表
export async function getUserList() {
  return request(`/api/base/user/all`, {
    method: 'GET',
  });
}

//审核操作接口--通过/不通过等操作
export async function transferTask(params: any) {
  return http_post('/api/bpm/processTask/transferTask', {
    data: params,
  });
}

// // 根据页面Id获取动态表单字段配置
// export async function selectTaskLogByTaskId(params: any) {
//   return request('/api/bpm/actHiTasklog/selectLogByTaskId', { params });
// }

// 调规则/bpm/bizDef/execByCode/{code}
export async function execByCode(params: any, code: any) {
  return http_post(`/api/bpm/bizDef/execByCode/${code}`, {
    data: params,
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  });
}

// 获取SQLs数据-BYBizCode
export async function getDataByBizCode(params) {
  return http_post('/api/wrapper/intfManDesc/getDataByBizCode', {
    data: params,
  });
}



// 根据页面Id获取动态表单字段配置,获取流程日志
export async function selectTaskLogByTaskId(params: any) {
  return http_post('/api/bpm/bizDef/execByCode/biz.flow.userApp.log', { data: params });
}