import React, { useEffect, useRef, useState } from 'react';
import {
    Row,
    Col,
    Radio,
    Spin,
    Card,
    message,
} from 'antd';
// import '@/theme/default/common.less';
import moment from 'moment';
import styles from '../styles.less';
import { Column } from '@ant-design/plots';
// import { getDataByBizCode } from '@/services/api';
import api from '../service';

const ColumnChart = (props: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [intCode, setIntCode] = useState<any>('');
    const [filterObj, setFilterObj] = useState<any>(undefined);
    // 图表类useState
    const [chartConfig, setChartConfig] = useState<any>({});
    const [moduleHeight, setModuleHeight] = useState<number>(400);
    const [chartTitle, setChartTitle] = useState<any>(undefined);
    const [tData, setData] = useState<any>([]);
    const [timeListData, setTimeListData] = useState<any>([]);
    const [titleField, setTitleField] = useState<any>(); //与主表标题关联字段
    const [linkField, setLinkField] = useState<any>();  //与主表关联字段
    const { yField } = props;
    useEffect(() => {
        props.linkRowDetial ? getViewData() : setData([]);
    }, [props.linkRowDetial]);

    // 初始化话进入页面所有数据
    const getViewData = async () => {
        const res1: any = pharseChartProps(props.cConfig);
        const { srvCode, inStartTime, inEndTime, ...obj } = res1;
        res1 && getBizCodeData(srvCode, obj, inStartTime, inEndTime);
    }

    //模块 属性解释
    const pharseChartProps = (data: any) => {
        let obj: any = []; //图表过滤参数值
        let linkFieldArr: any = [];

        data && setModuleHeight(data?.moduleHeight);
        data && setChartTitle(data?.chartTitle);
        data && setTimeListData(data?.timeFilter);

        if (data) {
            let obj = { ...data };
            const condition = ['chartTitle', 'moduleHeight', 'timeFilter', 'widthSpan'];
            for (let key in obj) {
                if (condition.includes(key) || obj[key] === '') {
                    delete obj[key]
                }
            }
            setChartConfig(obj);
        }

        props.sqlData && setIntCode(props.sqlData.intCode);  //获取数据的SrvCode;

        // 数据接口参数解释
        props.sqlData && props.sqlData?.opeBut.map((ite: any) => {
            if (ite.paramValue && ite.paramType) {
                if (ite.paramType == 'datePicker') {
                    obj[ite.paramName] = moment(ite.paramValue);
                } else if (ite.paramType == 'rangerPicker') {
                    let arr: any = [moment(ite.paramValue.split(',')[0]), moment(ite.paramValue.split(',')[1])];
                    obj[ite.paramName] = arr;
                } else {
                    obj[ite.paramName] = ite.paramValue;
                }
            }
        });

        //主表关联字段解析
        props.sqlData && props.sqlData?.intfIttrDescList1.map((item: any, index: any) => {
            // 关联过滤字段
            if (item.isLinkTo == 1) {
                linkFieldArr.push(item.tableColum)
            }
            //标题变化关联字段
            if (item.isTitleField) {
                setTitleField(item.isTitleField);
            }
        });
        setLinkField(linkFieldArr);

        obj.srvCode = props.sqlData.intCode;
        data?.timeFilter[0]?.label
        !!props.linkRowDetial && props.linkRowDetial && linkFieldArr.map((it: any) => {
            obj[it] = props.linkRowDetial[it];
        });

        // 默认传递时间
        const { inEndTime: endTime0, inStartTime: startTime0 }: any = props.linkRowDetial;
        if (data?.timeFilter && data?.timeFilter[0]?.label) {
            let strIndex = data?.timeFilter[0]?.label.indexOf('-');
            let num = Number(data?.timeFilter[0]?.label.slice(0, strIndex));
            if (num < 100) {
                obj.inStartTime = endTime0 ? moment(endTime0).subtract(num, data?.timeFilter[0]?.label.slice(strIndex + 1)).format('YYYY-MM-DD') : moment().subtract(num, data?.timeFilter[0]?.label.slice(strIndex + 1)).format('YYYY-MM-DD');
                obj.inEndTime = endTime0 ? endTime0 : moment().format('YYYY-MM-DD');
            } else {
                obj.inStartTime = startTime0 ? startTime0 : '';
                obj.inEndTime = endTime0 ? endTime0 : ''
            }
        } else {
            obj.inStartTime = startTime0 ? startTime0 : '';
            obj.inEndTime = endTime0 ? endTime0 : ''
        }

        const { srvCode, inStartTime, inEndTime, ...obj1 } = obj;
        setFilterObj(obj1);
        return obj;
    }

    // 获取图表数据 by BizCode
    const getBizCodeData = async (srvCode: any, filterFFFF: any, inStartTime: any, inEndTime: any) => {
        setLoading(true);
        let res0: any = await api.getDataByBizCode(Object.assign({ srvCode }, filterFFFF, { inStartTime }, { inEndTime }));
        let res = res0.response;
        if (res.code === 0) {
            let data = res.data.cursor_result.map((item: any) => {
                item[yField] = Number(item[yField]);
                return item;
            })
            res.data.cursor_result && setData(data);
        } else {
            message.error(res.message || '操作失败');
        }
        setLoading(false);
    }

    //时间筛选器
    const handleTimeChange = (e: any) => {
        const { inEndTime: endTime0, inStartTime: startTime0 }: any = props.linkRowDetial;
        let strIndex = e.target.value.indexOf('-');
        let num = Number(e.target.value.slice(0, strIndex));
        if (num < 100) {
            let startTime = endTime0 ? moment(endTime0).subtract(num, e.target.value.slice(strIndex + 1)).format('YYYY-MM-DD') : moment().subtract(num, e.target.value.slice(strIndex + 1)).format('YYYY-MM-DD');
            let endTime = endTime0 ? endTime0 : moment().format('YYYY-MM-DD');
            getBizCodeData(intCode, filterObj, startTime, endTime);
        } else {
            getBizCodeData(intCode, filterObj, startTime0, endTime0);
        }
    }

    return (
        <Card style={{ height: moduleHeight }} bordered={false}>
            {/*  图表标题 */
                (titleField && props.linkRowDetial) || chartTitle ?
                    <Row>
                        <Col span={24}>
                            <div
                                style={{ textAlign: "center", fontSize: 14, fontWeight: 700, paddingBottom: 10 }}>
                                {titleField && props.linkRowDetial[titleField] ? props.linkRowDetial[titleField] : chartTitle}
                            </div>
                        </Col>
                    </Row>

                    : null
            }

            { // 日期筛选
                timeListData.length ?
                    <Row>
                        <Col span={24}>
                            <div style={{ textAlign: "right", marginRight: 10 }}>
                                <Radio.Group
                                    className={styles.radioStyle}
                                    defaultValue={timeListData[0]?.label}
                                    buttonStyle="solid"
                                    onChange={handleTimeChange}
                                >
                                    {
                                        timeListData.map((item: any, index: any) => (
                                            <Radio.Button key={index} value={item.label}>{item.name}</Radio.Button>
                                        ))
                                    }
                                </Radio.Group>
                            </div>
                        </Col>
                    </Row>
                    : null
            }

            {/* 图表区域 */
                loading ?
                    <div className={styles.spinexample}>
                        <Spin delay={500} />
                    </div>
                    :
                    // <Card loading={loading}>
                    <Column data={tData} {...chartConfig} />
                // </Card>
            }
        </Card>
    )
}

export default ColumnChart;
