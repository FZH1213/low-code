import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { Card, } from '@/components/base';
import GraphPanel from './components/GraphPanel';
import InfoDetails from './components/InfoDetails';
import Toolbar from './components/ToolbarPanel';
import NodesPanel from './components/NodesPanel';
import NodesForm from './components/NodesForm';

interface AntdChartProps {

};
const AntdChart: AntdChartProps = () => {
    const graphRef = useRef<any>({}); // 流程内容

    useEffect(() => {
        console.log('%c测试', 'color: white; background: red;', graphRef)
    }, []);

    return (
        <Card
            title={"流程标题"}
            className={styles.main}
        >
            {/* 详情信息 */}
            <InfoDetails />

            <div className={styles.content}>
                {/* 工具栏 */}
                <Toolbar />

                <div className={styles.canvans_content}>
                    {/* 节点列表 */}
                    <NodesPanel />

                    {/* 流程内容图 */}
                    <GraphPanel ref={graphRef} />

                    {/* 节点表单 */}
                    <NodesForm />
                </div>
            </div>
        </Card>
    );
}
export default AntdChart;