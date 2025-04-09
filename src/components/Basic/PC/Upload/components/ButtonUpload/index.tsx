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
                return e?.fileList?.map((item: any) => {
                    const res = item?.response;
                    if (res?.code === 0) {
                        res.data.url = res.data.fileUrlView;
                        res.data.name = res.data.fileName;
                    }
                    return res?.data;
                });
            }}
            {...params}
        >
            <Upload
                onChange={handlerChange}
                beforeUpload={handlerBeforeUpload('ButtonUpload', node)}
                className={styles.upload}
                action={node?.props?.action}
                headers={{
                    Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
                }}
                data={{
                    btype: node?.props?.btype
                }}
                disabled={node?.props?.disabled}
                showUploadList={{
                    showDownloadIcon: true,
                    showRemoveIcon: true,
                    showPreviewIcon: true,
                }}
                onDownload={handlerDownload}
                itemRender={handlerItemRender}
            >
                {
                    !node?.props?.disabled ? (
                        <Button className={styles.wbico_file}>
                            <FileOutlined />
                            {node?.props?.fileName}
                        </Button>
                    ) : (
                        null
                    )
                }
            </Upload>
        </Form.Item>
    )
}

export default ButtonUpload;