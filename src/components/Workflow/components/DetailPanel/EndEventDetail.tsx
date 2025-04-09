import styles from "./index.less";
import React, { useContext, useState, useRef } from "react";
import { Button, Switch, Select, Modal } from "antd";
import DataTableModal from "./DataTableModal";
import DefaultDetail from './DefaultDetail';
import LangContext from "../../util/context";
import { IEndModel, IUserListData, IRoleListData, IRuleListData, IFormListData, IMsgListData, IAssociationformData } from '../../types';

// 导入可编辑表格组件，嵌入消息模版编辑弹框
// import EditableTable from './UserTaskDetailEditModal'

export interface EndProps {
  model: IEndModel;
  onChange: (...args: any[]) => any;
  readOnly: boolean;
  userList: IUserListData[];
  roleList: IRoleListData[];
  ruleList: IRuleListData[];
  formList: IFormListData[];
  msgList: IMsgListData[];
  assform: IAssociationformData[];
}

const EndEventDetail: React.FC<EndProps> = ({ model, assform, userList, roleList, ruleList, formList, msgList, onChange, readOnly = false, }) => {
  if (model.eventContent === undefined) { onChange('eventContent', []); }
  if (model.readSet === undefined) { onChange('readSet', false) }
  // if (model.messageSet === undefined) { onChange('messageSet', false) }
  // if (model.msgEventContent === undefined) { onChange('msgEventContent', []); }

  var selectUserData: any[] = [];
  // var personRoleList: any[] = [];
  var selectRuleData: any[] = [];
  // var personFormList: any[] = [];
  // var msgDataList: any[] = [];
  var readPageData: any[] = [];

  if (userList.length > 0) {
    selectUserData = userList;
  }
  // if (roleList.length > 0) {
  //   personRoleList = roleList;
  // }
  if (ruleList.length > 0) {
    selectRuleData = ruleList;
  }
  // if (formList.length > 0) {
  //   personFormList = formList;
  // }
  // if (msgList.length > 0) {
  //   msgDataList = msgList;
  // }

  if (assform != undefined && assform.length > 0) {
    assform.map((item) => {
      readPageData.push(item)
    })
  }

  // // 获取可编辑表单子组件的实例
  // const editTableRef = useRef(null);

  // //消息配置弹框的显示和隐藏标志
  // const [messageEditModalShow, setMessageEditModalShow] = useState(false);

  // const showMessageEditModal = () => {
  //   setMessageEditModalShow(true);
  // }

  // // 获取表单数据的方法
  // const fetchEditData = () => {
  //   // console.log('获取表', editTableRef.current.emitData())

  //   let emitMessageData = editTableRef.current.emitData();

  //   console.log('获取可编辑表格的数据', emitMessageData);
  //   onChange('msgEventContent', emitMessageData);
  //   // 隐藏弹框 (测试的时候，临时注释掉下面一行)
  //   setMessageEditModalShow(false);
  // }


  const { i18n, lang } = useContext(LangContext);
  const title = i18n['endEvent'];

  const [messageEndModalVisible, setMessageEndModalVisible] = useState(false);
  const messageCols = [
    {
      title: i18n['process.event.type'], dataIndex: 'event', editable: true,
      editor: {
        type: 'select',
        options: [
          { key: 'end', value: 'end' },
          // {key: 'processInstance',value:'processInstance'},
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

          {/* 传阅设置 */}
          <div className={styles.panelRow}>
            <div>{i18n['userTask.read.set']}：
              <Switch
                size={'small'}
                checked={model.readSet ? model.readSet : false}
                onChange={(e) => {
                  onChange('readSet', e);
                  onChange('readType', null);
                  onChange('readUser', null);
                  onChange('readRule', null);
                }}
              />
            </div>
          </div>

          {model.readSet == true &&
            <div>
              <div className={styles.panelRow}>
                <span>{i18n['userTask.read.type']}：</span>
                <Select
                  style={{ width: '100%', fontSize: 12 }}
                  placeholder={i18n['userTask.read.type']}
                  defaultValue={model.readType}
                  value={model.readType}
                  onChange={(e) => {
                    onChange('readType', e);
                    onChange('readUser', null);
                    onChange('readRule', null);
                  }}
                  disabled={readOnly}
                >
                  <Select.Option value="user">{i18n['userTask.read.type.user']}</Select.Option>
                  <Select.Option value="rule">{i18n['userTask.read.type.rule']}</Select.Option>
                </Select>
              </div>

              {/* 选择抄送角色 */}
              {/* {(model.copyForType == 'role') &&
                <div className={styles.panelRow}>
                  <div><span>{i18n['userTask.copyfor.roleid']}：</span></div>
                  <Select
                    mode="multiple"
                    showSearch
                    filterOption={(input, option: any) => { return option.key.indexOf(input) >= 0 }}
                    style={{ width: '100%', fontSize: 12 }}
                    placeholder={i18n['userTask.copyfor.roleid']}
                    // defaultValue={model.copyForRoleId}
                    value={model.copyForRoleId ? model.copyForRoleId : undefined}
                    onChange={(e) => {
                      onChange('copyForRoleId', e);
                    }}
                    disabled={readOnly}
                  >
                    {personRoleList && personRoleList.map(item => (<Select.Option key={item.roleName} value={item.roleId}>{item.roleName}</Select.Option>))}
                  </Select>
                </div>
              } */}

              {/* 指定传阅人员 */}
              {(model.readType == 'user') &&
                <div className={styles.panelRow}>
                  <div><span>{i18n['userTask.read.type.user']}：</span></div>
                  <Select
                    mode="multiple"
                    showSearch
                    filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
                    style={{ width: '100%', fontSize: 12 }}
                    placeholder={i18n['userTask.read.type.user']}
                    value={model.readParam ? model.readParam : undefined}
                    onChange={(e) => {
                      onChange('readParam', e);
                    }}
                    disabled={readOnly}
                  >
                    {selectUserData && selectUserData.map(item => (<Select.Option show={item.userName} value={item.userId}>{item.userName}</Select.Option>))}
                  </Select>
                </div>}

              {/* 选择传阅规则 */}
              {(model.readType == 'rule') &&
                <div className={styles.panelRow}>
                  <div>
                    <span >{i18n['userTask.read.type.rule']}：</span>
                  </div>
                  <Select
                    showSearch
                    filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
                    style={{ width: '100%', fontSize: 12 }}
                    placeholder={i18n['userTask.read.type.rule']}
                    defaultValue={model.readParam}
                    value={model.readParam}
                    onChange={(e) => {
                      onChange('readParam', e);
                    }}
                    disabled={readOnly}
                  >
                    {selectRuleData && selectRuleData.map(item => (<Select.Option show={item.name} value={item.code}>{item.name}</Select.Option>))}
                  </Select>
                </div>
              }

              {/* 指定抄送审核指定表 */}
              {/* {(model.copyForType == 'form') &&
                <div className={styles.panelRow}>
                  <div><span>{i18n['userTask.copyfor.rule']}：</span></div>
                  <Select
                    showSearch
                    filterOption={(input, option: any) => { return option.key.indexOf(input) >= 0 }}
                    style={{ width: '100%', fontSize: 12 }}
                    placeholder={i18n['userTask.copyfor.rule']}
                    defaultValue={model.copyForForm}
                    value={model.copyForForm}
                    onChange={(e) => {
                      onChange('copyForForm', e);
                    }}
                    disabled={readOnly}
                  >
                    {personFormList && personFormList.map(item => (<Select.Option key={item.value} value={item.key}>{item.value}</Select.Option>))}
                  </Select>
                </div>} */}

              {/* 传阅页面 */}
              <div className={styles.panelRow}>
                <div>{i18n['userTask.read.page']}：</div>
                <Select
                  showSearch
                  filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
                  style={{ width: '100%', fontSize: 12 }}
                  placeholder={i18n['userTask.read.page']}
                  defaultValue={model.readPage}
                  onChange={(e) => onChange('readPage', e)}
                  disabled={readOnly}
                >
                  {readPageData && readPageData.map(item => (<Select.Option show={item.bzPageValue} value={item.bzId}>{item.bzPageValue}</Select.Option>))}
                </Select>
              </div>
            </div>}

          {/* 消息提醒设置 */}
          {/* <div className={styles.panelRow}>
            <div>{i18n['userTask.message.set']}：
            <Switch
                size={'small'}
                checked={model.messageSet ? model.messageSet : false}
                onChange={(e) => {
                  onChange('messageSet', e); onChange('messageTempId', null);
                }}
              />
            </div>
          </div> */}

          {/* 消息模板 */}
          {/* {(model.messageSet == true) &&
            <div className={styles.panelRow}>
              <div><span>{i18n['userTask.message.temp']}：</span></div>
              <Select
                showSearch
                filterOption={(input, option: any) => { return option.key.indexOf(input) >= 0 }}
                style={{ width: '100%', fontSize: 12 }}
                placeholder={i18n['userTask.message.temp']}
                // defaultValue={model.copyForUser}
                value={model.messageTempId ? model.messageTempId : undefined}
                onChange={(e) => {
                  onChange('messageTempId', e);
                }}
                disabled={readOnly}
              >
                {msgDataList && msgDataList.map(item => (<Select.Option key={item.tplName} value={item.bzId}>{item.tplName}</Select.Option>))}
              </Select>
            </div>} */}

          <div className={styles.panelRow}>
            <div>
              {i18n['process.event']}：
              <Button className={styles.editBtn} disabled={readOnly} onClick={() => setMessageEndModalVisible(true)}>{i18n['tooltip.edit']}</Button>
            </div>
          </div>

          {/* 点击弹出消息配置弹框 */}
          {/* <div style={{ marginLeft: '12px', fontSize: 12 }}>
            <span>消息提醒：</span>
            <span><Button className={styles.editBtn} onClick={showMessageEditModal}>编辑</Button></span>
          </div> */}

        </div>
      </div>
      <DataTableModal title={i18n['process.event']}
        lang={lang}
        newRowKeyPrefix="message"
        cols={messageCols}
        data={model.eventContent}
        visible={messageEndModalVisible}
        onOk={(d) => {
          setMessageEndModalVisible(false);
          onChange('eventContent', d);
        }}
        onCancel={() => setMessageEndModalVisible(false)} />


      {/* 消息配置弹框 */}
      {/* <Modal
        title={'消息提醒配置'}
        destroyOnClose
        width={900}
        bodyStyle={{
          padding: '24px 24px 10px 24px'
        }}
        defaultVal={model.msgEventContent}
        visible={messageEditModalShow}
        onCancel={() => { setMessageEditModalShow(false) }}

        onOk={fetchEditData}
      >
        <EditableTable defaultVal={model.msgEventContent} ref={editTableRef}></EditableTable>
      </Modal> */}
    </>
  )
};

export default EndEventDetail;
