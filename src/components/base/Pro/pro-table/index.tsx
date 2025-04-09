import type {
  ProTableProps,
  IntlType,
  ActionType,
  TableRowEditable,
  ColumnsState,
  ProColumnsValueType,
  ProColumns,
  ProColumnType,
  RequestData,
  ListToolBarProps,
  DragTableProps,
} from '@ant-design/pro-table';
import ProTable, {
  ConfigProviderWrap,
  TableDropdown,
  ListToolBar,
  TableStatus,
  Search,
  EditableProTable,
  DragSortTable,
  IntlProvider,
  ConfigProvider,
  IntlConsumer,
  ConfigConsumer,
  zhCNIntl,
  IndexColumn,
  defaultRenderText,
  createIntl,
  arEGIntl,
  enUSIntl,
  viVNIntl,
  itITIntl,
  jaJPIntl,
  esESIntl,
  ruRUIntl,
  msMYIntl,
  zhTWIntl,
  frFRIntl,
  ptBRIntl,
} from '@ant-design/pro-table';

export type {
  ProTableProps,
  IntlType,
  ActionType,
  TableRowEditable,
  ColumnsState,
  ProColumnsValueType,
  ProColumns,
  ProColumnType,
  RequestData,
  ListToolBarProps,
  DragTableProps,
};
export {
  ConfigProviderWrap,
  TableDropdown,
  ListToolBar,
  TableStatus,
  Search,
  EditableProTable,
  DragSortTable,
  IntlProvider,
  ConfigProvider,
  IntlConsumer,
  ConfigConsumer,
  zhCNIntl,
  IndexColumn,
  defaultRenderText,
  createIntl,
  arEGIntl,
  enUSIntl,
  viVNIntl,
  itITIntl,
  jaJPIntl,
  esESIntl,
  ruRUIntl,
  msMYIntl,
  zhTWIntl,
  frFRIntl,
  ptBRIntl,
};
function MyProTable<U>(props: ProTableProps<Record<string, any>, U>) {
  return (
    <ProTable
      {...props}
      request={async (params, sort, filter) => {
        // 兼容后端数据结构
        // console.log(params, sort, filter);
        const sortKeys = Object.keys(sort);
        const pageData = await props?.request(
          {
            ...params,
            sort: sortKeys.length > 0 ? sortKeys[0] : undefined,
            order:
              sortKeys.length > 0 ? (sort[sortKeys[0]] === 'ascend' ? 'asc' : 'desc') : undefined,
          },
          sort,
          filter,
        );
        return {
          data: pageData?.data?.records,
          // success 请返回 true，
          // 不然 table 会停止解析数据，即使有数据
          success: pageData.code === 0,
          // 不传会使用 data 的长度，如果是分页一定要传
          total: pageData?.data?.total,
        };
      }}
    />
  );
}

export default MyProTable;
