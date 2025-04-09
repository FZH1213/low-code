import React, {Component, useEffect, useState} from "react";
import {Button, Modal, Space} from 'antd';
import {SubmitButton} from "@/components/base/form/Button";
import '@/theme/default/ico.less';
import './styles.less';

export default class ConfirmModal extends Component {

  constructor(props) {
    super(props);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.state = {
      show: props.show
    }
  }

  close() {
    this.setState({
      show: false
    });
    this.props.onClose && this.props.onClose();
  }

  open() {
    this.setState({
      show: true
    });
    this.props.onOpen && this.props.onOpen();
  }

  onCancel() {
    this.close();
  }

}

//非常规操作提示
// @params
//  config - 继承自Modal.confirm，传入的参数与Modal.confirm基本一致，唯一不同的是config.icon属性依据。
//
const dangerConfirm = config => {
  let settings = Object.assign({}, {...config}, {
    icon: <i className="wbico-warning confirm-ico"></i>,
    okButtonProps: {  size:'default', danger:true },
    cancelButtonProps: { size:'default', danger:true },
    content: <div className="dangerous-content-wrapper">{config.content}</div>
  });
  Modal.confirm(settings);
}

const normalConfirm = config => {
  let settings = Object.assign({}, {...config}, {
    icon: <i className="wbico-warning confirm-ico"></i>,
    okButtonProps: {  size:'default' },
    cancelButtonProps: { size:'default' },
    content: <div className="dangerous-content-wrapper">{config.content}</div>
  });
  Modal.confirm(settings);
}

const ConfirmModalTemplate = props => {

  const btnSubmit = React.createRef();
  const [modalVisible, setModalVisible] = useState(props.visible);

  const onOk = () => {
    setModalVisible(false);
    props.onClose && props.onClose();
  }

  const onCancel = () => {
    setModalVisible(false);
    props.onClose && props.onClose();
  }

  useEffect(() => {
    if(!props.loading)
      btnSubmit.current.reset();
  })

  return (
    <Modal
      {...props}
      visible={modalVisible}
      onOk={onOk}
      onCancel={onCancel}
      footer={<Space>
        <SubmitButton ref={btnSubmit} onClick={props.onSubmit} loading={props.loading}>确定</SubmitButton>
        <Button type="primary" ghost onClick={onCancel}>取消</Button>
      </Space>}
    >
      { !!props.children ? props.children : '' }
    </Modal>
  )
}

export {
  dangerConfirm,
  normalConfirm,
  ConfirmModalTemplate
}


