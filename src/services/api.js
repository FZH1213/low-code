import request from '@/utils/request';
import { stringify } from 'qs';
import { duration } from 'moment';

/**
 * 根据 url 获取数据
 * @param params
 * @returns
 */
export async function getTreeApi(url) {
  return await request(url);
}

/**
 * 根据 url 获取数据
 * @param params
 * @returns
 */
export async function postApi(url, data) {
  return await request(url, {
    method: 'POST',
    data,
  });
}

/**
 * 根据 url 获取数据
 * @param params
 * @returns
 */
export async function getexecByCode() {
  return await request('/api/bpm/bizDef/execByCode/biz.page.test', {
    method: 'POST',
    data: {},
  });
}

// 待审核任务
export const reviewedTask = async (params) =>
  request(`/api/biz/sysIndex/taskDevNum`, {
    method: 'GET',
  });

// 待阅消息列表
export const msgWaitRead = async (params) => {
  return request('/api/bpm/msgWaitRead/list', {
    method: 'GET',
  });
};
// 待阅转已阅 /bpm/msgWaitRead/toRead
export const msgWaitForRead = async (params) => {
  return request(`/api/bpm/msgWaitRead/toRead?id=${params}`, {
    method: 'GET',
  });
};
// 我的工单列表
export const processtaskMytaskList = async (params) =>
  request(`/api/bpm/processtask/mytaskList`, {
    method: 'POST',
    data: { ...params },
  });

//工单查询列表
export const processtaskSearchWorkList = async (params) =>
  request(`/api/bpm/actHiTasklog/selectAllLog`, {
    method: 'POST',
    data: { ...params },
  });

// 我的工单列表处理历史
export const taskListProcessingHistory = async (params) =>
  request(`/api/bpm/actHiTasklog/selectMyselfOrderLog`, {
    method: 'POST',
    data: { ...params },
  });

/**
 * 根据 category 获取字典列表(用于Select组件)
 * @param params
 * @returns
 */
export async function getSelectOptions(category) {
  return request(`/api/biz/sysDictionary/${category}/select-options`);
}

// 人员列表
export async function userSimpleList() {
  return request('/api/base/user/all');
}

// 人员列表(未离职)
export async function userSimpleListInUser() {
  return request('/api/base/user/userSimpleList', { params: { valid: true } });
}

/**流程配置API Start*/

//根据流程ID与流程标识启动流程
export const identityStartFlow = async (params) =>
  request(`/api/bpm/processtask/identityStartFlow`, {
    method: 'POST',
    params: { ...params },
  });

//获取我的待办列表数据
export const queryTaskList = async (params) =>
  request(`/api/bpm/processtask/taskList`, {
    method: 'GET',
  });
export async function queryTasks(params) {
  return request('/api/bpm/sysTask/taskList');
}
export async function processInfoByTaskId(params) {
  return request(`/api/bpm/sysTask/getTaskLogListByTaskId?${stringify(params)}`);
}

export const queryFlowList = async (params) =>
  request(`/api/bpm/actReDefine/list`, {
    method: 'GET',
  });
export const queryFormKey = async (params) =>
  request(`/api/bpm/processtask/selectFormKey`, {
    method: 'GET',
  });
export const AddFlow = async (params) =>
  request(`/api/bpm/actReDefine/addFlowDefine`, {
    method: 'POST',
    data: { ...params },
  });
export const StartrstopFlow = async (params) =>
  request(`/api/bpm/flowchart/updatecurstate`, {
    method: 'POST',
    data: { ...params },
  });
export async function queryConfigflow(params) {
  return request(`/api/bpm/actReData/detail?${params}`);
}

export const SaveFlow = async (params) =>
  request(`/api/bpm/actReData/saveFlowDetail`, {
    method: 'POST',
    data: { ...params },
  });

export async function releaseFlow(params) {
  return request(`/api/bpm/processtask/releaseprocess?${params}`);
}

export const StartFlow = async (params) =>
  request(`/api/bpm/processtask/startFlow`, {
    method: 'POST',
    data: { ...params },
  });
export const AccomplishFlow = async (params) =>
  request(`/api/bpm/processtask/accomplishFlow`, {
    method: 'POST',
    data: { ...params },
  });
/**流程配置API End*/

/** 流程编辑器初始化数据API Start */
//获取人员列表
export async function getUserList() {
  return request('/api/base/user/all');
}

//获取角色列表
export const getRoleList = async (params) =>
  request(`/api/base/role/all`, {
    method: 'GET',
  });
//机构树形下拉
export const getOrgTreeData = async (params) =>
  request(`/api/base/baseOrg/orgSelect`, {
    method: 'GET',
  });
//获取特定表列表
export const getFormList = async (params) =>
  request(`/api/bpm/specificApprovalNodeType/getTypeList`, {
    method: 'GET',
  });
