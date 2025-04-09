import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, Select } from 'antd';
const EditableContext = React.createContext(null);
import styles from './styles.less'

import api from './userMessageService.js'

// 导入图标
import { DeleteFilled, DeleteOutlined } from '@ant-design/icons'

// 事件编辑框的字符串转换对象
const eventStr = {
    'Y': '通过',
    'N': '退回',
    'create': '生成',
    'forward': '转交',
}


// 规则转化字符串对象
const ruleStr = {
    '1': '流程规则名称1',
    '2': '流程规则名称2',
    '3': '流程规则名称3',
    '4': '流程规则名称4',
}

// 消息模版字符串转化对象
const msgmodalStr = {
    '1': '消息模版名称1',
    '2': '消息模版名称2',
    '3': '消息模版名称3',
    '4': '消息模版名称4',
}

// 收信人选择框字符串转换对象
const addresseeStr = {
    '1': '选人规则名称1',
    '2': '选人规则名称2',
    '3': '选人规则名称3',
    '4': '选人规则名称4',
}


const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form preserve={false} form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  formTypeName,
  ruleSelectOptionData,
  modalSelectOptionData,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const formItemRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      formItemRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      // console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

// 根据表单项类型名，switch结构，获取渲染的编辑元素
// formTypeName eventSelect
// formTypeName ruleSelect
// formTypeName msgmodalSelect
// formTypeName addresseeSelect
  const getEditFormElement = (typeName) => {
      // console.log('typeName', typeName)
        switch (typeName) {
            case 'eventSelect':
                return (
                    <Form.Item
                        style={{
                            margin: 0,
                            width: '76px',
                        }}
                        name={dataIndex}
                        rules={[
                            {
                            required: true,
                            message: `请选择${title}`,
                            },
                        ]}
                        >
                        {/* <Input ref={formItemRef} onPressEnter={save} onBlur={save} /> */}
                        <Select
                            ref={formItemRef}
                            onBlur={save}
                        >
                            <Select.Option value={'Y'} label="通过">通过</Select.Option>
                            <Select.Option value={'N'} label="退回">退回</Select.Option>
                            <Select.Option value={'create'} label="生成">生成</Select.Option>
                            <Select.Option value={'forward'} label="转交">转交</Select.Option>
                        </Select>
                    </Form.Item>
                )
            case 'ruleSelect':
                return (
                        <Form.Item
                            style={{
                                margin: 0,
                                width: '100%'
                            }}
                            name={dataIndex}
                            // rules={[
                            // {
                            //     required: true,
                            //     message: `请填写${title}`,
                            // },
                            // ]}
                        >
                            <Input
                              ref={formItemRef}
                              onBlur={save}
                              onPressEnter={save}
                            ></Input>
                        </Form.Item>
                )
            case 'msgmodalSelect':
            return (
                    <Form.Item
                        style={{
                        margin: 0,
                        width: '224px'
                        }}
                        name={dataIndex}
                        rules={[
                        {
                            required: true,
                            message: `请选择${title}`,
                        },
                        ]}
                    >
                        {!!modalSelectOptionData.length && <Select
                            ref={formItemRef}
                            onBlur={save}
                        >
                            {
                                modalSelectOptionData.map((item) => {
                                    return (
                                        <Select.Option value={item.bzId} show={item.tplName}>{item.tplName}</Select.Option>
                                    )
                                })
                            }
                        </Select>}
                    </Form.Item>
                )
            case 'addresseeSelect':
                return (
                      <Form.Item
                          style={{
                              margin: 0,
                              width: '224px'
                          }}
                          name={dataIndex}
                          rules={[
                          {
                              required: true,
                              message: `请选择${title}`,
                          },
                          ]}
                      >
                          {ruleSelectOptionData.length && <Select
                          ref={formItemRef}
                          onBlur={save}
                      >
                          {
                              ruleSelectOptionData.map((item) => {
                                  return (
                                      <Select.Option show={item.name} value={item.ruleDefId}>{item.name}</Select.Option>
                                  )
                              })
                          }
                      </Select>}
                      </Form.Item>
                )
            default:
                return ''
      }
  }

  const getChildren = (children) => {
      console.log(record[dataIndex])
        // 第三列不可编辑状态时的显示
        if (formTypeName == 'msgmodalSelect') {
            let res = modalSelectOptionData.filter((item) => {
                return item.bzId === record[dataIndex]
            })
            console.log('res', res)

            if (!!res.length) {
                return <div style={{width: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{res[0].tplName}</div>
            } else {
                return ''
            }
        }

        // 第四列不可编辑状态时的显示
        if (formTypeName == 'addresseeSelect') {
          let res = ruleSelectOptionData.filter((item) => {
              return item.ruleDefId === record[dataIndex]
          })
          console.log('res', res)

          if (!!res.length) {
              return <div style={{width: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{res[0].name}</div>
          } else {
              return ''
          }
      }

        // 第二列不可编辑状态时的显示
        if (formTypeName == 'ruleSelect') {
          console.log('ruleSelect', children)

          return <div>{record[dataIndex]}</div>
        }

        return children

        

  }

  if (editable) {
    // console.log('formTypeName', formTypeName)

    childNode = editing ? (
        getEditFormElement(formTypeName)

    //   <Form.Item
    //     style={{
    //       margin: 0,
    //     }}
    //     name={dataIndex}
    //     rules={[
    //       {
    //         required: true,
    //         message: `${title} is required.`,
    //       },
    //     ]}
    //   >
    //     <Input ref={formItemRef} onPressEnter={save} onBlur={save} />
    //   </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          paddingTop: '9px',
          paddingBottom: '9px',
        }}
        onClick={toggleEdit}
      >
        {/* {children} */}
        {
            getChildren(children)
        }
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '事件',
        dataIndex: 'event',
        width: '96px',
        editable: true,
        formTypeName: 'eventSelect',
        render: (val) => {
            return (
                <div>{eventStr[val]}</div>
            )
        }
      },
      {
        title: '选择规则',
        dataIndex: 'sendToRule',
        width: '233px',
        editable: true,
        formTypeName: 'ruleSelect',
        render: (val) => {
            return (
                <div>{ruleStr[val]}</div>
            )
        }
        
      },
      {
        title: '选择消息模版',
        dataIndex: 'msgTempId',
        width: '233px',
        editable: true,
        formTypeName: 'msgmodalSelect',
        render: (val) => {
            return (
                <div>{msgmodalStr[val]}</div>
            )
        }
      },
      {
        title: '选择接收人',
        dataIndex: 'userRule',
        width: '233px',
        editable: true,
        formTypeName: 'addresseeSelect',
        render: (val) => {
            return (
                <div>{addresseeStr[val]}</div>
            )
        }
      },
      {
        title: '操作',
        width: 50,
        align: 'center',
        dataIndex: 'operation',
        render: (_, record) =>
          this.state.dataSource.length >= 1 ? (
            <Popconfirm title="是否确认删除?" onConfirm={() => this.handleDelete(record.key)}>
              <DeleteOutlined></DeleteOutlined>
            </Popconfirm>
          ) : null,
      },
    ];
    this.state = {
      dataSource: [
        // {
        //   key: 0,
        //   event: 'Y',
        //   rule: '1',
        //   msgmodal: '2',
        //   addressee: '3',
        // },
        // {
        //   key: 1,
        //   event: 'N',
        //   rule: '2',
        //   msgmodal: '1',
        //   addressee: '2',
        // },
      ],
      count: 2,
      ruleSelectOptionData: [], // 规则 下拉框的选项数据
      modalSelectOptionData: [], // 模版 下拉框的选项数据
    };
  }

  componentDidMount() {
      // 获取 规则 下拉框选项
      const getRuleSelectOption = async () => {
          console.log('执行了')
          let { success } = await api.fetchRuleSelectOption()
          success && success((data) => {
              console.log(data)
              this.setState({
                ruleSelectOptionData: data
              }, () => {
                getModalSelectOption()
              })
          })
      }

      getRuleSelectOption()


      // 获取 消息模版 下拉框选项
      const getModalSelectOption = async () => {
          let { success } = await api.fetchModalSelectOption()
          success && success((data) => {
              console.log('消息模版数据', data)
              this.setState({
                  modalSelectOptionData: data
              }, () => {
                // 在获取下拉选项之后，再设置初始值
                let newData = [...this.props.defaultVal]

                // 遍历初始值，重新设置 key 值
                newData = newData.map((item, index) => {
                  return {...item, key: index}
                })

                console.log('newData', newData)

                this.setState({
                  dataSource: newData,
                  count: this.props.defaultVal.length
                })

              })
          })
      }

      // getModalSelectOption()

      console.log('查看获取的初始值', this.props)
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({
      dataSource: dataSource.filter((item) => item.key !== key),
    });
  };
  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      event: 'Y',
      sendToRule: '',
      msgTempId: '',
      userRule: '',
      
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };
  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  // 可以访问实例获取的子组件方法，派发数据
  emitData = () => {
      let that = this
      let newData = [...this.state.dataSource]
      // console.log('子组件方法调用')
      return newData
  }

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          formTypeName: col.formTypeName, // 每一列的独特表单象征名，使每列渲染的表单元素区分开来
          ruleSelectOptionData: this.state.ruleSelectOptionData, // 传给子组件的 规则 下拉选择框数据
          modalSelectOptionData: this.state.modalSelectOptionData, // 传给子组件的 模版 下拉选择框数据
        }),
      };
    });
    return (
      <div className={styles.modal_body_wrapper}>
        <Table
          size={"small"}
          pagination={false}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
        <div style={{marginTop: '10px', textAlign: 'right'}}>
            <Button
            onClick={this.handleAdd}
            type="primary"
            style={{
                // marginBottom: 16,
            }}
            >
            添加
            </Button>
        </div>
        
      </div>
    );
  }
}