import React, { useEffect, useState } from 'react';
import { Space, Button } from 'antd';
import { history } from 'umi';
// import { GithubOutlined } from '@ant-design/icons'
import { useDesigner, TextWidget } from '@designable/react';
import { GlobalRegistry } from '@designable/core';
import { observer } from '@formily/react';
import { EditPage, loadInitialSchema, saveSchema, transformToSchema } from '../service';
import { message } from '@/components/base';
// import { transformToSchema } from '@designable/formily-transformer';
import { RollbackOutlined } from '@ant-design/icons';
import LeadingInPage from '../components/LeadingInPage';

export const ActionsWidget = observer(() => {
  const [saveBtnLoading, setSaveBtnLoading] = useState<boolean>(false);
  const designer = useDesigner();
  useEffect(() => {
    loadInitialSchema(designer);
  }, []);
  const supportLocales = ['zh-cn', 'en-us', 'ko-kr'];
  useEffect(() => {
    if (!supportLocales.includes(GlobalRegistry.getDesignerLanguage())) {
      GlobalRegistry.setDesignerLanguage('zh-cn');
    }
  }, []);
  return (
    <Space style={{ marginRight: 10 }}>

      {/* 导入其它页面 */}
      <LeadingInPage />

      <Button
        type="text"
        icon={<RollbackOutlined />}
        onClick={() => {
          history.push('/page-managelist');
          // window.location.reload();
          // history.goBack();
        }}
      >
        返回列表
      </Button>

      <Button
        onClick={() => {
          saveSchema(designer);
          // history.push(`/page-preview/`);
          window.open('/page-preview/', '_blank')
        }}
      >
        <TextWidget>预览</TextWidget>
      </Button>
      <Button
        type="primary"
        loading={saveBtnLoading}
        onClick={() => {
          setSaveBtnLoading(true);

          const { code, id, pageUrl, name }: any = history.location.query;
          let obj = {
            code: code,
            name: name,
            id: id,
            pageUrl: `/page-preview/${code}`,
            pageJson: JSON.stringify(transformToSchema(designer.getCurrentTree())),
          };
          EditPage({
            ...obj,
          }).then((res) => {
            if (res.code === 0) {
              // history.push('/page-managelist');
              // window.location.reload();
              message.success(res.message || 'Save Success');
            }
            setSaveBtnLoading(false);
          });
        }}
      >
        <TextWidget>Save</TextWidget>
      </Button>
    </Space>
  );
});
