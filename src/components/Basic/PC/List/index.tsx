// import { List, Form } from '@/components/base';
import { ProList } from '@ant-design/pro-components';
import styles from './index.less'
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { history } from 'umi';
import React, { useEffect, useState, useRef } from 'react';
import type { ReactText } from 'react';
/**
 * 列表
 */
interface PcListProps {
  dataSource: any[];
  headerTitle: string;
  columns: any;
  pageSize: number
  requestUrl: string;
  requestMethod: 'post' | 'get'
  toolBarRender: any
  rowKey?: string
  set_ref: any
  _ref: any
  set_var: any
  _var: any
  size: any
}
export const PcList: React.FC<PcListProps> & {
  ToolBar?: React.FC<any>
} & {
  Content?: React.FC<any>
} & {
  OptionBar?: React.FC<any>
} = (props) => {
  const [dataList, setDataList] = useState<any>(null);

  useEffect(() => {
    renderHandle()
  }, [props?._var]);

  const renderHandle = async () => {
    const params = { ...history.location.query, ...props?._var }
    const data = await judgeSucessAndGetData(await createRequest(props?.requestUrl, props?.requestMethod)(params));
    if (!data) return;
    setDataList(data.records)
  }

  const [selectedRows, setSelectedRows] = useState<ReactText[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<ReactText[]>([]);
  const rowSelection = {
    selectedRows,
    // selectedRowKeys,
    onChange: (keys: ReactText[], selectedRows) => {
      setSelectedRows(keys)
      setSelectedRowKeys(selectedRows)
    }
  };
  return (
    <div {...props} className={styles.container}>
      <ProList
        size={props?.size}
        dataSource={dataList}
        toolBarRender={(selectedRowKeys, selectedRows) => [
          <div>
            {
              !!props.toolBarRender ? props.toolBarRender :
                React.Children.map(props.children?.[0], (child: any) => {
                  return React.cloneElement(child.props.children, { selectedRows })
                })
            }
          </div>
        ]}
        rowKey={props?.rowKey}
        headerTitle={props?.headerTitle}
        rowSelection={rowSelection}
        pagination={{ pageSize: props?.pageSize }}
        metas={{
          content: {
            dataIndex: 'content',
            render: (_, record) => React.Children.map(props.children?.[1], (child: any) => {

              if (child.props.children.type && child.props.children.type.name) {
                return (
                  React.cloneElement(child.props.children, { value: record })
                )
              }
              return (
                React.cloneElement(child.props.children.props.children, { value: record })
                // React.cloneElement(child, { value: record })
              )
            })
          },
          actions: {
            render: (_, record) => {
              return (
                React.Children.map(props.children?.[2], (child: any) => {
                  // return React.cloneElement(child.props.children, { selectedRows: {selectedRows:selectedRowKeys,selectedRowKeys: selectedRows} })
                  if (Array.isArray(child.props.children.props.children)) {
                    return React.cloneElement(child.props.children, { selectedRows: { selectedRows: [record] } })
                  }
                  if (child.props.children.props.children) {
                    // 只有一个操作按钮
                    return React.cloneElement(child.props.children.props.children, { selectedRows: { selectedRows: [record] } })
                  }
                })
              )
            }
          }
        }}
      />
    </div>
  );
};

PcList.ToolBar = (props) => {
  return <>
    {React.Children.map(props.children, (child: any) => {
      return React.cloneElement(child.props.children, { selectedRows: props.selectedRows })
    })}
  </>
}

PcList.Content = (props) => {
  return <>
    {React.Children.map(props.children, (child: any) => {
      return React.cloneElement(child.props.children, { selectedRows: props.selectedRows })
    })}
  </>
}

PcList.OptionBar = (props) => {
  // return <>{props.children}</>
  return <>
    {React.Children.map(props.children, (child: any) => {
      return React.cloneElement(child.props.children, { selectedRows: props.selectedRows })
    })}
  </>
}
