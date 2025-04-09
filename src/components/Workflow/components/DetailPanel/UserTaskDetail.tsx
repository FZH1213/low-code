import styles from "./index.less";
import { Checkbox, Input, Select, Button, InputNumber, Switch, TreeSelect, Modal } from "antd";
import React, { useContext, useState, useRef } from "react";
import moment from "moment";
import DefaultDetail from "./DefaultDetail";
import DataTableModal from "./DataTableModal";
import LangContext from "../../util/context";
import { IUserModel, IAssociationformData, IUserListData, IRoleListData, IRuleListData, IFormListData, IMsgListData } from '../../types';

// 导入可编辑表格组件，嵌入消息模版编辑弹框
// import EditableTable from './UserTaskDetailEditModal'

export interface UserProps {
  model: IUserModel;
  onChange: (...args: any[]) => any;
  readOnly: boolean;
  userList: IUserListData[];
  roleList: IRoleListData[];
  ruleList: IRuleListData[];
  formList: IFormListData[];
  msgList: IMsgListData[];
  assform: IAssociationformData[];
}
const UserTaskDetail: React.FC<UserProps> = ({ model, assform, userList, roleList, ruleList, formList, msgList, onChange, readOnly = false, }) => {
  if (model.eventContent === undefined) { onChange('eventContent', []); }
  // if (model.msgEventContent === undefined) { onChange('msgEventContent', []); }
  // if (model.oneVeto === undefined) { onChange('oneVeto', false) }
  // if (model.agreeSet === undefined) { onChange('agreeSet', false) }
  // if (model.disagreeSet === undefined) { onChange('disagreeSet', false) }
  // if (model.withdrawSet === undefined) { onChange('withdrawSet', false) }
  // if (model.abortSet === undefined) { onChange('abortSet', false) }
  // if (model.abortSetOpinion === undefined) { onChange('abortSetOpinion', false) }
  // if (model.forWardSet === undefined) { onChange('forWardSet', false) }
  // if (model.nextNodeSet === undefined) { onChange('nextNodeSet', false) }
  // if (model.copyForSet === undefined) { onChange('copyForSet', false) }
  // if (model.messageSet === undefined) { onChange('messageSet', false) }
  // if (model.flowButtonPass === undefined) { onChange('flowButtonPass', true) }
  // if (model.flowButtonNoPass === undefined) { onChange('flowButtonNoPass', true) }
  // if (model.flowButtomDeliver === undefined) { onChange('flowButtomDeliver', true) }
  // if (model.flowButtomAbandon === undefined) { onChange('flowButtomAbandon', true) }
  // if (model.flowButtomSubmit === undefined) { onChange('flowButtomSubmit', false) }
  // if (model.flowButtomRemark === undefined) { onChange('flowButtomRemark', true) }

  if (model.assignType === undefined) { onChange('assignType', 'sequential') }

  var personRoleList: any[] = [];
  var personUserList: any[] = [];
  var personFormList: any[] = [];
  var personRoleRuleList: any[] = [];
  // var msgDataList: any[] = [];
  var assoformData: any[] = [];
  var initiateformDate: any[] = [];
  var auditformDate: any[] = [];
  var readformDate: any[] = [];

  if (roleList.length > 0) {
    personRoleList = roleList;
  }
  if (userList.length > 0) {
    console.log('userList',userList)
    personUserList = userList;
  }
  if (formList.length > 0) {
    personFormList = formList;
  }
  if (ruleList.length > 0) {
    personRoleRuleList = ruleList;
  }
  // if (msgList.length > 0) {
  //   msgDataList = msgList;
  // }
  if (assform != undefined && assform.length > 0) {
    assform.map((item) => {
      // if (item.bzPageType == '1') { readformDate.push(item) }
      // if (item.bzPageType == '2' || item.bzPageType == '3') { assoformData.push(item) }
      // if (item.bzPageType == '4') { initiateformDate.push(item) }
      // if (item.bzPageType == '5') { auditformDate.push(item) }
      readformDate.push(item)
      assoformData.push(item)
      initiateformDate.push(item)
      auditformDate.push(item)
    })
  }

  const { i18n, lang } = useContext(LangContext);
  const title = i18n['userTask'];

  const [messageUserModalVisible, setMessageUserModalVisible] = useState(false);

  // //消息配置弹框的显示和隐藏标志
  // const [messageEditModalShow, setMessageEditModalShow] = useState(false)

  // // 获取可编辑表单子组件的实例
  // const editTableRef = useRef(null)

  // const showMessageEditModal = () => {
  //   setMessageEditModalShow(true)
  // }


  const messageCols = [
    {
      title: i18n['process.event.type'], dataIndex: 'event', editable: true,
      editor: {
        type: 'select',
        options: [
          { key: 'create', value: 'create' },
          { key: 'assignment', value: 'assignment' },
          { key: 'complete', value: 'complete' },
          { key: 'delete', value: 'delete' },
        ]
      }
    },
    { title: i18n['process.event.content'], dataIndex: 'expression', editable: true },
  ];

  // 获取表单数据的方法
  // const fetchEditData = () => {
  //   // console.log('获取表', editTableRef.current.emitData())

  //   let emitMessageData = editTableRef.current.emitData()

  //   console.log('获取可编辑表格的数据', emitMessageData)
  //   onChange('msgEventContent', emitMessageData);
  //   // 隐藏弹框 (测试的时候，临时注释掉下面一行)
  //   setMessageEditModalShow(false)

  // }

  return (
    <>
      <div data-clazz={model.clazz} className={styles.propswrapper}>
        <div className={styles.panelTitle}>{title}</div>
        <div className={styles.panelBody}>
          {/* 标题 */}
          <DefaultDetail model={model} onChange={onChange} readOnly={readOnly} />

          {/* 审核类型 */}
          <div className={styles.panelRow}>
            <div>
              <span>{i18n['userTask.assignType']}：</span>
            </div>
            <Select
              style={{ width: '100%', fontSize: 12 }}
              placeholder={i18n['userTask.assignType.placeholder']}
              defaultValue={model.assignType}
              value={model.assignType}
              onChange={(e) => {
                onChange('personType', null);
                onChange('assignType', e);
              }}
              disabled={readOnly}
            >
              <Select.Option value="sequential">{i18n['userTask.assignType.sequential']}</Select.Option>
              <Select.Option value="parallel">{i18n['userTask.assignType.parallel']}</Select.Option>
            </Select>
          </div>

          {/* 节点类型 */}
          {/* <div className={styles.panelRow}>
            <div>
              <span>{i18n['userTask.nodeType']}：</span>
            </div>
            <Select
              style={{ width: '100%', fontSize: 12 }}
              placeholder={i18n['userTask.nodeType']}
              defaultValue={model.nodeType}
              value={model.nodeType}
              onChange={(e) => {
                onChange('nodeType', e);
              }}
              disabled={readOnly}
            >
              <Select.Option value="1">{i18n['userTask.nodeType.approve']}</Select.Option>
              <Select.Option value="2">{i18n['userTask.nodeType.sendback']}</Select.Option>
              <Select.Option value="5">{i18n['userTask.nodeType.feedback']}</Select.Option>
              <Select.Option value="6">{i18n['userTask.nodeType.goldstock']}</Select.Option>
              <Select.Option value="7">{i18n['userTask.nodeType.authoaudit']}</Select.Option>
              <Select.Option value="8">{i18n['userTask.nodeType.directoraudit']}</Select.Option>
              <Select.Option value="9">{i18n['userTask.nodeType.qualityaudit']}</Select.Option>
              <Select.Option value="10">{i18n['userTask.nodeType.complianceaudit']}</Select.Option>
              <Select.Option value="11">{i18n['userTask.nodeType.salesaudit']}</Select.Option>
              <Select.Option value="12">{i18n['userTask.nodeType.syschange']}</Select.Option>
              <Select.Option value="13">{i18n['userTask.nodeType.specialaudit']}</Select.Option>
              <Select.Option value="14">{i18n['userTask.nodeType.firstauthor']}</Select.Option>
            </Select>
          </div> */}

          {/* {model.assignType === 'parallel' &&
            <div className={styles.panelRow}>
              <div>{i18n['userTask.counterSignPassRate']}：</div>
              <InputNumber style={{ width: '40%', fontSize: 12 }}
                value={model.passrate}
                min={1} max={99} precision={2}
                formatter={value => `${value}%`}
                onChange={(value) => {
                  onChange('passrate', value)
                }}
                disabled={readOnly}
              />
              <Checkbox onChange={(e) => onChange('oneVeto', e.target.checked)} defaultChecked={false}
                disabled={readOnly} checked={!!model.oneVeto} style={{ marginLeft: '10%' }}>
                {i18n['userTask.veto']}
              </Checkbox>
            </div>
          } */}

          <div className={styles.panelRow}>
            <div>
              <span>{i18n['userTask.personType']}：</span>
            </div>

            {/* 选择是角色，指定人员，特定表 */}
            <Select
              style={{ width: '100%', fontSize: 12 }}
              placeholder={i18n['userTask.personType']}
              defaultValue={model.approverType}
              value={model.approverType}
              onChange={(e) => {
                onChange('approverType', e); 
                // onChange('personRoleId', null);
                onChange('approverParam', null); 
                // onChange('approverParam', null);
                // onChange('personRoleRule', null);
                // onChange('personFormRule', null);
              }}
              disabled={readOnly}
            >
              <Select.Option value="role">{i18n['userTask.personType.role']}</Select.Option>
              <Select.Option value="user">{i18n['userTask.personType.user']}</Select.Option>
              {/* <Select.Option value="form">{i18n['userTask.personType.form']}</Select.Option> */}
            </Select>
          </div>
          {/* 根据上面的选择，供其选择角色 */}
          {/* {(model.approverType == 'role') && <div className={styles.panelRow}>
            <div>
              <span>{i18n['userTask.personType.role']}：</span>
            </div>
            <Select
              style={{ width: '100%', fontSize: 12 }}
              placeholder={i18n['userTask.personType.role.placeholder']}
              showSearch
              filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
              defaultValue={model.personRoleId}
              value={model.personRoleId}
              onChange={(e) => {
                // onChange('assignValue', []);
                onChange('personRoleId', e);
              }}
              disabled={readOnly}
            >
              {personRoleList && personRoleList.map(item => (<Select.Option show={item.roleName} value={item.roleId}>{item.roleName}</Select.Option>))}
            </Select>
          </div>} */}
          {/* 根据上面的选择，供其选择特定表 */}
          {/* {(model.approverType == 'form') && <div className={styles.panelRow}>
            <div>
              <span >{i18n['userTask.personType.form']}：</span>
            </div>
            <Select
              style={{ width: '100%', fontSize: 12 }}
              placeholder={i18n['userTask.personType.form.placeholder']}
              showSearch
              filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
              defaultValue={model.approverParam}
              value={model.approverParam}
              onChange={(e) => {
                // onChange('assignValue', []);
                onChange('approverParam', e);
              }}
              disabled={readOnly}
            >
              {personFormList && personFormList.map(item => (<Select.Option show={item.value} value={item.key}>{item.value}</Select.Option>))}
            </Select>
          </div>} */}

          {/* 选择指定人员 */}
          {(model.approverType == 'user') &&
            <div className={styles.panelRow}>
              <div>{i18n['userTask.personType.user']}：</div>
              <Select
                style={{ width: '100%', fontSize: 12 }}
                mode="multiple"
                showSearch
                filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
                placeholder={i18n['userTask.personType.user.placeholder']}
                // optionFilterProp="children"
                // defaultValue={model.personUser?model.personUser: undefined}
                value={model.approverParam ? model.approverParam : undefined}
                onChange={(e) => {console.log('e11',e) ; onChange('approverParam', e)}}
                disabled={readOnly}
              >
                {personUserList && personUserList.map(item => (<Select.Option show={item.userName} value={item.userId}>{item.userName}</Select.Option>))}
              </Select>
            </div>}

          {/* 选择关联规则-角色 */}
          {(model.approverType == 'role') &&
            <div className={styles.panelRow}>
              <div>{i18n['userTask.personType.rule']}：</div>
              <Select
                style={{ width: '100%', fontSize: 12 }}
                showSearch
                filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
                placeholder={i18n['userTask.personType.rule.placeholder']}
                // defaultValue={model.personRoleRule}
                // value={model.personRoleRule}
                defaultValue={model.approverParam}
                value={model.approverParam}
                onChange={(e) => {
                  // onChange('assignValue', []);
                  // onChange('personRoleRule', e);
                  onChange('approverParam', e);
                }}
                disabled={readOnly}
              >
                {/* {personRoleRuleList && personRoleRuleList.map(item => (<Select.Option show={item.name} value={item.ruleDefId}>{item.name}</Select.Option>))} */}
                {personRoleRuleList && personRoleRuleList.map(item => (<Select.Option show={item.name} value={item.code}>{item.name}</Select.Option>))}
              </Select>
            </div>}

          {/* 抄送设置 */}
          {/* <div className={styles.panelRow}>
            <div>{i18n['userTask.copyfor.set']}：
              <Switch
                size={'small'}
                checked={model.copyForSet ? model.copyForSet : false}
                onChange={(e) => {
                  onChange('copyForSet', e); onChange('copyForType', null);
                  onChange('copyForRoleId', null); onChange('copyForRoleRule', null);
                  onChange('copyForUser', null); onChange('copyForForm', null);
                }}
              />
            </div>
          </div> */}

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
                filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
                style={{ width: '100%', fontSize: 12 }}
                placeholder={i18n['userTask.message.temp']}
                // defaultValue={model.copyForUser}
                value={model.messageTempId ? model.messageTempId : undefined}
                onChange={(e) => {
                  onChange('messageTempId', e);
                }}
                disabled={readOnly}
              >
                {msgDataList && msgDataList.map(item => (<Select.Option show={item.tplName} value={item.bzId}>{item.tplName}</Select.Option>))}
              </Select>
            </div>} */}

          {/* 待办页面 */}
          <div className={styles.panelRow}>
            <div>{i18n['userTask.associationform']}：</div>
            <Select
              showSearch
              filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
              style={{ width: '100%', fontSize: 12 }}
              placeholder={i18n['userTask.associationform']}
              // defaultValue={model.formKey}
              // onChange={(e) => onChange('formKey', e)}
              defaultValue={model.taskPage}
              onChange={(e) => onChange('taskPage', e)}
              disabled={readOnly}
            >
              {assoformData && assoformData.map(item => (<Select.Option show={item.bzPageValue} value={item.bzId}>{item.bzPageValue}</Select.Option>))}
            </Select>
          </div>
          {/* 我发起的页面 */}
          <div className={styles.panelRow}>
            <div>{i18n['userTask.initiateform']}：</div>
            <Select
              showSearch
              filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
              style={{ width: '100%', fontSize: 12 }}
              placeholder={i18n['userTask.initiateform']}
              // defaultValue={model.initiateform}
              // onChange={(e) => onChange('initiateform', e)}
              defaultValue={model.referPage}
              onChange={(e) => onChange('referPage', e)}
              disabled={readOnly}
            >
              {initiateformDate && initiateformDate.map(item => (<Select.Option show={item.bzPageValue} value={item.bzId}>{item.bzPageValue}</Select.Option>))}
            </Select>
          </div>
          {/* 我审核的页面 */}
          <div className={styles.panelRow}>
            <div>{i18n['userTask.auditform']}：</div>
            <Select
              showSearch
              filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
              style={{ width: '100%', fontSize: 12 }}
              placeholder={i18n['userTask.auditform']}
              // defaultValue={model.auditform}
              // onChange={(e) => onChange('auditform', e)}
              defaultValue={model.auditPage}
              onChange={(e) => onChange('auditPage', e)}
              disabled={readOnly}
            >
              {auditformDate && auditformDate.map(item => (<Select.Option show={item.bzPageValue} value={item.bzId}>{item.bzPageValue}</Select.Option>))}
            </Select>
          </div>
          {/* 待阅页面 */}
          <div className={styles.panelRow}>
            <div>{i18n['userTask.readform']}：</div>
            <Select
              showSearch
              filterOption={(input, option: any) => { return option.show.indexOf(input) >= 0 }}
              style={{ width: '100%', fontSize: 12 }}
              placeholder={i18n['userTask.readform']}
              // defaultValue={model.readform}
              // onChange={(e) => onChange('readform', e)}
              defaultValue={model.toReadPage}
              onChange={(e) => onChange('toReadPage', e)}
              disabled={readOnly}
            >
              {readformDate && readformDate.map(item => (<Select.Option show={item.bzPageValue} value={item.bzId}>{item.bzPageValue}</Select.Option>))}
            </Select>
          </div>

          {/* 审核类型 */}
          {/* <div className={styles.panelRow}>
            <div>{i18n['userTask.approve.type']}：</div>
            <Select
              style={{ width: '100%', fontSize: 12 }}
              placeholder={i18n['userTask.approve.type']}
              defaultValue={model.approveType}
              value={model.approveType}
              onChange={(e) => {
                if (e == '2') {
                  onChange('flowButtonPass', false); onChange('flowButtonNoPass', false); onChange('flowButtomDeliver', false);
                  onChange('flowButtomAbandon', false); onChange('flowButtomSubmit', false); onChange('flowButtomRemark', false);
                }
                onChange('approveType', e);
              }}
              disabled={readOnly}
            >
              <Select.Option value="1">{i18n['userTask.approve.defalut']}</Select.Option>
              <Select.Option value="2">{i18n['userTask.approve.customize']}</Select.Option>
            </Select>
          </div> */}

          {/* 流程描述 */}
          {/* <div className={styles.panelRow}>
            <div>{i18n['description']}：</div>
            <Input.TextArea style={{ width: '100%', fontSize: 12 }}
              value={model.description}
              onChange={(e) => onChange('description', e.target.value)}
              disabled={readOnly}
            />
          </div> */}
          <div className={styles.panelRow}>
            <div>
              {i18n['process.event']}：
              <Button className={styles.editBtn} disabled={readOnly} onClick={() => setMessageUserModalVisible(true)} >{i18n['tooltip.edit']}</Button>
            </div>
          </div>

          {/* 点击弹出消息配置弹框 */}
          {/* <div style={{ marginLeft: '12px', fontSize: 12 }}>
            <span>消息提醒：</span>
            <span><Button onClick={showMessageEditModal} style={{ fontSize: 12 }}>编辑</Button></span>
          </div> */}

          {/* 流程相关设置 */}
          {/* {model.approveType == '1' && <div className={styles.panelRow}>
            <div>
              <span>{i18n['userTask.flowbutton.set']}：</span>
            </div>
            <div>
              <Checkbox onChange={(e) => onChange('flowButtonPass', e.target.checked)}
                disabled={readOnly} style={{ marginTop: '2%' }} checked={!!model.flowButtonPass}>
                {i18n['userTask.flowbutton.pass']}
              </Checkbox>
            </div>
            <div>
              <Checkbox onChange={(e) => onChange('flowButtonNoPass', e.target.checked)}
                disabled={readOnly} style={{ marginTop: '2%' }} checked={!!model.flowButtonNoPass}>
                {i18n['userTask.flowbutton.nopass']}
              </Checkbox>
            </div>
            <div>
              <Checkbox onChange={(e) => onChange('flowButtomDeliver', e.target.checked)}
                disabled={readOnly} style={{ marginTop: '2%' }} checked={!!model.flowButtomDeliver}>
                {i18n['userTask.flowbutton.deliver']}
              </Checkbox>
            </div>
            <div>
              <Checkbox onChange={(e) => onChange('flowButtomAbandon', e.target.checked)}
                disabled={readOnly} style={{ marginTop: '2%' }} checked={!!model.flowButtomAbandon}>
                {i18n['userTask.flowbutton.abandon']}
              </Checkbox>
            </div>
            <div>
              <Checkbox onChange={(e) => onChange('flowButtomSubmit', e.target.checked)}
                disabled={readOnly} style={{ marginTop: '2%' }} checked={!!model.flowButtomSubmit}>
                {i18n['userTask.flowbutton.submit']}
              </Checkbox>
            </div>
            <div>
              <Checkbox onChange={(e) => onChange('flowButtomRemark', e.target.checked)}
                disabled={readOnly} style={{ marginTop: '2%' }} checked={!!model.flowButtomRemark}>
                {i18n['userTask.flowbutton.remark']}
              </Checkbox>
            </div>
          </div>} */}

        </div>
      </div>
      <DataTableModal title={i18n['process.event']}
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

export default UserTaskDetail;
