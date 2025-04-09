import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  message,
  Row,
} from 'antd';
// import '@/theme/default/common.less';
import styles from './style.less';
// import { getTreeDetailById } from '@/services/api';
import api from './service';
import SearchTreeMenu from './components/SearchTreeMenu';
import TableList from './components/TableList';
import TreeNodeDetail from './components/TreeNodeDetail';
import { useParams } from 'umi';
const KnowledgeDataTemplate: React.FC<{}> = (props: any) => {

  const { code }: any = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  // 树菜单
  const [treeMenuItem, setTreeMenuItem] = useState<any>(undefined);
  // 右侧列表
  const [treeDetialtem, setTreeDetialItem] = useState<any>(undefined);
  const [linkRowDetial, setLinkRowDetial] = useState<any>(undefined);
  const [treeRefreshFlag, setTreeRefreshFlag] = useState<number>(0);
  const [selectedKeysValue, setSelectedKeysValue] = useState<boolean>(false);

  useEffect(() => {
    getViewData()
  }, [code]);

  // 初始化话进入页面所有数据
  const getViewData = async () => {
    setLoading(true);
    const res1: any = await getViewProps();
    res1 && setLoading(false);
  }

  // 获取页面配置的属性
  const getViewProps = () => {
    let pageProps: any = getSrvCode(code.split("page&id=")[1]);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(pageProps);
      }, 300);
    });
  }

  // 根据页面id获取页面图表各个模块类型配置属性
  const getSrvCode = async (id: any) => {
    const res0 = await api.getTreeDetailById({ id: id });
    if (res0.code === 0 && res0.data) {
      res0.data.intfIttrDescList1.map((item: any, index: any) => {
        const condition = ['TreeMenu', 'TreeDetial'];
        if (condition.includes(item.filterType) && item.isDisabled != 1) {
          let obj = {
            key: index,
            ...item
          }
          item.filterType === 'TreeMenu' && setTreeMenuItem(obj);
          item.filterType === 'TreeDetial' && setTreeDetialItem(obj)
        }
      });
      return true;
    } else {
      res0.code !== 0 && message.error(res0.message || '操作失败')
      return false;
    }
  };


  // 树菜单选择节点回传的值obj
  const getSelTreeNodeValue = (treeIdKey: any, selectedKeysValue: any, info: any) => {
    selectedKeysValue.length > 0 ? setSelectedKeysValue(true) : setSelectedKeysValue(false)
    setLinkRowDetial({ ...info });
    setTreeRefreshFlag(0);
  }

  const refreshPage = (flag: any) => {
    setTreeRefreshFlag(flag);
  }
  return (
    <>
      <Row className="wb-fit-screen" gutter={10}>
        {
          treeMenuItem &&
          <Col
            md={JSON.parse(treeMenuItem.componentCode)?.widthSpan}
            xs={24}
            sm={24}
            className={styles.type_management_custom}
          >
            <SearchTreeMenu
              sqlData={treeMenuItem?.intfManDesc}
              treeTitile={treeMenuItem.displayName}
              treeIdKey={JSON.parse(treeMenuItem.componentCode)?.treeIdKey}
              treeParentIdKey={JSON.parse(treeMenuItem.componentCode)?.treeParentIdKey}
              treeTitleKey={JSON.parse(treeMenuItem.componentCode)?.treeTitleKey}
              treeShowLine={JSON.parse(treeMenuItem.componentCode)?.treeShowLine}
              getSelTreeNodeValue={getSelTreeNodeValue}
              treeRefreshFlag={treeRefreshFlag}   //刷新标志
              linkRowDetial={linkRowDetial}
              selectedKeysValue={selectedKeysValue}
              refreshPage={refreshPage}
            />

          </Col>
        }
        <Col
          md={treeDetialtem ? JSON.parse(treeDetialtem.componentCode)?.widthSpan : 19}
          xs={24}
          sm={24}
        >
          <Card
            bodyStyle={{ paddingTop: 0 }}>
            <Row>
              <Col
                span={24}
              >
                {
                  treeMenuItem &&
                  <TreeNodeDetail
                    treeDetialTitile={treeMenuItem.displayName}
                    linkRowDetial={linkRowDetial}
                    sqlData={treeMenuItem?.intfManDesc}
                    selectedKeysValue={selectedKeysValue}
                    refreshPage={refreshPage}
                  />
                }
              </Col>
              <Col
                span={24}
              >
                {
                  treeDetialtem &&
                  <TableList
                    sqlData={treeDetialtem?.intfManDesc}
                    isSearch={true}
                    treeDetialTitile={treeDetialtem.displayName}
                    linkRowDetial={linkRowDetial}
                  />
                }
              </Col>
            </Row>
          </Card>


        </Col>
      </Row>
    </ >
  );
};

export default KnowledgeDataTemplate;