import React, { useState, useRef, useEffect } from 'react';
import {
    List,
    Button,
    Card,
    TextareaItem,
    Toast,
    Picker,
    Modal,
    DatePicker
} from 'antd-mobile';
import {
    Image,
    Input
} from 'antd';
import moment from "moment";
import style from "./index.less";
import getRem from "../../../utils/getRem";

/**
 * H5多行文本
 *
 * @param {*} props
 * @param {*} props.placeholder 占位符
 * @param {*} props.maxLength 最大长度
 * @param {*} props.onChange 输入框内容变化时的回调
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.name 标签的文本：左边标题
 * @param {*} props.onClick 点击按钮时的回调
 * @param {*} props.defaultValue 日期的默认值
 * @param {*} props.space 组件下方的间隔
 * @return {*} 
 */
const TextAreah5: React.FC<{
    border: Boolean;
    placeholder: string;
    maxLength?: number;
    onChange: () => void;
    required?: string;
    name?: string;
    defaultValue: string;
    space?: number;
}> = (props) => {
    return (
        <>
            <div className={style.itemContentOne}>
                <div className={style.itemContentitle}>{props.name}{props.required === 'true' && <span className={style.itemColor}>*</span>}</div>
                <TextareaItem
                    style={{
                        border: props.border ? '1px solid #999' : 'none',
                    }}
                    title={''}
                    rows={2}
                    count={props.maxLength}
                    placeholder={props.placeholder}
                    onChange={props.onChange}
                    defaultValue={props.defaultValue}
                />
            </div>
        </>
    );
};

export default TextAreah5;
