import React, { useRef, useState, useEffect } from 'react';
import { PageContainer } from '@/components/pro/pro-layout';
import ProCard from '@ant-design/pro-card';
import { Tabs, Modal } from 'antd';
import {
  Card,
  Form,
  Row,
  Tree,
  Col,
  Divider,
  Typography,
  Input,
  Space,
  Table,
  Button,
  Drawer,
  Popconfirm,
  message,
  getCategoryText,
} from '@/components/base';
import SearchTree, { SearchTreeInstance } from '@/components/base/SearchTree';
import api from './services/businessRules';
import AddBusiness from './model/AddBusiness';
import UpdataBusiness from './model/UpdataBusiness';
import UpdataBusinessRules from './model/UpdataBusinessRules';
import UpdataBusinessRules2 from './model/UpdataBusinessRules2';
import { GLOBAL_VALUE } from '@/utils/globalValue';
import {
  PlusOutlined,
  PropertySafetyFilled,
  DeleteOutlined,
  FormOutlined,
} from '@ant-design/icons';

// 页面高度
const ProCardMH = { minHeight: 'calc(100vh - 150px)' };
const colSpan = { md: 4, lg: 4, xl: 4, xxl: 4 };
// 新增抽屉组件宽度
const DrawerWith = 350;
const DrawerRuleWith = 500;
// 新增抽屉组件方向
const DrawerPlacement = 'right';
interface CRef {
  getData: () => void;
}
// 输出属性
// export type BusinessRule1 = {};
let getdata = {};
const BusinessRule = (props: { [key: string]: any }) => {
  const cRef = useRef<CRef>(null); //创建调用更新树形数据方法
  const [businessData, setExbusinessData] = useState<any>([]); // 树状数据
  const [nodeData, setNodeData] = useState<any>(); //点击树状节点数据
  const [isRuleType, setisRuleType] = useState<number>();
  const [businessListDate, setbunsinessDate] = useState<any>(); // 业务规则节点列表数据
  const [columnsShow, setColumnsShow] = useState<number>(1);
  const [businessRuleBus, setBusinessRuleBus] = useState<any>(); // 查看是业务规则节点的业务
  const [selectKey, setSelectKey] = useState(''); // 左侧树状图选中的key值
  const [BusinessTreeKey, setBusinessTreeKey] = useState<any>();
  const [cuRuleNodeRule, setCuRuleNodeRule] = useState<any>({}); //规则详情
  const [RuleDataList, setRuleDataList] = useState<any>();
  const [addBus, setaddBus] = useState<boolean>(); // 业务新增抽屉
  const [updataBus, setupdataBus] = useState<boolean>(); // 业务修改抽屉
  const [updataBusinessRule, setupdataBusinessRule] = useState<boolean>(); // 规则修改
  const [pidName, setPidName] = useState<any>(); // 根据pid获取父级业务
  //多次点击置灰
  const [subDisable, setsubDisable] = useState<boolean>(false);
  // 初始加载
  useEffect(() => {
    // 获取树状数据
    onBusinessTree();
    // get(nodeData)
  }, []);

  // 调用获取更新树形数据方法
  const handleClick = async () => {
    if (cRef.current) {
      await cRef.current.getData();
    }
  };
  // 添加业务
  const addBusiness = async () => {
    setsubDisable(true);
    setTimeout(() => {
      setsubDisable(false);
    }, 2000);
    console.log('isRuleType: ', isRuleType);

    if (isRuleType === 1) {
      message.warning('不能为规则节点添加业务');
      setaddBus(false);
    } else {
      setaddBus(true);
    }
  };

  // 关闭业务新增抽屉
  const addBusClose = () => {
    setaddBus(false);
  };
  // 添加业务抽屉
  const addBusinessForm = () => {
    return (
      <AddBusiness
        businessData={businessData}
        selectKey={selectKey}
        setaddBus={setaddBus}
        handleClick={handleClick}
        businessListDate={businessListDate}
        onBusinessTree={onBusinessTree}
      />
    );
  };
  // 修改业务
  const updateBusiness = () => {
    setupdataBus(true);
  };
  // 关闭修改业务抽屉
  const updataBusClose = () => {
    setupdataBus(false);
  };
  // 修改业务抽屉
  const updataBusinessForm = () => {
    return (
      <UpdataBusiness
        initialValues={businessListDate}
        businessData={businessData}
        selectKey={selectKey}
        setupdataBus={setupdataBus}
        getbusinessTableData={getbusinessTableData}
      />
    );
  };
  // 删除业务
  const deleteBusiness = async () => {
    console.log('删除的节点key: ', selectKey);

    let res = await api.deleteBusinessRule(selectKey);
    if (res.code == 0) {
      message.success('删除成功');
      await onBusinessTree();
    } else {
      message.error('删除规则节点失败');
    }
  };

  // 点击修改规则
  const updataBusinessRules = async () => {
    console.log('修改规则的isRuleType：', isRuleType);

    if (isRuleType != 1) {
      message.warning('不能为非规则节点修改规则');
      setupdataBusinessRule(false);
    } else {
      await getbusinessRulesLst(selectKey);
      setupdataBusinessRule(true);
    }
  };
  // 修改规则抽屉
  const updataBusinessRulesForm = () => {
    return (
      // <UpdataBusinessRules
      //     cuRuleNodeRule={cuRuleNodeRule}
      //     setupdataBusinessRule={setupdataBusinessRule}
      // />

      <UpdataBusinessRules2
        cuRuleNodeRule={cuRuleNodeRule}
        setupdataBusinessRule={setupdataBusinessRule}
        RuleDataList={RuleDataList}
        selectKey={selectKey}
      />
    );
  };
  // 关闭修改规则抽屉
  const updataBusinessRuleClose = () => {
    setupdataBusinessRule(false);
  };
  // 删除规则节点
  const delRules = async () => {
    if (isRuleType != 1) {
      message.warning('请删除规则节点');
    } else {
      let res = await api.deleteBusinessRule(selectKey);
      if (res.code == 0) {
        message.success('删除成功');
        await onBusinessTree();
      } else {
        message.error('删除规则节点失败');
      }
    }
  };

  // 遍历树状数据比对 isRuleType
  const getIsRuleType = async (nodeData: any, key: any) => {
    // console.log('比对isRuleTyle的树状数据: ', nodeData);

    nodeData.map(async (e: any) => {
      if (e.key === key && e.isRuleType === 1) {
        // ruleType = 1
        await setisRuleType(1);
      } else if (e.key === key && e.isRuleType === 2) {
        // ruleType = 2
        await setisRuleType(2);
        // rule = 2
      } else if (e.key === key && e.isRuleType === 0) {
        // ruleType = 0
        await setisRuleType(0);
      }
      if (e.children) {
        getIsRuleType(e.children, key);
      }
    });
    // console.log("ruleType", ruleType);
    // return ruleType
  };

  // 递归遍历匹配 pid 取父级业务
  const getFatherPname = (nodeData: any, pid: any) => {
    nodeData.map((e) => {
      if (e.key == pid) {
        setPidName(e.name);
      }
      if (e.children) {
        getFatherPname(e.children, pid);
      }
    });
  };
  // 获取从子組件派发过来的选中树状key值
  const getSelectTreeKey = async (key: any, e: any, isRuleType: any) => {
    if (key && key.length && !!key.length) {
      console.log('父组件获取的选中key值', key[0]);
      await setSelectKey(key[0]);
      await getbusinessTableData(key[0]);
      getIsRuleType(nodeData, key[0]);
      // await getbusinessRulesLst(selectKey)
    } else {
      console.log('获取选中的key值失败');
    }
  };

  // 请求业务节点规则详情
  const getbusinessRulesLst = async (data: any) => {
    // 拿到业务id
    let businessId = data;
    let rulesData: any = [];
    let ruledataList: any = [];
    let cuRuleNodeList: any = { cuRuleNodes: [] };
    // let businessRuleData : any = {};
    const res = await api.getbusinesslist(businessId);
    if (res.code === 0) {
      console.log('业务规则节点' + businessId + '列表', res);
      ruledataList = res.data.cuRuleNodeList;
      // setRuleDataList(ruledataList)
      // debugger
      // const {name,num,nodeType,dealEvent,description,resultName} = [...res.extra.cuRuleNodeList[0]
      if (ruledataList.length > 0) {
        ruledataList.map((e) => {
          let businessRuleData: any = {};
          businessRuleData.name = e.name;
          // if(e.nodeType == 0){
          //     businessRuleData.nodeType = '普通类型'
          // }else{
          //     businessRuleData.nodeType = 'sql类型'
          // }

          // businessRuleData.nodeType = e.nodeType
          businessRuleData.dealEvent = e.dealEvent;
          businessRuleData.description = e.description;
          businessRuleData.num = e.num;
          businessRuleData.resultName = e.resultName;
          businessRuleData.id = e.id;
          rulesData.push(businessRuleData);
          businessRuleData = {};
        });
      } else {
        let businessRuleData: any = {};
        businessRuleData.id = businessId;
        // cuRuleNodeList.cuRuleNodes[0].push(businessListDate)
        // cuRuleNodeList.cuRuleNodes = businessRuleData
        // setCuRuleNodeRule(cuRuleNodeList)
        // setRuleDataList(businessRuleData)
      }
      cuRuleNodeList.cuRuleNodes = rulesData;
      setCuRuleNodeRule(cuRuleNodeList);
      setRuleDataList(rulesData);
    }
  };

  // 请求业务表格数据
  const getbusinessTableData = async (data: any) => {
    // console.log("node: ",node);
    setBusinessTreeKey(data);
    await getBusinessRuleData(data);
    setColumnsShow(1);
  };

  // 点击业务规则节点查看规则的业务
  const getBusinessRuleData = async (data: any) => {
    // let cuRuleId = e.node.key ? e.node.key.split(".") : ["1"]
    console.log('key', data);

    let cuRuleId = data;

    const res = await api.getBusinessRuleList(cuRuleId);
    if (res.code === 0) {
      console.log(res);
      let pid = res.data.pid;
      setbunsinessDate(res.data);
      // let busi = {pid: ''}
      let Busi: any = {};
      let dataList = [];
      // let pid = '父级业务'
      let business = {
        pid: '',
        name: '',
        type: '',
        description: '',
        ruleDefId: '',
        isAutoDeal: '',
      };
      // debugger
      await getFatherPname(nodeData, pid);
      business.pid = pidName;
      // business.pid = res.data.pid
      business.name = res.data.name;
      // business.type = res.data.type
      if (res.data.type == 2) {
        business.type = '否';
      } else {
        business.type = '是';
      }
      business.description = res.data.description;
      business.ruleDefId = res.data.ruleDefId;
      if (res.data.isAutoDeal == 2) {
        business.isAutoDeal = '否';
      } else {
        business.isAutoDeal = '是';
      }
      dataList.push(business);
      console.log('datalist: ', dataList);
      setBusinessRuleBus(dataList);
    } else {
      message.error(res.error);
    }
  };

  // 获取树状数据
  const onBusinessTree = async () => {
    let res = await api.getBusinessTree();
    console.log(res);

    if (res.code === 0) {
      if (res.data.length != 0) {
        // 输入树状数据
        // let data = res.data;
        setNodeData(res.data);
        // setBusinessTreeData(data[0].children);
        // console.log('树状data', data);
        let TreeData = getResTreeData(res.data);
        console.log('树状data', TreeData);
        // 拿到需要的数据传到树状
        // setExbusinessData(data.length != 0 && data[0].children ? data[0].children : []);
        setExbusinessData(TreeData);
        console.log('树状data--', businessData);
        // console.log('树状data--key',businessData.key);
      }
    } else {
      message.error(res.message);
    }
  };

  // 整合树状数据
  const getResTreeData = (data: any, FatherType = '') => {
    return data.map((item: any) => {
      // 根据地区的标识添加icon
      // if (item.type === 'CITY') {
      //     item.icon = 'GlobalOutlined';
      // } else if (item.type === 'AREA') {
      //     item.icon = 'EnvironmentOutlined';
      // } else if (item.type === 'STORAGE') {
      //     item.icon = 'DashboardOutlined';
      // };
      if (item.children) {
        return { ...item, children: getResTreeData(item.children) };
      }
    });
  };

  // 业务规则按钮（添加，修改，删除）
  const tableButton = () => {
    return (
      <Space>
        <>
          <Button
            type="primary"
            style={{ marginBottom: '10px' }}
            onClick={addBusiness}
            icon={<PlusOutlined />}
          >
            添加业务
          </Button>
        </>
        <>
          <Button
            type="primary"
            style={{ marginBottom: '10px' }}
            onClick={updateBusiness}
            icon={<FormOutlined />}
          >
            修改业务
          </Button>
        </>
        {/* {删除业务按钮} */}
        <Button
          type="primary"
          style={{ marginBottom: '10px' }}
          onClick={deleteBusiness}
          icon={<DeleteOutlined />}
        >
          删除业务
        </Button>
      </Space>
    );
  };

  // 业务规则节点的业务和规则表格
  const tableList = () => {
    if (businessRuleBus && columnsShow === 1) {
      return (
        <Table
          size={GLOBAL_VALUE.TABLE_SISE}
          columns={columns}
          dataSource={businessRuleBus}
          // size={}
          rowKey="description"
          pagination={{
            onChange: (page, PageSize) => {
              getBusinessRuleData(BusinessTreeKey);
            },
            showTotal: (total, range) => GLOBAL_VALUE.TABLE_SHOWTOTAL(total, range),
          }}
        />
      );
      // } if (businessRuleBus && columnsShow === 2) {
      //     return (
      //         <Table
      //             bordered
      //             columns={columns}
      //             // dataSource={}
      //             // size={}
      //             pagination={{
      //                 onChange: (page, PageSize) => {
      //                     updataBusinessRules()
      //                 }
      //             }}
      //         />
      //     )
      // }
    }
  };
  // 点击业务规则
  // const bunsinessDate = () => {

  // }
  const columns = [
    {
      title: '父级业务',
      dataIndex: 'pid',
    },
    {
      title: '本级业务',
      dataIndex: 'name',
    },
    {
      title: '规则节点',
      dataIndex: 'type',
    },
    {
      title: '业务描述',
      dataIndex: 'description',
    },
    {
      title: '业务标识',
      dataIndex: 'ruleDefId',
    },
    {
      title: '是否自动执行',
      dataIndex: 'isAutoDeal',
    },
    {
      title: '操作',
      dataIndex: 'caozuo',
      width: '20%',
      align: 'left',
      ellipsis: true,
      render: (_: any, text: any) => (
        <Space size="small" split={<Divider type="vertical" />}>
          {/* <Typography.Link>详情</Typography.Link> */}
          <Typography.Link onClick={updataBusinessRules}>修改规则</Typography.Link>
          <Popconfirm
            title="是否删除？"
            okText="确定"
            cancelText="取消"
            onConfirm={() => delRules()}
          >
            <Typography.Link>删除节点</Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      fatherbusiness: '父级业务1',
      cuntentbusiness: '本级业务1',
      rules: '规则节点1',
      businessDrip: '业务描述1',
      businessIndex: '业务表示1',
      zhixing: '是',
    },
    {
      key: '2',
      fatherbusiness: '父级业务2',
      cuntentbusiness: '本级业务2',
      rules: '规则节点2',
      businessDrip: '业务描述2',
      businessIndex: '业务表示2',
      zhixing: '是',
    },
    {
      key: '3',
      fatherbusiness: '父级业务3',
      cuntentbusiness: '本级业务3',
      rules: '规则节点3',
      businessDrip: '业务描述3',
      businessIndex: '业务表示3',
      zhixing: '是',
    },
  ];

  return (
    <PageContainer title={false}>
      <ProCard split="vertical">
        {/* {左侧树状选择} */}
        <ProCard style={ProCardMH} title={false} colSpan={colSpan}>
          {businessData.length != 0 && (
            <SearchTree
              selfDefaultExpandedKeys={[businessData[0].key]}
              treeData={businessData}
              onSelect={getSelectTreeKey}
            />
          )}
          {/* <Tree
                        treeDefaultExpandAll={true}
                        treeData={businessData}
                        onSelect={getSelectTreeKey}
                    /> */}
        </ProCard>

        <ProCard headerBordered>
          {/* {按钮} */}
          {tableButton()}
          {/* {表格列表} */}
          {tableList()}
          {addBus && (
            <Drawer
              title="业务新增"
              visible={addBus}
              placement={DrawerPlacement}
              onClose={addBusClose}
              getContainer={false}
              width={DrawerWith}
              disable={subDisable}
              loading={subDisable}
            >
              {addBusinessForm()}
            </Drawer>
          )}
          {updataBus && (
            <Drawer
              title="业务修改"
              visible={updataBus}
              placement={DrawerPlacement}
              onClose={updataBusClose}
              getContainer={false}
              width={DrawerWith}
            >
              {updataBusinessForm()}
            </Drawer>
          )}
          {updataBusinessRule && (
            <Drawer
              title="规则详情"
              visible={updataBusinessRule}
              placement={DrawerPlacement}
              onClose={updataBusinessRuleClose}
              getContainer={false}
              width={DrawerRuleWith}
            >
              {updataBusinessRulesForm()}
            </Drawer>
          )}
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

// 输出组件
export default BusinessRule;
