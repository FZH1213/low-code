import { Form, Upload, Button, message, Image } from '@/components/base';
import React, { useEffect, useRef, useState } from 'react';
import { handlerBeforeUpload, handlerChange, uploadItemRender, UploadProps } from '..';
import { PlusOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { ACCESS_TOKEN_KEY } from '@/utils/constant';

const ImagesUpload = ({ node, params }: UploadProps) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
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
                <Upload
                    onChange={(file: any) => {
                        setFileList(file.fileList);
                        handlerChange(file);
                    }}
                    beforeUpload={handlerBeforeUpload('ButtonUpload', node)}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={(file: any) => {
                        setVisible(true);
                    }}
                    action={node?.props?.action}
                    headers={{
                        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`,
                    }}
                    disabled={node?.props?.disabled}
                    data={{
                        btype: node?.props?.btype
                    }}
                >
                    {
                        (fileList.length < node?.props?.maxCount || !node?.props?.disabled) ? (
                            <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>{node?.props?.fileName}</div>
                            </div>
                        ) : (
                            null
                        )
                    }
                </Upload>
            </Form.Item>
            <div
                hidden
            >
                <Image
                    preview={{ visible: false }}
                    src={fileList?.[0]?.thumbUrl}
                    onClick={() => setVisible(true)}
                />
                <div>
                    <Image.PreviewGroup preview={{ visible, onVisibleChange: setVisible }}>
                        {
                            fileList?.map((item: UploadFile) => (
                                <Image src={item.thumbUrl} key={item.uid} />
                            ))
                        }
                    </Image.PreviewGroup>
                </div>
            </div>
        </>
    )
}

export default ImagesUpload;