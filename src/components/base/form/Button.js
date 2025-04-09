// SubmitButton
//  @props
//    与ant button组件一致，并在此基础上增加两个属性配置
//    1. confirm <Object>  点击确认提示的配置，点击SubmitButton后弹出确认提示
//        - okText <String> 确认按钮文本
//        - cancelText <String> 确认按钮文本
//    2. onConfirm <Function> 点击确认提交按钮的回调函数
//

import { Button, Popconfirm } from 'antd';
import React, { Component } from "react";

const non = () => {};

export class SubmitButton extends Component {

  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onConfirm = this.onConfirm.bind(this);

    this.sets = Object.assign({
      savingText: '正在保存'
    }, props);

    this.state = {
      loading: props.loading !== undefined ? props.loading : false
    }

    // console.log("输出一下按钮的props.children", this.props.children)
  }

  reset(){
    this.setState({
      loading: false
    })
  }

  onClick(){
    this.setState({
      loading: true
    });
    this.props.onClick && this.props.onClick();
  }

  onConfirm(){
    this.setState({
      loading: true
    });
    this.props.onConfirm();
  }

  render(){
    let htmlButton = 
    <div style={{display: 'inline-block'}} className={this.props.children == "转交" ? "transfer_button_style_global_zmx": ''}>
      <Button { ...this.props }
        type="primary"
        htmlType="submit"
        onClick={ !this.props.confirm ? this.onClick: non }
        loading={ this.state.loading }
        ghost={ this.props.ghost || false}
      >
        { !this.state.loading ? this.props.children : this.sets.savingText }
      </Button>
    </div>;

    let confirmSet = this.props.confirm;
    return (
      this.props.confirm ?
        //点击后先提示
        <Popconfirm
            { ...this.props }
            title={confirmSet.title}
            okText={confirmSet.okText}
            cancelText={confirmSet.cancelText}
            onConfirm={ this.onConfirm }
        >{htmlButton}</Popconfirm> :

        htmlButton
    )
  }
}
