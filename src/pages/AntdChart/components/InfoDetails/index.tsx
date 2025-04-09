import { Descriptions } from '@/components/base';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';

const InfoDetails = () => {
    return (
        <Descriptions
            size="small"
            className={styles.desc}
        >
            <Descriptions.Item label={"名称"}>
                名称
            </Descriptions.Item>
            <Descriptions.Item label={"版本"}>
                版本
            </Descriptions.Item>
            <Descriptions.Item label={"更新时间"}>
                更新时间
            </Descriptions.Item>
            <Descriptions.Item label={"描述"} span={3}>
                描述
            </Descriptions.Item>
        </Descriptions>
    )
}

export default InfoDetails