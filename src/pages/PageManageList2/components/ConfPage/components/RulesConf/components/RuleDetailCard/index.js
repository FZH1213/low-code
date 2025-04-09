// 参数配置卡片
import React, { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Form, Input, TreeSelect } from 'antd';

import {
  PlusCircleOutlined,
  DeleteOutlined,
  CloseOutlined,
  EditOutlined,
  FormOutlined,
  SaveOutlined,
} from '@ant-design/icons';
const type = 'ParamsDetailCard';

const ParamsDetailCard = (props) => {
  const formRef = useRef(null);
  const [data, setData] = useState(null);
  const [index, setIndex] = useState(null);
  const [id, setId] = useState(null);
  //   编辑状态
  const [editing, setEditing] = useState(false);
  const [treeSelectRule, setTreeSelectRule] = useState(null);

  const [treeSelectOptions, setTreeSelectOptions] = useState([]);

  useEffect(() => {
    // debugger;
    if (props.treeSelectOptions != null && props.treeSelectOptions.length != null) {
      setTreeSelectOptions(props.treeSelectOptions);
    }
  }, [props.treeSelectOptions]);

  // // 添加树形结构
  // useEffect(() => {
  //   if (props.treeSelectRule != null) {
  //     setTreeSelectRule([...props.treeSelectRule])
  //   }
  // }, [props.treeSelectRule])
  // // 搜索
  // const [value, setValue] = useState(undefined);
  // const onChange = (newValue) => {
  //   console.log(newValue)
  //   setValue(newValue.split('(')[0]);
  // };
  useEffect(() => {
    console.log('规则配置卡片 =>', props.itemData);
    if (props.itemData != null) {
      setEditing(props.itemData.edit);
      setData(props.itemData);
    }
  }, [props.itemData]);
  useEffect(() => {
    if (props.index != null) {
      setIndex(props.index);
    }
  }, [props.index]);
  useEffect(() => {
    if (props.index != null) {
      setId(props.id);
    }
  }, [props.id]);
  useEffect(() => {
    if (data != null) {
      drag(drop(ref));
    }
  }, [data]);

  useEffect(() => {
    if (data != null && formRef != null && formRef.current != null) {
      formRef.current.setFieldsValue(data);

      // if (data.params === '') {
      //   setEditing(true);
      // }
    }
  }, [data, formRef]);

  //   开启编辑状态
  const startEdit = () => {
    setEditing(true);
  };

  const save = () => {
    formRef.current.validateFields().then(() => {
      //   debugger;
      let newarr = { ...data };
      newarr.edit = false;
      props.changeItem && props.changeItem({ ...newarr, ...formRef.current.getFieldsValue() });
      setEditing(false);
    });
  };

  const deleteItem = () => {
    props.deleteItem && props.deleteItem(data);
  };
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: type,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action,拿到form表单的值
      let changeData = {};
      formRef.current.validateFields().then(() => {
        //   debugger;
        changeData = { ...data, ...formRef.current.getFieldsValue() };
        props.moveCard(dragIndex, hoverIndex, changeData);
      });

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: type,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0.2 : 1;
  const backgroundColor = isDragging ? 'lightblue' : '#F7F8FA';
  return (
    <>
      {data != null && (
        <div
          style={{
            border: '1px solid rgba(0,0,0,0.1)',
            marginLeft: '16px',
            marginRight: '16px',
            marginBottom: '16px',
          }}
        >
          {/* 头部 */}
          <div
            style={{
              height: '48px',
              lineHeight: '48px',
              display: 'flex',
              borderBottom: '1px solid #f1f2f4',
              backgroundColor,
              opacity,
            }}
            ref={ref}
          >
            <div
              style={{
                marginLeft: '16px',
                fontSize: '14px',
                fontWeight: 'bold',
                flex: '1',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <span>{data.ruleDefId}</span>
            </div>
            <div
              style={{
                flex: '0 0 200px',
                display: 'flex',
                flexDirection: 'row-reverse',
                fontSize: '16px',
                color: '#C9CDD4',
                paddingRight: '16px',
              }}
            >
              {/* 删除icon */}
              <div
                style={{
                  marginLeft: '16px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  deleteItem();
                }}
              >
                <CloseOutlined />
              </div>

              {/* 根据编辑状态切换的 编辑 和 保存 按钮*/}
              <div
                style={{
                  cursor: 'pointer',
                }}
              >
                {editing === false ? (
                  <>
                    {/* 编辑 */}
                    <FormOutlined
                      onClick={() => {
                        startEdit();
                      }}
                    />
                  </>
                ) : (
                  <>
                    {/* 保存 */}
                    <SaveOutlined
                      onClick={() => {
                        save();
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 表单内容 */}
          <Form ref={formRef}>
            <div>
              <div
                style={{
                  display: 'flex',
                  margin: '24px 12px 12px 12px',
                }}
              >
                <div
                  style={{
                    flex: '1',
                  }}
                >
                  <Form.Item
                    name={`ruleDefId`}
                    label="执行能力"
                    rules={[{ required: true, message: '请输入执行能力' }]}
                  >
                    {/* <TreeSelect value={value} showSearch treeData={treeSelectRule} onChange={onChange} allowClear
                      treeNodeFilterProp="title"
                       treeLine
                      disabled={editing === false ? true : false}
                      style={{ width: '100%' }}
                      dropdownStyle={{ minWidth: 300 }}
                    ></TreeSelect> */}
                    {/* <Input disabled={editing === false ? true : false}></Input> */}

                    <TreeSelect
                      disabled={editing === false ? true : false}
                      treeData={treeSelectOptions}
                      showSearch={true}
                      treeNodeLabelProp='value'
                    ></TreeSelect>
                  </Form.Item>
                </div>
                <div
                  style={{
                    width: '12px',
                  }}
                ></div>
                <div
                  style={{
                    flex: '1',
                  }}
                >
                  <Form.Item name={`resultName`} label="返回结果">
                    <Input disabled={editing === false ? true : false}></Input>
                  </Form.Item>
                </div>
              </div>
              <div
                style={{
                  padding: '0px 12px 0px 12px',
                  marginTop: '-12px',
                  //   marginBottom: '-12px',
                }}
              >
                <Form.Item
                  name={`params`}
                  rules={[{ required: true, message: '请输入入参映射' }]}
                  label="入参映射"
                >
                  <Input.TextArea disabled={editing === false ? true : false}></Input.TextArea>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};

export default ParamsDetailCard;
