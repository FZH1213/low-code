import { FormInstance, message } from '@/components/base';
import {
    Card,
    Space,
    Modal,
    Input,
    Drawer,
    BizTable,
    Button,
    Tabs,
    createInput,
    createButton,
    createConfirm,
    createTagFunction
} from '@/components/base';
import { PageContainer } from '@/components/pro/pro-layout';
import TableSearchForm, { TableSearchFormInstance } from '@/components/TableSearchForm';
import type { ColumnsType } from 'antd/es/table/interface';
import {
    fetchRolePage,
    removeByRoleId,
} from './service';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { Typography } from 'antd';
import { formListHistory } from '@/utils/historicalPreservation';
import { bizExecByCode } from '@/services/templateApi';

export interface ComponentProps { }

const functionsMap = { //方法映射
    createInput,
    createButton,
    createConfirm,
    createTagFunction
}

const apiMap = { //接口映射
    bizExecByCode,
    removeByRoleId
}

const _componentsMap = { //组件映射
    Input
}
const FunctionComponent: React.FC<ComponentProps> = (props: { [key: string]: any }) => {
    const [operate, setOperate] = useState<number>(0);
    const queryFormRef = useRef<TableSearchFormInstance | undefined>(undefined);
    //查询条件
    const [searchFormValues, setSearchFormValues] = useState<any>();
    // 防多次点击 置灰
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);

    // 获取页面属性数据
    const [components, setComponents] = useState<any>(undefined);


    //初始化方法
    useEffect(() => {
        /**
         *  加载
         */
        handleBizExecByCode()
    }, [props.location.query._tcode])

    const handleBizExecByCode = async () => {
        let res = await apiMap['bizExecByCode']({ _code: props.location.query._tcode });
        if (res.code === 0) {
            Object.entries(res.data._functions).forEach(([key, value]) => {
                if (key.startsWith("const_")) {
                    functionsMap[key] = value
                } else {
                    functionsMap[key] = eval(value)
                }
            });
            setComponents(res.data)
            setSearchFormValues({ _code: functionsMap["const_queryBizCode"] })
        } else {
            message.error('请求失败请重试');
        }
    }
    //查询框
    const [queryFieldsProp, setQueryFieldsProp] = useState([])
    useEffect(() => {
        if (!!components) {
            components._params._queryFieldsProp.map(item => {
                item['components'] = eval(item['_eval_components'])
            });
            setQueryFieldsProp(components._params._queryFieldsProp);
        }
    }, [components]);
    //topOpter
    const createTopOpter = (data: any) => {
        return (
            <Space>
                {data.map(item => { return eval(item) })}
            </Space>
        )
    }
    //col
    const [tableColumns, setTableColumns] = useState<ColumnsType<any>>([]);
    useEffect(() => {
        if (!!components) {
            components._params._tableCol.map(item => {
                item['render'] = eval(item['_eval_render'])
            });
            setTableColumns(components._params._tableCol);
        }
    }, [components]);//据说改子节点修改是不会重新触发

    function createOper(_, record) {
        components._params._colOper.map(item => {
            item['onClick'] = eval(item['_eval_onclick'])
        });
        return (
            <Space>
                {
                    components._params._colOper ? components._params._colOper.map(item => {
                        return (<Typography.Link onClick={() => item.onClick(record)}>{item.name}</Typography.Link>)
                    }) : ""
                }

            </Space>
        );
    }
    const handleCancel = () => {
        setOperate(0);
    };



    const handleOk = eval(`() => {
        setSubmitDisabled(true);
        setTimeout(() => {
            setSubmitDisabled(false);
        }, 2000);
    };`)
    return (
        <>
            <TableSearchForm
                ref={queryFormRef}
                queryFieldsProp={queryFieldsProp}
                onSearch={(values) => {
                    values['_code'] = functionsMap["const_queryBizCode"]
                    setSearchFormValues(values);
                }}
                onReset={() => {
                    setSearchFormValues({ _code: functionsMap["const_queryBizCode"] });
                }}
            />
            <Card
                className={styles.newMarginCard}
                title={components ? createTopOpter(components._params._topOper) : ""
                }
            >
                {/* 表格 */}
                <BizTable
                    columns={tableColumns}
                    listService={bizExecByCode}
                    rowKey="roleId"
                    searchFormValues={searchFormValues}
                    rowSelection={{
                        type: 'checkbox',
                    }}
                />
            </Card>

            <Drawer
                visible={operate !== 0}
                onClose={handleCancel}
                destroyOnClose
                footer={
                    <div className={styles.roleManagementDrawer}>
                        <Button
                            className={styles.roleManagementBtn}
                            type="primary"
                            disabled={submitDisabled}
                            loading={submitDisabled}
                            onClick={handleOk}
                        >
                            保存
                        </Button>
                        <Button className={styles.roleManagementBtn} onClick={handleCancel}>
                            关闭
                        </Button>
                    </div>
                }
            >
            </Drawer>
        </>
    );
};

export default FunctionComponent;
