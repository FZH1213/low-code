import { Alert, Form } from '@/components/base';
import React, { useState, useEffect } from 'react';
import {} from 'module';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { isArray } from 'lodash';
/**
 *
 * @return {*}
 */
interface PcAlertProps {
  name: string;
  hidden: boolean;
  message: string;
  description: string;
  type: string;
  showIcon: boolean;
  closable: boolean;
  banner: boolean;
  requestUrl: string;
}
export const PcAlert: React.FC<PcAlertProps> = (props) => {
  const [alertData, setAlertData] = useState<any>(null);
  const request = createRequest(props.requestUrl, 'post');
  const renderHandle = async () => {
    if (!props.requestUrl) {
      return;
    }
    const data = await judgeSucessAndGetData(await request({}));
    if (!data) return;
    setAlertData(data);
  };
  useEffect(() => {
    renderHandle();
  }, []);
  return <Alert {...props} {...alertData} />;
};
