export const ACCESS_TOKEN_KEY = 'access_token';

export const CFG_OLD_IP = 'http://183.6.112.101:18000';

export const DF_YMDHMS = 'YYYY.MM.DD HH:mm:ss';
export const DF_YMD = 'YYYY.MM.DD';
export const UPLOAD_DEFAULT_TIME_FORMAT = 'MM.DD HH:mm';

/**
 * 页面规范字段表
 */
export const PAGE_CODE: { [key: string]: string } = {
  /**
   * 全局变量
   */
  _VAR: '_var',

  /**
   * 表单前缀
   */
  _FORM_PREFIX: '_form_',
  /**
   * 刷新
   */
  RELOAD: 'reload',
  /**
   * 搜索
   */
  SEARCH: 'search',
  /**
   * 重置
   */
  RESET: 'reset',
};

/** 查询框本地存储key列表 */
export const LOCAL_STORE_KEYS: { [key: string]: string } = {
  /**
   * 内部报告列表
   */
  INTERNAL_REPORT_LIST: 'INTERNAL_REPORT_LIST',

  /**
   * 架构节点编码历史
   */
  STRUCT_CODE_LOG_LIST: 'STRUCT_CODE_LOG_LIST',

  /**
   * 待办列表
   */
  TODO_LIST: 'TODO_LIST',

  /**
   * 我发起的流程
   */
  INITIATED_PROCESS: 'INITIATED_PROCESS',
  /**
   * 待阅任务
   */
  TO_BE_READ: 'TO_BE_READ',

  /**
   * 历史已阅
   */
  TO_BE_READ_HISTROY: 'TO_BE_READ_HISTROY',
  /**
   * 研报预计待办
   */
  WILL_BE_PROCESS: 'WILL_BE_PROCESS',

  /**
   * 财务模型查询
   */
  FINANCIAL_MODEL_QUERY: 'FINANCIAL_MODEL_QUERY',

  /**
   * 同行报告列表
   */
  PEER_REPORT_LIST: 'PEER_REPORT_LIST',

  /**
   * 合规名单管理
   */
  COMPLIANCE_LIST: 'COMPLIANCE_LIST',
  /**
   * 风险关键字管理
   */
  RISK_KEYWORD: 'RISK_KEYWORD',
  /**
   * 执业证书管理
   */
  PRACTICING_CERTIFICATE: 'PRACTICING_CERTIFICATE',
  /**
   * 电话会议查询
   */
  TEL_MEETING: 'TEL_MEETING',
  /**
   * 公司属性配置
   */
  COMPANY_ATTRS_CONFIG: 'COMPANY_ATTRS_CONFIG',
  /**
   * 股票分管历史查询
   */
  CompanyConfigurationLogs: 'CompanyConfigurationLogs',

  /**
   * 默认分管单元配置
   */
  IndustryDefualt: 'IndustryDefualt',
  /**
   * 行业映射关系管理
   */
  IndustryMapSetting: 'IndustryMapSetting',
  /**
   * 股票池查询
   */
  StockPool: 'StockPool',
  /**
   * 股票调整历史查询
   */
  AdjustHistories: 'AdjustHistories',
  /**
   * 研究覆盖数配置
   */
  RearchCoveredSetting: 'RearchCoveredSetting',
  /**
   * 股票池收益展示
   */
  EarningsDisplay: 'EarningsDisplay',
  /**
   * 股票池收益配置
   */
  EarningsSetting: 'EarningsSetting',
  /**
   * 新股预分配
   */
  NewStocksPredistribution: 'NewStocksPredistribution',
  /**
   * 股票池查询-研究员端
   */
  StockPoolQuerResearcherSide_ONE: 'StockPoolQuerResearcherSide_ONE',
  StockPoolQuerResearcherSide_TWO: 'StockPoolQuerResearcherSide_TWO',
  /**
   * 机构信息
   */
  InstitutionalInformation: 'InstitutionalInformation',
  /**
   * 客户联系人
   */
  CustomerContact: 'CustomerContact',
  /**
   * 服务记录
   */
  ServiceRecordList: 'ServiceRecordList',

  /**
   * 推送验证
   */
  PushVerification: 'PushVerification',

  /**
   *人员管理
   */
  UserManagement: 'UserManagement',
  /**
   * 推送查询
   */
  PushQuery: 'PushQuery',
  /**
   * 数据操作日志
   */
  DataCurdLogManagement: 'DataCurdLogManagement',
  /**
   * 消息模版
   */
  // MessageTemplateList: 'MessageTemplateList',

  /**
   * 流程页面
   */
  pageList: 'pageList',
  /**
   * 流程监控
   */
  FlowList: 'FlowList',
  /**
   * 全流程查询
   */
  AllFlowView: 'AllFlowView',
  /**
   * 全流程查询明细
   */
  // TaskAllFlowView: 'TaskAllFlowView',

  /**
   * 流程审批管理
   */
  FlowNodeList: 'FlowNodeList',

  /**
   * 我的代审设置
   */
  PendingSettings: 'PendingSettings',

  /**
   * 定时任务管理
   */
  TaskManagement: 'TaskManagement',

  /**
   * 调度日志
   */
  TaskLog: 'TaskLog',

  /**
   * 模板参数管理
   */
  MsgTplParamMgr: 'MsgTplParamMgr',
  /**
   * 请求查询
   */
  MsgTplRequestMgr: 'MsgTplRequestMgr',
  /**
   * 消息发送查询
   */
  MsgTplSentMgr: 'MsgTplSentMgr',
  /**
   * 消息模版
   */
  MessageTemplateList: 'MessageTemplateList',
  /**
   * 数据库管理
   */
  DatabaseMgr: 'DatabaseMgr',

  /**
   * 存储过程管理
   */
  ProcduceMgr: 'ProcduceMgr',

  /**
   * 服务管理
   */
  ServiceMgr: 'ServiceMgr',

  /**
   * HTTP接口管理
   */
  HttpWrapperMgr: 'HttpWrapperMgr',

  /**
   * 接口调用日志管理
   */
  CallLogMgr: 'CallLogMgr',

  /**
   * 行政文档详情
   */
  AdministrativeWrapper: 'AdministrativeWrapper',

  /**
   * 员工通讯录
   */
  EmployeeAddressBook: 'EmployeeAddressBook',
  /**
   * 邮箱行业配置列表
   */
  EmailAct: 'EmailAct',
  /**
   * 邮件资讯查询
   */
  MailInformation: 'MailInformation',
};

