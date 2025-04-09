import { Form, Upload, Button } from '@/components/base';
import { UploadOutlined } from '@ant-design/icons';
import ButtonUpload from './components/ButtonUpload';

/**
 * 上传文件
 *
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @param {*} props.placeholder 占位符
 * @param {*} props.type input输入类型
 * @param {*} props.maxLength 最大长度
 * @param {*} props.btnType 上传图片类型
 * @return {*}
 */
interface FileImportProps {
  label: string;
  name: string;
  required: boolean;
  btnType?: string;
}
export const FileImport: React.FC<FileImportProps> = (props) => {
  return (
    <ButtonUpload node={{ props: props }} params={props} />
  )
};
