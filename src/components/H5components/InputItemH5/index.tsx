import React, { useState, useRef, useEffect } from 'react';
import {
    Image,
    Input
} from 'antd';
import style from "./index.less";

/**
 * H5输入框
 *
 * @param {*} props
 * @param {*} props.bordered 输入框边框
 * @param {*} props.placeholder 占位符
 * @param {*} props.maxLength 最大长度
 * @param {*} props.onChange 输入框内容变化时的回调
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.space 组件下方的间隔
 * @param {*} props.defaultValue 输入框默认内容
 * @param {*} props.onClick 输入框默认内容
 * @param {*} props.style 输入框默认内容
 * @return {*} 
 */

const InputItem: React.FC<{
    bordered: string;
    placeholder: string;
    maxLength?: number;
    onChange: any;
    label: string;
    required?: string;
    space?: number;
    defaultValue: string;
    onClick?: any;
    style?: any;
}> = (props) => {
    return (
        <>
            <div className={style.itemContenttwo} onClick={props.onClick}>
                <div className={style.itemContentitle}>{props.label}{props.required === 'true' && <span className={style.itemColor}>*</span>}</div>
                <Input
                    defaultValue={props.defaultValue}
                    bordered={props.bordered === 'true' ? true : false}
                    placeholder={props.placeholder}
                    style={{ textAlign: 'right', width: '70%', fontSize: '2.66rem', ...props.style }}
                    maxLength={props.maxLength}
                    onChange={props.onChange}
                />
            </div>
        </>

    );
};

export default InputItem;
