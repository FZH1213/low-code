import { Modal, Button } from '@/components/base';
import { useState } from 'react';

/**
 * 输入框
 *
 * @param {*} props
 * @param {*} props.title 弹框标题
//  * @param {*} props.name 表单名
//  * @param {*} props.required 必填样式，必填规则
//  * @param {*} props.placeholder 占位符
//  * @param {*} props.type input输入类型
//  * @param {*} props.maxLength 最大长度
//  * @param {*} props.value 默认值
 * @return {*}
 */
interface PcModalProps {
  title: string;
  styleType: 'primary' | 'ghost' | 'dashed' | 'link' | 'text' | 'default';
  clickButton: string;
  //   required: boolean;
  //   hidden: boolean;
  //   placeholder: string;
  //   type: string;
  //   maxLength: number;
  //   value: string;
}
export const PcModal: React.FC<PcModalProps> = (props) => {
  const [isModalOpen, setisModalOpen] = useState<any>(false);

  const showModal = () => {
    setisModalOpen(true);
  };
  const handleCancel = () => {
    setisModalOpen(false);
  };
  const handleOk = () => {
    setisModalOpen(false);
  };
  return (
    <>
      <Button type={props.styleType} onClick={showModal}>
        {props.clickButton}
      </Button>

      <Modal footer={null} title={props.title} visible={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        {props.children}
      </Modal>
    </>
  );
};
