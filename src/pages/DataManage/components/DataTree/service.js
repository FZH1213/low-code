import request from '@/utils/request';

// 导入 mock 树形数据
import { mockTreeData } from '../../MockData/MockData';

// export async function getTreeData(params) {
//     return request(`/api/biz/sysRegion/region-and-storage/tree`, {
//         method: 'GET',
//         params: {...params}
//     })
// }

// /bpm/dataSources/tree

export async function getTreeData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 0,
        data: mockTreeData,
      });
    }, 500);
  });
}

// 接口获取数据库表数据
// /bpm/dataSources/list
// export const fetchDataSources = () => {
//   return request('/api/bpm/dataSources/list', {
//     method: 'get',
//   });
// };

export const fetchDataSources = () => {
  return request('/api/bpm/dataSources/tree', {
    method: 'get',
  });
};

// 测试接口获取其下库表分页数据
export const fetchTablesData = (id) => {
  return request(`/api/bpm/dataDdl/list?dataSourceId=${id}`, {
    method: 'get',
  });
};

// /bpm/dataSources/get

// export const fetchTablesData = (id) => {
//   return request(`/api/bpm/dataSources/get?id=${id}`, {
//     method: 'get',
//   });
// };

// 删除 /bpm/dataSources/remove
export const deleteTreeItem = (data) => {
  return request(`/api/bpm/dataSources/remove`, {
    method: 'post',
    data,
    requestType: 'form',
  });
};
