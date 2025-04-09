import React, { useState, useEffect } from 'react';
import { Transfer, Tree, Input, List, TreeSelect, Select, Tag } from 'antd';
const { TreeNode } = TreeSelect;
// const { TreeNode } = Tree;
import styles from './styles.less';

// 穿梭框


const TransferInput = (props) => {
  // console.log("Transfer 的props", props);

  const [inputValue, setInputValue] = useState<any>("")
  const [selectText, setSelectText] = useState<any>([])
  const [selectArr, setSelectArr] = useState<any>([])
  const { dataSource, targetKeys, ...restProps } = props
  const [transferState,setTransfetState]=useState(true)
  let dataSourceData = props.dataSource
  dataSourceData.map((item) => {
    item.title = item.regularCode + " " + item.title
    if (item.children && item.children.length > 0) {
      item.children.map((ite) => {
        ite.title = ite.regularCode + " " + ite.title
        if (ite.children && ite.children.length > 0) {
          ite.children.map((it) => {
            it.title = it.regularCode + " " + it.title
          })
        }
      })
    }
  })
  const isChecked = (selectedKeys, eventKey) => selectedKeys.indexOf(eventKey) !== -1;

  const generateTree = (treeNodes = [], checkedKeys = []) => (

    treeNodes.map(({ children, ...props }) => ({
      ...props,
      disabled: checkedKeys.includes(props.key),
      children: generateTree(children, checkedKeys),
    }))
  )

  const transferDataSource = [];
  function flatten(list = []) {
    list.forEach(item => {
      transferDataSource.push(item);
      flatten(item.children);
    });
  }
  flatten(dataSource);

  useEffect(()=>{
    dropdownRenderFunc()
  },[selectText])
  console.log("transfer selectText", selectText)

  const dropdownRenderFunc=()=>{
    
    return (
      <Transfer
        {...restProps}
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        className="tree-transfer"
        onSelectChange={()=>{
          setTransfetState(true)
        }}
        render={(item) => {
          let selectArrCus = []
          let selectTextArr = []
          transferDataSource.map((item) => {
            targetKeys.map((ite) => {
              if (item.key == ite) {
                selectArrCus.push(item)
                selectTextArr.push(item.regularCode + " " + item.title.split(" ")[item.title.split(" ").length-1])
              }
            })
          })
          if (JSON.stringify(selectTextArr).split(" ")[1] !== JSON.stringify(selectText).split(" ")[1]&& transferState) {
            // debugger
            setSelectText(selectTextArr)
            setSelectArr(selectArrCus)
          }
          let listArr = []
          listArr.push(item)
          return (
            <List
              size="small"
              bordered={false}
              style={{ padding: "0 0", }}
              dataSource={listArr}
              renderItem={ite => <List.Item
                className={styles['transfertreelist']}
              >
                <div>
                  <span>{ite.regularCode} </span>
                  <Input className={styles['transfertreeinput']} bordered={false}
                    defaultValue={ite.title?.split(" ")[1]}
                    key={item.key}
                    onFocus={(record) => {
                      setInputValue(item.key)
                    }}
                    onChange={(record) => {
                      setTransfetState(false)
                      let changeItem = {}
                      // listArr.map((it) => {
                        if (listArr[0].key == inputValue) {
                          changeItem = listArr[0]
                          listArr[0].title = record.target.value
                        }
                      // })
                      console.log("transfer Input onchange setSelectArr", selectArr)
                      let mediumSelect=selectArr
                      let mediumSelectTextArr = []
                      mediumSelect.map((item)=>{
                        if(item.key==listArr[0].key){
                          item.title=record.target.value
                        }
                        mediumSelectTextArr.push(item.regularCode + " " + item.title)

                      })
                      setSelectArr(mediumSelect)
                      setSelectText(mediumSelectTextArr)
                      console.log("transfer select mediumSelectTextArr", mediumSelectTextArr)

                      // debugger
                      props.getTransferInput(changeItem);
                    }} />
                </div>
              </List.Item>}
            />
          )
        }}
        listStyle={{
          minHeight: 80,
          maxHeight: 300,
          margin: "5px 10px"
        }}
        showSelectAll={false}

      >
        {({ direction, onItemSelect, selectedKeys }) => {
          // console.log("Transfer  direction, onItemSelect, selectedKeys", direction, onItemSelect, selectedKeys);
          if (direction === 'left') {
            const checkedKeys = [...selectedKeys, ...targetKeys];
            props.getTransfer({ targetKeys });
            return (
              <Tree
                height={200}
                blockNode
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                treeData={
                  generateTree(dataSourceData, targetKeys)
                }
                onCheck={(_, { node: { key } }) => {
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
                onSelect={(_, { node: { key } }) => {
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
              />
            );
          }
        }}
      </Transfer >

    )
  }
  

  return (
    <>

      <Select
        mode="multiple"
        style={{ width: '100%' }}
        value={selectText}
        dropdownRender={dropdownRenderFunc}
      >

      </Select>


      {/* <Transfer
        {...restProps}
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        className="tree-transfer"
        render={(item) => {
          let listArr = []
          listArr.push(item)
          return (
            <List
              size="small"
              bordered={false}
              style={{ padding: "0 0", }}
              dataSource={listArr}
              renderItem={ite => <List.Item
                className={styles['transfertreelist']}
              >
                <div>
                  <span>{ite.regularCode} </span>
                  <Input className={styles['transfertreeinput']} bordered={false}
                    defaultValue={ite.title?.split(" ")[1]}
                    key={item.key}
                    onFocus={(record) => {
                      setInputValue(item.key)
                    }}
                    onChange={(record) => {
                      let changeItem = {}
                      listArr.map((it) => {
                        if (it.key == inputValue) {
                          changeItem = it
                          it.title = record.target.value
                        }
                      })
                      props.getTransferInput(changeItem);
                    }} />
                </div>
              </List.Item>}
            />
          )
        }}
        listStyle={{
          minHeight: 80,
          maxHeight: 300,
        }}
        showSelectAll={false}

      >
        {({ direction, onItemSelect, selectedKeys }) => {
          // console.log("Transfer  direction, onItemSelect, selectedKeys", direction, onItemSelect, selectedKeys);
          if (direction === 'left') {
            const checkedKeys = [...selectedKeys, ...targetKeys];
            props.getTransfer({ targetKeys });
            return (
              <Tree
                height={200}
                blockNode
                checkable
                checkStrictly
                defaultExpandAll
                checkedKeys={checkedKeys}
                treeData={
                  generateTree(dataSourceData, targetKeys)
                }
                onCheck={(_, { node: { key } }) => {
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
                onSelect={(_, { node: { key } }) => {
                  onItemSelect(key, !isChecked(checkedKeys, key));
                }}
              />
            );
          }
        }}
      </Transfer > */}
    </>
  );
};

export default TransferInput;
