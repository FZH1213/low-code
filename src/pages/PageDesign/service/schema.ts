import { Engine } from '@designable/core';
import { transformToSchema, transformToTreeNode } from '../service';

import { history } from 'umi';
import request from '@/utils/request';
export const saveSchema = (designer: Engine) => {
  // const { pageJson }: any = history.location.query;
  // console.log('history.location', history.location.query);
  // console.info('designer', designer);
  const treeNode = { ...designer.getCurrentTree()?.children };
  const treeNode2 = { ...designer.getCurrentTree() };
  console.info('pageJson', treeNode2);

  localStorage.setItem(
    'my-schema',
    JSON.stringify(transformToSchema(designer.getCurrentTree(), {})),
  );
};

export const loadInitialSchema = async (designer: Engine) => {

  const { code }: any = history.location.query;
  await getByCode(code).then((res) => {
    if (res.code === 0) {
      const { pageJson } = res.data;
      try {
        pageJson
          ? designer.setCurrentTree(transformToTreeNode(JSON.parse(pageJson), {}))
          : designer.setCurrentTree(transformToTreeNode(JSON.parse('{}'), {}));
      } catch {
        console.error('遍历失败');
      }
    }
  }

  )


};

// 添加库表
export const EditPage = (data) => {
  return request('/api/bpm/pageDef/update', {
    method: 'post',
    data,
    requestType: 'form',
  });
};


export const getByCode = (data) => {
  return request(`/api/bpm/pageDef/getByCode?code=${data}`, {
    method: 'GET',
  });
};