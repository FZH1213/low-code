export function flatTreeToList(tree: any[], list: any[]) {
  if (!tree || !(tree instanceof Array)) {
    return;
  }
  tree.forEach((item) => {
    list.push(item);
    if (item.children && item.children instanceof Array && item.children.length > 0) {
      flatTreeToList(item.children, list);
    }
  });
}

export function flatTreeToMap(tree: any[], map: any) {
  if (!tree || !(tree instanceof Array)) {
    return;
  }
  tree.forEach((item) => {
    map[item.value] = item;
    if (item.children && item.children instanceof Array && item.children.length > 0) {
      flatTreeToMap(item.children, map);
    }
  });
}

export function getParentKey(key: any, tree: any[]): any {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: any) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
}

export function flatTreeToMapByKey(tree: any[], map: any, key: string, childrenKey: string) {
  if (!tree || !(tree instanceof Array)) {
    return;
  }
  tree.forEach((item) => {
    map[item[key]] = item;
    if (item[childrenKey] && item[childrenKey] instanceof Array && item[childrenKey].length > 0) {
      flatTreeToMapByKey(item[childrenKey], map, key, childrenKey);
    }
  });
}
