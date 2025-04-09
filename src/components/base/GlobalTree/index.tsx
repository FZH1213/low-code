import { Form, Tree, Input } from '@/components/base';
import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';

const { Search } = Input;


// 搜索关键字展开
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
    return parentKey;
};

const dataList:any = [];
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

interface CityTreeProp{
    
};

export interface CityTreeInstance {
    ref?: any;
    treeData?: any;
    onSelect?: any;
};

const CityTree: React.FC<CityTreeInstance> = forwardRef((props: { [key: string]: any }, ref: any) => {
    // form的ref
    const [thisForm] = Form.useForm();
    const [expandedKeys, setExpandedKeys] = useState<any>([]); // 默认展开树状
    const [dataSource, setDataSource] = useState<any>(); // 获取表格数据
    const [searchValue, setSearchValue] = useState<any>(''); // 搜索关键字
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(); // 是否展开父级
    
    useImperativeHandle(
        ref,
        (): CityTreeProp => ({

        }),
    );

    useEffect(() => {
        setExpandedKeys(props.keyShow);
    }, [props.keyShow]);

    useEffect(() => {
        generateList(props.treeData);
    }, [props.treeData]);

    // 循环变换搜索的到的数据值
    const loop = (data: any) => data.map((item: any) => {
        const index = item.title.indexOf(searchValue); //从每一个搜索项返回索引的位置
        const beforeStr = item.title.substr(0, index); //开始截取的位置和截取的数量
        const afterStr = item.title.substr(index + searchValue.length); //开始截取的位置
        const title = index > -1 ? 
            (
                <span>
                    {beforeStr}
                        <span style={{ color: '#f50' }}>{searchValue}</span>
                    {afterStr}
                </span>
            ) : 
            (
                <span>{item.title}</span>
            );
        if (item.children) {
            return { title, key: item.key, children: loop(item.children) };
        }
        return {
            title,
            key: item.key,
        };
    });

    // 展开跟收起树状
    const onExpand = (expandedKeys: any) => {
        setExpandedKeys(expandedKeys);
    };

    // 模糊搜索框方法搜索
    const onChange = (value: any) => {
        let expandedKeyArr:any = [];
        // 如果搜索框有值
        if(value){
            dataList.map((item: any) => {
                if (item.title.indexOf(value) > -1) {
                    let indexOfKey = getParentKey(item.key, props.treeData);
                    if(getParentKey(item.key, props.treeData) && expandedKeyArr.indexOf(indexOfKey) === -1 ){
                        expandedKeyArr.push(indexOfKey);
                    };
                };
                return null;
            })
            .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
        };
        // 模糊搜索的key传入数组
        setExpandedKeys(expandedKeyArr);
        // 模糊搜索子级的时候父级要展开
        setAutoExpandParent(true);
        // 搜索框的值
        setSearchValue(value);
    };
    
    return (
        <>
            {/* 搜索框 */}
            <Search placeholder="请输入" allowClear onSearch={onChange} />

            {/* 城市树状 */}
            {
                props.treeData &&
                <Tree
                    treeData={loop(props.treeData)}
                    onExpand={onExpand}
                    expandedKeys={expandedKeys}
                    autoExpandParent={props.fatherShow}
                    onSelect={props.onSelect}
                    showIcon={props.showIcon}
                />
            }
        </>
    )
});

export { CityTreeProp };
export default CityTree;