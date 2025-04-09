import {
    queryFlowList, AddFlow, StartrstopFlow, queryConfigflow,
    SaveFlow, releaseFlow, StartFlow, AccomplishFlow,
    queryFormKey, getUserList, getRoleList, getFormList,
    getRuleList, getMsgList, handleDeleteFlow
} from '@/services/api';

export default {
    namespace: 'flowMangerList',

    state: {
        data: [],
        initData: {},
        formKeyData: {},
        userListData: [],
        roleListData: [],
        ruleListData: [],
        formListData: [],
        msgListData: [],
    },

    effects: {
        *fetchInit({ payload, callback }, { call, put }) {
            const response = yield call(queryFlowList, payload);
            if (response.code == 0) {
                yield put({
                    type: 'dataSave',
                    payload: response.data,
                });
            }
        },
        *fetchFormKey({ payload, callback }, { call, put }) {
            const response = yield call(queryFormKey, payload);
            if (response.code == 0) {
                yield put({
                    type: 'formKeyDataSave',
                    payload: response.extra,
                });
            }
        },
        *fetchAddflow({ payload, callback }, { call, put }) {
            const response = yield call(AddFlow, payload);
            if (callback) callback(response);
        },
        *fetchstartOrstop({ payload, callback }, { call, put }) {
            const response = yield call(StartrstopFlow, payload);
            if (callback) callback(response);
        },

        *fetchconfigInit({ payload, callback }, { call, put }) {
            const response = yield call(queryConfigflow, payload);
            if (callback) callback(response);
        },
        *fetchConfig({ payload, callback }, { call, put }) {
            const response = yield call(SaveFlow, payload);
            if (callback) callback(response);
        },

        *fetchRelease({ payload, callback }, { call, put }) {
            const response = yield call(releaseFlow, payload);
            if (callback) callback(response);
        },

        *fetchStart({ payload, callback }, { call, put }) {
            const response = yield call(StartFlow, payload);
            if (callback) callback(response);
        },
        *fetchAccomplish({ payload, callback }, { call, put }) {
            const response = yield call(AccomplishFlow, payload);
            if (callback) callback(response);
        },

        *fetchGetUserList({ payload, callback }, { call, put }) {
            const response = yield call(getUserList, payload);
            if (response.code == 0) {
                yield put({
                    type: 'userListDataSave',
                    payload: response.data,
                });
            }
        },
        *fetchGetRoleList({ payload, callback }, { call, put }) {
            const response = yield call(getRoleList, payload);
            if (response.code == 0) {
                yield put({
                    type: 'roleListDataSave',
                    payload: response.data,
                });
            }
        },
        *fetchGetFormList({ payload, callback }, { call, put }) {
            const response = yield call(getFormList, payload);
            if (response.code == 0) {
                yield put({
                    type: 'formListDataSave',
                    payload: response.data,
                });
            }
        },
        *fetchGetRuleList({ payload, callback }, { call, put }) {
            const response = yield call(getRuleList, payload);
            if (response.code == 0) {
                yield put({
                    type: 'ruleListDataSave',
                    payload: response.data,
                });
            }
        },
        *fetchMsgList({ payload, callback }, { call, put }) {
            const response = yield call(getMsgList, payload);
            if (response.code == 0) {
                yield put({
                    type: 'msgDataSave',
                    payload: response.data,
                });
            }
        },
        *fetchDeleteFlow({ payload, callback }, { call, put }) {
            const response = yield call(handleDeleteFlow, payload);
            if (response.code == 0) {
                yield put({
                    type: 'msgDataSave',
                    payload: response.data,
                });
            }
            if (callback) callback(response);
        },

    },

    reducers: {
        dataSave(state, action) {
            return {
                ...state,
                data: action.payload,
            };
        },
        formKeyDataSave(state, action) {
            return {
                ...state,
                formKeyData: action.payload,
            };
        },
        userListDataSave(state, action) {
            return {
                ...state,
                userListData: action.payload,
            };
        },
        roleListDataSave(state, action) {
            return {
                ...state,
                roleListData: action.payload,
            };
        },
        ruleListDataSave(state, action) {
            return {
                ...state,
                ruleListData: action.payload,
            };
        },
        formListDataSave(state, action) {
            return {
                ...state,
                formListData: action.payload,
            };
        },
        msgDataSave(state, action) {
            return {
                ...state,
                msgListData: action.payload,
            };
        },
        resetData(state, action) {
            return {
                ...state,
                data: [],
            };
        },

    },
};
