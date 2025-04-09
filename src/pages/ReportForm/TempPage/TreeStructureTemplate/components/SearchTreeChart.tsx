import React, { useEffect, useState } from 'react';
import {
    Input,
    Card,
    Row,
    Col
} from 'antd';
// import styles from '../style.less';
import './searchTree.less';
// import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import { getDataByBizCode } from '@/services/api';
// import moment from 'moment';
// import api from '../service';
// import { FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import MouldHeader from './ChartComponent/MouldeHeader';
import MouldePie from './ChartComponent/MouldePie';

const { Search } = Input;

const SearchTreeChart: React.FC<{}> = (props: any) => {
    const { ChartTitle, linkRowDetial, ChartID } = props;
    const [HeaderTitle, setHeaderTitle] = useState<any>(null);
    const [MouldeHeader, setMouldeHeader] = useState<any>(null);
    const [MoulderBodys, setMoulderBodys] = useState<any>(null);

    const [linkRowDetialChat, setlinkRowDetialChat] = useState<any>(null);
    const [SearchObj, setSearchObj] = useState<any>(null);
    // 设置头部title名
    useEffect(() => {
        // 数据初始化
        if (props.linkRowDetial != undefined && props.linkRowDetial != null && JSON.stringify(props.linkRowDetial) != "{}") {
            // console.log(props.linkRowDetial[ChartTitle])
            console.log(props.linkRowDetial)
            setlinkRowDetialChat(linkRowDetial)
        }
    }, [linkRowDetial])
    useEffect(() => {
        if (linkRowDetialChat != null) {

            setHeaderTitle(linkRowDetialChat[ChartTitle])
            let SearchValue = { ...linkRowDetialChat };
            for (let key in SearchValue) {
                // console.log(ChartID)
                if (key != ChartID) {
                    console.log(key);
                    delete (SearchValue[key]);
                }
            }
            setSearchObj(SearchValue);
        }
    }, [linkRowDetialChat, ChartTitle])
    // 设置头部title名 --end
    // 获取页面图表各个模块类型配置属性
    const getSrvCode = async (data: any) => {
        let MouldeHeader: any = [];
        let MoulderBody: any = [];

        data.intfIttrDescList1.map((item: any, index: any) => {
            // const condition = ["MoudleHeader","MouldeBody"];
            console.log(item.filterType == "MouldeHeader")
            if (item.filterType == "MouldeHeader") {
                let obj = {
                    key: index,
                    ...item
                }
                MouldeHeader.push(obj);
            }
            if (item.filterType == "MouldePie") {
                let obj = {
                    key: index,
                    ...item
                }
                MoulderBody.push(obj);
            }
        });
        console.log(MouldeHeader)
        setMouldeHeader(MouldeHeader);
        setMoulderBodys(MoulderBody);
        return true;

    };
    useEffect(() => {
        if (props.sqlData != null && props.sqlData != undefined) {
            console.log(props.sqlData)
            getSrvCode(props.sqlData)
        }
    }, [props.sqlData])
    // 获取页面图表各个模块类型配置属性 --- endF

    return (
        <div>
            <Card>
                {HeaderTitle}
            </Card>

            {MouldeHeader && MouldeHeader.length > 0 && SearchObj != null ?
                MouldeHeader.map((item: any, index: any) => {
                    return (
                        <MouldHeader
                            headerTitle={item.displayName}
                            Column={JSON.parse(item.componentCode)?.column}
                            key={index}
                            sqlData={item?.intfManDesc}
                            SearchObj={SearchObj}
                        ></MouldHeader>
                    )
                })
                :
                null
            }
            <Row wrap gutter={[16, 16]} style={{ backgroundColor: "rgba(255,255,255,0)" }}>
                {MoulderBodys && MoulderBodys.length > 0 && SearchObj != null ?
                    MoulderBodys.map((item: any, index: any) => {
                        return (
                            <Col
                                xs={24}  //屏幕 < 576px 响应式栅格
                                sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 6}
                            >
                                <MouldePie
                                    headerTitle={item.displayName}
                                    componentCode={JSON.parse(item.componentCode)}
                                    key={index}
                                    sqlData={item?.intfManDesc}
                                    SearchObj={SearchObj}
                                ></MouldePie>
                            </Col>
                        )
                    })
                    :
                    null
                }
            </Row>
        </div>
    )
}
export default SearchTreeChart;