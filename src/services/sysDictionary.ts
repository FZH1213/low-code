import request from '@/utils/request';

// 设备信息
export async function getDetailData(params: any) {
  return request(`/api/biz/devSignal/getDevSignal`, {
    method: 'get',
    params,
  });
}

/**
 * 专家维护记录
 * DeviceIfoManagement
 */
export async function getListByExpId(params: any) {
  return request('/api/biz/repairOrder/listByExpId', {
    params,
  });
}

/**
 * 设备基础信息管理
 * DeviceIfoManagement
 */

/**
 * 停用启用
 * @param params
 * @returns
 */
export async function updateStatusDeviceCategory(params: any) {
  return request('/api/biz/deviceCategory/update/updateStatus', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取分页数据
 * @param params
 * @returns
 */
//  export async function listDeviceCategory(params: any) {
//   return request('/api/biz/deviceCategory/list', {
//     params
//   });
// };
export async function listDeviceCategory(params: any) {
  return request('/api/biz/deviceCategory/validList', {
    params,
  });
}

/**
 * 批量删除数据
 * @param params   ids:[]
 * @returns
 */
export async function batchRemoveDeviceCategory(params: any) {
  return request('/api/biz/deviceCategory/batch/remove', {
    method: 'POST',
    data: params,
  });
}

/**
 * 添加数据
 * @param params
 * @returns
 */
export async function addDeviceCategory(params: any) {
  return request('/api/biz/deviceCategory/combine-add', {
    method: 'POST',
    data: params,
  });
}

/**
 * 更新数据
 * @param params
 * @returns
 */
export async function updateDeviceCategory(params: any) {
  return request('/api/biz/deviceCategory/combine-update', {
    method: 'POST',
    data: params,
    // requestType: 'form',
  });
}

/**
 * 字典值
 * Dictionary
 */

/**
 * 添加数据
 * @param params
 * @returns
 */
export async function addDictionary(params: any) {
  return request('/api/biz/sysDictionary/add', {
    method: 'POST',
    data: params,
    // requestType: 'form',
  });
}

/**
 * 批量删除数据
 * @param params   ids:[]
 * @returns
 */
export async function batchRemoveDictionary(params: any) {
  return request('/api/biz/sysDictionary/batch/remove', {
    method: 'POST',
    data: params,
  });
}

/**
 * 根据ID查找数据
 * @param params
 * @returns
 */
export async function getDictionary(params: any) {
  return request('/api/biz/sysDictionary/get', {
    params,
  });
}

/**
 * 获取分页数据
 * @param params
 * @returns
 */
export async function listDictionary(params: any) {
  return request('/api/biz/sysDictionary/list', {
    params,
  });
}

/**
 * 删除数据
 * @param params   id
 * @returns
 */
export async function removeDictionary(params: any) {
  return request('/api/biz/sysDictionary/remove', {
    method: 'POST',
    data: params,
  });
}

/**
 * 更新数据
 * @param params
 * @returns
 */
export async function updateDictionary(params: any) {
  return request('/api/biz/sysDictionary/update', {
    method: 'POST',
    data: params,
    // requestType: 'form',
  });
}

/**
 * 根据 category 获取字典列表(用于Select组件)
 * @param params
 * @returns
 */
export async function getSelectOptions(category: any) {
  return request(`/api/biz/sysDictionary/${category}/select-options`);
}

/**
 * 获取分页数据(有效数据)
 * @param params
 * @returns
 */
export async function listValidDictionary(params: any) {
  return request('/api/biz/sysDictionary/validList', {
    params,
  });
}


// 更新数据抽屉接口/biz/deviceAsset/update
export async function AssetsUpdateSubmit (params: any) {
  return request(`/api/biz/deviceAsset/combine-update`, {
      method: 'POST',
      data: {...params}
  })
}

// 新增设备抽屉的提交接口
export async function AssetsAddSubmit(params: any) {
  return request(`/api/biz/deviceAsset/combine-add`, {
      method: 'POST',
      data: {...params}
  })
}

// 新增设备抽屉的数据接口
export async function GetValidMaintenanceCycle(params: any) {
  return request(`/api/biz/deviceCategory/getValidMaintenanceCycle`, {
      method: 'get',
      params,
  })
}

//压力表新增抽屉的数据接口
export async function AssetsdeviceCheck(params: any) {
  return request(`/api/biz/deviceCheck/combine-add`, {
      method: 'POST',
      data: {...params}
  })
}
//压力表修改抽屉的数据接口
export async function AssetsdeviceCheckUpdate(params: any) {
  return request(`/api/biz/deviceCheck/combine-update`, {
      method: 'POST',
      data: {...params}
  })
}

//检测详情接口
export async function AssetsdeviceCheckdetail(id: any) {
  return request(`/api/biz/deviceCheck/${id}/combine-detail`, {
      method: 'GET',
  })
}
export default {
  listDictionary,
  listValidDictionary,
  getSelectOptions,
  addDictionary,
  listDeviceCategory,
  updateDictionary,
  batchRemoveDictionary,
  addDeviceCategory,
  batchRemoveDeviceCategory,
  updateDeviceCategory,
  getDictionary,
  updateStatusDeviceCategory,
  getListByExpId,
  getDetailData,
  AssetsUpdateSubmit,
  AssetsAddSubmit,
  GetValidMaintenanceCycle,
  AssetsdeviceCheck,
  AssetsdeviceCheckUpdate,
  AssetsdeviceCheckdetail
};
