import React, { useState, useEffect } from 'react';
import { message, Select } from '@/components/base';
// const { Option } = Select;
import api from '@/services/sysDictionary';
const BizCategorySelect: React.FC<BizCategorySelectProps> = (props: { [key: string]: any }) => {
  const [optionData, setOptionData] = useState([]);

  useEffect(() => {
    getSelectOptions(props.category);
  }, []);

  const getSelectOptions = async (category: string) => {
    let res = await api.getSelectOptions(category);
    console.info(res);
    if (res.code === 0) {
      setOptionData(res.data);
    } else {
      message.error('处理失败请重试');
    }
  };
  return (
    <Select showSearch allowClear placeholder="请选择">
      {optionData
        ? optionData.map((item: any) => {
            // console.log('item =>', item)
            return (
              <Select.Option key={item.value} value={item.value}>
                {item.title}
              </Select.Option>
            );
          })
        : undefined}
    </Select>
  );
};

// 输出属性
export type BizCategorySelectProps = {
  /** @name 字典类型 */
  category: string;
};
// 输出该组件
export default BizCategorySelect;

export function createBizCategorySelect(
  categoryOption: any,
  value = 'value',
  title = 'title',
  disabled = false,
  multiple = undefined,
) {
  // console.info(categoryOption)
  return (
    <Select
      showSearch
      allowClear
      mode={multiple}
      optionFilterProp="children"
      placeholder="请选择"
      disabled={disabled}
      filterOption={(input, option: any) => {
        return option.show.indexOf(input) >= 0;
      }}
    >
      {categoryOption
        ? categoryOption.map((item: any) => {
            return (
              <Select.Option show={item[title]} key={item[value]} value={item[value]}>
                {item[title]}
              </Select.Option>
            );
          })
        : undefined}
    </Select>
  );
}

/**
 *
 * @param {*} dictList
 * @param {*} value
 */
export function getCategoryText(dictList: any, value: any, val = 'value', title = 'title') {
  try {
    return dictList.filter((item: any) => {
      return item[val] == value;
    })[0][title];
  } catch (error) {
    return '';
  }
  return '';
}
