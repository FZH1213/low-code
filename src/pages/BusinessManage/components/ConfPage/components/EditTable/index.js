import { Button, Form, Input, Popconfirm, Table, Select } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import './styles.less';
// import '@/theme/default/common.less';
// import { SYMBOL_SELECT_OPTION } from '@/utils/constant';

const SYMBOL_SELECT_OPTION = [
  { label: '=', value: '=' },
  { label: '>', value: '>' },
  { label: '<', value: '<' },
  { label: '<>', value: '<>' },
  { label: '>=', value: '>=' },
  { label: '<=', value: '<=' },
  { label: 'in', value: 'in' },
  { label: "like '", value: "like '" },
  { label: "like '%", value: "like '%" },
];

const EditableContext = React.createContext(null);
const { Option } = Select;
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
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
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
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
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: false,
            message: `${title} is required.`,
          },
        ]}
      >
        {dataIndex === 'symbol' ? (
          <Select
            allowClear
            ref={inputRef}
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onChange={save}
            onBlur={save}
          >
            {SYMBOL_SELECT_OPTION.map((item) => (
              <Option value={item.value} key={item.value} label={item.label}>
                {item.label}
              </Option>
            ))}
          </Select>
        ) : (
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const EditTable = (props) => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    let newData = [];
    props.tableDataSource &&
      props.tableDataSource.length > 0 &&
      props.tableDataSource.map((item, index) => {
        item = {
          key: index,
          ...item,
        };
        newData.push(item);
      });
    setDataSource(newData);
  }, [props.tableDataSource]);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    props.getTableData(props.title, newData);
    setDataSource(newData);
  };

  const defaultColumns = [
    ...props.columns,
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: '10%',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="确认删除改数据吗?" onConfirm={() => handleDelete(record.key)}>
            <a>删除</a>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData = {
      key: Date.now(),
    };
    props.getTableData(props.title, [...dataSource, newData]);
    setDataSource([...dataSource, newData]);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    props.getTableData(props.title, newData);
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
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
        handleSave,
      }),
    };
  });
  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        添加{props.title}
      </Button>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={{
          size: 'small',
          pageSize: 5,
        }}
      />
    </div>
  );
};

export default EditTable;
