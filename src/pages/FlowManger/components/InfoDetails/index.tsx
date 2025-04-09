import { Descriptions } from '@/components/base';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';

const InfoDetails = (props) => {
    const { flowCode, flowName, gmtModified } = props.flowDefData
    return (
        <Descriptions
            size="small"
            className={styles.desc}
        >
            <Descriptions.Item label={"名称"}>
                {flowCode}
            </Descriptions.Item>
            <Descriptions.Item label={"描述"}>
                {flowName}
            </Descriptions.Item>
            <Descriptions.Item label={"更新时间"}>
                {gmtModified ? gmtModified : '-'}
            </Descriptions.Item>
        </Descriptions>
    )
}

export default InfoDetails