import React, { useState, useRef, useEffect } from 'react';
import style from "./index.less";
import TitleH5 from "@/components/H5components/TitleH5";
import InputItemH5 from "@/components/H5components/InputItemH5";

/**
 * H5预览组件
 *
 * @param {*} props
 * @param {*} props.dataOption 组件列表数据
 * @param {*} props.dataOption 
 * @return {*} 
 */
const PreviewH5: React.FC<{
    dataOption?: any;
    setOptionConfigView?: any;
}> = (props) => {

    // 匹配组件方法
    // const opconfig = (item: any) => {
    //     switch (item.type) {
    //         case 'TitleH5':
    //             return (<TitleH5 onClick={() => { props.setOptionConfigView(true) }} />)
    //             break;
    //         case 'InputItemH5':
    //             return (<InputItemH5 onClick={() => { props.setOptionConfigView(true) }} />)
    //             break;
    //     }
    // }

    return (
        <>
            {
                props.dataOption.map(item => opconfig(item))
            }
        </>
    );
};

export default PreviewH5;
