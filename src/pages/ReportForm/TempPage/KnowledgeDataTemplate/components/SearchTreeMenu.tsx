import React, { useEffect, useState } from 'react';
import {
    Tree,
    Input,
    Card,
    Button,
    Spin,
    message,
    Dropdown,
    Menu,
    Space,
    Popconfirm,
    Empty
} from 'antd';
import styles from '../style.less';
import './searchTree.less';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// import { getDataByBizCode } from '@/services/api';
import moment from 'moment';
import api from '../service';
import { FORM_ITEM_API, TABLE_COLUMN_API } from '@/utils/constant';
import ModalFormItem from './ModalFormItem';
import ModalFormTemplate from '../../ModalFormTemplate';
import ModalFormProTemplate from '../../ModalFormProTemplate';
const { Search } = Input;

const SearchTreeMenu: React.FC<{}> = (props: any) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [intCode, setIntCode] = useState<any>('');
    // 树属性配置
    const [gData, setGData] = useState<any>([]);
    const [renderData, setRenderData] = useState<any>([]);
    const [dataList, setDataList] = useState<any>([]);
    const [expandedKeys, setExpandedKeys] = useState<any>([]);
    const [searchValue, setSarchValue] = useState<any>('');
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    // 新增按钮、编辑
    const [topbtnArr, setTopbtnArr] = useState<any>([]);
    const [opebtnArr, setOpebtnArr] = useState<any>([]);
    //编辑树节点
    const [treeNodeEdit, setTreeNodeEdit] = useState<boolean>(false);
    // 表单属性
    const [formFieldsProp, setFormFieldsProp] = useState([]);
    const [initData, setInitData] = useState(undefined);
    // 弹窗部分
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<any>(undefined);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalEditVisible, setModalEditVisible] = useState<boolean>(false);
    const [recordDetial, setRecordDetial] = useState<any>(undefined);
    const [submitCode, setSubmitCode] = useState<any>(undefined);  //用原有的页面属性
    const [modalPageLink, setModalPageLink] = useState<any>(undefined); //跳转页面
    const [modalFormTemplate, setModalFormTemplate] = useState<boolean>(false)  //新增模板链接（不含附件）
    const [modalFormProTemplate, setModalFormProTemplate] = useState<boolean>(false)  //新增模板链接（含附件）
    const [editCode, setEditCode] = useState<any>('');
    const [delCode, setDelCode] = useState<any>('');
    const [userName, setUserName] = useState<any>({});
    useEffect(() => {
        getViewData()
    }, []);

    // 初始化话进入页面所有数据
    const getViewData = async () => {
        const res1: any = pharsePageProps(props.sqlData);
        const { srvCode } = res1;
        res1 && getBizCodeData(srvCode);
    }

    // 获取页面下拉框子项数据
    const getInitData = async (code: any) => {
        if (code) {
            let res: any = await api.execByCode(JSON.stringify({}), code);
            res.response.code === 0 ? setInitData(res.response.data) : message.error(res.response.message || '操作失败');
        }
    }
    const getUserName = async (code: any, tableColum: any) => {
        let res: any = await api.execByCode(JSON.stringify({}), code);
        let obj = {}
        if (res.response.code === 0) {
            obj[tableColum] = res.response.data
        } else {
            message.error(res.response.message || '操作失败');
        }
        setUserName({ ...userName, ...obj })
    }


    //树菜单模块 属性解释
    const pharsePageProps = (data: any) => {
        let obj: any = []; //图表过滤参数值
        let topbtnArr: any = [];
        let opebtnArr: any = [];
        // 表单属性
        let fieldsArr: any = [];
        // 保存数据编码
        setIntCode(data?.intCode);
        // 获取下拉list接口
        getInitData(data?.initDataApi);
        // 按钮数据属性解析
        data && data?.topBut.map((it: any) => {
            if (it.position.includes('1')) {
                topbtnArr.push(it)
            } else if (it.position.includes('2')) {
                opebtnArr.push(it);
            }
            if (it.type === '5') {
                setEditCode(it.code)
            }
            if (it.type === '7') {
                setDelCode(it.code)
            }
        });
        setTopbtnArr(topbtnArr);
        setOpebtnArr(opebtnArr);

        // 搜素框解析、列表属性解析
        data && data?.intfIttrDescList1.map((item: any, index: any) => {
            let componentCode = JSON.parse(item.componentCode);
            let formItemProps: any = {};
            item.code && getUserName(item.code, item.tableColum)
            for (let key in componentCode) {
                if (FORM_ITEM_API.includes(key)) {
                    formItemProps[key] = componentCode[key];
                    delete componentCode[key];
                }
                if (TABLE_COLUMN_API.includes(key) || key === 'searchSpan' || key === 'isAdd' || key === 'isEdit' || key === 'isDetial' || key === 'name' || key === 'label' || key === 'rules') {
                    delete componentCode[key];
                }
            }
            // 表单属性构建
            let f_obj: any = {
                key: index,
                filterType: item.filterType,
                isFilter: item.isFilter,
                isDisabled: item.isDisabled,
                tableColum: item.tableColum,
                displayName: item.displayName,
                formItemProps: formItemProps,
                componentCode: componentCode,
                code: item.code,
            }
            fieldsArr.push(f_obj);
        });
        setFormFieldsProp(fieldsArr);
        // 数据接口参数解释
        data && data?.opeBut.map((ite: any) => {
            if (ite.paramValue && ite.paramType) {
                if (ite.paramType == 'datePicker') {
                    obj[ite.paramName] = moment(ite.paramValue);
                } else if (ite.paramType == 'rangerPicker') {
                    let arr: any = [moment(ite.paramValue.split(',')[0]), moment(ite.paramValue.split(',')[1])];
                    obj[ite.paramName] = arr;
                } else {
                    obj[ite.paramName] = ite.paramValue;
                }
            }
        });
        obj.srvCode = data.intCode;
        return obj;
    }


    // 获取列表数据 by BizCode
    const getBizCodeData = async (srvCode: any) => {
        setLoading(true);
        let res0: any = await api.getDataByBizCode(Object.assign({ srvCode }));
        let res = res0.response;
        if (res.code === 0 && res.data.cursor_result) {
            setDataList(res.data.cursor_result);
            props.getSelTreeNodeValue(props.treeIdKey, props.treeRefreshFlag == 2 ? [] : selectedKeys, res.data.cursor_result.find((it: any) => it[props.treeIdKey] === selectedKeys[0]));
            toTreeData(res.data.cursor_result, props.treeIdKey, props.treeParentIdKey);
        } else {
            res.code !== 0 && message.error(res.message || '操作失败')
        }
        setLoading(false);
    }

    // 扁平数据转换为树形结构
    const toTreeData = (arr: any, primaryKey: any, parentId: any) => {
        arr.forEach(function (item: any) {
            delete item.children;
        });
        let map = {}; // 构建map
        arr.forEach((i: any) => {
            map[i[primaryKey]] = i; // 构建以primaryKey为键 当前数据为值
        });
        let treeData: any = [];
        arr.forEach((child: any) => {
            const mapItem = map[child[parentId]]; // 判断当前数据的parentId是否存在map中
            if (mapItem) {
                (mapItem.children || (mapItem.children = [])).push(child);
            } else {
                // 不存在则是组顶层数据
                treeData.push(child);
            }
        });
        setGData(treeData);
        // 初始搜索为null的值
        setRenderData(treeData)
        setLoading(false)
    };

    // 删除方法
    const deleteTreeNode = async () => {
        const { title, ...obj }: any = { ...props.linkRowDetial }
        let res: any = await api.execByCode(JSON.stringify({ ...obj }), delCode);
        if (res.response.code === 0) {
            message.success(res.response.message);
            props.refreshPage(2)
        } else {
            message.error(res.response.message);
        }
    }
    const NullMenu = (<Menu></Menu>)
    const menuBtn = (
        <Menu
            items={
                [
                    {
                        label: <React.Fragment>
                            <Space>
                                {
                                    props.sqlData.topBut.length && props.sqlData.topBut.filter((item: any) => item.position == 1).map((ite: any, i: any) => (
                                        ite.type == 1 ? //新增弹窗
                                            (
                                                <a
                                                    key={i}
                                                    disabled={props.selectedKeysValue ? false : true}
                                                    style={{ fontSize: '12px' }}
                                                    onClick={(e) => {
                                                        let newRecord: any = { ...props.linkRowDetial }
                                                        const { id } = newRecord
                                                        setRecordDetial({ pid: id, ...userName });
                                                        // 树节点新增
                                                        setIsDisabled(false);
                                                        props.selectedKeysValue && setModalVisible(true);
                                                        setModalTitle(ite.name);
                                                        setSubmitCode(ite.code);
                                                        e.stopPropagation()
                                                    }}
                                                >
                                                    {ite.name}
                                                </a>
                                            )
                                            : (
                                                ite.type == 2 ? //新增弹窗
                                                    (
                                                        <a
                                                            key={i}
                                                            disabled={props.selectedKeysValue ? false : true}
                                                            style={{ fontSize: '12px' }}
                                                            onClick={(e) => {
                                                                // 树节点新增
                                                                // setIsDisabled(false);
                                                                // setModalVisible(true);
                                                                // setModalTitle(ite.name);
                                                                // setModalPageLink(ite.link);
                                                                let newRecord: any = { ...props.linkRowDetial }
                                                                const { id } = newRecord
                                                                if (ite.link.indexOf('/report-manage/ModalFormReport?id=') > -1) {
                                                                    setIsDisabled(false);
                                                                    setModalTitle(ite.name);
                                                                    setModalPageLink(ite.link);
                                                                    props.selectedKeysValue && setModalFormTemplate(true)
                                                                    setRecordDetial({ pid: id, ...userName });
                                                                } else if (ite.link.indexOf('/report-manage/ModalFormProReport?id=') > -1) {
                                                                    setIsDisabled(false);
                                                                    setModalTitle(ite.name);
                                                                    setModalPageLink(ite.link);
                                                                    props.selectedKeysValue && setModalFormProTemplate(true)
                                                                    setRecordDetial({ pid: id, ...userName });
                                                                }
                                                                e.stopPropagation()
                                                            }}
                                                        >
                                                            {ite.name}
                                                        </a>
                                                    ) : null
                                            )
                                    ))
                                }
                            </Space>
                        </React.Fragment>,
                        key: '0'
                    },
                    {
                        label: <React.Fragment>
                            <Space>
                                {
                                    props.sqlData.topBut.length && props.sqlData.topBut.filter((item: any) => item.position == 2).map((ite: any, i: any) => (
                                        ite.type == 5 ? //编辑弹窗
                                            (
                                                <a
                                                    key={i}
                                                    disabled={props.selectedKeysValue ? false : true}
                                                    style={{ fontSize: '12px' }}
                                                    onClick={(e) => {
                                                        let newRecord: any = { ...props.linkRowDetial }
                                                        formFieldsProp.forEach((item: any) => {
                                                            if (item.filterType == 'datePicker') {
                                                                if (!!newRecord[item.tableColum] && newRecord[item.tableColum]) {
                                                                    newRecord[item.tableColum] = moment(newRecord[item.tableColum])
                                                                } else {
                                                                    newRecord[item.tableColum] = moment()
                                                                }
                                                            }
                                                            if (item.filterType == 'rangerPicker') {
                                                                if (!!newRecord[item.tableColum] && newRecord[item.tableColum]) {
                                                                    let arr: any = [moment(newRecord[item.tableColum].split(',')[0]), moment(newRecord[item.tableColum].split(',')[1])];
                                                                    newRecord[item.tableColum] = arr;
                                                                } else {
                                                                    newRecord[item.tableColum] = [moment(), moment()];
                                                                }
                                                            }
                                                        });
                                                        // 树节点编辑
                                                        setRecordDetial(newRecord);
                                                        props.selectedKeysValue && setModalEditVisible(true);
                                                        setModalTitle('编辑');
                                                        e.stopPropagation()
                                                    }}
                                                >
                                                    {ite.name}
                                                </a>
                                            )
                                            : (
                                                ite.type == 2 ? //编辑弹窗
                                                    (
                                                        <a
                                                            key={i}
                                                            style={{ fontSize: '12px' }}
                                                            disabled={props.selectedKeysValue ? false : true}
                                                            onClick={(e) => {
                                                                let newRecord: any = { ...props.linkRowDetial }
                                                                formFieldsProp.forEach((item: any) => {
                                                                    if (item.filterType == 'datePicker') {
                                                                        if (!!newRecord[item.tableColum] && newRecord[item.tableColum]) {
                                                                            newRecord[item.tableColum] = moment(newRecord[item.tableColum])
                                                                        } else {
                                                                            newRecord[item.tableColum] = moment()
                                                                        }
                                                                    }
                                                                    if (item.filterType == 'rangerPicker') {
                                                                        if (!!newRecord[item.tableColum] && newRecord[item.tableColum]) {
                                                                            let arr: any = [moment(newRecord[item.tableColum].split(',')[0]), moment(newRecord[item.tableColum].split(',')[1])];
                                                                            newRecord[item.tableColum] = arr;
                                                                        } else {
                                                                            newRecord[item.tableColum] = [moment(), moment()];
                                                                        }
                                                                    }
                                                                });
                                                                // 树节点编辑
                                                                // setModalVisible(true);
                                                                // setRecordDetial(newRecord);
                                                                // setModalTitle(ite.name);
                                                                // setModalPageLink(ite.link);
                                                                if (ite.link.indexOf('/report-manage/ModalFormReport?id=') > -1) {
                                                                    setModalTitle(ite.name);
                                                                    setModalPageLink(ite.link);
                                                                    setRecordDetial(newRecord);
                                                                    props.selectedKeysValue && setModalFormTemplate(true)
                                                                } else if (ite.link.indexOf('/report-manage/ModalFormProReport?id=') > -1) {
                                                                    setModalTitle(ite.name);
                                                                    setModalPageLink(ite.link);
                                                                    setRecordDetial(newRecord);
                                                                    props.selectedKeysValue && setModalFormProTemplate(true)
                                                                }
                                                                e.stopPropagation()
                                                            }}
                                                        >
                                                            {ite.name}
                                                        </a>
                                                    ) : null
                                            )
                                    ))
                                    // 树节点编辑
                                    // setRecordDetial(newRecord);
                                    // setModalVisible(true);
                                    // setModalTitle('编辑');
                                }
                            </Space>
                        </React.Fragment>,
                        key: '1',
                    },
                    {
                        label:
                            props.selectedKeysValue ?
                                <React.Fragment>
                                    <Space>
                                        <Popconfirm
                                            title="确认删除此节点？"
                                            onConfirm={() => deleteTreeNode()}
                                            okText="确定"
                                            cancelText="取消"
                                            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                                        >
                                            <a
                                                className='deleteBtn'
                                                disabled={false}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                style={{ fontSize: '12px' }}
                                            >删除</a>
                                        </Popconfirm>
                                    </Space>
                                </React.Fragment>

                                :
                                <React.Fragment>
                                    <Space>
                                        <a
                                            className='deleteBtn'
                                            disabled={true}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            style={{ fontSize: '12px' }}
                                        >删除</a>
                                    </Space>
                                </React.Fragment>
                        ,
                        key: '2',
                    }
                ]
            }
        >
        </Menu>
    )
    // 格式化树形数据
    const loop = (data: any) =>
        data.map((item: any) => {
            const index = item[props.treeTitleKey] && item[props.treeTitleKey].indexOf(searchValue)
            const beforeStr = item[props.treeTitleKey] && item[props.treeTitleKey].substring(0, index);
            const afterStr = item[props.treeTitleKey] && item[props.treeTitleKey].slice(index + searchValue.length);
            const title =
                index > -1 ? (
                    <Dropdown overlay={modalVisible || modalEditVisible ? NullMenu : menuBtn} trigger={['contextMenu']} align={{ offset: [0, 20] }}>
                        <span>
                            {beforeStr}
                            <span style={{ color: '#f50' }}>{searchValue}</span>
                            {afterStr}
                        </span>
                    </Dropdown>
                ) : (
                    <Dropdown overlay={modalVisible || modalEditVisible ? NullMenu : menuBtn} trigger={['contextMenu']} align={{ offset: [0, 20] }}>
                        <span>{item[props.treeTitleKey]}</span>
                    </Dropdown>
                );
            if (item.children) {
                return { key: item[props.treeIdKey], ...item, title, children: loop(item.children) };
            }
            return {
                key: item[props.treeIdKey],
                ...item,
                title
            };
        });

    // //  删除树节点
    // const deleteTreeNode = async (record: any, code: any) => {
    //     const { title, key, ...obj }: any = { ...record };
    //     let res: any = await api.execByCode(JSON.stringify(obj), code);
    //     if (res.response.code === 0) {
    //         message.success(res.response.message);
    //         getBizCodeData(intCode);
    //     } else {
    //         message.error(res.response.message);
    //     }
    // }

    // 顶部搜索框 获取父id
    // const getParentKey = (key: any, tree: any) => {
    //     let parentKey;
    //     for (let i = 0; i < tree.length; i++) {
    //         const node = tree[i];
    //         if (node.children) {
    //             if (node.children.some((item: any) => item[props.treeIdKey] === key)) {
    //                 parentKey = node[props.treeIdKey];
    //             } else if (getParentKey(key, node.children)) {
    //                 parentKey = getParentKey(key, node.children);
    //             }
    //         }
    //     }
    //     return parentKey;
    // };

    // 树菜单serch框触发
    useEffect(() => {
        if (
            searchValue != null &&
            searchValue.length != null &&
            !!searchValue.length &&
            gData != null
        ) {
            let key: any = [];

            let onRecursionData = (arr: any, val: any) => {
                let newarr: any = [];
                arr.forEach((item: any) => {
                    if (item.children && item.children.length) {
                        let children = onRecursionData(item.children, val)
                        let obj = {
                            ...item,
                            children
                        }
                        if (children && children.length) {
                            //  key值增加
                            newarr.push(obj)
                            key.push(obj[props.treeIdKey]);
                        } else if (item[props.treeTitleKey] != undefined && item[props.treeTitleKey] != null && item[props.treeTitleKey].includes(val)) {
                            newarr.push(obj)
                        }
                    } else {
                        if (item[props.treeTitleKey] != undefined && item[props.treeTitleKey] != null && item[props.treeTitleKey].includes(val)) {
                            newarr.push(item)
                        }
                    }
                })
                return newarr
            }
            let res = onRecursionData(gData, searchValue)
            setExpandedKeys(key);
            setRenderData(res);
        }
        if (
            searchValue != null &&
            searchValue.length != null &&
            !!!searchValue.length &&
            gData != null
        ) {

            setRenderData(gData);
        }
    }, [searchValue]);
    //2022-8-4 树菜单serch框触发 --- end
    // 树菜单serch框触发
    const onChange = (e: any) => {
        const { value } = e.target;
        // const expandedKeys = dataList.map((item: any) => {
        //     if (item[props.treeTitleKey].indexOf(value) > -1) {
        //         return getParentKey(item[props.treeIdKey], gData);
        //     }
        //     return null;
        // }).filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
        // setExpandedKeys(expandedKeys);
        setSarchValue(value);
        // setAutoExpandParent(true);
    };

    // 展开/收起节点时触发
    const onExpand = (expandedKeys: any) => {
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(true);
    };

    // 点击树节点触发
    const onSelect = (selectedKeysValue: React.Key[], info: any) => {
        const condition: any = ['key', 'children']
        const { selectedNodes } = info;
        setSelectedKeys(selectedKeysValue);
        let obj = { ...selectedNodes[0] };
        // 删除obj不必要的字段
        for (let key in obj) {
            if (condition.includes(key)) {
                delete obj[key]
            }
        }
        //回传父组件 
        props.getSelTreeNodeValue(props.treeIdKey, selectedKeysValue, obj);
    };


    // 关闭新增、编辑弹窗
    const handleCancel = (flag: any) => {
        setModalVisible(false);
        setModalTitle(undefined);
        setSubmitCode(undefined);
        setModalPageLink(undefined);
        setModalEditVisible(false)
        setRecordDetial(undefined);
        //新增提交数据后、修改提交数据后，刷新数据页面 ，
        flag && getBizCodeData(intCode);

    };

    useEffect(() => {
        props.treeRefreshFlag && getBizCodeData(intCode);
    }, [props.treeRefreshFlag])

    return (
        <Card
            bodyStyle={{ paddingBottom: 50 }}
            title={props.treeTitile}
            extra={
                <React.Fragment>
                    {
                        topbtnArr.length && topbtnArr.map((ite: any, i: any) => (
                            ite.type == 1 ? //新增弹窗
                                (
                                    <Button
                                        key={i}
                                        className={styles.assistbtn}
                                        type="link"
                                        size="small"
                                        onClick={() => {
                                            // 树节点新增
                                            setIsDisabled(false);
                                            setModalVisible(true);
                                            setModalTitle(ite.name);
                                            setSubmitCode(ite.code);
                                        }}
                                    >
                                        {ite.name}
                                    </Button>
                                )
                                : (
                                    ite.type == 2 ? //新增弹窗
                                        (
                                            <Button
                                                key={i}
                                                className={styles.assistbtn}
                                                type="link"
                                                size="small"
                                                onClick={() => {
                                                    // 树节点新增
                                                    // setIsDisabled(false);
                                                    // setModalVisible(true);
                                                    // setModalTitle(ite.name);
                                                    // setModalPageLink(ite.link);
                                                    if (ite.link.indexOf('/report-manage/ModalFormReport?id=') > -1) {
                                                        setIsDisabled(false);
                                                        setModalTitle(ite.name);
                                                        setModalPageLink(ite.link);
                                                        setModalFormTemplate(true)
                                                    } else if (ite.link.indexOf('/report-manage/ModalFormProReport?id=') > -1) {
                                                        setIsDisabled(false);
                                                        setModalTitle(ite.name);
                                                        setModalPageLink(ite.link);
                                                        setModalFormProTemplate(true)
                                                    }
                                                }}
                                            >
                                                {ite.name}
                                            </Button>
                                        ) : null
                                )
                        ))
                    }

                    {/* <Button
                        className={styles.assistbtn}
                        type="link"
                        size="small"
                        onClick={() => {
                            treeNodeEdit ? setTreeNodeEdit(false) : setTreeNodeEdit(true)
                        }}
                    >
                        {treeNodeEdit ? '完成' : '编辑'}
                    </Button> */}
                </React.Fragment>
            }
        >
            {
                loading ?
                    <div className={styles.spinexample}>
                        <Spin delay={500} />
                    </div>
                    : (
                        <>
                            <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={onChange} />
                            {
                                renderData.length > 0 ?
                                    <Tree
                                        className={["mm-tree", treeNodeEdit && "mm-tree-mode-edit"].join(' ')}
                                        height={700}
                                        onSelect={onSelect}
                                        selectedKeys={selectedKeys} //（受控）设置选中的树节点
                                        expandedKeys={expandedKeys}
                                        autoExpandParent={autoExpandParent}
                                        showLine={props.treeShowLine}                           //是否展示连接线
                                        switcherIcon={<DownOutlined />}   //自定义树节点的展开/折叠图标
                                        onExpand={onExpand}
                                        treeData={loop(renderData)}
                                    // treeData={loop(gData)}
                                    // titleRender={customizeTreeItemTitle}
                                    />
                                    :
                                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />

                            }
                        </>
                    )
            }


            {
                modalPageLink && modalFormTemplate ?
                    <ModalFormTemplate
                        isDisabled={isDisabled}
                        modalTitle={modalTitle}
                        modalVisible={modalFormTemplate}
                        modalPageLink={modalPageLink}
                        recordDetial={recordDetial}
                        handleCancel={handleCancel}
                    // initData={initData} //下拉list数据
                    /> : null
            }

            {
                modalPageLink && modalFormProTemplate ?
                    <ModalFormProTemplate
                        isDisabled={isDisabled}  //是否可编辑
                        modalTitle={modalTitle}   //弹窗标题
                        modalVisible={modalFormProTemplate} //是否打开弹窗
                        modalPageLink={modalPageLink} //页面链接
                        recordDetial={recordDetial}  //行数据
                        handleCancel={handleCancel}  //关闭弹窗方法
                    />
                    : null
            }



            {
                submitCode && modalVisible ? <ModalFormItem
                    isDisabled={isDisabled}
                    modalTitle={modalTitle}
                    modalVisible={modalVisible}
                    recordDetial={recordDetial}
                    handleCancel={handleCancel}
                    formFieldsProp={formFieldsProp.length > 0 ? formFieldsProp : []}
                    submitCode={submitCode}
                    initData={initData} //下拉list数据
                />
                    : null
            }
            {
                editCode && modalEditVisible ? <ModalFormItem
                    isDisabled={false}
                    modalTitle={modalTitle}
                    modalVisible={modalEditVisible}
                    recordDetial={recordDetial}
                    handleCancel={handleCancel}
                    formFieldsProp={formFieldsProp.length > 0 ? formFieldsProp : []}
                    submitCode={editCode}
                    initData={initData} //下拉list数据
                />
                    : null
            }
        </Card>
    )
}

export default SearchTreeMenu;