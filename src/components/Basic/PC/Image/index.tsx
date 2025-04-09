import React, { useState } from 'react';
import { Form, Image } from 'antd';

/**
 * 图片组件
 * @param {*} props
 * @param {*} props.label 标签的文本：左边标题
 * @param {*} props.name 表单名
 * @param {*} props.required 必填样式，必填规则
 * @param width //图片宽度
 * @param height //图像高度
 * @param isPreview  //是否禁用预览
 * @param boolean
 * @return {*}
 */
interface PcImageProps {
  label: string;
  name: string;
  required: boolean;
  hidden: boolean;
  width: number;
  height: number;
  // value: string,
  isPreview: boolean;
  // fallback: string,
}
export const PcImage: React.FC<PcImageProps> = (props) => {
  const [srcId, setSrcId] = useState<any>(undefined);
  return (
    <Form.Item
      label={props.label}
      name={props.name}
      hidden={props.hidden}
      getValueProps={(value: any) => setSrcId(value)}
    >
      {srcId ? (
        <Image
          width={props.width}
          height={props.height}
          src={
            srcId.includes('http') ? srcId : `/api/file/fileDown/downloadFileById?fileId=${srcId}`
          }
          // src={srcId}
          preview={props.isPreview ? false : true}
        />
      ) : null}
    </Form.Item>
  );
};
