import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import styles from './styles.less';
import ColumnCard from './ColumnCard';
import BarCard from './BarCard';
import AreaCard from './AreaCard';
import TinyChart from './TinyChart';
import DualaxreCard from './dualaxreCard';
import PieCard from './PieCard';
import ChartTable from './ChartTable'

const ChartsCombine = React.forwardRef((props: any, ref: any) => {
    // useImperativeHandle(ref, () => ({
    //     getBizCodeData,
    // }))
    const [tinyChartArr, setTinyChart] = useState<any>([])
    const [tabChart, setTabChart] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // 获取当前标题头,
    useEffect(() => {
        if (props.config != null) {
            // let config = { ...props.config };
            if (props.config.chartTitle != "" && props.config.chartTitle != null && props.config.chartTitle != undefined && loading) {
                setChartTitle(props.config.chartTitle)
            }
        }
    }, [props.config, loading])
    useEffect(() => {
        if (props.sqlData != null && props.sqlData != undefined) {
            let tinychartsArr: any = [];
            let tabConfigArr: any = [];
            // let tabArr: any = [];
            props.sqlData.intfIttrDescList1.map((item: any, index: any) => {
                const tinycondition = ['tingyDefault', 'tinyColumn', 'tinyArea', 'tinyProgress', 'tinyText'];
                const tableCondition = ['columnCard', 'AreaCard', 'pieCard', 'dualAxesCard', 'tableList', 'lineCard', 'tab', 'combineEarchast', 'BarCard'];
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
        }
    }, [props.sqlData])
    //  页面标题
    const [chartTitle, setChartTitle] = useState<any>(null);
    // 内容加载

    const getLoading = () => {
        setLoading(true)
    }
    // 内容加载end
    return (

        <Card>
            <Card
                title={
                    chartTitle ?
                        <Row>
                            <Col span={12}>
                                <div>
                                    {chartTitle}
                                </div>
                            </Col>
                        </Row >
                        : null
                }
                className={styles.bigChartSty}
                bodyStyle={{ padding: 0 }}
                headStyle={{ padding: '0 4px' }}
            >
                {tinyChartArr && tinyChartArr.length > 0 && (
                    <Row wrap gutter={[16, 16]}>
                        {
                            tinyChartArr.map((item: any, index: any) => {
                                return (
                                    <Col
                                        xs={24}  //屏幕 < 576px 响应式栅格
                                        sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                        md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 6}
                                    >
                                        <TinyChart
                                            getLoading={getLoading}
                                            filterType={item?.filterType}
                                            config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                            key={index}
                                            sqlData={item?.intfManDesc}
                                        ></TinyChart>
                                    </Col>
                                )
                            })
                        }
                    </Row>

                )}
                {tabChart && tabChart.length > 0 && (
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
                                            index={item.key}
                                            getLoading={getLoading}
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
                                                index={item.key}
                                                getLoading={getLoading}
                                                filterType={item.filterType}
                                                config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                key={index}
                                                sqlData={item?.intfManDesc}
                                            ></BarCard>
                                        </Col>)
                                        :
                                        item.filterType == "columnCard" ?
                                            <Col
                                                xs={24}  //屏幕 < 576px 响应式栅格
                                                sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                                md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 12}
                                            >
                                                <ColumnCard
                                                    index={item.key}
                                                    getLoading={getLoading}
                                                    filterType={item.filterType}
                                                    config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                    key={index}
                                                    sqlData={item?.intfManDesc}
                                                ></ColumnCard>
                                            </Col>
                                            :
                                            item.filterType == "lineCard" ?
                                                (<Col
                                                    xs={24}  //屏幕 < 576px 响应式栅格
                                                    sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                                    md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 12}
                                                >
                                                    <ColumnCard
                                                        index={item.key}
                                                        getLoading={getLoading}
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
                                                            getLoading={getLoading}
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
                                                                getLoading={getLoading}
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
                                                                    getLoading={getLoading}
                                                                    config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                                    key={index}
                                                                    sqlData={item?.intfManDesc}
                                                                ></ChartTable>
                                                            </Col>)

                                                            :
                                                            null)
                            )
                        }
                    </Row>

                )
                }
            </Card >

        </Card>



    )
})
export default ChartsCombine;