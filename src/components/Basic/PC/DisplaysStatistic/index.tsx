import { Statistic, Form } from '@/components/base';
import React from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {} from 'module';
import styles from './index.less';
import { includes } from 'lodash';
/**
 * 输入框
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.value 默认值
 * @param {*} props.requestUrl 查询url
 * @param {*} props.requestMethod 请求类型
 * @return {*}
 */
interface PcDisplaysStatisticProps {
  label: string;
  name: string;
  hidden: boolean;
  requestUrl: string;
  requestMethod: 'post' | 'get';
  value: string;
  title: string;
  tooltipTitle: string;
  _var: any;
  alignType: string;
  fontSize: string;
  fontMode: string;
}
export const PcDisplaysStatistic: React.FC<PcDisplaysStatisticProps> = (props) => {
  return (
    <Form.Item
      label={props.label}
      name={props.name}
      hidden={props.hidden}
      initialValue={props.value}
    >
      <Statistic
        className={['default', ''].includes(props?.alignType) ? '' : styles.custTitleContentInline}
        title={
          <div style={{ marginRight: 10 }}>
            <span>{props?.title}</span>{' '}
            {props?.tooltipTitle ? (
              <Tooltip placement="top" title={props?.tooltipTitle}>
                <QuestionCircleOutlined />
              </Tooltip>
            ) : null}
          </div>
        }
        value={props?.value}
        formatter={(value) => (
          <div
            className={`${
              ['default', ''].includes(props?.fontSize) ? '' : styles.custContentfontSize
            } ${['default', ''].includes(props?.fontMode) ? '' : styles.custContentfontMode}`}
          >
            {<span>{value}</span>}
          </div>
        )}
      />
    </Form.Item>
  );
};