/**
 * 流程状态
 */
export const PROCESS_STATUS: { [key: string]: string } = {
  /**
   * 编辑状态
   */
  '0': '编辑',
  /**
   * 提交
   */
  '1': '提交',
  /**
   * 审批中
   */
  '2': '审批中',
  /**
   * 审批通过
   */
  '10': '已通过',
  /**
   * 审批不通过
   */
  '20': '不通过',
  /**
   * 废弃
   */
  '30': '已废弃',
  /**
   * 驳回
   */
  '40': '已驳回',
};

/**
 * 组织架构节点类型
 */
export const STRUCT_NODE_TYPE = {
  /**
   * 一级部门
   */
  PRIMARY_SECTOR: '1',
  /**
   * 二级部门
   */
  SECONDARY_SECTOR: '2',
  /**
   * 大组
   */
  GROUP: '3',
  /**
   * 研究单元
   */
  RESEARCH_UNIT: '4',
  /**
   * 研究方向
   */
  RESEARCH_DIRECTION: '5',

  /**
   * 人员
   */
  PERSON: '-1',
};

/**
 * 模板系统 start-------------------------------------------------------------------------------------
 */
export const FILE_REQUEST_BASE = '/api/file/fileDown/downloadFileById';
/**
 * FormItem属性常用API
 */
export const FORM_ITEM_API = [
  'colon', //配合 label 属性使用，表示是否显示 label 后面的冒号
  'hasFeedback', //配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用
  'hidden', //是否隐藏字段（依然会收集和校验字段
  'initialValue', //设置子元素默认值
  'labelAlign', //标签文本对齐方式
  'labelCol', //label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}。
  'rules', //校验规则，设置字段的校验逻辑
  'required', //必填样式设置。如不设置，则会根据校验规则自动生成
  'wrapperCol', //输入控件设置布局样式时，使用该属性，用法同 labelCol
  'tooltip', //配置提示信息
  'help,', //输入框添加提示信息
];

/**
 * Table columns属性常用API  Column
 */
export const TABLE_COLUMN_API = [
  'align', //设置列的对齐方式
  'ellipsis', //超过宽度将自动省略
  'fixed', //列是否固定
  'width', //列宽度
];

/**
 * symbol属性下拉列表的形式
 */
export const SYMBOL_SELECT_OPTION = [
  { label: '=', value: '=' },
  { label: '>', value: '>' },
  { label: '<', value: '<' },
  { label: '<>', value: '<>' },
  { label: '>=', value: '>=' },
  { label: '<=', value: '<=' },
  { label: 'in', value: 'in' },
  { label: "like '", value: "like '" },
  { label: "like '%", value: "like '%" },
];

/**
 * 替换文件地址字符串
 */
export const REPLACE_FILE_PATH_STR =
  'aslkjdlkjiox!@#jsadjo2k*(asdljomoJSDFLODElkjsdfoienocposaoixkljklj1j78638753lkjsd';
// export const REPLACE_FILE_PATH_STR = 'http://192.168.30.179:8000/files'; //投标知识单独使用

//模板系统end-------------------------------------------------------------------------------------

export const authUrl =
  // 'http://192.168.5.107:8213/?redirectUrl=http%3A%2F%2F192.168.30.108%3A8000%2Fapi%2Fadmin%2Flogin%2FauthToken%3Fredirect%3Dhttp%3A%2F%2F192.168.30.108%3A8000%2Fant-design-pro%2Fuser%2Flogin';
  // 'http://192.168.5.107:8213/?redirectUrl=http%3A%2F%2F192.168.5.108%3A8002%2Fapi%2Fadmin%2Flogin%2FauthToken%3Fredirect%3Dhttp%3A%2F%2F192.168.5.108%3A8002%2Fant-design-pro%2Fuser%2Flogin';
  'http://192.168.5.107:8213/?redirectUrl=http%3A%2F%2F192.168.30.123%3A8000%2Fapi%2Fadmin%2Flogin%2FauthToken%3Fredirect%3Dhttp%3A%2F%2F192.168.30.123%3A8000%2Fant-design-pro%2Fuser%2Flogin';

// mqtt docker包单点配置：
// export const authUrl =
//   'http://192.168.5.107:8213/?redirectUrl=http%3A%2F%2F192.168.30.56%3A30805%2Fapi%2Fadmin%2Flogin%2FauthToken%3Fredirect%3Dhttp%3A%2F%2F192.168.30.56%3A30805%2Fant-design-pro%2Fuser%2Flogin';

// txad docker包单点配置：
// export const authUrl =
//   'http://192.168.5.107:8213/?redirectUrl=http%3A%2F%2F192.168.30.56%3A30810%2Fapi%2Fadmin%2Flogin%2FauthToken%3Fredirect%3Dhttp%3A%2F%2F192.168.30.56%3A30810%2Fant-design-pro%2Fuser%2Flogin';
