export interface IDefaultModel {
  id?: string;
  clazz?: 'start' | 'end' | 'gateway' | 'exclusiveGateway' | 'parallelGateway' | 'inclusiveGateway'
    | 'timerStart' | 'messageStart' | 'signalStart' | 'userTask' | 'scriptTask' | 'mailTask'
    | 'javaTask' | 'receiveTask' | 'timerCatch' | 'messageCatch' | 'signalCatch' | 'subProcess' | 'flow' | 'process';
  label?: string;
  x?: number;
  y?: number;
  active?: boolean;
  hideIcon?: boolean;
  eventContent?: object[];
  description?: string;
}
export interface IJavaModel extends IDefaultModel{
  javaClass?: string;
}
export interface IMailModel extends IDefaultModel {
  to?: string;
  subject?: string;
  content?: string;
}
export interface IUserModel extends IDefaultModel {
  nodeType?: string;
  assignType?: 'sequential'| 'parallel';
  // passrate?: number;
  //人员设置
  approverType?: string;
  approverParam?: string;
  // personType?: string;
  // personRoleId?: string;
  // personFormId?: string;
  // personUser?: string;
  // personRoleRule?: string;
  // personRuleId?: string;
  // personFormRule?: string;
  //设置流程
  // oneVeto?: boolean;
  // agreeSet?: boolean;
  // disagreeSet?: boolean;
  // withdrawSet?: boolean;
  // abortSet?: boolean;
  // abortSetOpinion?: boolean;
  // forWardSet?: boolean;
  // nextNodeSet?: boolean;
  //页面设置
  // formKey?: string;
  // initiateform?: string;
  // auditform?: string;
  // readform?: string;
  taskPage?: string;
  referPage?: string;
  auditPage?: string;
  toReadPage?: string;
  //抄送
  // copyForSet?: boolean;
  // copyForType?: string;
  // copyForRoleId?: string;
  // copyForRoleRule?: string;
  // copyForUser?: string;
  // copyForForm?: string;
  // //消息提醒
  // messageSet?: boolean;
  // messageTempId?: string;
  // msgEventContent?: object[];
  //交互设置
  // flowButtonPass?: boolean;
  // flowButtonNoPass?: boolean;
  // flowButtomDeliver?: boolean;
  // flowButtomAbandon?: boolean;
  // flowButtomSubmit?: boolean;
  // flowButtomRemark?: boolean;
  //审核类型
  // approveType?: string;
}
export interface IEndModel extends IDefaultModel {
  //传阅
  readSet?: boolean;
  readType?: string;
  readParam?: string;
  //消息提醒
  // msgEventContent?: object[];
  //传阅页面
  readPage?: string;
}
export interface IMessageModel extends IDefaultModel {
  message?: string;
}
export interface IReceiveModel extends IDefaultModel {
  waitState?: string;
  stateValue?: string;
}
export interface IScriptModel extends IDefaultModel {
  script?: string;
}
export interface ISignalModel extends IDefaultModel {
  signal?: string;
}
export interface ITimerModel extends IDefaultModel {
  cycle?: string;
  duration?: string;
}

export interface IFlowModel extends IDefaultModel {
  source?: string;
  target?: string;
  sourceAnchor?: number;
  targetAnchor?: number;
  conditionExpression?: string;
  // seq?: string;
  // reverse?: boolean;
  conExp?: string;
}
export interface IProcessModel extends IDefaultModel {
  //消息提醒
  messageSet?: boolean;
  messageTempId?: string;
  msgStopTempId?: string;
  // name?: string;
  // dataObjs?: object[];
  // signalDefs?: object[];
  // messageDefs?: object[];
}

export interface ISelectData {
  id?: string;
  name?: string;
}
export interface IAssociationformData {
  bzId?: string;
  bzPageType?: string;
  bzPageKey?: string;
  bzPageValue?: string;
}
export interface IUserListData {
  userId?: string;
  userName?: string;
  userType?: string;
  companyId?: string;
  nickName?: string;
  avatar?: string;
  password?: string;
  status: number;
}
export interface IRoleListData {
  key?: string;
  title?: string;
  pid?: string;
  chilren?: object[];
}
export interface IRuleListData {
  ruleDefId?: string;
  name?: string;
}

export interface IFormListData {
  key?: string;
  value?: string;
}

export interface IMsgListData {
  bzId?: string;
  tplName?: string;
}
