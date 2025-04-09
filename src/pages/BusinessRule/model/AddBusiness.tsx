import react from 'react';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { values } from '@antv/util';
import { addBusiness } from '../service';
import api from '../services/businessRules';
import { useEffect } from 'react';
import { GLOBAL_VALUE } from '@/utils/globalValue';
import { message, TreeSelect, getCategoryText, Form } from '@/components/base';
import { max } from '@umijs/deps/compiled/lodash';

const AddBusiness: react.FC<any> = ({
  businessData,
  selectKey,
  setaddBus,
  handleClick,
  businessListDate,
  onBusinessTree,
}) => {
  let [thisForm] = Form.useForm();
  useEffect(() => {
    // 默认填写
    // thisForm.setFieldsValue(props.dataSource);
  }, []);

  //

  const addbusiness = async (values: any) => {
    console.log('values--', values);
    let res = await api.addBusiness(values);
    if (res.code === 0) {
      message.success('业务添加成功');
      await handleClick();
      await onBusinessTree();
      setaddBus(false);
    } else {
      message.error('添加业务失败');
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
        onFinish={async (values) => {
          // values.regionCode = regionCode
          // console.log('values', values);
          values.cuRuleId = selectKey;

          await addbusiness(values);
        }}
        form={thisForm}
      >
        <ProFormTreeSelect
          name="pid"
          width="md"
          label="父级业务"
          // request={async () => businessData}
          rules={[
            {
              required: true,
              message: GLOBAL_VALUE.INPUT_PROMPT('父级业务', 20, true),
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
          // request={async () => businessListDate.type}
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
          // request={async () => businessListDate.isAutoDeal}
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
export default AddBusiness;
