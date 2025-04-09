import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Table, message } from '@/components/base';
import { GLOBAL_VALUE } from '@/utils/globalValue';
import styles from './index.less';
import { formListHistory } from '@/utils/historicalPreservation';
import { values } from '@antv/util';

const BizTable: React.FC<any> = (props: { [key: string]: any }) => {
  const rowSelectionParam: any = {}; // 每个表格的属性
  const [loading, setLoading] = useState<any>(false); // *列表操作*
  // const [pageSize, setPageSize] = useState<number>( (props.currentPage1 && props.currentPage1.limit) || 10);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageData, setPageData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<any>({});
  // 20210726 增加全选功能||优化全选功能
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [allChoiceTableData, setAllChoiceTableData] = useState({});
  let datapage = {};
  let sizepage;
  // console.log(props)
  // 选中项
  let rowSelections: any = {};
  if (
    props.rowSelection &&
    props.rowSelection.type === 'checkbox' &&
    !props.rowSelection.onChange
  ) {
    rowSelections = {
      selectedRowKeys,
      // 选中的变化回调
      onChange: async (record: any) => {
        let choiceTableData = {};
        choiceTableData[pageData ? pageData.page : 1] = record;
        await setAllChoiceTableData(Object.assign(allChoiceTableData, choiceTableData));
        // 下面方法可分出;
        let data: any = [];
        for (let key in allChoiceTableData) {
          data = data.concat(allChoiceTableData[key]);
        }
        props.tickData && props.tickData(data);
        setSelectedRowKeys(data);
      },
    };
  }
  useEffect(() => {
    if (props.selectEmpty === null) {
      setSelectedRowKeys([]);
    }
  }, [props.selectEmpty]);
  // 20210726 增加全选功能||优化全选功能 end

  useEffect(() => {
    // debugger
    // getTableList({ limit: pageSize, page: ((props.currentPage1 && props.currentPage1.page) || 1) },1);
    // getTableList({ limit: pageSize, page: 1 },1);
    // getTableList(props.PageData&&JSON.stringify(props.PageData) != '{}' ? props.PageData : { limit: pageSize, page: 1 },1)
    // console.log(JSON.stringify(props.PageData) == '{}', JSON.stringify(props.searchFormValues) == '{}', props.flag);
    if (props.PageData && JSON.stringify(props.PageData) != '{}') {
      if (JSON.stringify(props.searchFormValues) != '{}') {
        // props.PageData.page = 1;
        getTableList(props.PageData, 1);
      } else if (JSON.stringify(props.searchFormValues) == '{}') {
        // getTableList({ limit: pageSize, page: 1 },1)
        props.flag
          ? getTableList({ limit: pageSize, page: 1 }, 1)
          : getTableList(props.PageData, 1);
      }
    } else {
      getTableList({ limit: pageSize, page: 1 }, 1);
    }
    // getTableList( props.PageData && JSON.stringify(props.PageData) != "{}" ? props.PageData : { limit: pageSize, page: 1 },1);
    // props.getPageData(pageSize,currentPage)
  }, [props.searchFormValues, props.flag, props.PageData]);

  /**
   * @param 表格请求方法
   * @param value {limit: 10, page: 1}
   * @param isNum
   */
  const getTableList = async (value: any, isNum: number, isChange?: boolean) => {
    //  判断如果不是切页则清空勾选项
    if (!isChange) {
      setSelectedRowKeys([]);
    }
    if (isNum) {
      // setLoading(true);
      // 如果等于1的时候使用getFormValues，如果不是值只是是form值
      let formData = {};
      formData = props.searchFormValues;
      props.order?formData.order='desc':'' ;
      props.sort?formData.sort="gmt_create":'';
      // console.info("formData",formData)
      // 循环数据为空的删除掉
      for (let key in formData) {
        if (!formData[key]) {
          delete formData[key];
        }
      }
      // 页码跟form值合成一个对象做请求
      value = Object.assign(value, formData);
    
    }
    
    console.log(value);
    let timer = null
    timer = setTimeout(()=>{
      listPost()
    },500)
    
    const listPost = async()=>{
      let res = await props.listService(value);
    // setLoading(false);
    if (res.code === 0) {
      console.log(res.data,"表数据")
      setPageData(res.data);
    } else {
      message.error('处理失败请重试');
    }
    }
    
  };

  // 页码改变的回调
  const handleTableChange = (pagination: any) => {
    console.info(pagination,"11111111")
    setPageSize(pagination.pageSize);
    getTableList({ limit: pagination.pageSize, page: pagination.current }, 1, true);
    //   fetchList({ ...searchParams, page: pagination.current, limit: pagination.pageSize });
    if (props.getPageData) {
      props.getPageData({ limit: pagination.pageSize, page: pagination.current });
    }
  };

  // 向外传的页码数据
  //  getPageData = ()=>{
  //     // let dataList:any = []
  //     let data:any = {}
  //     data.currentPage = currentPage
  //     data.pageSize = pageSize
  //     return data
  // }
  // useImperativeHandle(ref,()=>({
  //     // 缓存的page值
  //     pageSize,
  //     currentPage,
  //     getPageData
  //     // getPageData: ()=>{}
  // }))

  return (
    <Table
      className={styles.GTable}
      size={GLOBAL_VALUE.TABLE_SISE}
      columns={props.columns}
      sortDirections={props.sortDirections}
      // rowKey={GLOBAL_VALUE.TABLE_KEY}
      rowKey={props.rowKey}
      dataSource={pageData ? pageData.records : []}
      loading={props.loading} // 加载
      // rowSelection={props.rowSelection}
      rowSelection={
        props.rowSelection ? { ...props.rowSelection, ...rowSelections } : props.rowSelection
      }
      scroll={props.scroll}
      pagination={{
        pageSize,
        total: pageData ? pageData.total : 0,
        current: pageData ? pageData.page : 1,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => GLOBAL_VALUE.TABLE_SHOWTOTAL(total, range),
      }}
      onChange={handleTableChange}
    />
  );
};

// 输出属性
export type BizTableProps = {
  /** @name 是否需要滚动 */
  scroll?: any;
  /** @name 字段列表 */
  columns: any;
  /** @name 查询接口 */
  listService: any;
  /** @name 查询条件 */
  searchFormValues: any;
  searchFormValues2:any
  /** @name 勾选框 */
  rowSelection?: any;
  /** @name 勾选全部数据暴露 */
  tickData?: any;
  /** @name 取消全部清空数据 */
  selectEmpty?: any;
  /** @name 唯一id */
  rowKey?: any;
  currentPage1?: any;
  sortDirections?:any;
  loading:any
};
// 输出该组件
export default BizTable;
