import request from '@/utils/request';

export async function fetchAllMenu() {
  return request('/api/base/menu/all');
}

export async function fetchAllMenuH5() {
  return request('/api/base/baseAppMenu/menu/all');
}

// export async function fetchAllMenuH5() {
//   return request('/api/base/baseAppMenu/menu/getTreeByUserAuth');
// }