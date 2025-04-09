import React, { useEffect, useState } from 'react';
import {
  Col,
  message,
  Row,
} from 'antd';
// import { PageContainer } from '@ant-design/pro-layout';
// import '@/theme/default/common.less';
import '@/pages/ReportForm/theme/default/common.less'
import styles from './style.less';
import api from './service';
import SearchTreeMenu from './components/SearchTreeMenu';
import SearchTreeChart from './components/SearchTreeChart';
import TableList from './components/TableList';
import { useParams } from 'umi';
const TreeStructureTemplate1: React.FC<{}> = (props: any) => {
  const { code }: any = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [componentList, setComponentList] = useState<any>([]);
  const [linkRowDetial, setLinkRowDetial] = useState<any>(undefined);

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
      let chartsArr: any = [];

      res0.data.intfIttrDescList1.map((item: any, index: any) => {
        const condition = ['TreeMenu', 'TreeDetial', 'TreeChart'];
        if (condition.includes(item.filterType) && item.isDisabled != 1) {
          let obj = {
            key: index,
            ...item
          }
          chartsArr.push(obj);
        }
      });
      setComponentList(chartsArr);
      return true;
    } else {
      res0.code !== 0 && message.error([res0.message])
      return false;
    }
  };


  // 树菜单选择节点回传的值obj
  const getSelTreeNodeValue = (treeIdKey: any, selectedKeysValue: any, info: any) => {
    setLinkRowDetial({ ...info });
  }

  return (
    <>
      <Row className="wb-fit-screen" gutter={10}>
        {
          componentList.map((item: any, index: any) => (
            <Col
              key={index}
              // span={JSON.parse(item.componentCode)?.widthSpan}
              md={JSON.parse(item.componentCode)?.widthSpan}
              xs={24}
              sm={24}
              className={item.filterType == 'TreeMenu' ? `${styles.type_management_custom}` : null}
            >
              {
                item.filterType == 'TreeMenu' ?
                  (
                    <SearchTreeMenu
                      sqlData={item?.intfManDesc}
                      treeTitile={item.displayName}
                      treeIdKey={JSON.parse(item.componentCode)?.treeIdKey}
                      treeParentIdKey={JSON.parse(item.componentCode)?.treeParentIdKey}
                      treeTitleKey={JSON.parse(item.componentCode)?.treeTitleKey}
                      treeShowLine={JSON.parse(item.componentCode)?.treeShowLine}
                      isSelectFirst={JSON.parse(item.componentCode)?.isSelectFirst}
                      getSelTreeNodeValue={getSelTreeNodeValue}
                    />
                  )
                  :
                  item.filterType == 'TreeDetial' ?
                    (
                      <TableList
                        sqlData={item?.intfManDesc}
                        isSearch={true}
                        treeDetialTitile={item.displayName}
                        linkRowDetial={linkRowDetial}
                      />
                    )
                    :
                    item.filterType == 'TreeChart' ?
                      (
                        <SearchTreeChart
                          sqlData={item?.intfManDesc}
                          treeDetialTitile={item.displayName}
                          ChartTitle={JSON.parse(item.componentCode).ChartTitle}
                          ChartID={JSON.parse(item.componentCode).ChartID}
                          linkRowDetial={linkRowDetial}
                        />
                      )
                      : null
              }
            </Col>
          ))
        }
      </Row>
    </ >
  );
};

export default TreeStructureTemplate1;