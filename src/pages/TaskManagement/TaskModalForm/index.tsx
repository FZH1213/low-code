import { Form, Input, Select, message, Tooltip, Modal, Spin } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
// import '@/theme/default/common.less';
import MonacoEditor from 'react-monaco-editor';
import { createTask, updateById } from '../service';

interface ModalFormProps {
  visable: boolean;
  onRefresh?: () => void;
  onCancel: () => void;
  allApis: Array<any>;
  isAdd: Boolean;
  modalLoading: boolean;
  data: any;
}
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const { Option } = Select;
const { TextArea } = Input;

const TaskModalForm: React.FC<ModalFormProps> = (props) => {
  const { visable, onCancel, onRefresh, data, allApis, isAdd, modalLoading } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [simpleTask, setSimpleTask] = useState<boolean>(false);

  const [form] = Form.useForm();

  const getIsSimpleTask = async (data: any) => {
    if (data) {
      if (data === 'org.quartz.impl.triggers.CronTriggerImpl') {
        setSimpleTask(false);
      } else {
        setSimpleTask(true);
      }
    }
  };

  useEffect(() => {
    form.resetFields();
    if (data) {
      const nd = { ...data };
      if (data.executionInfo) {
        nd.executionInfo.path = `${data.executionInfo.path},${data.executionInfo.serviceId},${data.executionInfo.method},${data.executionInfo.contentType}`;
      }
      form.setFieldsValue(nd);
      getIsSimpleTask(data.jobTrigger);
    }
  }, [data, form]);

  if (!visable) {
    return null;
  }

  const onOk = () => {
    setLoading(true);
    form
      .validateFields()
      .then(async (values) => {
        const info = values.executionInfo.path?.split(',');
        let nVals = { ...values };
        [
          nVals.executionInfo.path,
          nVals.executionInfo.serviceId,
          nVals.executionInfo.method,
          nVals.executionInfo.contentType,
        ] = info;
        // if (!nVals.executionInfo.serviceId) {
        //   nVals.executionInfo.serviceId = data.serviceId;
        // }
        // if (!nVals.executionInfo.method) {
        //   nVals.executionInfo.method = data.method;
        // }
        if (simpleTask) {
          nVals = {
            ...nVals,
            jobType: 'simple',
          };
        } else {
          nVals = {
            ...nVals,
            jobType: 'cron',
          };
        }
        if (values.id || values.id === 0) {
          const resp = await updateById(nVals);
          if (resp.code === 0) {
            message.success('修改成功');
            if (onRefresh) {
              onRefresh();
            }
            onCancel();
            form.resetFields();
          } else {
            message.error(resp.message || '修改失败');
          }
        } else {
          const resp = await createTask(values);
          if (resp.code === 0) {
            message.success('新增成功');
            if (onRefresh) onRefresh();
            onCancel();
            form.resetFields();
          } else {
            message.error(resp.message || '新增失败');
          }
        }

        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <Modal
      title={isAdd ? '新增任务' : '编辑任务'}
      className="webroot"
      visible={visable}
      confirmLoading={loading}
      centered
      onOk={onOk}
      width={700}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
    >
      <Spin spinning={modalLoading}>
        <Form form={form} {...layout}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="任务名称"
            name="jobName"
            rules={[{ required: true, message: '任务名称不能为空' }]}
          >
            {isAdd ? <Input /> : <Input disabled />}
          </Form.Item>

          <Form.Item name="jobTrigger" hidden>
            <Input value="org.quartz.impl.triggers.CronTriggerImpl" />
          </Form.Item>
          {/* <Form.Item
            label="定时类型"
            name="jobTrigger"
            rules={[{ required: true, message: '定时任务不能为空' }]}
          >
            <Select placeholder="请选择定时类型" optionFilterProp="children"
              onChange={(e) => {
                getIsSimpleTask(e)
              }}>
              <Option key={"0"} value="org.quartz.impl.triggers.CronTriggerImpl">cron任务(CronTrigger)</Option>
              <Option key={"1"} value="简单任务(SimpleTrigger)">简单任务(SimpleTrigger)</Option>
            </Select>
          </Form.Item> */}
          {
            // simpleTask ?
            //   <div>
            //     <Form.Item
            //       name="startTime"
            //       label="开始时间"
            //       rules={[{ required: true, message: '开始时间不能为空' }]}
            //     >
            //       <DatePicker style={{ width: '100%' }} placeholder="请选择开始时间" />
            //     </Form.Item>
            //     <Form.Item
            //       name="endTime"
            //       label="结束时间"
            //     >
            //       <DatePicker style={{ width: '100%' }} placeholder="请选择结束时间" />
            //     </Form.Item>
            //     <Form.Item
            //       label="重复执行"
            //       name="repeatCount"
            //       rules={[{ required: true, message: '重复执行次数不能为空' }]}
            //     >
            //       <InputNumber min={-1}></InputNumber> 次<br />
            //       <Button style={{ marginTop: "5px", marginLeft: "-2px" }}>不重复执行</Button>
            //       <Button>不限制次数,一直重复执行(直到过期)</Button>
            //     </Form.Item>
            //   </div>:
          }
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <div>
              <Form.Item
                label="cron表达式"
                name="cronExpression"
                rules={[{ required: true, message: 'cron表达式不能为空' }]}
              >
                <Input style={{ width: '434px' }} />
              </Form.Item>
            </div>
            <Tooltip
              placement="right"
              color="white"
              title={
                <div style={{ color: 'black' }}>
                  <span style={{ color: '#19be6b' }}>0 0 2 1 * ? *</span> <br />
                  表示在每月的1日的凌晨2点调度任务
                  <br />
                  <span style={{ color: '#19be6b' }}>0 15 10 ? * MON-FRI </span>
                  <br />
                  表示周一到周五每天上午10：15调度任务
                  <br />
                  <span style={{ color: '#19be6b' }}>0 0 10,14,16 * * ? </span>
                  <br />
                  表示每天上午10点，下午2点，4点调度任务
                  <br />
                  <span style={{ color: '#19be6b' }}>0 0 12 ? * WED </span>
                  <br />
                  表示每个星期三中午12点调度任务
                  <br />
                  <span style={{ color: '#19be6b' }}>0 15 10 ? * * </span>
                  <br />
                  表示每天上午10:15调度任务
                </div>
              }
            >
              &emsp;
              <QuestionCircleOutlined style={{ width: '40px' }} />
            </Tooltip>
          </div>
          <Form.Item
            label="远程调度接口"
            name={['executionInfo', 'path']}
            rules={[{ required: true, message: '远程调度接口不能为空' }]}
          // initialValue={`${data.executionInfo.path},${data.executionInfo.serviceId},${data.executionInfo.requestMethod}`}
          >
            <Select
              placeholder="请选择远程调度接口"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {allApis.map((item: any) => (
                <Option
                  key={`${item.path},${item.serviceId},${item.requestMethod},${item.contentType}`}
                  value={`${item.path},${item.serviceId},${item.requestMethod},${item.contentType}`}
                >
                  {`${item.path}-${item.apiName}-${item.serviceId}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="任务描述"
            name="jobDescription"
            rules={[
              { required: true, message: '任务描述不能为空' },
              { max: 1000, message: '字数不符合' },
            ]}
          >
            <TextArea rows={3} maxLength={1000} showCount />
          </Form.Item>
          <Form.Item
            name={['executionInfo', 'pathParams']}
            label="路径参数"
            initialValue={data.pathParams}
          >
            <MonacoEditor language="json" theme="vs-dark" height={120} />
          </Form.Item>
          <Form.Item
            name={['executionInfo', 'requestParams']}
            label="url参数"
            initialValue={data.requestParams}
          >
            <MonacoEditor language="json" theme="vs-dark" height={120} />
          </Form.Item>
          <Form.Item
            name={['executionInfo', 'bodyParams']}
            label="请求体参数"
            initialValue={data.bodyParams}
          >
            <MonacoEditor language="json" theme="vs-dark" height={120} />
          </Form.Item>
          {/* <Form.Item
            name={['executionInfo', 'alarmMail']}
            label="异常告警邮箱"
            initialValue={data.alarmMail}
          >
            <Input />
          </Form.Item> */}
        </Form>
      </Spin>
    </Modal>
  );
};

export default TaskModalForm;
