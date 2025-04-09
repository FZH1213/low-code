import react from 'react';
import { useEffect, useState } from 'react';
import ProForm, { ProFormText, ProFormSelect } from '@ant-design/pro-form';
import api from '../services/businessRules';
import { message, Form, Select } from '@/components/base';
import { Input, Button, Space, Row, Col, Divider } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import styles from '../index.less';

const UpdataBusinessRules2: react.FC<any> = ({
  cuRuleNodeRule,
  setupdataBusinessRule,
  RuleDataList,
  selectKey,
}) => {
  const [deleteIds, setDeleteIds] = useState<any>([]);
  let nodeType = '';

  const onFinish = async (values: any) => {
    let ruleObject: any = { deleteIds: [], cuRule: { id: '' }, cuRuleNodes: '' };
    // ruleObject.cuRule.id = cuRuleNodeRule.cuRuleNodes.id
    ruleObject.cuRule.id = selectKey;
    console.log('values', values.cuRuleNodes);
    values.cuRuleNodes.map((item: any) => {
      item.nodeType = 0;
    });
    ruleObject.deleteIds = deleteIds;
    ruleObject.cuRuleNodes = values.cuRuleNodes;
    console.log('ruleObject', ruleObject);
    let res = await api.updataBusinessRules(ruleObject);
    if (res.code === 0) {
      message.success('修改成功');
      setupdataBusinessRule(false);
    } else {
      message.error('修改失败！');
    }
  };
  // let deleteIds:any = []
  const deleteId = (key: any) => {
    let delIds: any = [];
    console.log(RuleDataList[key].id);
    delIds.push(RuleDataList[key].id);
    setDeleteIds(delIds);
    console.log(delIds);
  };
  return (
    <Form
      name="dynamic_form_nest_item"
      onFinish={onFinish}
      autoComplete="off"
      layout="horizontal"
      initialValues={cuRuleNodeRule}
    >
      <Form.List name="cuRuleNodes">
        {(fields, { add, remove }) => {
          console.log(fields);
          return (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space key={key} style={{ marginBottom: 8 }} align="baseline">
                  <Row gutter={16}>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          label="规则名称"
                          {...restField}
                          name={[name, 'name']}
                          fieldKey={[fieldKey, 'name']}
                          rules={[{ required: true, message: '请输入规则名称' }]}
                        >
                          <Input style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                      {/* <Col span={12}>
                                                <Form.Item
                                                    label="规则类型"
                                                    {...restField}
                                                    name={[name, "nodeType"]}
                                                    fieldKey={[fieldKey, "nodeType"]}
                                                    rules={[{ required: false, message: "请输入规则类型" }]}
                                                >
                                                    <Select
                                                        options={[
                                                            {
                                                                value: '0',
                                                                label: "普通类型",
                                                            },
                                                            {
                                                                value: '1',
                                                                label: "sql类型"
                                                            }
                                                        ]}
                                                    />
                                                </Form.Item>
                                            </Col> */}
                    </Row>
                    <Row style={{ width: '100%' }}>
                      <Col xs={24}>
                        <Form.Item
                          label="规则描述"
                          {...restField}
                          name={[name, 'description']}
                          fieldKey={[fieldKey, 'description']}
                          rules={[{ required: false, message: '请输入规则描述' }]}
                        >
                          <Input.TextArea style={{ width: '100%' }} />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="处理事件"
                          {...restField}
                          name={[name, 'dealEvent']}
                          fieldKey={[fieldKey, 'dealEvent']}
                          rules={[{ required: true, message: '请输入处理事件' }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="执行顺序"
                          {...restField}
                          name={[name, 'num']}
                          fieldKey={[fieldKey, 'num']}
                          rules={[{ required: true, message: '请输入执行顺序' }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col style={{ width: '210px' }}>
                        <Form.Item
                          label="返回结果"
                          {...restField}
                          name={[name, 'resultName']}
                          fieldKey={[fieldKey, 'resultName']}
                          rules={[{ required: false, message: '请输入返回结果' }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Divider style={{ margin: '0 0 10px 0' }} />
                  </Row>
                  <MinusCircleOutlined
                    style={{ fontSize: '14px', paddingLeft: '10px' }}
                    onClick={() => {
                      remove(name), deleteId(fieldKey);
                    }}
                  />
                </Space>
              ))}

              <Form.Item>
                <Button onClick={() => add()} block icon={<PlusOutlined />}>
                  新增规则
                </Button>
              </Form.Item>
            </>
          );
        }}
      </Form.List>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
      </Form.Item>
    </Form>
  );
};

// 输出组件
export default UpdataBusinessRules2;
