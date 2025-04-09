import styles from "./index.less";
import { Checkbox, Input, Button, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import DefaultDetail from './DefaultDetail';
import DataTableModal from "./DataTableModal";
import LangContext from "../../util/context";
import { IFlowModel } from '../../types';

const Option = Select.Option;

export interface FlowProps {
  model: IFlowModel;
  onChange: (...args: any[]) => any;
  readOnly: boolean;
}
const FlowDetail: React.FC<FlowProps> = ({ model, onChange, readOnly = false, }) => {

  //初始化加载方法。[]中可填入变量，当该变量变化是会再次触发。可以写多个
  useEffect(() => {
    if (model && model.conditionExpression != undefined) {
      const conExp = model.conditionExpression
      if (
        conExp == '<![CDATA[${pass=="Y"}]]>'
        || conExp == '<![CDATA[${pass=="N"}]]>'
        || conExp == "${pass=='Y'}"
        || conExp == "${pass=='N'}"
        || conExp == '${pass=="Y"}'
        || conExp == '${pass=="N"}'
      ) {
        onChange("conExp", conExp);
        setCustom(false)
      } else {
        onChange("conExp", '10000');
        setCustom(true)
      }
    }
  }, [])

  const items = [
    { key: "${pass=='Y'}", value: "通过" },
    { key: "${pass=='N'}", value: "不通过" },
    { key: '', value: "空" },
    { key: '10000', value: "自定义" },
  ]
  const [custom, setCustom] = useState(false);



  if (model.eventContent === undefined) {
    onChange('eventContent', []);
  }
  const { i18n, lang } = useContext(LangContext);
  const title = i18n['sequenceFlow'];

  const [messageFlowModalVisible, setMessageFlowModalVisible] = useState(false);
  const messageCols = [
    {
      title: i18n['process.event.type'], dataIndex: 'event', editable: true,
      editor: {
        type: 'select',
        options: [
          { key: 'start', value: 'start' },
          { key: 'end', value: 'end' },
          { key: 'take', value: 'take' }
        ]
      }
    },
    { title: i18n['process.event.content'], dataIndex: 'expression', editable: true },
  ];

  return (
    <>
      <div data-clazz={model.clazz} className={styles.propswrapper}>
        <div className={styles.panelTitle}>{title}</div>
        <div className={styles.panelBody}>
          <DefaultDetail model={model} onChange={onChange} readOnly={readOnly} />
          {/* <div className={styles.panelRow}>
            <div>{i18n['sequenceFlow.expression']}：</div>
            <Input.TextArea style={{ width: '100%', fontSize: 12 }}
              rows={4}
              value={model.conditionExpression}
              onChange={(e) => {
                onChange('conditionExpression', e.target.value)
              }}
              disabled={readOnly}
            />
          </div> */}
          <div className={styles.panelRow}>
            <div>{i18n["sequenceFlow.expression"]}：</div>
            <Select
              placeholder={i18n["sequenceFlow.expression"]}
              style={{ width: "100%", fontSize: 12 }}
              defaultValue={model.conExp}
              value={model.conExp}
              onChange={(e: any) => {
                onChange("conExp", e);
                if (e == '10000') {
                  onChange("conditionExpression", null);
                  setCustom(true);
                } else {
                  onChange("conditionExpression", e);
                  setCustom(false);
                }
              }}
            >
              {items.map((item) => (
                <Option value={item.key}>{item.value}</Option>
              ))}
            </Select>
          </div>
          {custom &&
            <div className={styles.panelRow}>
              <Input.TextArea style={{ width: '100%', fontSize: 12 }}
                rows={4}
                value={model.conditionExpression}
                onChange={(e) => {
                  onChange('conditionExpression', e.target.value)
                }}
                disabled={readOnly}
              />
            </div>

          }
          {/* <div className={styles.panelRow}>
          <div>{i18n['sequenceFlow.seq']}：</div>
          <Input style={{width: '100%', fontSize: 12}}
                 value={model.seq}
                 onChange={(e) => {
                   onChange('seq', e.target.value)
                 }}
                 disabled={readOnly}
          />
        </div>
        <div className={styles.panelRow}>
          <Checkbox onChange={(e) => onChange('reverse', e.target.checked)}
                    disabled={readOnly}
                    checked={!!model.reverse}>{i18n['sequenceFlow.reverse']}</Checkbox>
        </div> */}
          <div className={styles.panelRow}>
            <div>
              {i18n['process.event']}：
              <Button className={styles.editBtn} disabled={readOnly} onClick={() => setMessageFlowModalVisible(true)}>{i18n['tooltip.edit']}</Button>
            </div>
          </div>
        </div>
      </div>
      <DataTableModal title={i18n['process.event']}
        lang={lang}
        newRowKeyPrefix="message"
        cols={messageCols}
        data={model.eventContent}
        visible={messageFlowModalVisible}
        onOk={(d) => {
          setMessageFlowModalVisible(false);
          onChange('eventContent', d);
        }}
        onCancel={() => setMessageFlowModalVisible(false)} />
    </>
  )
};

export default FlowDetail;
