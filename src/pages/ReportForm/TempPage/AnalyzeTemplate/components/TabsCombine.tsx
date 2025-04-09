import React, { useEffect, useRef, useState } from 'react';
import { Card, Space, DatePicker, Tabs } from 'antd';
import moment from 'moment';
import styles from './styles.less';
const { RangePicker } = DatePicker;
import ColumnCard from './ColumnCard';
import AreaCard from './AreaCard';
import BarCard from './BarCard';
import DualaxreCard from './dualaxreCard';
import PieCard from './PieCard';
import ChartsCombine from './ChartsCombine';
import ChartTable from './ChartTable'
const { TabPane } = Tabs;

const TabsCombine: React.FC<{}> = (props: any) => {

    // const [config, setConfig] = useState<any>({});
    const [TabItems, setTabItems] = useState<any>([]);
    const [componentCode, setComponentCode] = useState<any>([]);
    const [dateRange, setDateRange] = useState<any>([]);
    // const [loading, setLoading] = useState<boolean>(true);
    // const [loadingChart, setLoadingChart] = useState<boolean>(false);
    // const [timeNumber, setTimeNumber] = useState<any>(0);
    const [timeKey, setTimeKey] = useState<any>(0);
    // const [operations, setOperations] = useState<any>(null);
    const domRef = useRef(null);
    const tableCondition = ['columnCard', 'pieCard', 'dualAxesCard', 'tableList', 'lineCard', 'combineEarchast', 'BarCard', 'AreaCard'];

    useEffect(() => {
        if (props.sqlData != null && props.sqlData != undefined && props.sqlData) {
            const code: any = [];
            const tabPane = props.sqlData.intfIttrDescList1.filter((item: any, index: any) => {
                if (tableCondition.includes(item.filterType)) {
                    code.push(JSON.parse(item.componentCode))
                    return item;
                }
            })
            setComponentCode(code)
            setTabItems(tabPane)
        }
    }, [props.sqlData])

    useEffect(() => {
        setDateRange([])
    }, [timeKey])

    const onChange = (key: string) => {
        setTimeKey(key);
    };

    const onTimeChange = (time: any, timeString: string) => {
        const intCode = TabItems[timeKey].intfManDesc.intCode;

        timeString[0] && timeString[1] &&
            // 调用方法
            domRef.current.getBizCodeData(intCode, timeString[0], timeString[1])
    }

    //时间筛选器
    const handleTimeTag = (e: any) => {
        let strIndex = e.indexOf('-');
        let num = Number(e.slice(0, strIndex));
        const intCode = TabItems[timeKey].intfManDesc.intCode;
        if (num < 100) {

            let startTime = moment().subtract(num, e.slice(strIndex + 1)).format('YYYY-MM-DD');
            let endTime = moment().format('YYYY-MM-DD');
            setDateRange([moment().subtract(num, e.slice(strIndex + 1)), moment()])
            domRef.current.getBizCodeData(intCode, startTime, endTime);
        } else {

            domRef.current.getBizCodeData(intCode, undefined, undefined);
        }
    }

    // 过滤器显示

    return (
        // <Tabs defaultActiveKey="1">

        // </Tabs>
        // <div className={styles.tab} >
        <Card>

            {TabItems && TabItems.length > 0 &&
                <Tabs defaultActiveKey="0" onChange={onChange} tabBarExtraContent={

                    componentCode[timeKey].timeFilter != null ?
                        <div style={{ textAlign: 'right' }} className={styles.showRangDate}>
                            {componentCode[timeKey].timeFilter.length &&
                                <Space >
                                    {
                                        componentCode[timeKey].timeFilter.map((item: any, index: any) => (
                                            <span key={index}>
                                                <a
                                                    href="javascript:;"
                                                    style={{ color: '#555151' }}
                                                    onClick={() => handleTimeTag(item.label)}
                                                >
                                                    {item.name}
                                                </a>
                                            </span>
                                        ))
                                    }
                                    <span><RangePicker onChange={onTimeChange} value={dateRange} /></span>
                                </Space>
                            }
                        </div>
                        : null}>
                    {TabItems.map((item: any, index: any) => {
                        return (
                            <TabPane tab={item.displayName} key={index} >
                                {
                                    item.filterType == "BarCard" ?
                                        <BarCard
                                            ref={timeKey == index ? domRef : null}
                                            filterType={item.filterType}
                                            config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                            key={index}
                                            sqlData={item?.intfManDesc}

                                        ></BarCard>
                                        :
                                        item.filterType == "AreaCard" ?
                                            <AreaCard
                                                ref={timeKey == index ? domRef : null}
                                                filterType={item.filterType}
                                                config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                key={index}
                                                sqlData={item?.intfManDesc}

                                            ></AreaCard>
                                            :
                                            item.filterType == "columnCard" ?
                                                <ColumnCard
                                                    ref={timeKey == index ? domRef : null}
                                                    filterType={item.filterType}
                                                    config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                    key={index}
                                                    sqlData={item?.intfManDesc}

                                                ></ColumnCard>
                                                :
                                                item.filterType == "lineCard" ?
                                                    <ColumnCard
                                                        ref={timeKey == index ? domRef : null}
                                                        filterType={item.filterType}
                                                        config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                        key={index}
                                                        sqlData={item?.intfManDesc}

                                                    ></ColumnCard>
                                                    :
                                                    item.filterType == "dualAxesCard" ?

                                                        <DualaxreCard
                                                            config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                            key={index}
                                                            sqlData={item?.intfManDesc}
                                                            ref={timeKey == index ? domRef : null}
                                                        ></DualaxreCard>
                                                        :
                                                        item.filterType == "pieCard" ?
                                                            <PieCard
                                                                config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                                key={index}
                                                                sqlData={item?.intfManDesc}
                                                                ref={timeKey == index ? domRef : null}
                                                            ></PieCard>
                                                            :
                                                            item.filterType == "combineEarchast" ?
                                                                <ChartsCombine
                                                                    config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                                    key={index}
                                                                    sqlData={item?.intfManDesc}
                                                                    ref={timeKey == index ? domRef : null}
                                                                ></ChartsCombine>
                                                                :
                                                                item.filterType == "tableList" ?
                                                                    <ChartTable
                                                                        config={item.componentCode ? JSON.parse(item.componentCode) : undefined}
                                                                        key={index}
                                                                        sqlData={item?.intfManDesc}
                                                                        ref={timeKey == index ? domRef : null}
                                                                    ></ChartTable>
                                                                    :
                                                                    null
                                }
                            </TabPane>
                        )
                    })}


                </Tabs>
            }
        </Card>
        // </div>
    )
}
export default TabsCombine;