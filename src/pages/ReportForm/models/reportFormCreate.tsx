import { Effect, ImmerReducer, Reducer, Subscription } from 'umi';

export interface IndexModelState {
  sqlPageLevel: number;
  sqlData: any;
  tableColum: string;
  intfList: Array<[]>;
  remark: string;
  addSqlTableData: Array<[]>;
}

export interface IndexModelType {
  namespace: 'reportFormCreate';
  state: IndexModelState;
  effects: {
    query: Effect;
  };
  reducers: {
    // save: Reducer<IndexModelState>;
    // 启用 immer 之后
    setSqlPageLevel: ImmerReducer<IndexModelState>;
    resetSqlPageLevel: ImmerReducer<IndexModelState>;
    setSqlTableData: ImmerReducer<IndexModelState>;
    setAddSqlTableData: ImmerReducer<IndexModelState>;
  };
  subscriptions: { setup: Subscription };
  // pathname:any
}

const ReportFormCreateModel: IndexModelType = {
  namespace: 'reportFormCreate',

  state: {
    addSqlTableData: [],
    remark: '',
    intfList: [],
    tableColum: '',
    sqlPageLevel: 1,
    sqlData: [
      {
        rptName: '',
        intLvl: 1,
        intName: '',
        intType:'',
        intVal: '',
        intfIttrDescList: [],
        opeBut:[],
        topBut:[],
        initDataApi: '',
        // tplId: 0
      },
    ],
  },

  effects: {
    *query({ payload }, { call, put }) { },
  },
  reducers: {
    setSqlPageLevel(state, action) {
      return {
        ...state,
        ...action.payload,
      };
      // state.sqlPageLevel = action.payload;
    },
    setSqlTableData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
      // state.sqlPageLevel = action.payload;
    },
    setAddSqlTableData(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    resetSqlPageLevel(state, action) {
      return (
        {
          ...state,
          ...action.payload,
        } || null
      );
      // state.sqlPageLevel = 1;
      // state.sqlData = [
      //   {
      //     intCode: '',
      //     intLvl: 1,
      //     intName: '',
      //     intVal: '',
      //     intfIttrDescList: [],

      //     // tplId: 0
      //   },
      // ];
    },
    // save(state, action) {
    //   return {
    //     ...state,
    //     ...action.payload,
    //   };
    // },
    // 启用 immer 之后
    // save(state, action) {
    //   state.name = action.payload;
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      // return history.listen(({ pathname }) => {
      //   if (pathname === '/') {
      //     dispatch({
      //       type: 'query',
      //     });
      //   }
      // });
    },
  },
};

export default ReportFormCreateModel;
