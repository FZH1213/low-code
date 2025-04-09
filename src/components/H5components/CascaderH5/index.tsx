import React, { useEffect, useState } from 'react'
import {
    Button,
    Tabs
} from 'antd';
import style from "./index.less";
import { getTreeApi, postApi } from "@/services/api";
const { TabPane } = Tabs;


/**
 * H5级联选择器
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

const CascaderH5: React.FC<{
    placeholder: string;
    label: string;
    required?: string;
    onClick?: any;
    defValue?: any;
    visibleModel?: any;
    paramsData?: any;
    select?: any;
    getselect?: any;
    selectDa?: any;
}> = (props) => {

    const [data, setdata] = useState([]) //获取列表数据
    const [open, setOpen] = useState(false)//关闭弹窗
    const [postdata, setpostdata] = useState([]) //获取列表数据
    const [value, setValue] = useState('') //获取列表数据
    const [valueT, setValueT] = useState(false) //获取列表数据
    // 请求列表数据
    const getTreeData = async () => {
        const res = await getTreeApi(props.paramsData.get)
        if (res.code === 0) {
            setdata(res.data)
        }
    }
    // 获取数据
    const postSelectData = async (code) => {
        let url = props.paramsData.post + '&code_likeR=' + code
        const res = await getTreeApi(url)
        if (res.code === 0) {
            setpostdata(res.data)
            props.getselect(res.data)
        }
    }

    useEffect(() => {
        setdata(props?.selectDa?.records)
    }, [valueT && props?.selectDa?.records])

    useEffect(() => {
        props?.paramsData ? getTreeData() : setValueT(true)
    }, [])


    return (
        <>
            <div className={style.itemContenttwo}>
                <div className={style.itemContentitle}>{props.label}{props.required === 'true' && <span className={style.itemColor}>*</span>}</div>
                <div
                    onClick={() => {
                        data && setOpen(true)
                    }}
                    className={style.itemValue}
                >
                    {value ? value : props.placeholder + ' >'}
                </div>
            </div>
            {
                open && (
                    <div className={style.model}>
                        <div
                            className={style.modelBackground}
                            onClick={() => setOpen(false)}
                        >
                        </div>
                        <div className={style.modelContent}>
                            {data.map(item => {
                                return <span
                                    key={item.id}
                                    style={{ height: '30px', lineHeight: '30px' }}
                                    onClick={() => {
                                        setOpen(false)
                                        props.paramsData ? postSelectData(item.code) : null
                                        setValue(item.name)
                                    }}>{item.name}</span>
                            })}
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default CascaderH5;