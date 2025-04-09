import React, { useState, useRef, useEffect } from 'react';
import { Form} from 'antd';
import TitleH5 from "@/components/H5components/TitleH5";
import InputItemH5 from "@/components/H5components/InputItemH5";
import DatePickerh5 from "@/components/H5components/DatePickerh5";
import TextAreah5 from "@/components/H5components/TextAreah5";
import CascaderH5 from "@/components/H5components/CascaderH5"
import { getexecByCode } from '@/services/api'
import style from "./index.less";

const ComponentsMap = { //组件映射
    TitleH5,  //
    InputItemH5,  //
    DatePickerh5,//
    TextAreah5, //
  }


/**
 * H5生成页面
 *
 * @param {*} props
 * @param {*} props.dataOption 组件列表数据
 * @return {*} 
 */
const Preview: React.FC<{
    dataOption?: any;
    setOptionConfigView?: any;
}> = (props) => {

    
    const formRef = useRef(null);


    // 获取页面数据
    const getData = async () => {
        const res = await getexecByCode()
        if (res.code === 0) {
        }
    }

    // 模拟接口数据
    const data = [
        {
            type: 'TitleH5',
            name: 'H5标题',
            key: 'title',
            params: {
                pageJson: '{"name":"申请"}'
            },
        },
        {
            type: 'TextAreah5',
            name: '主题',
            key: 'TextAreah51',
            params: {
                pageJson: '{"name":"主题","bordered":"false","placeholder":"请选择","maxLength":"20"}',
            },
        },
        {
            type: 'DatePickerh5',
            name: 'H5日期选择器',
            key: 'date',
            params: {
                pageJson: '{"name":"开始时间","bordered":"false","placeholder":"请选择","maxLength":"20","connect":"input2"}',
            },
        },
        {
            type: 'InputItemH5',
            name: 'H5输入框',
            key: 'title1',
            params: {
                pageJson: '{"label":"联系人","bordered":"false","placeholder":"请输入","maxLength":"20"}'
            },
        },
        {
            type: 'InputItemH5',
            name: 'H5输入框',
            key: 'input',
            params: {
                pageJson: '{"label":"详细地址","bordered":"false","placeholder":"请输入","maxLength":"20"}'
            },
        },
        {
            type: 'TextAreah5',
            name: 'H5多行文本',
            key: 'TextAreah52',
            params: {
                pageJson: '{"name":"内容","bordered":"false","placeholder":"请选择","maxLength":"2000"}',
            },
        },
    ]

    /**
     * 
     * @param item 匹配组件方法
     * @returns 
     */
    const opconfig = (item: any) => {
        let Component=undefined;
        Component=ComponentsMap[!!item? item.type :''];
        return (<Component  {...JSON.parse(item.params.pageJson)} />)
        // switch (item.type) {
        //     case 'TitleH5':
        //         return (<TitleH5 {...JSON.parse(item.params.pageJson)} />)
        //         break;
        //     case 'InputItemH5':
        //         return (<InputItemH5  {...JSON.parse(item.params.pageJson)} />)
        //         break;
        //     case 'DatePickerh5':
        //         return (<DatePickerh5  {...JSON.parse(item.params.pageJson)} />)
        //         break;
        //     case 'TextAreah5':
        //         return (<TextAreah5  {...JSON.parse(item.params.pageJson)} />)
        //         break;
        // }
    }

    /**
     * 改变页面整体样式
     */
    const rebuildMain = () => {
        const widthGlbal = document.documentElement.clientWidth || document.body.offsetWidth
        document.documentElement.style.fontSize = 12 * (widthGlbal / 750) + "px";
        window.onresize = function () {
            document.documentElement.style.fontSize = 12 * (widthGlbal / 750) + "px";
        };
    }

    useEffect(() => {
        rebuildMain()
        getData()
    }, [])


    return (
        <div>
            <Form
            ref={formRef}
          >
            {
                data.map(item => {
                    return <div key={item.key}>{opconfig(item)}</div>
                })
            }
            </Form>
        </div>
    );
};

export default Preview;
