import React, { useEffect, useState, useRef } from 'react';
import type { ProColumns, ActionType } from '@/components/base/Pro/pro-table';
import ProTable from '@/components/base/Pro/pro-table';
import { createRequest } from '@/utils/requestUtil';
import { history } from 'umi';
import styles from './index.less'

/**
 * 表格
 *
 * @param {*} props
 * @param {*} props.headerTitle 表头名称
 * @param {*} props.columns 选项
 * @param {*} props.pageSize 每页数量
 * @param {*} props.requestUrl 查询url
 * @param {*} props.requestMethod 请求类型
 * @return {*}
 */
interface PcTableProps {
  headerTitle: string;
  columns: any;
  pageSize: number
  requestUrl: string;
  requestMethod: 'post' | 'get'
  tableName: string
  toolBarRender: any
  rowKey?: string
  set_ref: any
  _ref: any
  set_var: any
  _var: any
  search: 'true' | 'false',
  isPagination: 'true' | 'false',
  isShowToolBar: 'true' | 'false',
  option: any
}


export const PcTable: React.FC<PcTableProps> & {
  ToolBar?: React.FC<any>
} & {
  OptionBar?: React.FC<any>
} = (props) => {
  const actionRef = useRef<ActionType>();
  const [searchValue, setSearchValue] = useState<any>(null);

  useEffect(() => {
    // setSearchValue({ ...history.location.query, ...props._var });
    if (history.location.pathname === '/page-design') {
      setSearchValue({ ...props._var });
    } else {
      setSearchValue({ ...history.location.query, ...props._var });
    }
  }, [props._var]);
  const columns = [...props.columns, {
    title: '操作',
    valueType: 'option',
    fixed: 'right',
    width: 180,
    // render: (text, record, _, action) => !!props.option ? props.option : props.children[1],
    render: (text, record, _, action) => !!props.option ? props.option :
      React.Children.map(props.children?.[1], (child: any) => {
        if (Array.isArray(child.props.children.props.children)) {
          return React.cloneElement(child.props.children, { selectedRows: { selectedRows: [record] } })
        }
        if (child.props.children.props.children) {
          // 只有一个操作按钮
          return React.cloneElement(child.props.children.props.children, { selectedRows: { selectedRows: [record] } })
        }
      })
  }]
  return (
    <ProTable<{}>
      columns={['true', undefined].includes(props.isShowToolBar) ? columns : props.columns}
      actionRef={actionRef}
      request={(params = {}, sort, filter) => {
        return createRequest(props.requestUrl, props.requestMethod)(params);
      }}
      params={searchValue}
      rowKey={props.rowKey || 'id'}
      rowSelection={['true', undefined].includes(props.isShowToolBar) ? {} : false}
      search={
        ['true', undefined].includes(props.search) ? (
          {
            labelWidth: 'auto',
          }
        ) : (
          false
        )
      }
      pagination={
        ['true', undefined].includes(props.isPagination) ? (
          {
            pageSize: props.pageSize
          }
        ) : (
          false
        )
      }
      toolBarRender={
        ['true', undefined].includes(props.isShowToolBar) ?
          (selectedRowKeys, selectedRows) => [
            <div>
              {
                !!props.toolBarRender ? props.toolBarRender :
                  // React.cloneElement(props.children[0], {selectedRows})
                  React.Children.map(props.children?.[0], (child: any) => {
                    return React.cloneElement(child.props.children, { selectedRows })
                  })
              }
            </div>
          ] : false
      }
      dateFormatter="string"
      headerTitle={props.headerTitle}
    />
  );
};

PcTable.ToolBar = (props) => {
  return <>
    {React.Children.map(props.children, (child: any) => {
      console.info("props.children", props, child)
      return React.cloneElement(child.props.children, { selectedRows: props.selectedRows })
    })}
  </>
}

PcTable.OptionBar = (props) => {
  // return <>{props.children}</>
  return <div className={styles.optionBar} style={{ display: 'flex', gap: '8px' }}>
    {React.Children.map(props.children, (child: any) => {
      return React.cloneElement(child.props.children, { selectedRows: props.selectedRows })
    })}
  </div>
}