import react from 'react';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import api from '../services/businessRules';
import { GLOBAL_VALUE } from '@/utils/globalValue';
import { message, TreeSelect, getCategoryText, Form } from '@/components/base';

const UpdataBusiness: react.FC<any> = ({
  businessData,
  selectKey,
  setupdataBus,
  getbusinessTableData,
  initialValues,
}) => {
  // console.log(initialValues)
  if (initialValues.type !== 1) {
    initialValues.type = '否';
  } else {
    initialValues.type = '是';
  }
  if (initialValues.isAutoDeal == 1) {
    initialValues.isAutoDeal = '是';
  } else {
    initialValues.isAutoDeal = '否';
  }

  const updataBusiness = async (values: any) => {
    console.log('values--', values);
    if (values.type == '否') {
      values.type = '2';
    } else if (values.type == '是') {
      values.type = '1';
    }
    if (values.isAutoDeal == '否') {
      values.isAutoDeal = '2';
    } else if (values.isAutoDeal == '是') {
      values.isAutoDeal = '1';
    }
    let res = await api.updatabusiness(values);
    if (res.code === 0) {
      message.success('业务修改成功');
      setupdataBus(false);
      await getbusinessTableData(selectKey);
    } else {
      message.error('业务修改失败');
    }
  };
  const ProFormTreeSelect = (props) => {
    return (
      <ProForm.Item {...props}>
        {/* <Input placeholder={props.placeholder} {...props.fieldProps} /> */}
        <TreeSelect
          allowClear
          placeholder={props.placeholder}
          treeData={businessData}
          showSearch
          treeNodeFilterProp={'title'}
          {...props.fieldProps}
        ></TreeSelect>
      </ProForm.Item>
    );
  };
  return (
    <>
      <ProForm
        initialValues={initialValues}
        onFinish={async (values) => {
          values.id = selectKey;
          await updataBusiness(values);
        }}
      >
        <ProFormTreeSelect
          name="pid"
          width="md"
          label="父级业务"
          // request={async () => businessData}
          rules={[
            {
              required: true,
              message: '请选择父级业务',
            },
          ]}
        />
        <ProFormText
          name="name"
          width="md"
          label="本级业务"
          rules={[
            {
              required: true,
              message: GLOBAL_VALUE.INPUT_PROMPT('本级业务', 20),
              max: 20,
            },
          ]}
        />
        <ProFormSelect
          name="type"
          width="md"
          label="规则节点"
          options={[
            {
              value: '1',
              label: '是',
            },
            {
              value: '2',
              label: '否',
            },
          ]}
          rules={[
            {
              required: true,
              validator: async (_, value) => {
                if (value && value.length > 0) {
                  return;
                }
                throw new Error('请输入规则节点');
              },
            },
          ]}
        />
        <ProFormText
          name="description"
          width="md"
          label="业务描述"
          rules={[
            {
              required: true,
              message: GLOBAL_VALUE.INPUT_PROMPT('业务描述', 20),
              max: 20,
            },
          ]}
        />
        <ProFormText
          name="ruleDefId"
          width="md"
          label="业务标识"
          rules={[
            {
              required: true,
              message: GLOBAL_VALUE.INPUT_PROMPT('业务标识', 20),
              max: 20,
            },
          ]}
        />
        <ProFormSelect
          name="isAutoDeal"
          width="md"
          label="是否自动自行"
          options={[
            {
              value: '1',
              label: '是',
            },
            {
              value: '2',
              label: '否',
            },
          ]}
          rules={[
            {
              required: true,
              validator: async (_, value) => {
                if (value && value.length > 0) {
                  return;
                }
                throw new Error('请输选择');
              },
            },
          ]}
        />
      </ProForm>
    </>
  );
};
// 输出组件
export default UpdataBusiness;