//获取规则列表
export async function getRuleList() {
  // return request('/api/bpm/actCuRule/getListByType');
  return request('/api/bpm/bizDef/getProcessDefList');
}
//获取消息模板列表
// export async function getMsgList() {
//   return request('/api/sys/msgService/listTplCatalog');
// }
export async function getMsgList() {
  return request('/api/sys/msgService/tpls');
}
//删除流程定义
export async function handleDeleteFlow(params) {
  return request(`/api/bpm/actReDefine/deleteFlowDefine`, {
    method: 'GET',
    params: { ...params },
  });
}

/** 流程编辑器初始化数据API End */

/**业务规则管理API Start*/

/*获取业务列表信息*/
export async function businessRule_list() {
  return request('/api/bpm/cuRule/list');
}

/*获取业务具体信息*/
export async function businessRule_detail(params) {
  return request(`/api/bpm/cuRule/detail/${params}`);
}

/*删除业务具体信息*/
export async function businessRule_delete(params) {
  return request(`/api/bpm/cuRule/delete/${params}`, {
    method: 'POST',
  });
}

/*提交业务信息 */
export async function businessRule_save(params) {
  return request(`/api/bpm/cuRule/add`, {
    method: 'POST',
    json: true,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

/*获取业务规则信息*/
export async function businessRuleNodes_list(params) {
  return request(`/api/bpm/cuRuleNode/list/${params}`);
}

/*更新业务规则信息 */
export async function businessRuleNodes_update(params) {
  return request(`/api/bpm/cuRuleNode/update`, {
    method: 'POST',
    json: true,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

/*获取数据库表字段信息*/
export async function findField_list(params) {
  return request(`/api/bpm/cuRuleNode/fieldList/${params}`);
}

/**业务规则管理API End*/

/**角色权限管理API Start*/
//获取树型角色数据
export const queryTreeData = async (params) =>
  request(`/api/base/role/treeList`, {
    method: 'GET',
  });

//添加-编辑角色组
export const addorEditRoleGroup = async (params) =>
  request(`/api/base/role/addorupdaterolegroup`, {
    method: 'POST',
    data: { ...params },
  });
//删除角色组
export const deleteRoleGroup = async (params) =>
  request(`/api/base/role/removerolegroup`, {
    method: 'POST',
    data: { ...params },
  });
//添加-编辑角色组
export const addorEditRole = async (params) =>
  request(`/api/base/role/addorupdate`, {
    method: 'POST',
    data: { ...params },
  });
//删除角色
export const deleteRole = async (params) =>
  request(`/api/base/role/remove`, {
    method: 'POST',
    data: { ...params },
  });
//复制子角色
export const CopyRole = async (params) =>
  request(`/api/base/role/copychildrole`, {
    method: 'POST',
    data: { ...params },
  });

//菜单权限树形数据
export const queryMenuRuleData = async (params) =>
  request(`/api/base/authority/menu`, {
    method: 'GET',
  });

//菜单权限树形数据V2
export const queryMenuRuleDataV2 = async (params) =>
  request(`/api/base/authority/treeMenu`, {
    method: 'GET',
  });
//获取角色/角色组已分配的菜单权限
export async function roleRuleMenu(params) {
  return request(`/api/base/authority/role?${params}`);
}
//修改角色组\角色权限
export const roleGrUpdateRule = async (params) =>
  request(`/api/base/authority/role/grant`, {
    method: 'POST',
    params: { roleId: params.roleId },
    data: params.authorityIds,
  });

//根据角色id获取用户
export async function selectRoleIdByUser(params) {
  return request(`/api/base/role/userlist?${params}`);
}

/**角色权限管理API End*/

/*其他申请API start */
//添加申请
export const otherApplyForm_save = async (params) =>
  request(`/api/studio/otherApply/update`, {
    method: 'POST',
    data: { ...params },
  });
/*--------*/
/*培训申请API start */
//添加申请
export const trainingApplyForm_save = async (params) =>
  request(`/api/studio/trainingApply/update`, {
    method: 'POST',
    data: { ...params },
  });
//获取全部树级列表地址信息
export async function getTreeLocal() {
  return request(`/api/studio/trainingApply/getLocal`);
}
//获取全部树级列表地址信息
export async function getLocalList() {
  return request(`/api/studio/trainingApply/getLocalList`);
}
/*--------*/

/*营业部及其他路演申请API start */
//添加申请
export const roadShowApplyForm_save = async (params) =>
  request(`/api/studio/salesRoadshowApply/update`, {
    method: 'POST',
    data: { ...params },
  });
/*--------*/

/*研讨申请API start */
//列表查询
export const discussionApplyList_init = async (params) =>
  request(`/api/studio/discussionApply/list`, {
    method: 'GET',
  });
//添加申请
export const discussionApplyForm_save = async (params) =>
  request(`/api/studio/discussionApply/add`, {
    method: 'POST',
    data: { ...params },
  });
//查看详情
export async function discussionApplyForm_detail(params) {
  return request(`/api/studio/discussionApply/edit/${params}`);
}
//删除申请信息
export async function discussionApplyForm_delete(params) {
  return request(`/api/studio/discussionApply/remove/${params}`, {
    method: 'POST',
  });
}

// 资料交流表
// 获取分页数据
export async function exchangeInfoResearch_list(params) {
  return request(`/api/studio/exchangeInfoResearch/list`, {
    method: 'GET',
  });
}
// 添加数据
export async function exchangeInfoResearch_update(params) {
  return request(`/api/studio/exchangeInfoResearch/update`, {
    method: 'POST',
    data: { ...params },
  });
}
// 删除数据
export async function exchangeInfoResearch_remove(params) {
  return request(`/api/studio/exchangeInfoResearch/remove`, {
    method: 'POST',
    data: { ...params },
  });
}
// 电话申请
// 获取分页数据
export async function phoneResearch_list(params) {
  return request(`/api/studio/phoneResearch/list`, {
    method: 'GET',
  });
}
// 添加数据
export async function phoneResearch_update(params) {
  return request(`/api/studio/phoneResearch/update`, {
    method: 'POST',
    data: { ...params },
  });
}
// 删除数据
export async function phoneResearch_remove(params) {
  return request(`/api/studio/phoneResearch/remove`, {
    method: 'POST',
    data: { ...params },
  });
}

/*研讨申请API end */
/**岗位管理 Start*/

//获取全部部门信息
export async function stationNode_list() {
  return request('/api/sys/dictionaryValue/getNodeList');
}
//获取岗位信息
export async function station_list(params) {
  return request(`/api/base/station/getByNodeId?nodeId=${params}`);
}

//添加岗位信息
export async function station_insert(params) {
  return request(`/api/base/station/add`, {
    method: 'POST',
    json: true,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

//修改岗位信息
export async function station_update(params) {
  return request(`/api/base/station/update`, {
    method: 'POST',
    json: true,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

//修改岗位排序
export async function order_update(params) {
  return request(`/api/base/station/updateOrder`, {
    method: 'POST',
    json: true,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

//删除岗位信息
export async function station_delete(params) {
  return request(`/api/base/station/remove/${params}`, {
    method: 'POST',
  });
}

/**岗位管理 End*/

/**
 * 获取研究方向树
 */
export async function getResearchFieldsTree() {
  return request('/api/base/struct/rootChildrenTree');
}

// 大屏全省监控图表
export async function ProvincialChartData(params) {
  return request(`/api/biz/chartShow/repairOrderCountStatisticsGroupCityRegion`, {
    method: 'GET',
    params,
  });
}

// 大屏全省监控图表
export async function CityChartData(params) {
  return request(`/api/biz/chartShow/repairOrderCountStatisticsGroupCityRegion`, {
    method: 'GET',
    params,
  });
}
// 大屏全省监控图表
export async function AreaChartData(params) {
  return request(`/api/biz/chartShow/repairOrderCountStatisticsGroupRegionStorage`, {
    method: 'GET',
    params,
  });
}

/**
 * 获取当前用户的所有公司
 * @returns
 */
export async function getCurrentAllCompany() {
  return request(`/api/base/user/all-company`, {
    method: 'GET',
  });
}

/**
 * 切换公司
 * @returns
 */
export async function switchCompany(companyId) {
  return request(`/api/base/user/switch-company/${companyId}`, {
    method: 'POST',
  });
}

/**
 * 切换公司
 * @returns
 */
export async function getallSimple() {
  return request('/api/base//user/all-simple');
}

/**
 * 切换公司
 * @returns
 */
export async function transferTask(parmas) {
  return request('/api/bpm/processtask/transferTask', {
    method: 'POST',
    data: { ...parmas },
  });
}
//获取机构类型列表
export const getOrgTypeList = async (params) =>
  request(`/api/bpm/bizDef/execByCode/sys.dictionary.list`, {
    method: 'POST',
    data: { ...params },
  });
//获取登录名列表
export const getUserNameList = async (params) =>
  request(`/api/bpm/bizDef/execByCode/sys_questStar.user_select`, {
    method: 'POST',
    data: { ...params },
  });
export default {
  processtaskMytaskList,
  processtaskSearchWorkList,
  getSelectOptions,
  taskListProcessingHistory,
  reviewedTask,
  getRoleList,
  ProvincialChartData,
  CityChartData,
  AreaChartData,
  getCurrentAllCompany,
  switchCompany,
  getUserNameList,
  msgWaitRead,
  msgWaitForRead,
  getallSimple,
  transferTask,
  getOrgTreeData,
  getOrgTypeList
};
