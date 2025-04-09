import { Form, Upload, Button, message } from '@/components/base';
import React, { useEffect, useRef, useState } from 'react';
import { handlerBeforeUpload, handlerChange, handlerDownload, handlerItemRender, UploadProps } from '..';
import { FileOutlined } from '@ant-design/icons';
import styles from './index.less';
import { ACCESS_TOKEN_KEY } from '@/utils/constant';
import { UploadFile } from 'antd';

const ButtonUpload = ({ node, params }: UploadProps) => {
    return (
        <Form.Item
            label={node?.props?.label}
            required={node?.props?.required}
            getValueFromEvent={(e) => {
                console.log('e',e);
                return e?.fileList;
            }}
            {...params}
        >
            <Upload
                onChange={handlerChange}
                // beforeUpload={handlerBeforeUpload('ButtonUpload', node)}
                beforeUpload={() => {return false}}
                className={styles.upload}
                // action={node?.props?.action}
                // headers={{
                //     Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
                // }}
                maxCount={node?.props?.maxCount}
                data={{
                    btype: node?.props?.btype
                }}
                showUploadList={{
                    showDownloadIcon: true,
                    showRemoveIcon: true,
                    showPreviewIcon: true,
                }}
                onDownload={handlerDownload}
                itemRender={handlerItemRender}
            >
                <Button className={styles.wbico_file}>
                    <FileOutlined />
                    {node?.props?.fileName}
                </Button>
            </Upload>
        </Form.Item>
    )
}

export default ButtonUpload;