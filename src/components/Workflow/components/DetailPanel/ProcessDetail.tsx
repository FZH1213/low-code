import styles from "./index.less";
import { Input, Button, Select, Switch } from "antd";
import React, { useContext, useState } from "react";
import LangContext from "../../util/context";
import DataTableModal from "./DataTableModal";
import { IProcessModel, IMsgListData } from '../../types';

export interface ProcessProps {
  model: IProcessModel;
  msgList: IMsgListData[];
  onChange: (...args: any[]) => any;
  readOnly: boolean;
}
const ProcessDetail: React.FC<ProcessProps> = ({ model, msgList, onChange, readOnly = false, }) => {

  const { i18n, lang } = useContext(LangContext);
  const [messageUserModalVisible, setMessageUserModalVisible] = useState(false);
  const messageCols = [
    {
      title: i18n['process.event.type'], dataIndex: 'event', editable: true,
      editor: {
        type: 'select',
        options: [
          { key: 'start', value: 'start' },
          { key: 'end', value: 'end' },
          { key: 'stopflow', value: 'stopflow' },
        ]
      }
    },
    { title: i18n['process.event.content'], dataIndex: 'expression', editable: true },
  ];

  var msgDataList: any[] = [];
  if (msgList.length > 0) {
    msgDataList = msgList;
  }

  return (
    <>
      <div data-clazz={model.clazz}>
        <div className={styles.panelTitle}>{i18n['process']}</div>
        <div className={styles.panelBody}>
          {/* 消息提醒设置 */}
          <div className={styles.panelRow}>
            <div>{i18n['userTask.message.set']}：
            <Switch
                size={'small'}
                checked={model.messageSet ? model.messageSet : false}
                onChange={(e) => {
                  onChange('messageSet', e);
                }}
              />
            </div>
          </div>

          {/* 消息模板--转交 */}
          {(model.messageSet == true) &&
            <div className={styles.panelRow}>
              <div><span>{i18n['userTask.message.forwardtemp']}：</span></div>
              <Select
                showSearch
                filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
                style={{ width: '100%', fontSize: 12 }}
                placeholder={i18n['userTask.message.forwardtemp']}
                value={model.messageTempId ? model.messageTempId : undefined}
                onChange={(e) => {
                  onChange('messageTempId', e);
                }}
                disabled={readOnly}
              >
                {msgDataList && msgDataList.map(item => (<Select.Option show={item.tplName} value={item.bzId}>{item.tplName}</Select.Option>))}
              </Select>
            </div>}
          {/* 消息模板--终止 */}
          {(model.messageSet == true) &&
            <div className={styles.panelRow}>
              <div><span>{i18n['userTask.message.stoptemp']}：</span></div>
              <Select
                showSearch
                filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
                style={{ width: '100%', fontSize: 12 }}
                placeholder={i18n['userTask.message.stoptemp']}
                value={model.msgStopTempId ? model.msgStopTempId : undefined}
                onChange={(e) => {
                  onChange('msgStopTempId', e);
                }}
                disabled={readOnly}
              >
                {msgDataList && msgDataList.map(item => (<Select.Option show={item.tplName} value={item.bzId}>{item.tplName}</Select.Option>))}
              </Select>
            </div>}
          <div className={styles.panelRow}>
            <div>
              {i18n['process.event.global']}：
              <Button className={styles.editBtn} disabled={readOnly} onClick={() => setMessageUserModalVisible(true)}>{i18n['tooltip.edit']}</Button>
            </div>
          </div>
        </div>
      </div>
      <DataTableModal title={i18n['process.event.global']}
        lang={lang}
        newRowKeyPrefix="message"
        cols={messageCols}
        data={model.eventContent}
        visible={messageUserModalVisible}
        onOk={(d) => {
          setMessageUserModalVisible(false);
          onChange('eventContent', d);
        }}
        onCancel={() => setMessageUserModalVisible(false)} />
    </>
  )
};

export default ProcessDetail;
