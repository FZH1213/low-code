import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { deepClone } from '@/utils/utils';
import { Card, Input, Select, DatePicker, Drawer, Checkbox, message, Form } from 'antd';
import moment from 'moment';
import { STRUCT_NODE_TYPE, LOCAL_STORE_KEYS } from '@/utils/constant';
import { ColumnsType } from 'antd/lib/table';
import api from './service';
// import '@/theme/default/common.less';
import './styles.less';
import { DF_YMD, DF_YMDHMS } from '@/utils/constant';
import TableSearchForm, { FieldProp, TableSearchFormInstance } from "@/components/TableSearchForm";
const { Option } = Select;
const { RangePicker } = DatePicker;

const TableList: React.FC<{}> = () => {
  const [pageTable] = Form.useForm();
  const [visable, setVisable] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<Array<any> | undefined>([]);
  const [directionUnitMap, setDirectionUnitMap] = useState<any>({});
  const [taskLog, setTaskLog] = useState<any>({});
  const [search, setSearch] = useState({})
  const searchFormRef = useRef<TableSearchFormInstance | undefined>(undefined);
  const columns: ColumnsType<any> = [
    {
      title: '任务名称',
      dataIndex: 'jobName',
      key: 'jobName',
      align: 'left',
      width: '13%'
    },
    {
      title: '调度信息',
      dataIndex: 'cronExpression',
      key: 'cronExpression',
      align: 'left',
      width: '25%',
      render: (text: any, record: any) => (
        <div>
          {"cron表达式：" + text}
        </div>
      ),
    },
    {
      title: '执行结果',
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      width: '15%',
      render: (text: any, record: any) => (
        <div>
          {text === 1 ?
            <div>
              <span className="ivu-badge-status-dot ivu-badge-status-success"></span>
              <span className="ivu-badge-status-text">成功</span>
            </div>
            : <div>
              <span className="ivu-badge-status-dot ivu-badge-status-error"></span>
              <span className="ivu-badge-status-text">失败</span>
            </div>}
        </div>

      ),
    },
    {
      dataIndex: 'runTime',
      title: '耗时',
      align: 'right',
      width: '16%',
      render: (text: any) => (
        <div>
          {text}ms
        </div>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'left',
      key: 'createTime',
      width: '20%',
      render: (text: any) => (text && text !== '' ? moment(text).format(DF_YMDHMS) : ''),
    },
    {
      title: '详情',
      width: 60,
      fixed: 'right',
      align: 'left',
      render: (val: any, record: any) => (
        <a
          onClick={() => {
            setVisable(true);
            setTaskLog(record);
          }}
        >
          详情
        </a>
      ),
    },
  ];

  const queryFieldsProp: Array<FieldProp> = [
    { label: '任务名称', name: 'jobName', components: <Input placeholder="请输入任务名称" /> },
    {
      label: '状态',
      name: 'status',
      components: (
        <Select placeholder="请选择类型">
          <Option key={1} value={"1"}>成功</Option>
          <Option key={0} value={"0"}>失败</Option>
        </Select>
      ),
    },
    {
      label: '创建日期',
      name: 'workDuring',
      initValue: [moment().subtract('days', 6), moment()],
      components: <RangePicker style={{ width: '100%' }} allowClear />,
    },
  ];

  const fetchList = () => {
    return (playload: any) => {
      // let params = Object.assign({}, playload.params, search);
      const values = searchFormRef.current?.getFormValues()
      const nVals = { ...values };
      delete nVals.workDuring;
      if (values?.workDuring && values.workDuring instanceof Array && values.workDuring.length === 2) {
        nVals.workStartTime = moment(values.workDuring[0]).format(DF_YMD);
        nVals.workEndTime = moment(values.workDuring[1]).format(DF_YMD);
      }
      const params = { ...playload.params, ...nVals };
      playload.params = params;
      const resp = api.pageList(playload);
      return resp;
    };
  }

  const filterNodeTypeRecuVDisabled = (data: any[], key: string) => {
    const newData = [...data];
    newData.forEach((item) => {
      // 除研究方向类型  其他禁用
      if (item.nodeType === STRUCT_NODE_TYPE.RESEARCH_DIRECTION) {
        item.disabled = true;
      } else {
        setDirectionUnitMap({ ...directionUnitMap, [item.value]: item.children });
      }

      if (item.children && item.children instanceof Array && item.children.length > 0) {
        item.children = filterNodeTypeRecuVDisabled(item.children, key);
      }
    });
    return newData;
  };


  const onSearch = async (e) => {
    if (e) {
      setSearch({
        jobName: e.jobName,
        status: e.status,
        workStartTime: e.workStartTime,
        workEndTime: e.workEndTime,
      })
      pageTable.current.renderData()
    }
  };

  const onReset = async () => {
    await setSearch({})
    pageTable.current.renderData()
  }

  return (
    <PageContainer title={false}>
      <TableSearchForm
        queryFieldsProp={queryFieldsProp}
        span={6}
        defaultCollapsed={false}
        ref={searchFormRef}
        localStoreKey={LOCAL_STORE_KEYS.TaskLog}
        onSearch={(values) => {
          const nVals = { ...values };
          delete nVals.workDuring;
          if (values.workDuring && values.workDuring instanceof Array && values.workDuring.length === 2) {
            nVals.workStartTime = moment(values.workDuring[0]).format(DF_YMD);
            nVals.workEndTime = moment(values.workDuring[1]).format(DF_YMD);
          }
          onSearch(nVals)
        }}
        onReset={onReset}
      // form={queryForm}
      />
      <Card className="area-mt">
      </Card>

      <Drawer
        destroyOnClose
        title={
          taskLog.status === 1 ?
            <div>
              <span className="ivu-badge-status-dot ivu-badge-status-success"></span>
              <span className="ivu-badge-status-text">{taskLog.jobName}</span>
            </div>
            : <div>
              <span className="ivu-badge-status-dot ivu-badge-status-error"></span>
              <span className="ivu-badge-status-text">{taskLog.jobName}</span>
            </div>
        }
        closable={false}
        visible={visable}
        onClose={() => setVisable(false)}
        width="50%"
        placement="right"
        style={{ fontSize: "15px" }}
      >
        <span style={{ fontWeight: "bold" }}>执行类: </span>{taskLog.jobClass}<br />
        <span style={{ fontWeight: "bold" }}>触发器: </span>{taskLog.triggerClass}<br />
        <span style={{ fontWeight: "bold" }}>运行时长: </span>{taskLog.runTime}ms<br />
        <span style={{ fontWeight: "bold" }}>cron表达式: </span>{taskLog.cronExpression}<br />
        <p style={{ fontWeight: "bold" }}>执行参数 </p>
        <div style={{ color: "#c7254e", background: "#f6f6f6", padding: "3px", whiteSpace: 'pre-wrap' }}>
          {!!taskLog.jobData ? taskLog.jobData.substr(1, taskLog.jobData.length - 2).split(',').map((item: any, index: any) => {
            if (index == taskLog.jobData.substr(1, taskLog.jobData.length - 2).split(',').length - 1) {
              return "\t" + item + "\n" + "}";
            } else if (index === 0) {
              return "{\n\t" + item + ",\n";
            } else {
              return "\t" + item + ",\n";
            }
          }) : null}
        </div>
        <p style={{ fontWeight: "bold", marginTop: "10px" }}>错误信息 </p>
        <div style={{ color: "#c7254e", background: "#f6f6f6", padding: "10px", whiteSpace: 'pre-wrap' }}>
          {'' + taskLog.exception + ''}
        </div>
      </Drawer>
    </PageContainer>

  );
};

export default TableList;
