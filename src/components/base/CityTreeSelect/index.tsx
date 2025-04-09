import React, { useEffect, useState } from 'react';
import { Cascader, TreeSelect, message } from '@/components/base';

const CityTreeSelect:React.FC<CityCityTreeSelectFormProps> = (props: { [key: string]: any }) => {
    const [treeSelectData, setTreeSelectData] = useState<any>();
    
    
    // 初始化
    useEffect(() => {
        getDataSource();
    }, []);

    const getDataSource = async () => {
        let res = await props.listService();
        if(res.code === 0){
            
            setTreeSelectData(res.data);
        }else{
            message.error(res.message);
        };
    };

    const onNumberChange = (value: any) => {
        props.onChange(value);
    };

    return(
        <TreeSelect allowClear placeholder="请选择"
            treeData={treeSelectData}
            showSearch
            treeNodeFilterProp={'title'}
            onChange={onNumberChange}
        />
    )
}


// 输出属性
export type CityCityTreeSelectFormProps = {
    /** @name 查询接口 */
    listService: any;
    /** @name 默认选中*/
    defaultValue?: any;
    /** @name 输出 */
    vaule?: any;
}
// 输出该组件
export default CityTreeSelect;