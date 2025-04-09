import { List } from '@/components/base';

import React, { useEffect, useState, useRef } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { history } from 'umi';
/**
 * 展示列表
 */
interface PcDisplaysListProps {
  dataSource: any[];
  requestUrl: string;
  requestMethod: 'post' | 'get';
  _var: any;
}
export const PcDisplaysList: React.FC<PcDisplaysListProps> = (props) => {
  const [searchValue, setSearchValue] = useState<any>({});
  const [listDataSource, setlistDataSource] = useState<any>([]);
  const renderHandle = async (params) => {
    const data = await judgeSucessAndGetData(
      await createRequest(props?.requestUrl, props?.requestMethod)(params),
    );
    if (!data) return;
    if (data) {
      setlistDataSource(data);
    }
  };
  // let timerCust;
  useEffect(() => {
    // clearTimeout(timerCust);
    setSearchValue({ ...history.location.query, ...props?._var });
    // setSearchValue({ ...history.location.query });
    console.log('props?._var', props?._var);
    // timerCust = setTimeout(() => {
    //   renderHandle(searchValue);
    // }, 200);
    renderHandle(searchValue);
  }, [props?._var]);
  return (
    <div>
      {listDataSource && listDataSource.length > 0 && (
        <List
          dataSource={listDataSource ? listDataSource : props.dataSource}
          renderItem={(value) => (
            <List.Item>
              {React.Children.map(props.children, (child: any) => {
                console.log('@@@@@ value', value);
                return React.cloneElement(child.props.children, { value });
              })}
            </List.Item>
          )}
        ></List>
      )}
    </div>
  );
};
