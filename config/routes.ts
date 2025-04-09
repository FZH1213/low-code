export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/flow-config',
    name: 'antd-chart',
    component: './FlowManger/FlowConfigList',
    // component: './AntdChart',
  },
  {
    name: '表单设计器',
    path: '/design-config/form-config',
    component: './FormConfig',
  },
  {
    name: '使用页面',
    path: '/design-config/preview',
    component: './Preview',
  },
  {
    name: '表单页面',
    path: '/common-form',
    component: './Template/CommonForm',
    routes: [
      {
        // path: '/common-form/InputTest1',
        component: '@/components/H5components/InputTest',
        props: {
          placeholder: '路由测试111',
        },
      },
      {
        // path: '/common-form/InputTest2',
        component: '@/components/H5components/InputTest',
        props: {
          placeholder: '路由测试222',
        },
      },
      {
        // path: '/common-form/InputTest3',
        component: '@/components/H5components/InputTest',
        props: {
          placeholder: '路由测试333',
        },
      },
    ],
  },
  {
    name: '列表页面',
    path: '/common-table',
    component: './Template/CommonTable',
  },
  {
    name: '高级列表',
    path: '/common-pro-table',
    component: './Template/CommonProTable',
  },
  {
    name: '元数据管理',
    path: '/dataManage',
    component: './DataManage/index.js',
  },

  {
    name: 'iframe容器',
    path: '/iframe-wrapper/:id',
    component: './IframeWrapper/index.js',
  },

  {
    path: '/businessManage',
    name: '接口管理',
    component: './BusinessManage',
  },
  {
    path: '/businessRule',
    name: '能力管理',
    component: './RulesManage',
  },

  {
    path: '/RulesManage',
    name: '能力管理',
    component: './RulesManage',
  },

  {
    path: '/user-management',
    name: '用户管理',
    component: './UserManagement',
  },
  {
    path: '/role-management',
    name: '角色管理',
    component: './RoleManagement',
  },

  {
    path: '/menu-management',
    name: '菜单管理',
    component: './MenuManagement',
  },
  {
    path: '/page-design',
    name: '页面设计',
    component: './PageDesign',
  },
  {
    path: '/organization-management',
    name: '机构管理',
    component: './Organization',
  },
  {
    // path: '/page-preview',
    path: '/page-preview/',
    name: '页面预览',
    component: './DesignPreview',
    // component: './DesignPreview/index',
    // layout: false,
  },
  {
    // path: '/page-preview',
    path: '/page-preview/:code',
    name: '页面预览',
    component: './DesignPreview',
    // component: './DesignPreview/index',
    // layout: false,
  },
  {
    path: '/businessConf',
    name: '业务配置',
    component: './BusinessConf',
  },
  {
    name: '菜单页面H5',
    path: '/system-management/menu-page-H5',
    component: './MenuPage',
    layout: false,
  },
  // 先使用铁塔的路由配置，提供菜单配置，用户配置，权限配置页面

  // {
  //   name: '操作流程',
  //   path: '/system-management/OperationProcess',
  //   component: './MockPage',
  // },
  // 测试全屏页面，for -H5
  // {
  //   name: '流程列表',
  //   path: '/system-management/flowList',
  //   component: './MockPage',
  //   layout: false,
  // },

  // {
  //   name: '菜单配置页面',
  //   path: '/system-management/menu-page-config-H5',
  //   component: './MenuPageConfig',
  // },
  {
    path: '/page-managelist',
    name: '页面管理列表',
    // component: './PageManageList',
    component: './PageManageList2',
  },
  // {
  //   path: '/Playgroundcode',
  //   name: '页面管理列表',
  //   component: './Playgroundcode/playground/main.tsx',
  // },
  {
    name: '定时任务管理',
    path: '/task-management',
    component: './TaskManagement',
  },

  /**
   * 摸板系统路由 sart-------------------------------------------------------------------------------------
   * 迁移时间20221125*/
  {
    name: '模板配置管理',
    path: '/reportFormTemplateManage',
    component: './ReportForm/ReportFormTemplateManage',
  },
  {
    name: '模板页面管理',
    path: '/reportFormManagePage',
    component: './ReportForm/ReportFormManagePage',
  },
  {
    name: '模板配置',
    path: '/manage-page/choice-sql',
    component: './ReportForm/ReportFormManagePage/ChoiceSQL',
    // layout: false,
  },
  {
    name: '选择模板',
    path: '/manage-page/choice-temp',
    component: './ReportForm/ReportFormManagePage/ChoiceTemplate',
  },
  {
    name: '列表模板2.1',
    path: '/report-manage/tableListReport/:code',
    component: './ReportForm/TempPage/TableListTemplate/index',
  },
  {//1.0
    name: '待办审核页面1.0',
    path: '/report-manage/TaskView1/:code',
    component: './ReportForm/TempPage/TaskView1/index',
  },
  {//2.0
    name: '待办审核页面2.0',
    path: '/report-manage/performanceTemplate/:code',
    component: './ReportForm/TempPage/performanceTemplate/index',
  },
  {
    name: '新增/编辑模板2.0',
    path: '/report-manage/ModalFormReport/:code',
    component: './ReportForm/TempPage/ModalFormTemplate/index',
  },
  {
    name: '图表展示模板2.1',
    path: '/report-manage/DiagramReport/:code',
    component: './ReportForm/TempPage/DiagramTempate/index',
  },
  {
    // 新增图表模板内容
    name: '图表模板2.2',
    path: '/report-manage/AnalyzeReport/:code',
    component: './ReportForm/TempPage/AnalyzeTemplate/index',
  },

  {
    name: '树形模板2.1',
    path: '/report-manage/TreeStructureReport/:code',
    component: './ReportForm/TempPage/TreeStructureTemplate/index',
  },
  {
    name: 'ERP编辑模板2.0',
    path: '/report-manage/DataManageReport/:code',
    component: './ReportForm/TempPage/DataManageTemplate1/index',
  },
  {
    name: '知识库模板2.0',
    path: '/report-manage/KnowledgeDataReport/:code',
    component: './ReportForm/TempPage/KnowledgeDataTemplate/index',
  },
  {
    name: '新增/编辑模板1.0(带附件)',
    path: '/report-manage/ModalFormProReport/:code',
    component: './ReportForm/TempPage/ModalFormProTemplate/index',
  },
  /* 摸板系统路由* end-------------------------------------------------------------------------------------*/

  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
