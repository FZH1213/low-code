import { Form, Upload, Button, message } from '@/components/base';
import React, { useEffect, useRef, useState } from 'react';
import { handlerBeforeUpload, handlerChange, handlerDownload, handlerItemRender, UploadProps } from '..';
import { InboxOutlined } from '@ant-design/icons';
import { ACCESS_TOKEN_KEY } from '@/utils/constant';

const DraggerUpload = ({ node, params }: UploadProps) => {


    return (
        <Form.Item
            label={node?.props?.label}
            required={node?.props?.required}
            getValueFromEvent={(e) => {
                return e?.fileList?.map((item: any) => {
                    const res = item?.response;
                    if (res?.code === 0) {
                        res.data.url = res.data.fileUrlView;
                    }
                    return res?.data;
                });
            }}
            {...params}
        >
            <Upload.Dragger
                onChange={handlerChange}
                beforeUpload={handlerBeforeUpload('ButtonUpload', node)}
                action={node?.props?.action}
                headers={{
                    Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
                }}
                disabled={node?.props?.disabled}
                data={{
                    btype: node?.props?.btype
                }}
                onDownload={handlerDownload}
                itemRender={handlerItemRender}
            >
                {
                    !node?.props?.disabled ? (
                        <>
                            <p className="ant-upload-drag-icon" style={{ marginBottom: '8px' }}>
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">{node?.props?.fileName}</p>
                        </>
                    ) : (
                        null
                    )
                }
            </Upload.Dragger>
        </Form.Item>
    )
}

export default DraggerUpload;
