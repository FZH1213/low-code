import React, { Component } from 'react';
import Designer from '@/components/Workflow';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { getActFlowDefByFlowCode, saveReleaseFlow, fetchPageDefList } from './service.js';
import { Form, Button, message, Card } from 'antd';
import antdData from './data';
import InfoDetails from './components/InfoDetails';
@connect(({ flowMangerList }) => ({
  flowMangerList,
}))
export default class FlowConfigList extends Component {
  wfdRef = React.createRef();
  state = {
    jsonVa: [],
    flowId: 0,
    disabled: false,
    globalData: {},
    globalFlag: '0',
    initGlobal: {
      clazz: 'process',
      messageSet: false,
      messageTempId: '',
      msgStopTempId: '',
      eventContent: [],
    },
    isGlobal: '0',
    globalEvent: {},
    assform: [],
    flowDefData:{},
    flowCode:'',
    id:''
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { id,flowCode }= location.query;
    this.setState({flowCode,id})
    // 改成静态数据
    // if (location.state != undefined) {
    //     if (location.state.id != undefined) {
    //         const flowid = location.state.id
    //         this.fetchInitConfig(flowid);
    //     }
    // }
    // this.setState({ jsonVa: JSON.parse(antdData.extra.flowDetail.bzJsonValue) });
    this.fetchInitConfigOther();
    const params = {
      flowCode
    };
    getActFlowDefByFlowCode(params).then((res) => {
      if (res.code === 0) {
        if (res.data.hasOwnProperty('jsonValue')) {
          if (
            res.data.jsonValue != undefined &&
            res.data.jsonValue != null &&
            res.data.jsonValue != ''
          ) {
            const arr = JSON.parse(res.data.jsonValue);
            if (
              arr.globals != undefined &&
              JSON.stringify(arr.globals) !== '[{}]' &&
              JSON.stringify(arr.globals) !== '[[]]'
            ) {
              var globals = arr.globals[0];
              this.setState({
                initGlobal: globals,
                globalFlag: '1',
                globalEvent: globals,
                isGlobal: '0',
              });
            } else {
              this.setState({
                initGlobal: {
                  clazz: 'process',
                  messageSet: false,
                  messageTempId: '',
                  msgStopTempId: '',
                  eventContent: [],
                },
                globalFlag: '1',
              });
            }
            this.setState({ jsonVa: arr });
          }
        }
        this.setState({ flowDefData: res.data });
      }
    });
    this.requestPageDefList();
  }

  requestPageDefList = () => {
    const params = {
      limit: 100000,
      page: 1,
    };
    fetchPageDefList(params).then((res) => {
      if (res.code === 0) {
        if (res.data.records && res.data.records.length > 0) {
          res.data.records.map((item, index) => {
            item.bzId = item.pageUrl;
            item.bzPageValue = item.name;
          });
        }
        this.setState({ assform: res.data.records });
      }
    });
  };

  fetchInitConfig = (bizId) => {
    const { dispatch } = this.props;
    this.setState({ flowId: bizId });
    console.log(bizId);
    dispatch({
      type: 'flowMangerList/fetchconfigInit',
      payload: 'flowChartId=' + bizId,
      callback: (res) => {
        if (res.code === 0) {
          if (
            res.extra.flowDetail.bzJsonValue != undefined &&
            res.extra.flowDetail.bzJsonValue != null &&
            res.extra.flowDetail.bzJsonValue != ''
          ) {
            const arr = JSON.parse(res.extra.flowDetail.bzJsonValue);
            if (
              arr.globals != undefined &&
              JSON.stringify(arr.globals) !== '[{}]' &&
              JSON.stringify(arr.globals) !== '[[]]'
            ) {
              var globals = arr.globals[0];
              this.setState({
                initGlobal: globals,
                globalFlag: '1',
                globalEvent: globals,
                isGlobal: '0',
              });
            } else {
              this.setState({
                initGlobal: {
                  clazz: 'process',
                  messageSet: false,
                  messageTempId: '',
                  msgStopTempId: '',
                  eventContent: [],
                },
                globalFlag: '1',
              });
            }
            this.setState({ jsonVa: arr });
          }
        }
      },
    });
  };

  fetchInitConfigOther = () => {
    const { dispatch } = this.props;
    //获取关联表单
    // dispatch({
    //     type: 'flowMangerList/fetchFormKey',
    // });
    //获取人员列表
    dispatch({
      type: 'flowMangerList/fetchGetUserList',
    });
    //获取角色列表
    dispatch({
      type: 'flowMangerList/fetchGetRoleList',
    });
    //获取特定表
    // dispatch({
    //     type: 'flowMangerList/fetchGetFormList',
    // });
    //获取规则列表
    dispatch({
      type: 'flowMangerList/fetchGetRuleList',
    });
    //获取消息模板列表
    // dispatch({
    //     type: 'flowMangerList/fetchMsgList',
    // });
  };

