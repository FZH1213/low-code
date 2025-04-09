// 添加表弹框
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Form,
  Tree,
  Input,
  Space,
  Typography,
  Modal,
  Spin,
  Select,
  Row,
  Col,
  Table,
  Tag,
  Drawer,
  Popconfirm,
  Pagination,
  message,
} from 'antd';

import { addTable } from './service';

const AddTableModal = (props) => {
  const formRef = useRef(null);

  const getLabel = (str, require) => {
    return (
      <div
        style={{
          fontSize: '14px',
          //   paddingRight: '12px',
          width: '64px',
        }}
      >
        {require != null && require === true && (
          <span
            style={{
              fontSize: '16px',
              color: 'red',
              fontWeight: 'bold',
              paddingLeft: '2px',
              paddingRight: '2px',
            }}
          >
            *
          </span>
        )}
        <span
          style={{
            paddingRight: '3px',
          }}
        >
          {str}
        </span>
      </div>
    );
  };

  const [addFormData, setAddFormData] = useState({});

  const handleSubmit = () => {
    formRef.current.validateFields().then((value) => {
      let flag = true;
      const validate = (name, str) => {
        if (name == null || !!!name.length) {
          message.error(`请输入${str}`);
          flag = false;
        }
        return flag;
      };
      tableRow.map((item, index) => {
        if (flag === true) {
          validate(item.columnName, '字段名称');
          validate(item.columnType, '字段类型');
        }
      });
      console.log('tableRow', tableRow);
      if (flag === false) {
        return;
      }
      addTable({
        ...value,
        dataSourceId: props.id,
        listData: tableRow,
      }).then((res) => {
        if (res.code === 0) {
          // 刷新列表
          props.refreshTable && props.refreshTable();
          // 关闭弹框
          props.onClose && props.onClose();
        }else{
          message.error(res.message);
        }
      });
    });
  };

  const [tableRow, setTableRow] = useState([]);

  // useEffect(() => {
  //   console.log('tableRow =>', tableRow);
  // }, [tableRow]);

  const columns = [
    {
      title: '字段名称',
      width: 200,
      dataIndex: 'columnName',
      render: (text, record, index) => {
        return (
          <Input
            placeholder={'请输入字段名称'}
            onChange={(event) => handleChange(event, record, index, 'columnName', true, '字段名称')}
            value={text}
            maxLength={50}
          ></Input>
        );
      },
    },
    {
      title: '字段描述',
      dataIndex: 'description',
      render: (text, record, index) => {
        return (
          <Input
            placeholder={'请输入字段描述'}
            onChange={(event) => handleChange(event, record, index, 'description')}
            value={text}
            maxLength={250}
          ></Input>
        );
      },
    },
    {
      title: '字段类型',
      dataIndex: 'columnType',
      width: 128,
      render: (text, record, index) => {
        return (
          <Select
            value={text}
            style={{
              width: '100%',
            }}
            onChange={(event) => handleSelectChange(event, record, index, 'columnType')}
          >
            {['bigint', 'varchar', 'date', 'int', 'datetime', 'tinyint', 'decimal'].map((i) => (
              <Select.Option key={i} value={i}>
                {i}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '字段长度',
      dataIndex: 'columnLength',
      width: 96,
      render: (text, record, index) => {
        return (
          <Input
            placeholder={'请输入字段长度'}
            onChange={(event) => handleChange(event, record, index, 'columnLength')}
            value={text}
            maxLength={250}
          ></Input>
        );
      },
    },
    {
      title: '允许空值（Null）',
      dataIndex: 'isNull',
      width: 96,
      render: (text, record, index) => {
        return (
          <Select
            value={text}
            style={{
              width: '100%',
            }}
            onChange={(event) => handleSelectChange(event, record, index, 'isNull')}
          >
            {[
              { lebel: '是', value: '1' },
              { lebel: '否', value: '0' },
            ].map((i, k) => (
              <Select.Option key={k} value={i.value}>
                {i.lebel}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '设置主键',
      dataIndex: 'isPrimary',
      width: 96,
      render: (text, record, index) => {
        return (
          <Select
            value={text}
            style={{
              width: '100%',
            }}
            onChange={(event) => handleSelectChange(event, record, index, 'isPrimary')}
          >
            {[
              { lebel: '是', value: '1' },
              { lebel: '否', value: '0' },
            ].map((i, k) => (
              <Select.Option key={k} value={i.value}>
                {i.lebel}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 88,
      render: (text, record, index) =>
      tableRow.length >= 1 ? (
          <Popconfirm title="确定要删除吗?" onConfirm={() => handleDelete(index)}>
            <a>删除</a>
          </Popconfirm>
        ) : null,
    },
  ];

  //  输入框更改
  const handleChange = (event, record, index, dataIndex, isRequired, title) => {
    console.log('dataIndex', dataIndex);
    const newData = [...tableRow];
    newData[index][dataIndex] = event.target.value;
    setTableRow(newData);
    if (isRequired) {
      if (event.target.value == null || !!!event.target.value.length) {
        message.error(`请输入${title}`);
        return;
      }
    }
  };

  // 下拉框更改
  const handleSelectChange = (event, record, index, dataIndex) => {
    console.log('dataIndex', dataIndex);
    const newData = [...tableRow];
    console.log('event', event);
    newData[index][dataIndex] = event;
    setTableRow(newData);
  };

  const handleDelete = (key) => {
    const newData = tableRow.filter((item,index) => index !== key);
    setTableRow(newData);
  };

  const handleAddRow = () => {
    let columnsLength = columns.length;
    let addFormDataArr = [];
    for (let index = 0; index < columnsLength - 1; index++) {
      addFormDataArr[columns[index].dataIndex] = '';
    }
    let addFormData = {};
    tableRow.push(addFormData);
    [...addFormDataArr];
    setTableRow([...tableRow]);
  };

  return (
    <Modal
      title="添加库表"
      width={960}
      open={props.visible}
      onCancel={props.onClose}
      onOk={() => {
        handleSubmit();
      }}
    >
      <Form ref={formRef}>
        <Form.Item
          name="tableName"
          label={getLabel('库表名称', true)}
          rules={[{ required: true, message: '请输入库表名称' }]}
          colon={false}
        >
          <Input></Input>
        </Form.Item>
        {/* <Form.Item
          name="createTable"
          label={getLabel('建表语句', true)}
          rules={[{ required: true, message: '请输入建表语句' }]}
          colon={false}
        >
          <Input.TextArea
            style={{
              minHeight: '100px',
            }}
          ></Input.TextArea>
        </Form.Item> */}
      </Form>

      <Button
        type="primary"
        style={{
          marginBottom: '12px',
        }}
        onClick={() => {
          setAddFormData({});
          handleAddRow();
        }}
      >
        新增字段
      </Button>
      <Table dataSource={tableRow} columns={columns} pagination={false} />
    </Modal>
  );
};

export default AddTableModal;
