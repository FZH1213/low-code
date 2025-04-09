import React, { useState, useRef, useEffect } from 'react';
import {
    Image,
    Input,
    Tabs,
    Card,
    Col,
    Button,
    Modal,
    Row
} from 'antd';
import style from "./index.less";
import { PageContainer } from '@/components/pro/pro-layout';

/**
 * 
 * @param props 
 * @returns 表单设计器
 */
const FormConfig: React.FC<{}> = (props) => {



    return (
        <PageContainer title={false}>
            <Card>
                <Row>
                    <Col span={8} className={style.leftcontainer}>
                        <div className={style.container}>
                            <div></div>
                            <div className={style.containerButton}>添加组件</div>
                        </div>

                    </Col>
                    <Col span={16}>

                    </Col>
                </Row>
            </Card>
        </PageContainer>
    );
};

export default FormConfig;