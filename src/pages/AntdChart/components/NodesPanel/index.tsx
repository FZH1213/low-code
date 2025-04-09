import { Collapse } from '@/components/base';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import startSvg from './img/start.svg';
import userTaskSvg from './img/user-task.svg';
import exclusiveGatewaySvg from './img/exclusive-gateway.svg';
import endSvg from './img/end.svg';

const NodesPanel = () => {
    return (
        <Collapse className={styles.node_list}>
            <Collapse.Panel header={"开始节点"} key={"1"}>
                <img
                    src={startSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>开始节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"活动"} key={"2"}>
                <img
                    src={userTaskSvg}
                    style={{ width: 80, height: 44 }}
                />
                <div>审核节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"网关"} key={"3"}>
                <img
                    src={exclusiveGatewaySvg}
                    style={{ width: 48, height: 48 }}
                />
                <div>排他网关</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            {/* <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel>
            <Collapse.Panel header={"结束事件"} key={"4"}>
                <img
                    src={endSvg}
                    style={{ width: 42, height: 42 }}
                />
                <div>结束节点</div>
            </Collapse.Panel> */}
        </Collapse>
    )
}

export default NodesPanel;