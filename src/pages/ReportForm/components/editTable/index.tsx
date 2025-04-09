import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, message, Select, TreeSelect } from 'antd';
import { FormInstance } from 'antd/lib/form';
import * as I from '../../interfaces';
import { IndexModelState, ConnectRC, Loading, connect } from 'umi';
import styles from './style.less';
import api from '../../ReportFormManagePage/ChoiceSQL/service';
const { Option } = Select;
const EditableContext = React.createContext<FormInstance<any> | null>(null);
interface PageProps {
  reportFormCreate: IndexModelState;
  loading: boolean;
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
  type: string;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: any;
  list: any;
  record: I.Item;
  handleSave: (record: I.Item) => void;
}
const EditableCell: React.FC<EditableCellProps> = ({
  title,
  type,
  editable,
  children,
  dataIndex,
  list,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<Input>(null);
  const form = useContext(EditableContext)!;
  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      let obj = { ...record, ...values }
      // 根据控件属性去获取默认控件componentAPI
      if (obj.filterType) {
        let res = await api.getCompAttr({ intfComp: obj.filterType });
        if (res.code == 0 && res.data.length > 0) {
          obj.componentAPI = res.data
        }
      }
      if (obj.isDisabled == '1') {
        obj.isDisabled = '是'
      } else if (obj.isDisabled == '是') {
        obj.isDisabled = '是'
      } else if (obj.isDisabled == '否') {
        obj.isDisabled = '否'
      } else if (obj.isDisabled == '0') {
        obj.isDisabled = '否'
      }
      if (obj.isFilter == '1') {
        obj.isFilter = '是'
      } else if (obj.isFilter == '是') {
        obj.isFilter = '是'
      } else if (obj.isFilter == '否') {
        obj.isFilter = '否'
      } else if (obj.isFilter == '0') {
        obj.isFilter = '否'
      }
      if (obj.isId == '1') {
        obj.isId = '是'
      } else if (obj.isId == '是') {
        obj.isId = '是'
      } else if (obj.isId == '否') {
        obj.isId = '否'
      } else if (obj.isId == '0') {
        obj.isId = '否'
      }

      if (obj.isLinkTo == '1') {
        obj.isLinkTo = '是'
      } else if (obj.isLinkTo == '是') {
        obj.isLinkTo = '是'
      } else if (obj.isLinkTo == '否') {
        obj.isLinkTo = '否'
      } else if (obj.isLinkTo == '0') {
        obj.isLinkTo = '否'
      }



      handleSave(obj);
    } catch (errInfo) {
      message.error('Save failed:', errInfo);
    }
  };
  if (list && list.length <= 2) {
  }
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
      // rules={[
      //   {
      //     required: true,
      //     message: `${title} is required.`,
      //   },
      // {list.length &&list.length==2?list.map((item: any) => <Option value={item.parmVal}>{item.parmDesc}</Option>):list.map((item: any) => <Option value={item.parmVal}>{item.parmVal}</Option>)}
      // ]}
      // list.map((item: any) => item.parmDesc=='是'||item.parmDesc=='否'?<Option value={item.parmVal}>{item.parmDesc}</Option>:<Option value={item.parmVal}>{item.parmVal}</Option>)
      // list.map((item: any) => <Option value={item.parmVal}>{item.parmDesc}</Option>)
      // list.map((item: any) => item.parmDesc == '是' || item.parmDesc == '否' ? <Option value={item.parmVal}>{item.parmDesc}</Option> : 
      // item.unlike ? <Option value={item.parmVal}>{item.parmDesc}</Option> : <Option value={item.parmVal}>{item.parmVal}</Option>)
      >
        {type === 'select' ? (
          <Select ref={inputRef} onChange={save}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              list.length &&
              list.map((item: any) => item.parmDesc == '是' || item.parmDesc == '否' ? <Option value={item.parmVal}>{item.parmDesc}</Option> : <Option value={item.parmVal}>{item.parmVal}</Option>)
            }
          </Select>
        ) : (
          type === 'treeSelect' ?
            (
              <TreeSelect
                ref={inputRef}
                dropdownMatchSelectWidth={400}
                showSearch
                treeNodeFilterProp="title"
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择API接口"
                treeDefaultExpandAll
                treeData={list}
                // fieldNames={{ label: 'title', value: 'value', children: 'children' }}
                onChange={save}
                allowClear
              >
              </TreeSelect>
            ) :
            <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        )}
      </Form.Item>
    ) : (
      <div
        className={styles['editable-cell-value-wrap']}
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
type EditableTableProps = Parameters<typeof Table>[0];
interface EditableTableState {
  dataSource_t: any;
  count: number;
}
type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;
class EditableTable extends React.Component<EditableTableProps, EditableTableState> {
  // column: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[];
  constructor(props: any) {
    super(props);
    this.state = {
      dataSource_t: props.dataSource,
      count: 2,
    };
  }
  // handleDelete = (key: React.Key) => {
  //   const dataSource = [...this.state.dataSource];
  //   this.setState({ dataSource: dataSource.filter((item) => item.key !== key) });
  // };
  // handleAdd = () => {
  //   const { count, dataSource } = this.state;
  //   const newData: DataType = {
  //     key: count,
  //     name: `Edward King ${count}`,
  //     age: '32',
  //     address: `London, Park Lane no. ${count}`,
  //   };
  //   this.setState({
  //     dataSource: [...dataSource, newData],
  //     count: count + 1,
  //   });
  // };
  componentDidUpdate(prevProps: any) {
    if (this.props.dataSource !== prevProps.dataSource) {
      const { dataSource }: any = this.props;
      this.setState({ dataSource_t: [...dataSource] });
    }
  }
  handleSave = (row: I.DataType) => {
    const {
      dispatch,
      reportFormCreate: { sqlData, sqlPageLevel, tableColum },
    }: any = this.props;
    const newData = [...this.state.dataSource_t];
    const index = newData.findIndex((item) => row.columId === item.columId);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    if (!this.props.from) {
      sqlData.map((item: any, i: number) => {
        if (sqlPageLevel === item.intLvl) {
          if (sqlPageLevel === 1) {
            sqlData[0].intfIttrDescList = newData;
          } else {
            if (item.attrId === tableColum) {
              sqlData[i].intfIttrDescList = newData;
            }
          }
        }
      });
      dispatch({
        type: 'reportFormCreate/setSqlTableData',
        payload: { sqlData: [...sqlData] },
      });
    } else {
      dispatch({
        type: 'reportFormCreate/setAddSqlTableData',
        payload: { addSqlTableData: [...newData] },
      });
    }
    this.setState({ dataSource_t: newData });
  };
  componentDidMount() {
  }
  render() {
    const { dataSource_t } = this.state;
    const { columns }: any = this.props;
    if (dataSource_t && dataSource_t.length > 0) {
      dataSource_t.map(item => {
        if (item.isDisabled == '1') {
          item.isDisabled = '是'
        } else if (item.isDisabled == '是') {
          item.isDisabled = '是'
        } else if (item.isDisabled == '否') {
          item.isDisabled = '否'
        } else if (item.isDisabled == '0') {
          item.isDisabled = '否'
        } else {
          item.isDisabled = ''
        }
        if (item.isFilter == '1') {
          item.isFilter = '是'
        } else if (item.isFilter == '是') {
          item.isFilter = '是'
        } else if (item.isFilter == '否') {
          item.isFilter = '否'
        } else if (item.isFilter == '0') {
          item.isFilter = '否'
        } else {
          item.isFilter = ''
        }
        if (item.isId == '1') {
          item.isId = '是'
        } else if (item.isId == '是') {
          item.isId = '是'
        } else if (item.isId == '否') {
          item.isId = '否'
        } else if (item.isId == '0') {
          item.isId = '否'
        } else {
          item.isId = ''
        }

        if (item.isLinkTo == '1') {
          item.isLinkTo = '是'
        } else if (item.isLinkTo == '是') {
          item.isLinkTo = '是'
        } else if (item.isLinkTo == '否') {
          item.isLinkTo = '否'
        } else if (item.isLinkTo == '0') {
          item.isLinkTo = '否'
        } else {
          item.isLinkTo = ''
        }

      })
    }
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const column = columns.map((col: any) => {
      if (!col.editable) {
        return col;
      }
      if (col.key == 'isDisabled' || col.key == 'isId' || col.key == 'isFilter' || col.key == 'isLinkTo') {
        // col.render=render(col.key)
      }
      return {
        ...col,
        onCell: (record: I.DataType) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          type: col.type,
          list: col.list,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div className={styles.editable}>
        {/* <Button type="primary" style={{ marginBottom: 16 }}>
          增加一行
        </Button> */}
        <Table
          size="small"
          components={components}
          rowClassName={() => styles['editable-row']}
          bordered
          dataSource={dataSource_t}
          columns={column as ColumnTypes}
          scroll={{ y: 500 }}
        />
      </div>
    );
  }
}
export default connect(
  ({ reportFormCreate, loading }: { reportFormCreate: IndexModelState; loading: Loading }) => ({
    reportFormCreate,
    loading: loading.models.reportFormCreate,
  }),
)(EditableTable);
