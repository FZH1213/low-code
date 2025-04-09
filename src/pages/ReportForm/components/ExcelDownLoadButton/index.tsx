import Button, { BaseButtonProps } from 'antd/lib/button/button';
import React, { useEffect, useRef, useState }  from 'react';
import { getExportFile } from './service';
import styles from './style.less';

interface MyBaseButtonProps extends BaseButtonProps {
  url: string;
  method?: 'GET' | 'POST';
  params?: () => any;
  data?: () => any;
}

const FunctionComponent: React.FC<MyBaseButtonProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  if (!props.url) {
    return null;
  }
  const { children = '导出', method = 'POST' ,isloading} = props;

  const exportFile = () => {
    setLoading(true)
    
    getExportFile({
      url: props.url,
      params: props.params ? props.params() : {},
      reqData: props.data ? props.data() : {},
      method,
    });
    
    setLoading(false)
    
  };

  return (
    <Button {...props} onClick={exportFile} disabled={isloading} loading={isloading}>
      {children}
    </Button>
  );
};

export default FunctionComponent;
