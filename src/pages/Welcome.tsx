import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './Welcome.less';
import welconePageImg from '../../public/welcone_Page.jpg';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const Welcome: React.FC = () => {
  const intl = useIntl();
  return (
    // <PageContainer>
    //   <Card>
    //     <Alert
    //       message={intl.formatMessage({
    //         id: 'pages.welcome.alertMessage1',
    //         defaultMessage: '欢迎',
    //       })}
    //       type="success"
    //       showIcon
    //       banner
    //       style={{
    //         margin: -12,
    //         marginBottom: 24,
    //       }}
    //     />

    //   </Card>
    // </PageContainer>
    // margin: 24,
    <div style={{overflow: 'hidden'}}>
      <img src={welconePageImg} alt="暂无图片" style={{display:'block',width:'100%',height:'100%'}} />
    </div>
  );
};

export default Welcome;
