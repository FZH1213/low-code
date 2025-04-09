import React, { useEffect, useRef, useState } from 'react';
import { TinyArea, TinyColumn, Bullet } from '@ant-design/plots';
import {
    MessageFilled,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { Card, Tooltip, message, Skeleton, Row, Col } from 'antd';
// import { getDataByBizCode } from '@/services/api';
import api from '../service';
import styles from './styles.less'
const TinyChart: React.FC<{}> = (props: any) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [title, setTitle] = useState<any>(""); // 模块名称修改
    const [describe, setDescribe] = useState<any>(""); // 模块名称修改
    const [tingyNumberField, setTingyNumberField] = useState<any>(""); // 模块名称修改
    const [detailItem, setDetailItem] = useState<any>([]);
    const [tinyItemText, settinyItemText] = useState<any>([]);
    const [tingyNumberType, setTingyNumberType] = useState<any>(null);
    const [tData, setData] = useState<any>({
    });
    useEffect(() => {
        if (props.sqlData != null && props.config != null) {
            getBizCodeData(props.sqlData.intCode)
        }
    }, [props.sqlData])

    // 遍历data数据
    useEffect(() => {
        if (props.sqlData != null && props.sqlData.intfIttrDescList1 != null) {
            let arr_detailItem: any = [];
            let arr_Text: any = [];
            props.sqlData.intfIttrDescList1.map((item: any) => {
                if (item.filterType == 'tingyTitle') {
                    setTitle(JSON.parse(item.componentCode)?.title || '')
                }
                if (item.filterType == 'tingyMemo') {
                    setDescribe(JSON.parse(item.componentCode)?.memo || '')
                }
                if (item.filterType == 'tingyItem') {
                    let obj = {
                        tableCloumn: item.tableColum,
                        displayName: item.displayName,
                        ...JSON.parse(item.componentCode)
                    }
                    arr_detailItem.push(obj)
                    console.log(obj)
                }
                if (item.filterType == 'tingyNumber') {
                    let condition = ["isDollar", "isPercentage"];
                    let params = JSON.parse(item.componentCode)
                    if (params.type != undefined && params.type != null && params.type != "") {
                        setTingyNumberType(params.type)
                    }
                    setTingyNumberField(item.tableColum)
                }
                if (item.filterType == 'tinyText') {
                    let obj = {
                        tableCloumn: item.tableColum,
                        displayName: item.displayName,
                        ...JSON.parse(item.componentCode)
                    }
                    arr_Text.push(obj)
                }
            })
            console.log(arr_detailItem)
            setDetailItem(arr_detailItem);
        }
    }, [props.sqlData])

    // 获取图表数据 by BizCode
    const getBizCodeData = async (srvCode: any) => {
        let res0: any = await api.getDataByBizCode(Object.assign({ srvCode }));
        setLoading(false)
        // combine 组件 loading title
        props.getLoading && props.getLoading();
        // combine 组件 loading title--- end
        let res = res0.response;
        if (res.code === 0) {

            let data = props.dataFiled == undefined ? { ...res.data.cursor_result[0] } : { meta: res.data.cursor_result }
            console.log(data);
            if (data.meta != null && data.meta != undefined && props.dataFiled == undefined) {
                data.meta = data.meta.split(',');
                let meta = data.meta.map((item: any) => {
                    return item * 1;
                })
                data.meta = meta;
            }
            // 数据是数组的

            if (data.meta != null && data.meta != undefined && props.dataFiled != undefined) {

                let meta = data.meta.map((item: any) => {
                    return item[props.dataFiled] * 1;
                })
                data.meta = meta;
            }
            if (props.filterType == "tinyProgress") {
                let { measureField, targetField, rangeField } = props.config;
                data[measureField] = [data[measureField]];
                data[rangeField] = [data[rangeField]];
                data[targetField] = Number(data[targetField]);
            }

            res.data.cursor_result && setData({ ...data });

        } else {
            message.error(res.message || '操作失败');
        }
    }

    const [config, setConfig] = useState<any>(null);
    useEffect(() => {
        if (props.config != undefined) {
            let condition = ["span", "offset"];
            let config = { ...props.config };
            for (let key in config) {
                if (condition.includes(key)) {
                    delete config[key];
                }
            }
            setConfig(config);
        }
    }, [props.config])

    return (
        <>
            {tData != null && props.filterType && props.config && props.sqlData &&
                props.filterType == "tinyArea" ?
                <Card
                    bodyStyle={{ padding: '20px 24px 8px' }}
                    bordered={false}
                >
                    <Skeleton loading={loading} active>
                        <Row wrap={false}>
                            <Col span={12}><span>{title}</span></Col>
                            <Col span={12}>
                                <div style={{ textAlign: 'right' }}>
                                    <Tooltip title={describe}><QuestionCircleOutlined /></Tooltip>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className={styles.tinyNumber}>

                                <span style={{ fontSize: '20px' }}>{tingyNumberType == "isDollar" ? "$" + tData[tingyNumberField] : tingyNumberType == "isPercentage" ? tData[tingyNumberField] + "%" : tingyNumberType == "isYuan" ? "￥" + tData[tingyNumberField] : tData[tingyNumberField]}</span>
                            </Col>
                            <Col span={24}>
                                {tData && config != null && (<TinyArea data={tData.meta} {...config} ></TinyArea>)}
                            </Col>
                        </Row>
                        <Row style={{
                            margin: "10px 0 0 0",
                            paddingTop: "5px",
                            height: "28px",
                            borderTop: "1px solid #f5f5f5",
                        }}
                        >
                            {
                                detailItem.length > 0 ? detailItem.map((it: any) => (
                                    <Col span={it?.span ? it.span : 12}>
                                        {it.displayName}
                                        <span style={{ paddingLeft: "5px" }}>{tData[it.tableCloumn]}</span>
                                    </Col>
                                ))
                                    :
                                    <Col></Col>
                            }
                        </Row>
                    </Skeleton>
                </Card>
                :
                (
                    props.filterType == "tinyColumn" ?
                        <Card
                            bodyStyle={{ padding: '20px 24px 8px' }}
                            bordered={false}
                        >
                            <Skeleton loading={loading} active>
                                <Row wrap={false}>
                                    <Col span={12}><span>{title}</span></Col>
                                    <Col span={12}><div style={{ textAlign: 'right' }}><Tooltip title={describe}><QuestionCircleOutlined /></Tooltip></div></Col>
                                </Row>
                                <Row>
                                    <Col span={24} className={styles.tinyNumber}>
                                        <span style={{ fontSize: '20px' }}>{tingyNumberType == "isDollar" ? "$" + tData[tingyNumberField] : tingyNumberType == "isPercentage" ? tData[tingyNumberField] + "%" : tData[tingyNumberField]}</span>
                                    </Col>
                                    <Col span={24}>
                                        {tData && config != null && (<TinyColumn data={tData.meta} {...config} ></TinyColumn>)}
                                    </Col>
                                </Row>
                                <Row style={{
                                    margin: "10px 0 0 0",
                                    paddingTop: "5px",
                                    borderTop: "1px solid #f5f5f5",
                                    height: "28px",
                                }}
                                >{
                                        detailItem.length > 0 ? detailItem.map((it: any) => (
                                            <Col span={it?.span ? it.span : 12}>
                                                {it.displayName}
                                                <span style={{ paddingLeft: "5px" }}>{tData[it.tableCloumn]}</span>
                                            </Col>
                                        ))
                                            :
                                            <Col></Col>
                                    }
                                </Row>
                            </Skeleton>
                        </Card>
                        :
                        props.filterType == "tinyText" ?
                            <Card
                                bodyStyle={{ padding: '20px 24px 8px' }}
                                bordered={false}
                            >
                                <Skeleton loading={loading} active>
                                    <Row wrap={false}>
                                        <Col span={12}>
                                            <span>{title}</span>
                                        </Col>
                                        <Col span={12}>
                                            <div style={{ textAlign: 'right' }}>
                                                <Tooltip title={describe}><QuestionCircleOutlined /></Tooltip>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col className={styles.tinyNumber}>
                                            <span style={{ fontSize: '20px' }}>{tingyNumberType == "isDollar" ? "$" + tData[tingyNumberField] : tingyNumberType == "isPercentage" ? tData[tingyNumberField] + "%" : tData[tingyNumberField]}</span>
                                        </Col>
                                    </Row>
                                    <Row
                                        justify="space-between"
                                        align="middle"
                                        style={{ height: config?.height ? config?.height : 46 }}
                                    >
                                        {
                                            tinyItemText.length && tinyItemText.map((it: any) => (
                                                <Col span={it?.span ? it.span : 12}>
                                                    {it.displayName}
                                                    <span style={{ paddingLeft: "5px" }}>{tData[it.tableCloumn]}</span>
                                                </Col>
                                            )) && null
                                        }
                                    </Row>
                                    <Row
                                        style={{
                                            margin: "10px 0 0 0",
                                            paddingTop: "5px",
                                            borderTop: "1px solid #f5f5f5",
                                            height: "28px",
                                        }}
                                    >
                                        {
                                            detailItem.length > 0 ? detailItem.map((it: any) => (
                                                <Col span={it?.span ? it.span : 12}>
                                                    {it.displayName}
                                                    <span style={{ paddingLeft: "5px" }}>{tData[it.tableCloumn]}</span>
                                                </Col>
                                            ))
                                                :
                                                <Col></Col>
                                        }
                                    </Row>
                                </Skeleton>

                            </Card>
                            :
                            props.filterType == "tinyProgress" ?
                                <Card
                                    bodyStyle={{ padding: '20px 24px 8px' }}
                                    bordered={false}
                                >
                                    <Skeleton loading={loading} active>
                                        <Row wrap={false}>
                                            <Col span={12}><span>{title}</span></Col>
                                            <Col span={12}>
                                                <div style={{ textAlign: 'right' }}>
                                                    <Tooltip title={describe}><QuestionCircleOutlined /></Tooltip>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={24} className={styles.tinyNumber}>
                                                <span style={{ fontSize: '20px' }}>{tingyNumberType == "isDollar" ? "$" + tData[tingyNumberField] : tingyNumberType == "isPercentage" ? tData[tingyNumberField] + "%" : tData[tingyNumberField]}</span>
                                            </Col>
                                            <Col span={24}>
                                                {tData && config != null && (<Bullet data={[tData]} {...config} yAxis={false} ></Bullet>)}
                                            </Col>
                                        </Row>
                                        <Row style={{
                                            margin: "10px 0 0 0",
                                            paddingTop: "5px",
                                            borderTop: "1px solid #f5f5f5",
                                            height: "28px",
                                        }}
                                        >
                                            {
                                                detailItem.length > 0 ? detailItem.map((it: any) => (
                                                    <Col span={it?.span ? it.span : 12}>
                                                        {it.displayName}
                                                        <span style={{ paddingLeft: "5px" }}>{tData[it.tableCloumn]}</span>
                                                    </Col>
                                                ))
                                                    :
                                                    <Col></Col>
                                            }
                                        </Row>
                                    </Skeleton>
                                </Card>
                                : null)

            }
        </>
    )
}
export default TinyChart;