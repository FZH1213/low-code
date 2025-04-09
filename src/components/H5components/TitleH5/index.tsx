import React, { useState, useRef, useEffect } from 'react';
import style from "./index.less";

/**
 * H5标题
 *
 * @param {*} props
 * @param {*} props.style 样式
 * @param {*} props.name 标签的文本：左边标题
 * @return {*} 
 */
const Titleh5: React.FC<{
    name?: string;
    style?: any;
    onClick?: any;
}> = (props) => {
    const [optionConfig, setOptionConfig] = useState(false)

    return (
        <div className={style.title} style={props.style} onClick={props.onClick}>{props.name}</div>
    );
};

export default Titleh5;
