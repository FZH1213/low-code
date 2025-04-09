import { Form, Tree, Input, Space} from '@/components/base';
import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import {
    GlobalOutlined,
    EnvironmentOutlined,
    DashboardOutlined,
    DatabaseOutlined,
    VideoCameraOutlined
} from '@ant-design/icons';
import { icons } from 'antd/lib/image/PreviewGroup';
import styles from './index.less';
import { Typography } from 'antd';

const { Search } = Input;


// 搜索关键字展开-按照找到的匹配节点，找到其父节点，以展开
const getParentKey = (key: string, tree: any) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
            if (node.children.some((item: any) => item.key === key)) {
                parentKey = node.key;
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children);
            };
        };
    };
    return parentKey != null && parentKey.length != null && !!parentKey.length ? parentKey : '';
};

const dataList: any = [];
const generateList = (data: any) => {
    for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key, title } = node;
        dataList.push({ key, title });
        if (node.children) {
            generateList(node.children);
        };
    };
};

interface SearchTreeProp {

};

export interface SearchTreeInstance {
    ref?: any;
    treeData?: any;
    onSelect?: any;
    className?: any;
    // 传的是一个key值数组
    selfDefaultExpandedKeys?: any;
    defaultSelectedKeys?: any;
    selfDefaultExpandedName?: string;
    showIcon?: any;
    // 标记 是否要默认选中末级节点，且携带事件 e 
    // forSelectDevice?: boolean;
    disabledItem?: any;
};

const SearchTree: React.FC<SearchTreeInstance> = forwardRef((props: { [key: string]: any }, ref: any) => {
    // form的ref
    const [thisForm] = Form.useForm();
    const [expandedKeys, setExpandedKeys] = useState<any>([]); // 默认展开树状
    const [searchValue, setSearchValue] = useState<any>(''); // 搜索关键字
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(); // 是否展开父级
    const [selectedKeys, setSelectedKeys] = useState([]); // 受控的选中key值

    useImperativeHandle(
        ref,
        (): SearchTreeProp => ({

        }),
    );

    useEffect(() => {
        setExpandedKeys(props.keyShow);
    }, [props.keyShow]);

    useEffect(() => {
        generateList(props.treeData);
    }, [props.treeData]);

    const getIcon = (key: string) => {
        let setIcon = {
            GlobalOutlined: <GlobalOutlined />,
            EnvironmentOutlined: <EnvironmentOutlined />,
            DashboardOutlined: <DashboardOutlined />,
            DatabaseOutlined: <DatabaseOutlined />,
            VideoCameraOutlined: <VideoCameraOutlined />,
        };
        return setIcon[key];
    }

    // 循环变换搜索的到的数据值
    const loop = (data: any) => data.map((item: any) => {
        const index = item.title.indexOf(searchValue); //从每一个搜索项返回索引的位置
        const beforeStr = item.title.substr(0, index); //开始截取的位置和截取的数量
        const afterStr = item.title.substr(index + searchValue.length); //开始截取的位置
        const title = index > -1 ?
            (
                <Typography.Text
                    title={item.title} disabled={props.disabledItem && props.disabledItem.indexOf(item.type) >= 0 ? true : false}
                    className="cityTitle"
                >
                    <Typography.Text className="cityIcon" >{getIcon(item.icon)}</Typography.Text>
                    {beforeStr}
                    <Typography.Text style={{color: '#f50', }}>{searchValue}</Typography.Text>
                    {afterStr}
                </Typography.Text>
            ) :
            (
                <Typography.Text
                    title={item.title} disabled={props.disabledItem && props.disabledItem.indexOf(item.type) >= 0 ? true : false}
                    className="cityTitle"
                >
                    <Typography.Text className="cityIcon" >{getIcon(item.icon)}</Typography.Text>
                    <Typography.Text className={styles.value}>{item.title}</Typography.Text>
                </Typography.Text>
            );
        let data = props.disabledItem && props.disabledItem.indexOf(item.type) >= 0 ? {disabled: true} : {};
        if (item.children) {
            return { title, key: item.key, ...data, children: loop(item.children) };
        }
        return {
            title,
            key: item.key,
            ...data,
        };
    });

    // 展开跟收起树状
    const onExpand = (expandedKeys: any) => {
        console.log(expandedKeys)
        setExpandedKeys(expandedKeys);
    };

    // 模糊搜索框方法搜索
    const onChange = (value: any) => {
        let expandedKeyArr: any = [];

        let oriArr = []
        // 如果搜索框有值
        if (value) {
            oriArr = dataList.map((item: any) => {
                // 筛选掉末级的匹配
                if ('A类设备（关键设备）B类设备（主要设备）C类设备（一般设备）视频监控'.indexOf(value) > -1) {
                    return null
                }


                if (item.title.indexOf(value) > -1) {

                    console.log('匹配到的item', item)

                    let indexOfKey = getParentKey(item.key, props.treeData);

                    console.log('找到的父节点key值', indexOfKey)

                    if (getParentKey(item.key, props.treeData) && expandedKeyArr.indexOf(indexOfKey) === -1) {
                        expandedKeyArr.push(indexOfKey);
                    };

                    return indexOfKey;
                };
                return null;
            })
                .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
        };

        console.log('获取的一级父节点数组 =>', oriArr)

        let resArr = []

        // 找到全部的相关联父节点
        oriArr.forEach(item => {
            const getPKey = (i) => {
                let pKey = getParentKey(i, props.treeData)
                console.log('pKey =>', pKey)
                if (pKey != null && pKey.length != null && !!pKey.length) {
                    resArr.push(pKey)
                    getPKey(pKey)
                }
            }
            getPKey(item)
        });

        resArr = resArr.concat(oriArr).filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
        console.log('找到的所有相关联keys =>', resArr)

        // 模糊搜索的key传入数组
        // setExpandedKeys(expandedKeyArr); // 原代码
        setExpandedKeys(resArr);

        // 模糊搜索子级的时候父级要展开
        setAutoExpandParent(true);
        // 搜索框的值
        setSearchValue(value);
    };

    // 如果有传入 自定义 默认展开 key 值数组，那么就一开始让对应值节点展开，可传入key值数组名：selfDefaultExpandedKeys
    useEffect(() => {
        const initSetExpanded = async () => {
            let arr = props.selfDefaultExpandedKeys
            // console.log(arr)
            if (arr && arr.length && !!arr.length) {
                await setExpandedKeys(arr)
                await setSelectedKeys([arr[arr.length - 1]])

                await onSelect([arr[arr.length - 1]], { node: { pos: '0-0-0-0-0', title: { props: { children: [props.selfDefaultExpandedName] } } } })


            }
        }

        initSetExpanded()
    }, [])

    const onSelect = (selectedKeys: any, e: any) => {
        console.log('组件中的keys => ', selectedKeys)
        setSelectedKeys(selectedKeys)

        props.onSelect(selectedKeys, e)
    }

    return (
        <Space className={`${props.className} ${styles.searchTreeStyle}`} direction="vertical" size={'small'}>
            {/* 搜索框 */}
            <Search placeholder="请输入" allowClear onSearch={onChange} style={{ width: '100%' }} />
            {/* 城市树状 */}
            {
                props.treeData &&
                <Tree
                    treeData={loop(props.treeData)}
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={props.fatherShow}
                    onSelect={onSelect}
                    blockNode
                    // 默认选中的 key 值
                    // defaultSelectedKeys={props.defaultSelectedKeys}

                    // 暴露出 selectedKeys 使受控
                    selectedKeys={selectedKeys}

                />
            }
        </Space>
    )
});

export { SearchTreeProp };
export default SearchTree;