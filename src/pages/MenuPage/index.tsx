import React, { useState, useRef, useEffect } from 'react';
import {
    Image,
    Input,
    Tabs
} from 'antd';
import style from "./index.less";
import { fetchAllMenu, fetchAllMenuH5 } from './service';
import dissu from './img/disscu.png'

/**
 * 
 * @param props 
 * @returns H5菜单页面
 */
const MenuList: React.FC<{}> = (props) => {
    const [treeData, settreedata] = useState([]);//菜单数据
    const [token, settoken] = useState([]);//页面token

    // 获取H5菜单数据
    const getH5menu = async () => {
        let res = await fetchAllMenuH5()
        if (res.code === 0) {
            const data = buildTreeData(res.data)
            settreedata(data)
        }
    }

    // 数据拼接
    const buildSubRecu = (parentNode: any[], allNode: any[]) => {
        parentNode.forEach((pNode) => {
            const fNode = allNode.filter((node) => pNode.menuId === node.parentId);
            if (fNode && fNode.length > 0) {
                pNode.children = fNode;
                buildSubRecu(fNode, allNode);
            }
        });
    };
    // 数据拼接
    const buildTreeData = (data: any[]) => {
        if (!data || data.length <= 0) {
            return [];
        }
        const rootNode = data.filter((item) => item.parentId === '0');
        if (rootNode.length > 0) {
            buildSubRecu(rootNode, data);
        }
        return rootNode;
    };

    // 重构页面
    const rebuildPage = () => {
        let magin = document.getElementById('magin')
        magin.offsetParent.style = 'margin: 0;'
    }

    // 初始化
    useEffect(() => {
        // rebuildPage()
        settoken(props?.location?.query?.token)
        getH5menu()
    }, [])

    return (
        <>
            <div className={style.title} id='magin'>全部功能</div>
            {/* <BackButton
                onClick={() => {
                    // setBackOpen(true);
                    // props.history.goBack();
                }}
            /> */}
            {
                treeData && treeData.map((item, i) => {
                    return (
                        <div className={style.container} key={i}>
                            <div className={style.containerTitle}>{item.menuName}</div>
                            <div className={style.iconList}>
                                {
                                    item?.children?.length > 0 && item?.children?.map(e => {
                                        return (
                                            <div className={style.icon}>
                                                <Image
                                                    src={e.icon ? e.icon : dissu}
                                                    preview={false}
                                                    style={{ width: '2.8rem', height: '2.8rem' }}
                                                    onClick={() => {
                                                        e.path && (
                                                            window.location.href = `${e.path}&token=${token}`
                                                        )
                                                    }}
                                                />
                                                <div>{e.menuName}</div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                })
            }
        </>

    );
};

export default MenuList;

