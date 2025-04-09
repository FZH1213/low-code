import React, { useEffect, useState, useImperativeHandle } from 'react';
import { Column, Line } from '@ant-design/plots';
import { Card, Row, Col, Skeleton, message, Space, DatePicker, } from 'antd';
import moment from 'moment';
import styles from './styles.less';
import api from '../service'
const { RangePicker } = DatePicker;
const ColumnCard = React.forwardRef((props: any, ref: any) => {

    //组件作用： 线性表，柱状表 入口文件
    // charstTitle  代表标题 + 过滤器内容加载，如果为空，则标题为空，不加载     
    // tab 可存在过滤器，不能存在charstTitle， 多个图表结合则不存在过滤器
    // end
    // tab 组件 过滤数据调用方法
    useImperativeHandle(ref, () => ({
        getBizCodeData,
    }))
    // tab 组件 过滤数据调用方法 --- end
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingChart, setLoadingChart] = useState<boolean>(false);
    const [timeNumber, setTimeNumber] = useState<any>(0);
    const [config, setConfig] = useState<any>({});
    const [dateRange, setDateRange] = useState<any>([]);
    const [timeListData, setTimeListData] = useState<any>([]);
    // 获取当前标题头,
    useEffect(() => {
        if (props.config != null) {
            let config = { ...props.config };

            if (props.config.chartTitle != "" && props.config.chartTitle != null && props.config.chartTitle != undefined) {
                setChartTitle(props.config.chartTitle)
            }
            if (props.config.timeFilter != "" && props.config.timeFilter != null && props.config.timeFilter != undefined) {
                setTimeListData(props.config.timeFilter);
            }

            const condition = ["chartTitle", "span", "timeFilter"];
            for (let key in config) {
                if (condition.includes(key)) {
                    delete config[key];
                }
            }

            setConfig(config);
        }

    }, [props.config])

    //  页面标题
    const [chartTitle, setChartTitle] = useState<any>(null);
    const [tData, setData] = useState<any>([]);
    // 网络请求数据
    // 网络请求数据
    const getBizCodeData = async (srvCode: any, inStartTime: any, inEndTime: any) => {
        let res0: any = await api.getDataByBizCode(Object.assign({ srvCode }, { inStartTime }, { inEndTime }));
        setLoading(false)
        // 过滤数据请求懒加载数据判断
        setLoadingChart(false)
        // 过滤数据请求懒加载数据判断 --- end
        // combine 组件 loading title
        props.getLoading && props.getLoading();
        // combine 组件 loading title--- end
        let res = res0.response;
        if (res.code === 0) {
            let data = res.data.cursor_result.records;
            res.data.cursor_result.records && setData(data);
        } else {
            message.error(res.message || '操作失败');
        }

    }

    useEffect(() => {
        if (props.sqlData.intCode != '') {
            let { timeFilter } = props.config;

            // 默认传递时间(时间范围的第一个值)
            if (timeFilter && timeFilter[0]?.label) {
                let strIndex = timeFilter[0]?.label.indexOf('-');
                let num = Number(timeFilter[0]?.label.slice(0, strIndex));
                if (num < 100) {
                    let startTime = moment().subtract(num, timeFilter[0]?.label.slice(strIndex + 1))
                    let endTime = moment();
                    setDateRange([startTime, endTime])
                    getBizCodeData(props.sqlData.intCode, startTime.format('YYYY-MM-DD'), endTime.format('YYYY-MM-DD'))
                } else {
                    getBizCodeData(props.sqlData.intCode, undefined, undefined)
                }
            } else {
                getBizCodeData(props.sqlData.intCode, undefined, undefined)
            }

        }
    }, [props.sqlData])
    // 时间 过滤请求 封装方法
    const onTimeChange = (time: any, timeString: string) => {
        timeString[0] && timeString[1] && getBizCodeData(props.sqlData.intCode, timeString[0], timeString[1])
    }

    //时间筛选器
    const handleTimeTag = (e: any) => {
        if (loadingChart == true) {
            return;
        }

        let strIndex = e.indexOf('-');
        let num = Number(e.slice(0, strIndex));
        if (timeNumber == num) {

            return;
        }
        setTimeNumber(num);
        setLoadingChart(true);
        if (num < 100) {
            let startTime = moment().subtract(num, e.slice(strIndex + 1)).format('YYYY-MM-DD');
            let endTime = moment().format('YYYY-MM-DD');
            setDateRange([moment().subtract(num, e.slice(strIndex + 1)), moment()])
            getBizCodeData(props.sqlData.intCode, startTime, endTime);
        } else {
            getBizCodeData(props.sqlData.intCode, undefined, undefined);
        }
    }
    // 时间 过滤请求 封装方法  --- end

    return (
        <>
            <Skeleton loading={loading} active>
                <Card
                    // className={styles.bigChartSty}
                    title={
                        chartTitle ?
                            <Row>
                                <Col span={12}>
                                    <div>
                                        {chartTitle}
                                    </div>
                                </Col>
                                {timeListData && timeListData.length > 0 &&
                                    <Col span={12}>
                                        <div style={{ textAlign: 'right' }} className={styles.showRangDate}>
                                            <Space>
                                                {
                                                    timeListData.map((item: any, index: any) => (
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
                                        </div>
                                    </Col>
                                }
                            </Row >
                            : null
                    }
                    bodyStyle={{ padding: 0 }}
                    headStyle={{ padding: '0 4px' }}
                    bordered={false}
                >
                    {/*  图表区域 */}
                    {tData && props.filterType &&
                        props.filterType == "columnCard" ?
                        <Column data={tData} {...config} />
                        :
                        props.filterType == "lineCard" ?
                            <Line data={tData} {...config} />
                            :
                            null
                    }
                </Card>
            </Skeleton >
        </ >
    )
})
export default ColumnCard;