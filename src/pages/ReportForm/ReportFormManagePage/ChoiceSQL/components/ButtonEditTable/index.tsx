import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, Select, message } from 'antd';
import type { InputRef } from 'antd';
import type { FormInstance } from 'antd/lib/form';
import { IndexModelState, ConnectRC, Loading, connect, useParams } from 'umi';
import './style.css';
import api from './service';


const { Option } = Select;


const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  position: string;
  type: string;
  code: string;
  link: string;
  isShow: string;
  permissionCode: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  inputType: 'input' | 'select';
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  inputType,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;
  //按钮下拉框数组
  const [actionNames, setActionNames] = useState<any>([])



  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  //获取按钮列表
  useEffect(() => {
    getButtonList()
  }, [])
  //获取按钮列表接口
  const getButtonList = async () => {
    // console.log(123);
    const res0: any = await api.getButtonList({});
    // console.log(res0, '123res0');
    let actionName: any = []
    let obj: any = {}
    if (res0.code === 0) {
      res0.data.map((item: any, index: any) => {
        obj['label'] = item.actionName
        obj['value'] = item.actionName
        obj['key'] = index
        actionName.push({ ...obj })
      })
      setActionNames(actionName)
    } else {
      message.error(res0.message || '操作失败')
      return
    }
  }
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;


  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: false,
            message: `${title} is required.`,
          },
        ]}
      >
        {inputType === 'select' && dataIndex === 'position' ?
          (
            <Select
              ref={inputRef}
              showSearch
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              onChange={save} onBlur={save}>
              <Option value="1" key="1">顶部按钮</Option>
              <Option value="2" key='2'>操作列按钮</Option>
              <Option value="3" key='3'>底部按钮</Option>
            </Select>
          )
          :
          (
            inputType === 'select' && dataIndex === 'type' ?
              <Select
                ref={inputRef}
                allowClear
                showSearch
                filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                onChange={save}
                onBlur={save}>
                <Option value="1" key="1">新增</Option>
                <Option value="2" key="2">链接跳转</Option>
                <Option value="3" key="3">调接口</Option>
                <Option value="4" key="4">上传文件</Option>
                <Option value="5" key="5">修改</Option>
                <Option value="6" key="6">查看</Option>
                <Option value="7" key="7">删除</Option>
                <Option value="8" key="8">提交</Option>
                <Option value="9" key="9">导出</Option>
                <Option value="10" key="10">批量删除</Option>
                <Option value="11" key="11">导入</Option>
                <Option value="12" key="12">下载附件</Option>
                <Option value="13" key="13">展开</Option>
                <Option value="14" key="14">查看列表</Option>
                <Option value="15" key="15">绩效导入</Option>
                <Option value="16" key="16">通过</Option>
                <Option value="17" key="17">不通过</Option>
                <Option value="18" key="18">提交</Option>
                <Option value="19" key="19">转交</Option>
              </Select>
              :
              inputType === 'select' && dataIndex === 'isShow' ?
                (
                  <Select
                    ref={inputRef}
                    showSearch
                    allowClear
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={save} onBlur={save}>
                    <Option value="1" key="1">是</Option>
                    <Option value="2" key='2'>否</Option>
                  </Select>
                ) :
                inputType === 'select' && dataIndex === 'permissionCode' ?
                  (
                    <Select
                      ref={inputRef}
                      showSearch
                      allowClear
                      filterOption={(input, option: any) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      onChange={save} onBlur={save}
                      options={actionNames}
                    >
                    </Select>
                  ) :
                  <Input ref={inputRef} onPressEnter={save} onBlur={save} />
          )
        }
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

// interface DataType {
//   key: React.Key;
//   name: string;
//   type: string;
//   code: string;
//   link: string;
// }

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const ButtonEditTable: React.FC = (props: any) => {
  const buttonName = props.buttonName;
  const [dataSource, setDataSource] = useState<any>([]);
  // const [count, setCount] = useState(2);

  useEffect(() => {
    // props.butTableData && setDataSource([...props.butTableData]);
    let newData = props.butTableData && props.butTableData.length > 0 ? props.butTableData.map((item: any, index: any) => {
      item = {
        key: index,
        ...item
      }
      return item
    }) : [];
    props.butTableData && setDataSource(newData);
  }, [props.butTableData])

  const handleDelete = (key: React.Key) => {
    const {
      reportFormCreate: { sqlData, sqlPageLevel, tableColum },
    }: any = props;
    const newData = dataSource.filter(item => item.key !== key);
    if (buttonName === '添加按钮') {
      sqlData.map((item: any, i: number) => {
        if (sqlPageLevel === item.intLvl) {
          if (sqlPageLevel === 1) {
            sqlData[0].topBut = newData;
          } else {
            if (item.attrId === tableColum) {
              sqlData[i].topBut = newData;
            }
          }
        }
      })
    } else if (buttonName === '接口参数') {
      sqlData.map((item: any, i: number) => {
        if (sqlPageLevel === item.intLvl) {
          if (sqlPageLevel === 1) {
            sqlData[0].opeBut = newData;
          } else {
            if (item.attrId === tableColum) {
              sqlData[i].opeBut = newData;
            }
          }
        }
      })
    }
    props.dispatch({
      type: 'reportFormCreate/setSqlTableData',
      payload: { sqlData: [...sqlData] },
    });
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: '按钮名称',
      dataIndex: 'name',
      width: '20%',
      align: 'left',
      ellipsis: true,
      editable: true,
    },
    {
      title: '按钮位置',
      dataIndex: 'position',
      width: '15%',
      align: 'left',
      ellipsis: true,
      editable: true,

    },
    {
      title: '按钮类型',
      dataIndex: 'type',
      width: '15%',
      align: 'left',
      ellipsis: true,
      editable: true,

    },
    {
      title: '按钮规则',
      dataIndex: 'code',
      width: '15%',
      align: 'left',
      ellipsis: true,
      editable: true,
    },
    {
      title: '按钮链接',
      dataIndex: 'link',
      width: '15%',
      align: 'left',
      ellipsis: true,
      editable: true,
    },
    {
      title: '是否有权限',
      dataIndex: 'isShow',
      width: '15%',
      align: 'left',
      ellipsis: true,
      editable: true,
    },
    {
      title: '权限功能',
      dataIndex: 'permissionCode',
      width: '15%',
      align: 'left',
      ellipsis: true,
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      align: 'center',
      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>删除</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const paramListColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: '参数描述',
      dataIndex: 'paramDesc',
      width: '20%',
      align: 'left',
      ellipsis: true,
      editable: true,
    },
    {
      title: '参数名称',
      dataIndex: 'paramName',
      width: '20%',
      align: 'left',
      ellipsis: true,
      editable: true,
    },
    {
      title: '参数类型',
      dataIndex: 'paramType',
      width: '20%',
      align: 'left',
      ellipsis: true,
      editable: true,
    },
    {
      title: '参数值',
      dataIndex: 'paramValue',
      align: 'left',
      width: '20%',
      ellipsis: true,
      editable: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
      align: 'center',
      render: (_, record: { key: React.Key }) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>删除</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: any = {
      key: Date.now(),
    };

    // setDataSource([newData]);
    setDataSource([...dataSource, newData]);
    // setCount(count + 1);
  };

  const handleSave = (row: any) => {
    const {
      reportFormCreate: { sqlData, sqlPageLevel, tableColum },
    }: any = props;
    const newData = [...dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    if (buttonName === '添加按钮') {
      sqlData.map((item: any, i: number) => {
        if (sqlPageLevel === item.intLvl) {
          if (sqlPageLevel === 1) {
            sqlData[0].topBut = newData;
          } else {
            if (item.attrId === tableColum) {
              sqlData[i].topBut = newData;
            }
          }
        }
      })
    } else if (buttonName === '接口参数') {
      sqlData.map((item: any, i: number) => {
        if (sqlPageLevel === item.intLvl) {
          if (sqlPageLevel === 1) {
            sqlData[0].opeBut = newData;
          } else {
            if (item.attrId === tableColum) {
              sqlData[i].opeBut = newData;
            }
          }
        }
      })
    }
    props.dispatch({
      type: 'reportFormCreate/setSqlTableData',
      payload: { sqlData: [...sqlData] },
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = buttonName.includes('添加按钮') ? defaultColumns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        inputType: col.dataIndex === 'type' || col.dataIndex === 'position' || col.dataIndex === 'isShow' || col.dataIndex === 'permissionCode' ? 'select' : 'input',
        title: col.title,
        handleSave,
      }),
    };
  })
    :
    paramListColumns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          inputType: 'input',
          title: col.title,
          handleSave,
        }),
      };
    });

  return (
    <div>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        {buttonName}
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={{
          size: 'small',
          pageSize: 5,
        }}
      />
    </div>
  );
};

// export default ButtonEditTable;
export default connect(
  ({ reportFormCreate, loading }: { reportFormCreate: IndexModelState; loading: Loading }) => ({
    reportFormCreate,
    loading: loading.models.reportFormCreate,
  }),
)(ButtonEditTable);


