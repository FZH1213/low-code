import React, { useEffect, useState } from 'react';
import { Button, TreeSelect, Modal, Input, Tree } from 'antd';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { observer } from '@formily/reactive-react';
import Style from './index.less';
const { Search } = Input;
export const Treeselect = observer((props) => {
  console.log(props);
  const [data, setData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [value, setValue] = useState(props.value);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [expressKeys, setExpressKeys] = useState([]);
  const request = createRequest('/api/bpm/bizDef/allList', 'get');
  const renderHandle = async () => {
    // if (!props.requestUrl) return;
    const data = await judgeSucessAndGetData(await request({}));
    if (!data) return;
    // 默认选中一次第一项，且派发选中事件
    if (data.length != null && !!data.length) {
      // setSelectKey(data[0].key);
      // setSelectItem(res.data[0])
      setExpressKeys([data[0].key]);
    }
    if (data.length > 0) {
      let NewData = formatter(data);
      // debugger;
      setData(NewData);
      setNewData(NewData);
    }
  };
  const formatter = (data) => {
    // let NewData = [];

    data.map((item) => {
      // if (item.children.length === 0) {
      item.title = item.title + `(` + item.value + `)`;
      // }
      item.newValue = item.value;
      item.value = `/api/bpm/bizDef/execByCode/` + item.value;

      // NewData.push(item);

      if (item.children) {
        const children = formatter(item.children);
        // Reduce memory usage
        item.children = children;
      }
    });
    return data;
  };
  useEffect(() => {
    renderHandle();
  }, []);
  // const onChange = (value) => {
  //   setValue(value);
  //   props.onChange(value);
  // };
  //搜索重新渲染树形数据
  const onSearch = (searchValue) => {
    console.log(searchValue);
    // return false;
    // const searchValue = e.target.value;

    if (
      searchValue != null &&
      searchValue.length != null &&
      !!searchValue.length &&
      newData != null
    ) {
      let key = [...expressKeys];
      let onRecursionData = (arr, val) => {
        let newarr = [];

        arr.forEach((item) => {
          if (item.children && item.children.length) {
            let children = onRecursionData(item.children, val);
            let obj = {
              ...item,
              children,
            };
            if (children && children.length) {
              //  key值增加
              newarr.push(obj);
              key.push(obj.key);
            } else if (item.title.includes(val) || item.value.includes(val)) {
              newarr.push(obj);
            }
          } else {
            if (item.title.includes(val) || item.value.includes(val)) {
              newarr.push(item);
            }
          }
        });
        return newarr;
      };
      setExpressKeys(key);

      let result = onRecursionData(newData, searchValue);
      console.log(result);

      setData(result);
    }
    // 而如果是空值搜索，那么就还原数据
    if (
      searchValue != null &&
      searchValue.length != null &&
      !!!searchValue.length &&
      newData != null
    ) {
      setData(newData);
    }
  };
  //点击打开弹框
  const showModal = () => {
    setisModalOpen(true);
  };
  //点击弹框确认按钮
  const handleOk = () => {
    setisModalOpen(false);
    props.onChange(value);
  };
  //点击弹框取消按钮
  const handleCancel = () => {
    setisModalOpen(false);
  };
  //点击获取节点
  const onSelect = (value, e) => {
    console.log(value, e);
    setValue(e.node?.value);
  };
  return (
    <>
      <Button style={{ width: '100%' }} type={'default'} onClick={showModal}>
        打开弹框
      </Button>
      <Modal title={'接口弹框'} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div>
          <Search style={{ marginBottom: 8 }} placeholder="请搜索" onSearch={onSearch} />
          <Tree
            style={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}
            defaultExpandParent
            // onExpand={onExpand}
            // expandedKeys={expandedKeys}
            // autoExpandParent={autoExpandParent}
            onExpand={(newExpandedKeys) => {
              setExpressKeys(newExpandedKeys);
            }}
            expandedKeys={expressKeys}
            onSelect={onSelect}
            treeData={data}
            footer={null}
          />
        </div>
        {/* <div style={{ marginTop: '8px' }}>已选接口：{value}</div> */}
        <div style={{ marginTop: '8px' }}>已选接口：
          <Input onChange={(e)=>{setValue(e.target.value)}} value={value}></Input>
        </div>
      </Modal>
    </>
    // <TreeSelect
    //   showSearch
    //   style={{ width: '100%' }}
    //   value={value}
    //   dropdownClassName={Style.treeSelect}
    //   dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    //   placeholder="请选择"
    //   filterTreeNode={(input, node) => {
    //     if (typeof node.title === 'string') {
    //       if (node.title.indexOf(input) !== -1) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     } else {
    //       if (node.name.indexOf(input) !== -1) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     }
    //   }}
    //   allowClear
    //   onSearch={onSearch}
    //   treeDefaultExpandAll
    //   onChange={onChange}
    //   treeData={data}
    // />
  );
});
