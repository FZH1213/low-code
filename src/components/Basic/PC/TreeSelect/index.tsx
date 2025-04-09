import { Form, TreeSelect } from '@/components/base';
import { useEffect, useState } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';

/**
 * 输入框
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.placeholder 占位符
 * @param {*} props.treeData 数据
 * @return {*}
 */
interface PcTreeSelectProps {
  label: string;
  name: string;
  required: boolean;
  placeholder: string;
  treeData: any;
  requestUrl: any;
  requestType: any;
  _var: any;
}
export const PcTreeSelect: React.FC<PcTreeSelectProps> = (props) => {
  const [data, setData] = useState<any>([]);
  const request = createRequest(props.requestUrl, props.requestType);
  const renderHandle = async () => {
    if (!props.requestUrl) {
      setData(props?.treeData);
      return;
    }
    const data = await judgeSucessAndGetData(await request(props._var));
    if (!data) return;
    setData(data);
  };
  useEffect(() => {
    renderHandle();
  }, [props._var]);
  return (
    <Form.Item label={props?.label} name={props?.name} required={props?.required}>
      <TreeSelect
        treeData={data}
        showSearch={true}
        filterTreeNode={(inputValue: string, treeNode: TreeNode) => (treeNode?.label ?? '').toLowerCase().includes(inputValue.toLowerCase())}
      />
    </Form.Item>
  );
};
