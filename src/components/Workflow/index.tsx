import * as React from 'react';
import styles from './index.less';
import G6 from '@antv/g6/lib';
import { getShapeName } from './util/clazz';
import locale from './locales/index';
import Command from './plugins/command';
import Toolbar from './plugins/toolbar';
import AddItemPanel from './plugins/addItemPanel';
import CanvasPanel from './plugins/canvasPanel';
import { exportXML } from './util/bpmn';
import LangContext from './util/context';
import DetailPanel from './components/DetailPanel';
import ItemPanel from './components/ItemPanel';
import ToolbarPanel from './components/ToolbarPanel';
import registerShape from './shape';
import registerBehavior from './behavior';
import {
  IDefaultModel,
  IProcessModel,
  IUserListData,
  IRoleListData,
  IRuleListData,
  IFormListData,
  IMsgListData,
  IAssociationformData,
} from './types';
registerShape(G6);
registerBehavior(G6);

export interface DesignerProps {
  /** 画布高度 */
  height?: number;
  /** 是否只显示中间画布 */
  isView?: boolean;
  /** 模式为只读或编辑 */
  mode: 'default' | 'view' | 'edit';
  /** 语言 */
  lang?: 'en' | 'zh';
  /** 流程数据 */
  data: any;
  /** 关联表单 */
  assform?: IAssociationformData[];
  /** 指定用户 */
  userList?: IUserListData[];
  /** 角色 */
  roleList?: IRoleListData[];
  /** 关联规则 */
  ruleList?: IRuleListData[];
  /** 特定表 */
  formList?: IFormListData[];
  /** 消息模板 */
  msgList?: IMsgListData[];
  /** 全局配置 */
  initGlobal?: IProcessModel[];
  /** 全局标识 */
  handleIsGlobal: any;
  isGlobal?: any;
}

export interface DesignerStates {
  selectedModel: IDefaultModel;
  processModel: IProcessModel;
}

export default class Designer extends React.Component<DesignerProps, DesignerStates> {
  static defaultProps = {
    height: 500,
    isView: false,
    mode: 'edit',
    lang: 'zh',
  };
  private readonly pageRef: React.RefObject<any>;
  private readonly toolbarRef: React.RefObject<any>;
  private readonly itemPanelRef: React.RefObject<any>;
  private readonly detailPanelRef: React.RefObject<any>;
  private resizeFunc: (...args: any[]) => any;
  public graph: any;
  public cmdPlugin: any;

