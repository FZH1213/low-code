import React, { useEffect, useState } from 'react';
import { message, Card, Skeleton } from 'antd';
import styles from '../searchTree.less';
import { Pie } from '@ant-design/plots';
import api from '../../service';
const PieCard: React.FC<{}> = (props: any) => {

    const { sqlData, componentCode, angleField, SearchObj } = props;
    const [title, setTitle] = useState<any>([]);
    const [loading, setLoading] = useState<any>(true);
    const [total, setTotal] = useState<any>(null);
    const [config, setConfig] = useState<any>(null);
    const [isShowTitle, setisShowTitle] = useState<any>(null);
    // const [height, setHeight] = useState<any>(null);
    const [tData, setData] = useState<any>(null);
    // 网络请求数据 格式化显示数据
    const getBizCodeData = async (srvCode: any) => {
        setLoading(true);
        let res0: any = await api.getDataByBizCode(Object.assign({ srvCode }, { ...SearchObj }));
        let res = res0.response;
        setLoading(false);
        if (res.code === 0) {
            let data = res.data.cursor_result
            res.data.cursor_result && foramtData(data);
        } else {
            message.error(res.message || '操作失败');
        }
    }
    // 数据做格式化
    const foramtData = (meta: any) => {
        // 模拟网络请求来的数据，后续做内容修改
        // 统计数目
        // let sourceData: any = [];
        // sqlData.intfIttrDescList1.map((item: any, index: any) => {
        //     if (meta[item.tableColum] != null && meta[item.tableColum] != undefined) {
        //         sourceData.push({
        //             title: item.displayName,
        //             value: meta[item.tableColum].toString().replace(/(?=(\B)(\d{3})+$)/g, ','),
        //             key: index,
        //         })
        //     }
        // })
        let sum = 0;
        meta = meta.map((item: any) => {
            sum += Number(item[angleField])
            item[angleField] = Number(item[angleField])
            return item;
        })
        setTotal(sum)
        setData(meta);
    }
    useEffect(() => {
        if (angleField != undefined && sqlData != null && sqlData != undefined && SearchObj != undefined) {
            getBizCodeData(sqlData.intCode);
        }
    }, [sqlData, angleField, SearchObj])

    // 网络请求数据 格式化显示数据 --- end
    // 获取标题，获取显示内容规范
    const propType = (componentCode: any) => {
        let config = { ...componentCode };
        let { title, isShowTitle, label, legend } = componentCode;
        let statistic: any = {};
        let interactions: any = [];
        if (title != undefined) {
            setTitle(title)
        }
        if (isShowTitle != undefined) {
            setisShowTitle(isShowTitle)
        }
        // if (mouldeHeight != undefined) {
        //     setMouldeHeight(mouldeHeight)
        // }
        if (label) {
            label = {
                type: 'spider',
                labelHeight: 28,
                content: '{name}\n{percentage}',
            }
        }
        if (!legend) {
            statistic = {
                title: {
                    offsetY: -4,
                    content: title,
                },
                content: {
                    content: total,
                }
            }
        } else {
            legend = {
                layout: 'vertical',
                position: 'bottom-right'
            },
                statistic = {
                    title: {
                        style: {
                            fontSize: 14,
                        },
                        offsetY: -4,
                        content: title,
                    },
                    content: {
                        style: {
                            fontSize: 14,
                        },
                        content: total,
                    }
                }
            interactions = [
                {
                    type: 'element-selected',
                },
                {
                    type: 'element-active',
                },
                {
                    type: 'pie-statistic-active',
                },
            ]
        }
        const condition = ["span", "title", "isShowTitle", "mouldeHeight", "label", "legend"];
        for (let key in config) {
            if (condition.includes(key)) {
                delete config[key]
            }
        }
        config = Object.assign({ ...config }, { label }, { legend }, { statistic }, { interactions })

        return config;
    }
    useEffect(() => {

        if (total != null && componentCode != null && componentCode != undefined) {


            setConfig(propType(componentCode))

        }

    }, [componentCode, total])
    // 获取标题，获取显示内容规范---end
    return (
        <div>
            <Skeleton loading={loading} active>

                {isShowTitle ?
                    <div className={styles.title_line}>
                        <p className={styles.title_item}>{title}</p>
                        <p className={styles.title_item}>{total}</p>
                    </div>
                    :
                    <div className={styles.title_line}>
                    </div>
                }
                {tData && config &&
                    <Card>
                        <Pie data={tData} {...config} />
                    </Card>
                }
            </Skeleton>
        </div>
    )
}
export default PieCard;