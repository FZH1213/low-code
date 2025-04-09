import React, { Component } from 'react'

import styles from './styles.less'

import {
    Form,
    Input
} from 'antd'

const { TextArea } = Input;

export default class ComTextArea extends Component {

    formItemRef = React.createRef();

    constructor(props) {
        super(props)
        this.state = {
            // 字数
            count: 0
        }
    }

    // componentDidUpdate() {
    //     console.log('获取的输入域ref实例对象', this.formItemRef)

    //     // 获取输入域初始值
    //     if (this.formItemRef.current && this.formItemRef.current.resizableTextArea) {
    //         let defValue = this.formItemRef.current.resizableTextArea.textArea

    //         if (!!defValue && !!this.formItemRef.current.resizableTextArea.textArea.innerHTML && !!this.formItemRef.current.resizableTextArea.textArea.innerHTML.length) {
    //             // console.log('获取的输入域的初始值：', defValue.innerHTML)

    //             // 在改生命周期中，要防止无限循环，所以要判断字数变化，再设置字数
    //             if (defValue.innerHTML.length != this.state.count) {
    //                 //那么就设置字数
    //                 this.setState({
    //                     count: defValue.innerHTML.length
    //                 })
    //             }
    //         }
    //     }
    // }

    // componentDidUpdate() {
    //     // 获取输入域初始值
    //     if (this.formItemRef && this.formItemRef.current != null && this.formItemRef.current.resizableTextArea) {
    //         console.log('获取的输入域ref实例对象', this.formItemRef)
    //         let defValue = this.formItemRef.current.resizableTextArea.props.value

    //         // console.log('defValue1', defValue)

    //         if (!!this.formItemRef.current.resizableTextArea.props) {
    //             // console.log('获取的输入域的初始值：', defValue.innerHTML)
    //             // console.log('defValue2', defValue)
    //             // 在改生命周期中，要防止无限循环，所以要判断字数变化，再设置字数
    //             if (defValue.length != this.state.count) {
    //                 console.log('defValue3', defValue)
    //                 //那么就设置字数
    //                 this.setState({
    //                     count: defValue.length
    //                 })
    //             }
    //         }
    //     }
    // }

    onChange = (e) => {
        // console.log(e.target.value.length)

        this.setState({
            count: e.target.value.length
        })

        this.props.onChange && this.props.onChange(e)
    }

    // countWord = () => {
    //     console.log(this.formItemRef)
    //     if (this.formItemRef.current != null && this.formItemRef.current.resizableTextArea != null && this.formItemRef.current.resizableTextArea.props.value) {
    //         if (this.formItemRef.current.resizableTextArea.props.value.length != this.state.count) {
    //             console.log('count: ', this.formItemRef.current.resizableTextArea.props.value.length)
    //             this.setState({
    //                 count: this.formItemRef.current.resizableTextArea.props.value.length
    //             })
    //         }
    //     }
    // }

    render() {

        // this.countWord()

        // console.log('获取的输入域ref实例对象(render)', this.formItemRef)

        const getCountColor = () => {
            // 计算用的最大字数
            let max = this.props.maxLength == null ? 2000 : this.props.maxLength

            // 获取字数限制距离字数
            let tipGapCount
            if (this.props.tipGap == null) {
                return 'rgba(0,0,0,0.36)'
            } else if (typeof this.props.tipGap == 'number') {
                // 如果传了个数字过来，那么就计算字数差，返回不同颜色
                if ((max - this.state.count) < this.props.tipGap) {
                    return 'red';
                } else {
                    return 'rgba(0,0,0,0.36)';
                }
            } else if (!!this.props.tipGap) {
                // 那么就以默认 20 字为差距
                if ((max - this.state.count) < 20) {
                    return 'red';
                } else {
                    return 'rgba(0,0,0,0.36)';
                }
            } else {
                return 'rgba(0,0,0,0.36)';
            }

        }

        return (
            <>
                {/* <div style={{position:'relative'}}> */}
                {
                    // 因为老是设置字数显示的样式不成功，所以自己写一个字数显示好了
                    //  backgroundColor: 'transparent' 背景颜色为透明色
                    this.props.showCount ? <div style={{ position: 'absolute', right: this.props.right ? this.props.right : '12px', bottom: this.props.bottom ? this.props.bottom : '12px', height: '20px', width: '300px', backgroundColor: 'transparent', zIndex: '10' }}>
                        <span style={{ position: 'absolute', bottom: '0px', right: '2px', zIndex: '2000', fontWeight: '500', color: getCountColor() }}>
                            <span>{this.state.count}</span>
                            <span>
                                <span style={{ padding: '0px 1px 0px 1px' }}>/</span>
                                <span>{this.props.maxLength == null ? 2000 : this.props.maxLength}</span>
                            </span>
                        </span>
                    </div> : (this.props.showCount == null ? <div style={{ position: 'absolute', right: this.props.right ? this.props.right : '12px', bottom: this.props.bottom ? this.props.bottom : '12px', height: '20px', width: '300px', backgroundColor: 'transparent', zIndex: '10' }}>
                        {/* 默认颜色 color: 'rgba(0,0,0,0.36)' */}
                        <span style={{ position: 'absolute', bottom: '0px', right: '2px', zIndex: '2000', fontWeight: '500', color: getCountColor() }}>
                            <span>{this.state.count}</span>
                            <span>
                                <span style={{ padding: '0px 1px 0px 1px' }}>/</span>
                                <span>{this.props.maxLength == null ? 2000 : this.props.maxLength}</span>
                            </span>
                        </span>
                    </div> : '')
                }
                {/* 之前label里有&nbsp没办法解析，新增label属性才可以解析 */}
                <Form.Item {...this.props.FormItemProps} label={this.props.label ? this.props.label : this.props.FormItemProps.label}>

                    <TextArea ref={this.formItemRef} className={[styles.for_padding_bottom_and_count, this.props.disabled && (this.props.disabled == true) && styles.disabled_textarea].join(' ')}
                        disabled={this.props.disabled}

                        showCount={false}
                        // showCount={true}

                        // showCount={this.props.showCount == null ? true : (this.props.showCount ? true : false) }
                        // autoSize={{ minRows: this.props.minRows ? this.props.minRows : 4}}

                        autoSize={this.props.autoSize == null ? { minRows: 4 } : this.props.autoSize}

                        maxLength={this.props.maxLength == null ? 2000 : this.props.maxLength}

                        onChange={this.onChange}

                        placeholder={this.props.placeholder == null ? '请输入内容' : this.props.placeholder}

                        style={this.props.style}

                        // 以下两行输入法输入开始和结束事件
                        onCompositionStart={this.props.onCompositionStart}
                        onCompositionEnd={this.props.onCompositionEnd}
                    />

                </Form.Item>
                {/* </div> */}
            </>
        )
    }
}
