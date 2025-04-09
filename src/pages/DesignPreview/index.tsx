/**
 * ^                   _ooOoo_
 * ^                  o8888888o
 * ^                  88" . "88
 * ^                  (| -_- |)
 * ^                  O\  =  /O
 * ^               ____/`---'\____
 * ^             .'  \\|     |//  `.
 * ^            /  \\|||  :  |||//  \
 * ^           /  _||||| -:- |||||-  \
 * ^           |   | \\\  -  /// |   |
 * ^           | \_|  ''\---/''  |   |
 * ^           \  .-\__  `-`  ___/-. /
 * ^         ___`. .'  /--.--\  `. . __
 * ^      ."" '<  `.___\_<|>_/___.'  >'"".
 * ^     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 * ^     \  \ `-.   \_ __\ /__ _/   .-` /  /
 * ^======`-.____`-.___\_____/___.-`____.-'======
 * ^                   `=---='
 * ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 * 佛祖保佑       永无BUG
 *
 * 业务定义
 *
 * @author lvrui
 * @date 2022-09-10
 */

import React, { useState, useEffect } from 'react';
import { Schema, BaseForm } from '@/components/Basic/Base';
import {
  PcButton,
  PcCard,
  PcInput,
  PcTextArea,
  PcCheckbox,
  PcDatePicker,
  PcRadio,
  PcRate,
  PcSelect,
  PcTreeSelect,
  PcTable,
  PcUpload,
  PcTree,
  PcRow,
  PcCol,
  PcG2Bar,
  PcG2Column,
  PcG2Gauge,
  PcG2Line,
  PcG2Liquid,
  PcG2Pie,
  PcVArea,
  PcVDualAxes,
  PcVScatter,
  PcVRose,
  PcModal,
  PcSpace,
  PcButtonLink,
  PcLayout,
  FileImport,
  PcList,
  PcListButtonLink,
  PcTabs,
  // PcAutoComplete,
  PcSwitch,
  PcCascader,
  // PcStatistic,
  PcDisplaysList,
  PcDisplaysStatistic,
  PcDrawer,
  // PcCarousel,
  PcImage,
  PcVideo,
  PcProgress,
  PcAlert,
  PcFormGrid,
  PcDotMap,
  PcCarouselV2,
  PcDisplayText,
  PcAddData,
  PcCarousel3d,
} from '@/components/Basic/PC';
import { useParams } from 'umi';
import { getByCode } from './service';
/**
 * 组件映射
 */
const _com = {
  Schema,
  BaseForm,
  PcButton,
  PcCard,
  PcInput,
  PcModal,
  PcTextArea,
  PcCheckbox,
  PcDatePicker,
  PcRadio,
  PcRate,
  PcSelect,
  PcTreeSelect,
  PcTable,
  PcUpload,
  PcTree,
  PcRow,
  PcCol,
  PcG2Bar,
  PcG2Column,
  PcG2Gauge,
  PcG2Line,
  PcG2Liquid,
  PcG2Pie,
  PcVArea,
  PcVDualAxes,
  PcVScatter,
  PcVRose,
  PcSpace,
  PcButtonLink,
  PcLayout,
  FileImport,
  PcList,
  PcListButtonLink,
  PcTabs,
  'PcTabs.PcTabItemType': PcTabs.PcTabItemType,
  'PcTable.ToolBar': PcTable.ToolBar,
  'PcTable.OptionBar': PcTable.OptionBar,
  'PcList.ToolBar': PcList.ToolBar,
  'PcList.Content': PcList.Content,
  'PcList.OptionBar': PcList.OptionBar,

  // PcAutoComplete,
  PcSwitch,
  PcCascader,
  // PcStatistic,
  PcDisplaysList,
  PcDisplaysStatistic,
  // PcCarousel,
  PcDrawer,
  'PcDrawer.Content': PcDrawer.Content,
  'PcDrawer.OptionBar': PcDrawer.OptionBar,
  PcImage,
  PcVideo,
  PcProgress,
  PcAlert,
  PcFormGrid,
  PcDotMap,
  PcCarouselV2,
  PcDisplayText,
  PcAddData,
  PcCarousel3d,
};
/**
 * 方法映射
 */
const _fun = {};

/**
 *
 * @param props
 * @returns
 */
const TFOM: React.FC<{}> = (props) => {
  const [schema, setSchema] = useState<any>({});
  const { code }: any = useParams();
  /**
   * 全局变量，用户过程中产生变量
   */
  const [_var, set_var] = useState<any>({});
  /**
   * 全局常量，组件方法ref
   */
  const [_ref, set_ref] = useState<any>({});
  useEffect(() => {
    /**
     *  加载
     */
    setSchema({}); //清空schema，前一个页面数据清除，解决后续重置数据影响问题
    set_ref({});
    set_var({});
    preViewPageByCode();
  }, [code]);

  // 根据页面code获取页面pageJson
  const preViewPageByCode = async () => {
    console.info('code', code);
    if (code) {
      let res: any = await getByCode(code);
      if (res.code === 0) {
        const { pageJson } = res.data;
        setSchema(JSON.parse(pageJson));
      }
    } else {
      const jsonSchema = JSON.parse(localStorage.getItem('my-schema'));
      setSchema(jsonSchema);
    }
  };

  /**********页面生成代码 */
  /**
   * 参数转换
   * @param params
   * @returns
   */
  const transformEval = (params: any) => {
    let res = {};
    for (let param in params) {
      if (param.startsWith('_eval_')) {
        res[param.split('_eval_')[1]] = eval(params[param]);
      } else {
        res[param] = params[param];
      }
    }
    return res;
  };
  const createPage = (key: string, _schema: any) => {
    if (Object.keys(_schema).length == 0) return; //为空，即子节点，返回,这情况应该不存在
    const Component = _com[_schema.type];

    if (_schema.children && Object.keys(_schema.children).length == 1) {
      return (
        //解决单子节点是for受控组件失效
        <Component
          key={key}
          {...transformEval(_schema.params)}
          _var={_var}
          set_var={set_var}
          _ref={_ref}
          set_ref={set_ref}
        >
          {createPage(Object.keys(_schema.children)[0], Object.values(_schema.children)[0])}
        </Component>
      );
    } else {
      return (
        <>
          <Component
            key={key}
            {...transformEval(_schema.params)}
            _var={_var}
            set_var={set_var}
            _ref={_ref}
            set_ref={set_ref}
          >
            {_schema.children &&
              Object.keys(_schema.children).map((item) => {
                //存在子节点的情况
                return createPage(item, _schema.children[item]);
              })}
          </Component>
        </>
      );
    }
  };
  return <>{createPage('schema', schema)}</>;
};

export default TFOM;
