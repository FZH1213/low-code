// 一个规则配置的卡片
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Button, Input, message, Radio, Modal, Form, Collapse, Popconfirm } from 'antd';
import { useDrag, useDrop } from 'react-dnd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
const ItemTypes = {
  CARD: 'card',
}
const RuleDetailCard = (props) => {
  const formRef = useRef(null);
  // 拖拽功能
  const ref = useRef(null)
  const { id, index, moveCard } = props;
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },

    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      let dropData = Object.assign({ ...props.data }, { ...formRef.current.getFieldsValue() })

      moveCard(item.dragData, dragIndex, dropData, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      let datas = formRef.current.getFieldsValue();
      let dragData = Object.assign({ ...props.data }, { ...datas })
      return { id, index, dragData }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  // 拖拽功能 ----end
  //   初始化一次数据
  useEffect(() => {
    // debugger;
    if (props.data != null && formRef != null && formRef.current != null) {
      console.log(props.data)
      formRef.current.setFieldsValue({
        ...props.data,
      });
    }
  }, [props.data, formRef]);
  useEffect(() => {
    if (props.data != null) {

      drag(drop(ref))
    }

  }, [props.data])
  // 删除小规则方法
  const handleDeleteItem = (key) => {
    console.log('删除 key =>', key);
    props.deleteItem && props.deleteItem(key);
  };

  return (
    <div
    ref={ref}
      style={{
        padding: '6px 12px',
      }}

      data-handler-id={handlerId}
    >

      <Collapse
        activeKey={props.data.expend === 1 ? props.forKey : -1}
        onChange={(e) => {
          props.changeExpendStatus && props.changeExpendStatus(props.forKey);
        }}
      >
        <Collapse.Panel
          key={props.forKey}
          forceRender={true}
          collapsible={'header'}
          header={
            <div
             
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <span>{props.data.name}</span>
            </div>
          }
          extra={
            <div
              style={{
                width: '200px',
                textAlign: 'right',
              }}
            >
              <span
                style={{
                  color: 'rgb(24, 144, 255)',
                  marginRight: '20px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (props.data.editing === 1) {
                    // 保存
                    if (formRef == null || (formRef != null && formRef.current == null)) {
                      return;
                    } else {
                      formRef.current
                        .validateFields()
                        .then((value) => {
                          let formData = null;
                          formData = formRef.current.getFieldsValue();
                          props.saveData && props.saveData(props.forKey, formData);
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    }
                  } else {
                    // 编辑
                    props.startEdit && props.startEdit(props.forKey);
                  }
                }}
              >
                {props.data.editing === 1 ? (
                  <>
                    <SaveOutlined style={{ marginRight: '2px' }} />
                  </>
                ) : (
                  <>
                    <EditOutlined style={{ marginRight: '2px' }} />
                  </>
                )}

                {props.data.editing === 1 ? '保存' : '编辑'}
              </span>
              {props.data.editing === 1 ? (
                <>
                  <span
                    style={{
                      color: 'rgb(24, 144, 255)',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      // 如果有 源数据，那么点击取消的时候，初始化恢复一次
                      if (props.data != null && formRef != null && formRef.current != null) {
                        formRef.current.setFieldsValue({
                          ...props.cancelData,
                        });
                      }

                      if (formRef == null || (formRef != null && formRef.current == null)) {
                        props.closeEditStatus && props.closeEditStatus(props.forKey);
                        // debugger;
                        return;
                      } else {
                        let formData = formRef.current.getFieldsValue();

                        let clearFlag = true;

                        for (let i in formData) {
                          if (formData[i] == null || (formData[i] != null && formData[i]) != '') {
                            clearFlag = false;
                          }
                        }

                        // debugger;

                        if (clearFlag) {
                          props.deleteItemSelf && props.deleteItemSelf(props.forKey);
                        } else {
                          props.closeEditStatus && props.closeEditStatus(props.forKey);
                        }
                      }
                      //   debugger;
                    }}
                  >
                    <CloseCircleOutlined style={{ marginRight: '2px' }} />
                    取消
                  </span>
                </>
              ) : (
                <>
                  {/* <span
                    style={{
                      color: '#ff4d4f',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      props.deleteItem && props.deleteItem(props.forKey);
                    }}
                  >
                    <DeleteOutlined style={{ marginRight: '2px' }} />
                    删除
                  </span> */}

                  <Popconfirm
                    title={`确定要删除该规则吗?`}
                    okText="确认"
                    cancelText="关闭"
                    onConfirm={() => handleDeleteItem(props.forKey)}
                  >
                    <span
                      style={{
                        color: '#ff4d4f',
                        cursor: 'pointer',
                      }}
                    // onClick={() => {
                    //   props.deleteItem && props.deleteItem(props.forKey);
                    // }}
                    >
                      <DeleteOutlined style={{ marginRight: '2px' }} />
                      删除
                    </span>
                  </Popconfirm>
                </>
              )}
            </div>
          }
        >
          <div>
            <Form ref={formRef}>
              <Form.Item
                initialValues={props.data.name}
                name="name"
                label={'能力名称'}
                style={{
                  marginBottom: '12px',
                }}
                rules={[{ required: true, message: '请输入能力名称' }]}
              >
                <Input disabled={props.data.editing === 1 ? false : true}></Input>
              </Form.Item>
              <Form.Item
                initialValues={props.data.description}
                label={
                  <span
                  // style={{ marginLeft: '11px' }}
                  >
                    <span
                      style={{
                        visibility: 'hidden',
                        width: '11px',
                        display: 'inline-block',
                      }}
                    >
                      *
                    </span>
                    能力描述
                  </span>
                }
                style={{
                  marginBottom: '12px',
                }}
                name="description"
              >
                <Input.TextArea disabled={props.data.editing === 1 ? false : true}></Input.TextArea>
              </Form.Item>
              <Form.Item
                initialValues={props.data.dealEvent}
                label={'处理方法'}
                style={{
                  marginBottom: '12px',
                }}
                name="dealEvent"
                rules={[{ required: true, message: '请输入处理方法' }]}
              >
                <Input.TextArea disabled={props.data.editing === 1 ? false : true}></Input.TextArea>
              </Form.Item>
              <Form.Item
                initialValues={props.data.resultName}

                label={
                  <span
                  // style={{ marginLeft: '11px' }}
                  >
                    <span
                      style={{
                        visibility: 'hidden',
                        width: '11px',
                        display: 'inline-block',
                      }}
                    >
                      *
                    </span>
                    返回结果
                  </span>
                }
                style={{
                  marginBottom: '12px',
                }}
                name="resultName"
              >
                <Input disabled={props.data.editing === 1 ? false : true}></Input>
              </Form.Item>
            </Form>
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default RuleDetailCard;
