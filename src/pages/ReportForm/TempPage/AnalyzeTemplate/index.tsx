import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import TinyChart from './components/TinyChart';
import ColumnCard from './components/ColumnCard';
import BarCard from './components/BarCard';
import AreaCard from './components/AreaCard';
import DualaxreCard from './components/dualaxreCard';
import PieCard from './components/PieCard';
import ChartTable from './components/ChartTable';
import TabsCombine from './components/TabsCombine';
import ChartsCombine from './components/ChartsCombine';
import api from './service';
import { useParams } from 'umi';

const AnalyzeTemplate: React.FC<{}> = (props: any) => {

    const { code }: any = useParams();
    const [tinyChartArr, setTinyChart] = useState<any>([])
    const [tabChart, setTabChart] = useState<any>([]);
    useEffect(() => {
        getViewData();
    }, [code]);

    // 初始化话进入页面所有数据
    const getViewData = async () => {
        // setLoading(true);
        const res1: any = await getViewProps();
        // res1 && setLoading(false);
    }

    // 获取页面配置的属性
    const getViewProps = () => {
        let pageProps: any = getSrvCode(code.split("page&id=")[1]);
        console.log(pageProps)
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
            let tinychartsArr: any = [];
            let tabConfigArr: any = [];
            // let tabArr: any = [];
            res0.data.intfIttrDescList1.map((item: any, index: any) => {
                const tinycondition = ['tingyDefault', 'tinyColumn', 'tinyArea', 'tinyProgress', 'tinyText'];
                const tableCondition = ['columnCard', 'pieCard', 'dualAxesCard', 'tableList', 'lineCard', 'tab', 'combineEarchast', 'BarCard', 'AreaCard'];
                console.log(item.filterType, tinycondition.includes(item.filterType))
                if (tinycondition.includes(item.filterType)) {
                    let obj = {
                        key: index,
                        ...item
                    }
                    tinychartsArr.push(obj)
                }
                if (tableCondition.includes(item.filterType)) {
                    let obj = {
                        key: index,
                        ...item
                    }
                    tabConfigArr.push(obj)
                }
            })
            setTinyChart(tinychartsArr);
            setTabChart(tabConfigArr);
            console.log(tinychartsArr, tabConfigArr);
            return true;
        }
        else {
            // res0.code !== 0 && message.error(res0.message || '操作失败')
            return false;
        }
    };


    return (
        <>
            {tinyChartArr && tinyChartArr.length > 0 && (
                <div style={{ background: '#f0f2f5' }}>
                    <Row wrap gutter={[16, 16]}>
                        {
                            tinyChartArr.map((item: any, index: any) => {
                                return (
                                    <Col

                                        xs={24}  //屏幕 < 576px 响应式栅格
                                        sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                        md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 6}
                                        key={index}
                                    >
                                        <TinyChart
                                            filterType={item?.filterType}
                                            dataFiled={JSON.parse(item.componentCode).dataFiled ? JSON.parse(item.componentCode).dataFiled : undefined}
                                            config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                            key={index}
                                            sqlData={item?.intfManDesc}
                                        ></TinyChart>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
            )}
            {tabChart && tabChart.length > 0 && (
                <div style={{ background: '#f0f2f5', marginTop: 10 }}>
                    <Row wrap gutter={[16, 16]}>
                        {
                            tabChart.map((item: any, index: any) => (
                                item.filterType == "AreaCard" ?
                                    (<Col
                                        xs={24}  //屏幕 < 576px 响应式栅格
                                        sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                        md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 12}
                                    >
                                        <AreaCard
                                            filterType={item.filterType}
                                            config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                            key={index}
                                            sqlData={item?.intfManDesc}
                                        ></AreaCard>
                                    </Col>)
                                    :
                                    item.filterType == "BarCard" ?
                                        (<Col
                                            xs={24}  //屏幕 < 576px 响应式栅格
                                            sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                            md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 12}
                                        >
                                            <BarCard
                                                filterType={item.filterType}
                                                config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                key={index}
                                                sqlData={item?.intfManDesc}
                                            ></BarCard>
                                        </Col>)
                                        :
                                        item.filterType == "columnCard" ?
                                            (<Col
                                                xs={24}  //屏幕 < 576px 响应式栅格
                                                sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                                md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 12}
                                            >
                                                <ColumnCard
                                                    filterType={item.filterType}
                                                    config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                    key={index}
                                                    sqlData={item?.intfManDesc}
                                                ></ColumnCard>
                                            </Col>)
                                            :
                                            item.filterType == "lineCard" ?
                                                (<Col
                                                    xs={24}  //屏幕 < 576px 响应式栅格
                                                    sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                                    md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 12}
                                                >
                                                    <ColumnCard
                                                        filterType={item.filterType}
                                                        config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                        key={index}
                                                        sqlData={item?.intfManDesc}
                                                    ></ColumnCard>
                                                </Col>)
                                                :
                                                item.filterType == "dualAxesCard" ?
                                                    (<Col
                                                        xs={24}  //屏幕 < 576px 响应式栅格
                                                        sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                                        md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 12} >
                                                        <DualaxreCard
                                                            config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                            key={index}
                                                            sqlData={item?.intfManDesc}
                                                        ></DualaxreCard>
                                                    </Col>)
                                                    :
                                                    item.filterType == "pieCard" ?
                                                        (<Col
                                                            xs={24}  //屏幕 < 576px 响应式栅格
                                                            sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                                            md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 12}
                                                        >
                                                            <PieCard
                                                                config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                                key={index}
                                                                sqlData={item?.intfManDesc}
                                                            ></PieCard>
                                                        </Col>)
                                                        :
                                                        item.filterType == "tableList" ?
                                                            (<Col
                                                                xs={24}  //屏幕 < 576px 响应式栅格
                                                                sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                                                md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 24}
                                                            >
                                                                <ChartTable
                                                                    config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                                    key={index}
                                                                    sqlData={item?.intfManDesc}
                                                                ></ChartTable>
                                                            </Col>)
                                                            :
                                                            item.filterType == "tab" ?
                                                                // <div>111111</div>
                                                                (<Col
                                                                    xs={24}  //屏幕 < 576px 响应式栅格
                                                                    sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                                                    md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 12}
                                                                >
                                                                    <TabsCombine
                                                                        config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                                        key={index}
                                                                        sqlData={item?.intfManDesc}
                                                                    >
                                                                    </TabsCombine>
                                                                </Col>)
                                                                :
                                                                item.filterType == "combineEarchast" ?
                                                                    (<Col
                                                                        xs={24}  //屏幕 < 576px 响应式栅格
                                                                        sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                                                        md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 12}
                                                                    >
                                                                        <ChartsCombine
                                                                            config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                                            key={index}
                                                                            sqlData={item?.intfManDesc}
                                                                        >
                                                                        </ChartsCombine>
                                                                    </Col>)
                                                                    :
                                                                    null)
                            )
                        }
                    </Row>
                </div>
            )
            }



        </>
    );
};

export default AnalyzeTemplate;