  constructor(cfg: DesignerProps) {
    super(cfg);
    this.pageRef = React.createRef();
    this.toolbarRef = React.createRef();
    this.itemPanelRef = React.createRef();
    this.detailPanelRef = React.createRef();
    this.resizeFunc = () => {};
    this.state = {
      selectedModel: {},
      processModel: {
        clazz: 'process',
        messageSet: false,
        messageTempId: '',
        msgStopTempId: '',
        eventContent: [],
        // id: '',
        // name: '',
        // dataObjs: [],
        // signalDefs: [],
        // messageDefs: [],
      },
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.data !== this.props.data) {
      if (this.graph) {
        this.graph.changeData(this.initShape(this.props.data));
        this.graph.setMode(this.props.mode);
        // this.graph.emit('canvas:click');
        if (this.cmdPlugin) {
          this.cmdPlugin.initPlugin(this.graph);
        }
        if (this.props.isView) {
          this.graph.fitView(5);
        }
      }
    }
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.initGlobal != undefined) {
      if (nextProps.globalFlag == '1') {
        var data = nextProps.initGlobal;
        nextProps.handleglobalFlag('0');
        this.setState({ processModel: data });
      }
    }
  }

  componentDidMount() {
    const { isView, mode } = this.props;
    const height = this.props.height - 1;
    const width = this.pageRef.current.offsetWidth;
    let plugins = [];
    if (!isView) {
      this.cmdPlugin = new Command();
      const toolbar = new Toolbar({ container: this.toolbarRef.current });
      const addItemPanel = new AddItemPanel({ container: this.itemPanelRef.current });
      const canvasPanel = new CanvasPanel({ container: this.pageRef.current });
      plugins = [this.cmdPlugin, toolbar, addItemPanel, canvasPanel];
    }
    this.graph = new G6.Graph({
      plugins: plugins,
      container: this.pageRef.current,
      height: height,
      width: width,
      modes: {
        default: ['drag-canvas', 'clickSelected'],
        view: [],
        edit: [
          'drag-canvas',
          'hoverNodeActived',
          'hoverAnchorActived',
          'dragNode',
          'dragEdge',
          'dragPanelItemAddNode',
          'clickSelected',
          'deleteItem',
          'itemAlign',
          'dragPoint',
          'brush-select',
        ],
      },
      defaultEdge: {
        type: 'flow-polyline-round',
      },
    });
    this.graph.saveXML = (createFile = true) =>
      exportXML(this.graph.save(), this.state.processModel, createFile);
    if (isView) {
      this.graph.setMode('view');
    } else {
      this.graph.setMode(mode);
    }
    this.graph.data(this.props.data ? this.initShape(this.props.data) : { nodes: [], edges: [] });
    this.graph.render();
    if (isView && this.props.data && this.props.data.nodes) {
      this.graph.fitView(5);
    }
    this.initEvents();
  }

  initShape(data) {
    if (data && data.nodes) {
      return {
        nodes: data.nodes.map((node) => {
          return {
            type: getShapeName(node.clazz),
            ...node,
          };
        }),
        edges: data.edges,
      };
    }
    return data;
  }

  initEvents() {
    this.graph.on('afteritemselected', (items) => {
      if (items && items.length > 0) {
        let item = this.graph.findById(items[0]);
        if (!item) {
          item = this.getNodeInSubProcess(items[0]);
        }
        this.setState({ selectedModel: { ...item.getModel() } });
      } else {
        this.setState({ selectedModel: this.state.processModel });
      }
    });
    const page = this.pageRef.current;
    const graph = this.graph;
    const height = this.props.height - 1;
    this.resizeFunc = () => {
      graph.changeSize(page.offsetWidth, height);
    };
    window.addEventListener('resize', this.resizeFunc);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunc);
    if (this.graph) {
      this.graph.getNodes().forEach((node) => {
        node.getKeyShape().stopAnimate();
      });
    }
  }

  onItemCfgChange(key: any, value: any) {
    const { handleglobal, handleIsGlobal, isGlobal } = this.props;
    const items = this.graph.get('selectedItems');
    if (items.length == 0 && isGlobal == '1') {
      handleIsGlobal('2');
    }

    if (items && items.length > 0) {
      let item = this.graph.findById(items[0]);
      if (!item) {
        item = this.getNodeInSubProcess(items[0]);
      }
      if (this.graph.executeCommand) {
        this.graph.executeCommand('update', {
          itemId: items[0],
          updateModel: { [key]: value },
        });
      } else {
        this.graph.updateItem(item, { [key]: value });
      }
      this.setState({ selectedModel: { ...item.getModel() } });
    } else {
      const canvasModel = { ...this.state.processModel, [key]: value };
      handleglobal(canvasModel);
      this.setState({ selectedModel: canvasModel });
      this.setState({ processModel: canvasModel });
    }
  }

  processUpdate(key: any, value: any) {
    const filter = this.state.processModel;
    filter[key] = value;
    this.setState({ processModel: filter });
  }

  getNodeInSubProcess(itemId: any) {
    const subProcess = this.graph.find('node', (node: any) => {
      if (node.get('model')) {
        const clazz = node.get('model').clazz;
        if (clazz === 'subProcess') {
          const containerGroup = node.getContainer();
          const subGroup = containerGroup.subGroup;
          const item = subGroup.findById(itemId);
          return subGroup.contain(item);
        } else {
          return false;
        }
      } else {
        return false;
      }
    });
    if (subProcess) {
      const group = subProcess.getContainer();
      return group.getItem(subProcess, itemId);
    }
    return null;
  }

  render() {
    const height = this.props.height;
    const {
      isView,
      mode,
      userList,
      roleList,
      ruleList,
      formList,
      msgList,
      assform,
      lang,
      handleIsGlobal,
      isGlobal,
    } = this.props;
    const { selectedModel, processModel } = this.state;
    // console.log('selectedModel',selectedModel);
    // console.log('assform',assform);
    
    // const { signalDefs, messageDefs } = processModel;
    const i18n = locale[lang.toLowerCase()];
    const readOnly = mode !== 'edit';
    return (
      <LangContext.Provider value={{ i18n, lang }}>
        <div className={styles.root}>
          {!isView && <ToolbarPanel ref={this.toolbarRef} />}
          <div style={{ display: 'flex' }} className={styles.tank_itemPanel_box}>
            {!isView && <ItemPanel ref={this.itemPanelRef} height={height} />}
            <div
              className={styles.tank_canvasPanel_box}
              style={{
                width: isView ? '100%' : '70%',
                borderBottom: isView ? 0 : null,
                height: '100%',
              }}
            >
              <div
                ref={this.pageRef}
                className={`${styles.canvasPanel} ${styles.tank_canvasPanel}`}
                style={{ height }}
              />
            </div>
            {!isView && (
              <DetailPanel
                ref={this.detailPanelRef}
                height={height}
                width="100%"
                model={selectedModel}
                readOnly={readOnly}
                userList={userList}
                roleList={roleList}
                ruleList={ruleList}
                formList={formList}
                msgList={msgList}
                assform={assform}
                handleIsGlobal={handleIsGlobal}
                isGlobal={isGlobal}
                // signalDefs={signalDefs}
                // messageDefs={messageDefs}
                onChange={(key, val) => {
                  this.onItemCfgChange(key, val);
                }}
                // onChange={(key, val) => { this.processUpdate(key, val) }}
              />
            )}
          </div>
        </div>
      </LangContext.Provider>
    );
  }
}