  handleSave = () => {
    const { dispatch } = this.props;
    const { flowId, globalData, isGlobal, globalEvent, flowCode, id } = this.state;
    // this.setState({ disabled: true });
    let bpm = this.wfdRef.current.graph.save();
    // console.log(bpm);
    let bpmVal = this.handleChackBpm(bpm);
    let global = [globalData];
    if (isGlobal == '0' || isGlobal == '1') {
      bpmVal.globals = [globalEvent];
    } else {
      bpmVal.globals = global;
    }
    console.log(bpmVal);

    const jsonstr = JSON.stringify(bpmVal);
    const values = {
      jsonString: jsonstr,
      // id: flowId,
      id,
      flowCode,
    };
    console.log(values);
    // dispatch({
    //     type: 'flowMangerList/fetchConfig',
    //     payload: values,
    //     callback: res => {
    //         if (res.code === 0) {
    //             this.props.history.push("/system-management/flow-manger/flowList");
    //             message.success("操作成功！");
    //         } else {
    //             message.error(res.message);
    //         }
    //         this.setState({ disabled: false });
    //     }
    // });
    saveReleaseFlow(values).then((res) => {
      if (res.code === 0) {
        // this.props.history.push("/system-management/flow-manger/flowList");
        message.success('操作成功！');
      } else {
        message.error(res.message);
      }
      this.setState({ disabled: false });
    });
  };
  handleglobal = (value) => {
    this.setState({ globalData: value });
  };
  handleglobalFlag = (value) => {
    this.setState({ globalFlag: value });
  };

  //全局默认事件
  handleIsGlobal = (val) => {
    this.setState({ isGlobal: val });
  };

  //替换编辑器节点id
  handleUpdateTaskId = (bpmNode, bpmEdges) => {
    let uuid = this.generateUUID();
    let nodeId = bpmNode.id;
    let newNodeId = bpmNode.clazz + uuid;
    for (var i = 0; i < bpmEdges.length; i++) {
      if (bpmEdges[i].source == nodeId) {
        bpmEdges[i].source = newNodeId;
      }
      if (bpmEdges[i].target == nodeId) {
        bpmEdges[i].target = newNodeId;
      }
    }
    bpmNode.id = newNodeId;
  };

  //生成唯一ID
  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  //检查bpm值
  handleChackBpm = (bpm) => {
    //去除重复线
    let bpmEdges = bpm.edges;
    for (var i = 0; i < bpmEdges.length; i++) {
      bpmEdges[i].id = 'edge' + i;
      for (var j = i + 1; j < bpmEdges.length; j++) {
        if (bpmEdges[i].source == bpmEdges[j].source && bpmEdges[i].target == bpmEdges[j].target) {
          bpmEdges.splice(j, 1);
          j--;
        }
      }
    }

    //替换唯一节点id
    let bpmNode = bpm.nodes;
    for (var i = 0; i < bpmNode.length; i++) {
      this.handleUpdateTaskId(bpmNode[i], bpmEdges);
    }
    bpm.edges = bpmEdges;
    bpm.nodes = bpmNode;

    return bpm;
  };

  render() {
    const {
      flowMangerList: {
        formKeyData,
        userListData,
        roleListData,
        ruleListData,
        formListData,
        msgListData,
      },
    } = this.props;
    const { isJson, jsonVa, disabled, globalData, initGlobal, globalFlag, isGlobal, assform, flowDefData } =
      this.state;

    return (
      <>
        <Card
            title={"流程标题"}
        >
        {/* 详情信息 */}
        <InfoDetails flowDefData={flowDefData}/>
        {/* <Button style={{ float: 'right', marginRight: '10px', marginTop: '8px' }}>
                    <Link to="/system-management/flow-manger/flowList">返回</Link>
                </Button> */}
        <Button
          className="long"
          style={{ float: 'right', marginRight: '10px', marginTop: '8px', width: '96px' }}
          onClick={() => {
            history.go(-1);
          }}
        >
          返回
        </Button>
        <Button
          type="primary"
          style={{ float: 'right', marginRight: '10px', marginTop: '8px', width: '96px' }}
          onClick={this.handleSave}
          disabled={disabled}
        >
          保存
        </Button>
        {/* <Button style={{ float: 'right', marginRight: '10px', marginTop: '8px' }} onClick={() => this.wfdRef.current.graph.saveXML()}>导出XML</Button> */}
        <Designer
          data={jsonVa}
          ref={this.wfdRef}
          height={680}
          mode={'edit'}
          lang="zh"
          handleglobal={this.handleglobal}
          initGlobal={initGlobal}
          handleglobalFlag={this.handleglobalFlag}
          globalFlag={globalFlag}
          assform={assform}
          userList={userListData}
          roleList={roleListData}
          ruleList={ruleListData}
          formList={formListData}
          msgList={msgListData}
          handleIsGlobal={this.handleIsGlobal}
          isGlobal={isGlobal}
        />
        {/* {formKeyData.formKey} */}
        </Card>
      </>
    );
  }
}

// const WarpForm = Form.create()(FlowConfigList);

// export default connect()(WarpForm);
