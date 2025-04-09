import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Form,
  Typography,
  message,
} from 'antd';
import api from './../../service';

const CustEditTable = (props) => {
  const { initDefault, totalTable, curentEditId, modalVisible } = props;
  const originData = [];

  /* for (let i = 0; i < 20; i++) {
    originData.push({
      key: i.toString(),
      name: `Edrward ${i}`,
      age: 32,
      address: `London Park no. ${i}`,
    });
  } */
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [modalTotalData, setModalTotalData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [modalVisibleSon, setModalVisibleSon] = useState<any>(modalVisible);

  const isEditing = (record) => record.attrCode === editingKey;

  useEffect(() => {
    console.log('CustEditTable  initDefault', initDefault);
    initDefault == undefined || initDefault.length == 0 ? getCompAttr() : setData(initDefault);

    return () => {};
  }, [curentEditId]);

  const getCompAttr = async () => {
    let paramType = totalTable.filter((item) => item.columId == curentEditId)[0].filterType;
    if (paramType == '') {
      message.error('请先选择 控件类型 一栏！');
    } else {
      let res = await api.getCompAttr({ intfComp: paramType });
      if (res.code == 0 && res.data.length > 0) {
        let arr = [];
        res.data.map((item) => {
          let obj = {
            attrCode: item.attrCode,
            attrDefault: item.attrDefault,
            attrDesc: item.attrDesc,
            attrName: item.attrName,
            attrTyp: item.attrTyp,
            attrVer: item.attrVer,
            compId: item.compId,
            entId: item.entId,
            entName: item.entName,
            entTime: item.entTime,
            id: item.id,
            isDel: item.isDel,
            seqid: item.seqid,
          };
          arr.push(obj);
        });
        setData(arr);
      }
    }
  };

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: false,
                message: `${title} 必填！否则请整行删除。`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
  const edit = (record) => {
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.attrCode);
  };
  const handleAdd = () => {
    const newData = {
      attrCode: '',
      attrDefault: '',
      attrDesc: '',
      attrName: '',
      attrTyp: '',
      attrVer: '',
      compId: '',
      entId: '',
      entName: '',
      entTime: '',
      id: '',
      isDel: '',
      seqid: 0,
    };
    setData([...data, newData]);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const rowDelete = (key) => {
    const nowDataList = data;
    setData(nowDataList.filter((item) => item.attrCode !== key));
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.attrCode);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
        // debugger;
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
        // debugger;
      }
    } catch (errInfo) {
      // console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'API参数',
      dataIndex: 'attrCode',
      editable: true,
    },
    {
      title: '说明',
      dataIndex: 'attrDesc',
      editable: true,
    },
    {
      title: '参数类型',
      dataIndex: 'attrTyp',
      editable: true,
    },
    /* {
      title: '属性值',
      dataIndex: 'attrDefault',
      editable: true,
    }, */
    {
      title: '默认值',
      dataIndex: 'attrDefault',
      editable: true,
    },
    {
      title: '版本',
      dataIndex: 'attrVer',
      editable: true,
    },
    {
      title: '操作',
      width: '10%',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.attrCode)}
              style={{
                marginRight: 8,
              }}
            >
              确定
            </Typography.Link>
            <Popconfirm title="取消将不保存修改内容?" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link
              disabled={editingKey !== ''}
              style={{
                marginRight: 8,
              }}
              onClick={() => edit(record)}
            >
              编辑
            </Typography.Link>

            <Popconfirm
              title="确定删除该属性?"
              onConfirm={() => {
                rowDelete(record.attrCode);
              }}
            >
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  const onModalCancel = () => {
    setModalVisibleSon(false);
    props.getModalVisible(false);
  };
  const onFormComfirm = () => {
    // 判断是否含有空行
    let isBlank = false;
    data.map((item) => {
      if (item.attrCode == undefined || item.attrCode.replace(/\s/g, '') == '') {
        isBlank = true;
      }
    });
    if (!isBlank) {
      setModalVisibleSon(false);
      props.getModalVisible(false);
      let obj = {
        rid: curentEditId,
        compData: data,
      };
      let arr = modalTotalData;
      if (arr.length > 0) {
        arr.filter((item) => item.rid !== curentEditId);
        arr.push(obj);
        setModalTotalData(arr);
        props.getModalTableData(arr, curentEditId);
      } else {
        setModalTotalData([obj]);
        props.getModalTableData([obj]);
      }
      // setModalTotalData([...modalTotalData, data])
    } else {
      message.error('含有 API参数 为空的行，请填写或删除整行！');
    }
  };

  return (
    <Modal
      title={'控件属性'}
      visible={modalVisibleSon}
      width={1300}
      // style={{height:"1200px"}}
      className="webroot"
      onCancel={onModalCancel}
      footer={[
        <Button type="primary" onClick={onFormComfirm}>
          确定
        </Button>,
        <Button key="back" onClick={onModalCancel}>
          关闭
        </Button>,
      ]}
    >
      <Form form={form} component={false}>
        <Button
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          添加API属性
        </Button>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </Modal>
  );
};

// ReactDOM.render(<CustEditTable />, mountNode);
export default CustEditTable;
