import React, { useEffect, useState } from 'react';
import { message, Card, List, Skeleton } from 'antd';
import styles from '../searchTree.less';
import api from '../../service';
const MoudleHeader: React.FC<{}> = (props: any) => {
    const { headerTitle, sqlData, Column, SearchObj } = props;
    const [tData, setData] = useState<any>();
    const [loading, setLoading] = useState<any>(true);
    // 网络请求数据 格式化显示数据
    const getBizCodeData = async (srvCode: any) => {
        setLoading(true);
        let res0: any = await api.getDataByBizCode(Object.assign({ srvCode }, { ...SearchObj }));
        let res = res0.response;
        if (res.code === 0) {
            let data = res.data.cursor_result.records[0]
            res.data.cursor_result && foramtData(data);
        } else {
            message.error(res.message || '操作失败');
        }
        setLoading(false);

    }
    // 数据做格式化
    const foramtData = (meta: any) => {
        // 模拟网络请求来的数据，后续做内容修改
        // console.log(meta)
        let sourceData: any = [];
        sqlData.intfIttrDescList1.map((item: any, index: any) => {
            if (meta[item.tableColum] != null && meta[item.tableColum] != undefined) {
                sourceData.push({
                    title: item.displayName,
                    value: meta[item.tableColum].toString().replace(/(?=(\B)(\d{3})+$)/g, ','),
                    key: index,
                })
            }
        })
        // console.log(sourceData);
        setData(sourceData);
    }
    useEffect(() => {
        if (sqlData != null && sqlData != undefined && SearchObj != undefined) {
            getBizCodeData(sqlData.intCode);
        }
    }, [sqlData, SearchObj])
    // 网络请求数据 格式化显示数据 --- end
    return (
        <>
            {/* 头部标题 */}
            <div className={styles.title_header}>

                <span className={styles.blueline}></span>
                {headerTitle}
            </div>
            {/* 头部标题---end */}
            {/* 组织遍历内容 */}
            <Skeleton loading={loading} active>
                <List
                    grid={{ gutter: 16, column: Column, xs: 1, sm: 2 }}
                    dataSource={tData}
                    renderItem={(item: any) => (
                        <List.Item>
                            <Card title={item.title}>{item.value}</Card>
                        </List.Item>
                    )}
                />
                {/* 组织遍历内容---end */}
            </Skeleton>
        </>
    )
}

export default MoudleHeader;
