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
 * H5日期选择器
 *
 * @param {*} props
 * @param {*} props.placeholder 占位符
 * @param {*} props.maxLength 最大长度
 * @param {*} props.onChange 输入框内容变化时的回调
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.name 标签的文本：左边标题
 * @param {*} props.onClick 点击按钮时的回调
 * @param {*} props.onOk 日期选择器确定的回调
 * @param {*} props.onDismiss 日期选择器取消的回调
 * @param {*} props.visible 日期选择器显示的回调
 * @param {*} props.dateValue 日期值
 * @param {*} props.defaultValue 日期的默认值
 * @param {*} props.space 组件下方的间隔
 * @return {*} 
 */

const DatePickerh5: React.FC<{
    placeholder: string;
    maxLength?: number;
    onChange: () => void;
    required?: string;
    name?: string;
    onClick?: () => any;
    onOk?: () => any;
    onDismiss?: () => any;
    visible?: boolean;
    dateValue?: string;
    defaultValue: any;
    space?: number;
}> = (props) => {
    const [visble, setvisble] = useState(false)

    return (
        <>
            <div className={style.itemContenttwo}>
                <div className={style.itemContentitle}>{props.name}{props.required === 'true' && <span className={style.itemColor}>*</span>}</div>
                <div
                    onClick={() => setvisble(true)}
                    className={style.itemValue}
                >
                    {props.dateValue ? props.dateValue : props.placeholder}{' >'}
                </div>
                <DatePicker
                    visible={visble}
                    mode='date'
                    onOk={() => setvisble(false)}
                    onDismiss={() => setvisble(false)}
                />
            </div>
        </>
    );
};

export default DatePickerh5;
