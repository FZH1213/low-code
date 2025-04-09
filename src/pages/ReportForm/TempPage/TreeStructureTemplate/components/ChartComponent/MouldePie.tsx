import React, { useEffect, useState } from 'react';
import { Col, Row, Card } from 'antd';
// import { getDataByBizCode } from '@/services/api';
import styles from '../searchTree.less';
import PieCard from './PieCard';

const MouldePie: React.FC<{}> = (props: any) => {
    const { headerTitle, sqlData, SearchObj } = props;
    const [PieCards, setPieCard] = useState<any>(null);
    // 网络请求数据 格式化显示数据
    const getSrvCode = async (data: any) => {
        let Pies: any = [];

        data.intfIttrDescList1.map((item: any, index: any) => {
            // console.log(item.filterType == "Pie")
            if (item.filterType == "Pie") {
                let obj = {
                    key: index,
                    ...item
                }
                Pies.push(obj)
            }

        });
        setPieCard(Pies)
        return true;
        console.log(Pies);
    };
    useEffect(() => {
        if (sqlData != undefined) {
            getSrvCode(sqlData)
        }
    }, [sqlData])
    // 获取标题，获取显示内容规范---end
    return (
        <>
            {/* 头部标题 */}
            <div className={styles.title_header}>
                <span className={styles.blueline}></span>
                {headerTitle}
            </div>
            {/* 头部标题---end */}
            {/* 组织遍历内容 */}
            <Card style={{ marginBottom: "10px" }}>
                <Row wrap justify="center" >
                    {
                        PieCards != null && PieCards.map((item: any, index: any) => {
                            return (
                                <Col
                                    xs={24}  //屏幕 < 576px 响应式栅格
                                    sm={24}  //屏幕 ≥ 576px 响应式栅格 
                                    md={JSON.parse(item.componentCode).span ? JSON.parse(item.componentCode).span : 24}
                                >

                                    <PieCard
                                        angleField={JSON.parse(item.componentCode)?.angleField}
                                        componentCode={JSON.parse(item.componentCode)}
                                        key={index}
                                        sqlData={item?.intfManDesc}
                                        SearchObj={SearchObj}
                                    ></PieCard>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Card>
            {/* 组织遍历内容---end */}
        </>
    )
}
export default MouldePie;
