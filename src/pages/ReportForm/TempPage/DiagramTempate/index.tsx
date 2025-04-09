import React, { useEffect, useState } from 'react';
import {
    Card,
    Col,
    message,
    Row,
    // Row,
    Tabs
} from 'antd';
// import '@/theme/default/common.less';
// import { PageContainer } from '@ant-design/pro-layout';
// import { getTreeDetailById } from '@/services/api';
import api from './service'
// import styles from './styles.less';
import MainTableList from './components/MainTableList';
import OptModalTableList from './components/OptModalTableList';
import LineChart from './components/LineChart';
import ColumnChart from './components/ColumnChart';
import OptionTableList from './components/OptionTableList';
import { useParams } from 'umi';

const { TabPane } = Tabs;

const DiagramTempate: React.FC<{}> = (props: any) => {

    const { code }: any = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [componentList, setComponentList] = useState<any>([]);
    // maintable配置
    const [linkRowDetial, setLinkRowDetial] = useState<any>(undefined);
    // tabList切换列表
    const [tabConfig, setTabConfig] = useState<any>([]);
    const [tabPanneList, setTabPanneList] = useState<any>([]);

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
            let tabConfigArr: any = [];
            let tabArr: any = [];
            res0.data.intfIttrDescList1.map((item: any, index: any) => {
                const condition = ['mainTable', 'optionTable', 'optModalTable', 'Line', 'Column', 'TabList'];
                if (condition.includes(item.filterType) && item.isDisabled != 1) {
                    let obj = {
                        key: index,
                        sortKey: item.sortNumber ? Number(item.sortNumber) : index,
                        ...item
                    }
                    chartsArr.push(obj);
                    if (item.filterType === 'TabList') {
                        // tab控件配置
                        if (item.componentCode) {
                            let componentCode = JSON.parse(item.componentCode)
                            for (let key in componentCode) {
                                if (key === 'moduleHeight' || key === 'widthSpan') {
                                    delete componentCode[key];
                                }
                            }
                            let obj = {
                                name: item.tableColum,
                                config: componentCode
                            }
                            tabConfigArr.push(obj);
                        }
                        if (!!item.intfManDesc && item.intfManDesc && item.intfManDesc.intfIttrDescList1 && item.intfManDesc.intfIttrDescList1.length > 0) {
                            item.intfManDesc.intfIttrDescList1.map((ite: any, index1: any) => {
                                let obj = {
                                    key: index1,
                                    tabName: item.tableColum,
                                    ...ite,
                                }
                                tabArr.push(obj);
                            })
                        }
                    }
                }
            });
            setComponentList(chartsArr);
            setTabConfig(tabConfigArr);
            setTabPanneList(tabArr);
            return true;
        } else {
            res0.code !== 0 && message.error(res0.message || '操作失败')
            return false;
        }
    };

    const handleClickRow = async (record: any, obj: any) => {
        let o = {
            ...record,
            ...obj
        }
        setLinkRowDetial(o);
    }

    return (
        <Row gutter={[16, 16]}>
            {componentList.sort((a: any, b: any) => a.sortKey - b.sortKey).map((item: any, index: any) => (

                item.filterType == "mainTable" ?
                    (
                        <Col key={index} md={item.componentCode && JSON.parse(item.componentCode)?.widthSpan ? JSON.parse(item.componentCode)?.widthSpan : 24} xs={24} sm={24} >
                            <MainTableList
                                tableWidth={item.componentCode && JSON.parse(item.componentCode)?.widthSpan ? JSON.parse(item.componentCode)?.widthSpan : 24}
                                sqlData={item?.intfManDesc}
                                moduleHeight={JSON.parse(item.componentCode)?.moduleHeight}
                                isSearch={JSON.parse(item.componentCode)?.isSearch}
                                handleClickRow={handleClickRow}
                            />
                        </Col>
                    )
                    :
                    (
                        item.filterType == "optionTable" ?
                            <Col key={index} md={item.componentCode && JSON.parse(item.componentCode)?.widthSpan ? JSON.parse(item.componentCode)?.widthSpan : 24} xs={24} sm={24} >
                                <OptionTableList
                                    sqlData={item?.intfManDesc}
                                    moduleHeight={JSON.parse(item.componentCode)?.moduleHeight}
                                    isSearch={JSON.parse(item.componentCode)?.isSearch}
                                    tableTitle={JSON.parse(item.componentCode)?.tableTitle}
                                    linkRowDetial={linkRowDetial}
                                />
                            </Col>
                            : (
                                item.filterType == 'optModalTable' ?
                                    <Col key={index} md={item.componentCode && JSON.parse(item.componentCode)?.widthSpan ? JSON.parse(item.componentCode)?.widthSpan : 24} xs={24} sm={24} >
                                        <OptModalTableList
                                            sqlData={item?.intfManDesc}
                                            moduleHeight={JSON.parse(item.componentCode)?.moduleHeight}
                                            isSearch={JSON.parse(item.componentCode)?.isSearch}
                                            tableTitle={JSON.parse(item.componentCode)?.tableTitle}
                                            modalTitle={JSON.parse(item.componentCode)?.modalTitle}
                                            linkRowDetial={linkRowDetial}
                                        />
                                    </Col>
                                    : (
                                        item.filterType == 'Line' ?
                                            <Col key={index} md={item.componentCode && JSON.parse(item.componentCode)?.widthSpan ? JSON.parse(item.componentCode)?.widthSpan : 24} xs={24} sm={24} >
                                                <LineChart
                                                    sqlData={item?.intfManDesc}
                                                    yField={item.componentCode && JSON.parse(item.componentCode).yField ? JSON.parse(item.componentCode).yField : undefined}
                                                    cConfig={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                    linkRowDetial={linkRowDetial}
                                                />
                                            </Col>
                                            : (
                                                item.filterType == 'Column' ?
                                                    <Col key={index} md={item.componentCode && JSON.parse(item.componentCode)?.widthSpan ? JSON.parse(item.componentCode)?.widthSpan : 24} xs={24} sm={24} >
                                                        <ColumnChart
                                                            sqlData={item?.intfManDesc}
                                                            yField={item.componentCode && JSON.parse(item.componentCode).yField ? JSON.parse(item.componentCode).yField : undefined}
                                                            cConfig={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                            linkRowDetial={linkRowDetial}
                                                        />
                                                    </Col>
                                                    :
                                                    (
                                                        item.filterType == "TabList" && tabConfig.length > 0 ?
                                                            (
                                                                <Col key={index} md={item.componentCode && JSON.parse(item.componentCode)?.widthSpan ? JSON.parse(item.componentCode)?.widthSpan : 24} xs={24} sm={24} >
                                                                    <Card>
                                                                        <Tabs {...tabConfig.find((it: any) => it.name === item.tableColum)}>
                                                                            {tabPanneList.filter((i: any) => i.tabName === item.tableColum).map((ite: any) => (
                                                                                ite.filterType == "optionTable" ?
                                                                                    <TabPane tab={ite.displayName} key={ite.key}>
                                                                                        <OptionTableList
                                                                                            sqlData={ite?.intfManDesc}
                                                                                            moduleHeight={JSON.parse(ite.componentCode)?.moduleHeight}
                                                                                            isSearch={JSON.parse(ite.componentCode)?.isSearch}
                                                                                            tableTitle={JSON.parse(ite.componentCode)?.tableTitle}
                                                                                            linkRowDetial={linkRowDetial}
                                                                                        />

                                                                                    </TabPane>
                                                                                    : (
                                                                                        ite.filterType == "optModalTable" ?
                                                                                            <TabPane tab={ite.displayName} key={ite.key}>
                                                                                                <OptModalTableList
                                                                                                    sqlData={ite?.intfManDesc}
                                                                                                    moduleHeight={JSON.parse(ite.componentCode)?.moduleHeight}
                                                                                                    isSearch={JSON.parse(ite.componentCode)?.isSearch}
                                                                                                    tableTitle={JSON.parse(ite.componentCode)?.tableTitle}
                                                                                                    modalTitle={JSON.parse(ite.componentCode)?.modalTitle}
                                                                                                    linkRowDetial={linkRowDetial}
                                                                                                />
                                                                                            </TabPane>
                                                                                            : (
                                                                                                ite.filterType == "Line" ?
                                                                                                    <TabPane tab={ite.displayName} key={ite.key}>
                                                                                                        <LineChart
                                                                                                            sqlData={ite?.intfManDesc}
                                                                                                            cConfig={ite.componentCode ? JSON.parse(ite.componentCode) : undefined}
                                                                                                            linkRowDetial={linkRowDetial}
                                                                                                        />
                                                                                                    </TabPane>
                                                                                                    : (
                                                                                                        ite.filterType == "Column" ?
                                                                                                            <TabPane tab={ite.displayName} key={ite.key}>
                                                                                                                <ColumnChart
                                                                                                                    sqlData={ite?.intfManDesc}
                                                                                                                    cConfig={ite.componentCode ? JSON.parse(ite.componentCode) : undefined}
                                                                                                                    linkRowDetial={linkRowDetial}
                                                                                                                />
                                                                                                            </TabPane>
                                                                                                            : null
                                                                                                    )
                                                                                            )
                                                                                    )
                                                                            ))}

                                                                        </Tabs>
                                                                    </Card>
                                                                </Col>
                                                            )
                                                            : null
                                                    )
                                            )
                                    )
                            )
                    )


            ))
            }
        </Row>
    );
};

export default DiagramTempate;
