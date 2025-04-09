import { Tree, Input } from '@/components/base';
import type { DataNode } from 'antd/es/tree';
import { useEffect, useState, } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
const { Search } = Input;
/**
 * 
 * 树形控件
`* @param {*} props
 * @param {*} props.requestUrl 请求url
 * @param {*} props.placeholder 占位符
 * @return {*}
 */
interface PcTreeProps {
  requestUrl: string,
  placeholder: string,
  wrapper: string
  set_var: any
  _var: any
}
export const PcTree: React.FC<PcTreeProps> = (props) => {
  const [data, setData] = useState<any>([]);
  const request = createRequest(props.requestUrl, 'post');
  const renderHandle = async () => {
    if (!props.requestUrl) return
    const data = await judgeSucessAndGetData(await request(props._var));
    if (!data) return
    setData(data);
  }
  useEffect(() => { renderHandle() }, [props._var])
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = (newExpandedKeys) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };
  const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
    let parentKey: React.Key;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey!;
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAutoExpandParent(true);
    setExpandedKeys(getExpandedKeys(value));
    setSearchValue(value);
  };
  const getExpandedKeys = (searchValue) => {
    const dataList = []
    const loop = (data: DataNode[]) =>
      data.map(item => {
        const strTitle = item.title as string;
        const index = strTitle.indexOf(searchValue);
        if (index > -1) {
          dataList.push(item.key)
        }
        if (item.children) {
          loop(item.children);
        }
      });
    loop(data);
    console.info("dataList", dataList)
    return dataList;
  }
  const titleRender = (node) => {
    const strTitle = node.title as string;
    const index = strTitle.indexOf(searchValue);
    const beforeStr = strTitle.substring(0, index);
    const afterStr = strTitle.slice(index + searchValue.length);
    return (
      <>
        {index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{strTitle}</span>
        )}
      </>

    )
  }

  /**
   * 列表点击事件
   */
  const onSelect = (selectedKeys, info) => {
    if (!props.set_var) return
    props.set_var({ ...props._var, [props.wrapper]: selectedKeys[0] })
  }
  return (
    <>
      <Search onChange={onChange} placeholder={props.placeholder} />
      <Tree
        onExpand={onExpand}
        treeData={data}
        autoExpandParent={autoExpandParent}
        expandedKeys={expandedKeys}
        titleRender={titleRender}
        onSelect={onSelect}
      />
    </>
  );
};
