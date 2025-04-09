import react from 'react';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { updataBusinessRules } from '../service';
import { message } from '@/components/base';
// export type UpdataBusinessRules = {
//     cuRuleNodeRule?: any;
// };
const UpdataBusinessRules: react.FC<any> = ({ cuRuleNodeRule, setupdataBusinessRule }) => {
  // console.log("规则更新的默认填写数据cuRuleNodeRule: ", cuRuleNodeRule);
  let nodeType = '';

  if (cuRuleNodeRule.nodeType === 0) {
    nodeType = '普通类型';
  } else {
    nodeType = 'sql类型';
  }

  const updataBusRules = async (values: any) => {
    let ruleObject: any = { deleteIds: [], cuRule: { id: '' }, cuRuleNodes: [] };
    ruleObject.cuRule.id = cuRuleNodeRule.id;
    ruleObject.cuRuleNodes.push(values);
    console.log('ruleObject', ruleObject);
    let res = await updataBusinessRules(ruleObject);
    if (res.code === 0) {
      message.success('修改成功');
      setupdataBusinessRule(false);
    } else {
      message.error('修改失败！');
    }
  };
  return (
    <>
      <ProForm
        onFinish={async (values) => {
          // console.log('修改规则的values', values);
          // let ruleObject: any = { deleteIds: [], cuRule: { id: '' }, cuRuleNodes: [] }
          // ruleObject.cuRule.id = cuRuleNodeRule.id
          // ruleObject.cuRuleIdtlo.push(values)
          // console.log("ruleObject", ruleObject);

          await updataBusRules(values);
        }}
        // request={async ()=>{
        //     cuRuleNodeRule
        // }}
      >
        <ProFormText
          name="name"
          width="md"
          label="规则名称"
          placeholder={cuRuleNodeRule.name}
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
        <ProFormText name="num" width="md" label="执行顺序" placeholder={cuRuleNodeRule.num} />
        <ProFormSelect
          name="nodeType"
          width="md"
          label="规则类型"
          placeholder={nodeType}
          options={[
            {
              value: '0',
              label: '普通类型',
            },
            {
              value: '1',
              label: 'sql类型',
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
          name="dealEvent"
          width="md"
          label="处理事件"
          placeholder={cuRuleNodeRule.dealEvent}
        />
        <ProFormText
          name="description"
          width="md"
          label="规则描述"
          placeholder={cuRuleNodeRule.description}
        />
        <ProFormText
          name="resultName"
          width="md"
          label="返回结果"
          placeholder={cuRuleNodeRule.resultName}
        />
      </ProForm>
    </>
  );
};
// 输出组件
export default UpdataBusinessRules;
