import { Form, Input, Button, Table, Popconfirm, Select, message } from '@/components/base';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import style from './index.less';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';

/**
 * 输入框
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.placeholder 占位符
 * @param {*} props.type AddData输入类型
 * @param {*} props.maxLength 最大长度
 * @param {*} props.value 默认值
 * @return {*}
 */
interface PcAddDataProps {
  label: string;
  name: string;
  required: boolean;
  hidden: boolean;
  placeholder: string;
  type: string;
  maxLength: number;
  value: string;
  disabled: boolean;
  columns: any;
  optionRequstParams: any;
  _var: any;
}
export const PcAddData: React.FC<PcAddDataProps> = (props) => {

  const [addFormData, setAddFormData] = useState({});
  const [tableRow, setTableRow] = useState<any>([]);
  const form = Form.useFormInstance();
  const [columnsArr, setColumnsArr] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);

  useEffect(() => {
    if (props?.columns && props?.columns.length > 0) {
      let arr = [];
      let obj = {}
      props?.columns.map((item, index1) => {
        if (item.type === 'Select') {
          let connectObj = item.connect ? JSON.parse(item.connect) : {};
          let list = [];
          item.selectList = [];
          renderHandle(item.requestUrl, connectObj).then((res) => {
            item.selectList = res;
          });
          obj = {
            title: item.title,
            dataIndex: item.dataIndex,
            width: item.width,
            connect: item.connect,
            type: item.type,
            render: (text, record, index) => {
              return (
                <Select
                  value={text}
                  style={{
                    width: '100%',
                  }}
                  onFocus={() => onFocus(item.requestUrl, connectObj, (res) => {
                    list = res;
                    let newColumns3 = JSON.parse(sessionStorage.getItem('newColumns'));
                    newColumns3.map((it, key) => {
                      if (key === index1) {
                        item.selectList = res;
                      }
                    })
                    // setColumns(newColumns3);
                  })}
                  onChange={(event) => handleSelectChange(event, record, index, item.dataIndex)}
                >
                  {item.selectList &&
                    item.selectList.map((item) => (
                      <Select.Option value={item.value}>{item.label}</Select.Option>
                    ))}
                </Select>
              );
            },
          }
        } else if (item.type === 'Input') {
          obj = {
            title: item.title,
            dataIndex: item.dataIndex,
            width: item.width,
            render: (text, record, index) => {
              return (
                <Input
                  placeholder={`请输入${item.title}`}
                  onChange={(event) => handleChange(event, record, index, item.dataIndex, true, item.title)}
                  value={text}
                  maxLength={50}
                ></Input>
              );
            },
          }
        }
        arr.push(obj);
      })
      let newColumns = [
        ...arr,
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
      ]
      sessionStorage.setItem('newColumns', JSON.stringify(newColumns));
      setColumns(newColumns);
    }
  }, [props.columns])

  //  输入框更改
  const handleChange = (event, record, index, dataIndex, isRequired, title) => {
    // const newData = [...tableRow];
    let newData = JSON.parse(sessionStorage.getItem('tableRow'));
    newData[index][dataIndex] = event.target.value;
    setTableRow(newData);
    if (isRequired) {
      if (event.target.value == null || !!!event.target.value.length) {
        message.error(`请输入${title}`);
        return;
      }
    }
  };

  const onFocus = (requestUrl, connectObj, callback) => {
    let query = {};
    for (const key in connectObj) {
      if (Object.prototype.hasOwnProperty.call(connectObj, key)) {
        const value = connectObj[key];
        if (form.getFieldValue(key)) {
          query[value] = form.getFieldValue(key);
        }
      }
    }
    renderHandle(requestUrl, query).then((res) => {
      callback(res);
    });
  }

  // 下拉框更改
  const handleSelectChange = (event, record, index, dataIndex) => {
    // const newData: any = [...tableRow];
    // console.log('newData', newData);
    let newData = JSON.parse(sessionStorage.getItem('tableRow'));
    console.log('sessionStorage', newData);
    console.log('event', event);
    console.log('index', index);
    newData[index][dataIndex] = event;
    setTableRow(newData);
  };

  const handleDelete = (key) => {
    let tableRow = JSON.parse(sessionStorage.getItem('tableRow'));
    const newData = tableRow.filter((item, index) => index !== key);
    setTableRow(newData);
  };

  const handleAddRow = () => {
    // let columnsLength = columns.length;
    // let addFormDataArr = [];
    // for (let index = 0; index < columnsLength - 1; index++) {
    //   addFormDataArr[columns[index].dataIndex] = '';
    // }

    let addFormData = {};
    tableRow.push(addFormData);
    setTableRow([...tableRow]);
  };

  useEffect(() => {
    sessionStorage.setItem('tableRow', JSON.stringify(tableRow));
    form.setFieldsValue({ [props.name]: tableRow });
  }, [tableRow])

  const renderHandle = async (requestUrl, query) => {
    if (!requestUrl) {
      return
    }
    const request = createRequest(requestUrl, 'post');
    const data = await judgeSucessAndGetData(await request({ ...props?._var, ...query }));
    if (!data) return
    return data;
  }

  return (
    <>
      <Form.Item name={props.name} required={props.required} hidden={props.hidden} initialValue={props.value}>
      </Form.Item>
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
        新增
      </Button>
      <Table dataSource={tableRow} columns={columns} pagination={false} />
    </>
  );
};
