import React, { useState, useRef, useEffect } from 'react';
// import {
//     List,
//     Button,
//     Card,
//     TextareaItem,
//     Toast,
//     Picker,
//     Modal,
//     DatePicker,
//     SearchBar
// } from 'antd-mobile'
import {
    Image,
    Input,
    Tabs,
    Card
} from 'antd';
// import moment from "moment";
import style from "./index.less";
// import getRem from "../../../utils/getRem";
// import { getSrvCode, intfManDescAddDataById, getDataBySrvCode } from "../../../services/api";
// // import InputItem from "@/components/H5components/InputItem";
// import BackButton from "@/components/H5components/backButton";
// // import Textareah5 from "@/components/H5components/Textareah5";
// // import DatePickerh5 from "@/components/H5components/DatePickerh5";
// import { connect, history } from 'umi';
// const { TabPane } = Tabs;

const Preview: React.FC<{}> = (props) => {
    const menuList = [
        {
            name: '工作室',
            child: [
                {
                    name: '待办任务',
                    menulink: '',
                    icon: ''
                }
            ]
        },
        {
            name: '研究服务',
            child: [
                {
                    name: '研讨申请',
                    menulink: '',
                    icon: ''
                }
            ]
        }
    ]

    const pixel = [
        {
            name: '375X667',
            width: 375,
            height: 667,
        },
        // {
        //     name: '390X890',
        //     width: 390,
        //     height: 890,
        // }
    ]

    const [pix, setpix] = useState({
        width: 375,
        height: 667,
    })

    return (
        <>

            <div className={style.leftcontainer}>
                <div>
                    <div>
                        {pixel.map(e => {
                            return <span
                                style={{
                                    // border: '1px solid #eeeeee',
                                    backgroundColor: '#eee',
                                    marginRight: 5,
                                    // cursor: 'pointer',
                                    color: '#333333',
                                    padding: 2
                                }}
                                onClick={() => {
                                    setpix({
                                        width: e.width,
                                        height: e.height
                                    })
                                }}>{e.name}</span>
                        })}
                    </div>
                    <div style={{
                        border: '1px solid #eee',
                        ...pix
                    }}

                    >
                        {
                            menuList.map(item => {
                                return (
                                    <div>
                                        <div className={style.containerTitle}>{item.name}</div>
                                        {
                                            item.child && item.child.map(e => {
                                                return (
                                                    <div className={style.icon}>
                                                        <Image
                                                            src={require('../../../MenuPage/img/disscu.png')}
                                                            preview={false}
                                                            style={{ width: '45px', height: '45px' }}
                                                        // onClick={() => history.push('/reportform/temp/ServiceRecord_h5?id=452830459362171')}
                                                        />
                                                        <div>
                                                            {e.name}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>

        </>
    );
};

export default Preview;
