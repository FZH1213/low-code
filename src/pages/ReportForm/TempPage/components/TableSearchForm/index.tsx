import React, { forwardRef, ReactNode, useEffect, useImperativeHandle, useState } from 'react';
import { Form, Row, Col, Button, Card, Dropdown, Menu, message } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { ColProps } from 'antd/lib/grid';
import moment from 'moment';
import ExcelDownLoadButton from '@/pages/ReportForm/components/ExcelDownLoadButton';
import './index.less';
import { history } from 'umi';


interface FieldProp {
  label: string;
  name?: string;
  components: ReactNode;
  // 注意传递的reactNode中  是按大部分框的长度，如input框设置的wrapper项
  // 像日历那些需要加style={{width:'100%'}},根据需求，修改大小
  long?: boolean;
  initValue?: any;
  colon?: boolean;
  layout?: { labelCol?: ColProps; wrapperCol?: ColProps };
  span?: any;
  attrColumns?: any;
  intCode?: any;
  tData?: any;
  rowInput?: any

}

interface TableSearchFormProps {
  // ref?: React.MutableRefObject<TableSearchFormInstance | undefined>;
  queryFieldsProp: Array<FieldProp>;
  onSearch?: (vales: any) => void;
  onReset?: () => void;
  initialValues?: any;
  form?: FormInstance | undefined;
  collapsable?: boolean;
  localStoreKey?: string;
  [key: string]: any;
  // 标志是否要使用自定义表单，而不是自适应表单
  customFields?: boolean;
  abreast?: boolean
  rowInput?: any

}

interface TableSearchFormInstance {
  getFormValues: () => { [key: string]: any };
  onSearchExec: () => void;
  setFuekdsValue: () => void; // bk.渲染表单
  onFormBtnClick: () => void; // bk.点击查询||重置
  onCollapsable: () => void; // bk.历史是否展开form表单
}

const MOMENT_PARAMS_PFX = 'moment_';

const TableSearchForm: React.FC<TableSearchFormProps> = forwardRef(
  (
    {
      customFields,
      initialValues,//表单默认值
      queryFieldsProp,
      onSearch,
      onReset,
      collapsable = true, // 是否展开
      form = undefined,
      abreast = false,
      localStoreKey = undefined,
      attrColumns,
      intCode,
      tData,
      rowInput

    },
    ref,
  ) => {
    const [expand, setExpand] = useState(false);
    const [reload, setReload] = useState(false);
    const [exceLoading, setExceLoading] = useState(false);
    const [fromButtonClick, setFromButtonClick] = useState(false); // bk.保存点击了是查询还是重置
    const [inputDefault, setInputDefault] = useState<any>(3); //每行input框默认个数



    useEffect(() => {
      if (rowInput) {
        setInputDefault(rowInput)
      }
      // console.log(inputDefault,'123inputDefault');

    }, [history?.location?.query?.id, rowInput])

    let [thisForm] = Form.useForm();
    if (form) {
      thisForm = form;
    }

    useImperativeHandle(
      ref,
      (): TableSearchFormInstance => ({
        getFormValues: () => thisForm.getFieldsValue(),
        onSearchExec: () => onSearch && onSearch(thisForm.getFieldsValue()),
        // bk.渲染form表单
        setFuekdsValue: (data) => {
          thisForm.setFieldsValue(data);
          console.log('触发设置数据！')
        },
        // bk.获取点击查询和重置的变量。 传get重置
        onFormBtnClick: (isOpen) => {
          if (isOpen === 'get') {
            setFromButtonClick(false);
          }
          return fromButtonClick;
        },
        // bk.获取是否展开的函数。传get重置变量
        onCollapsable: (isOpen) => {
          if (isOpen === 'get') {
            setExpand(true);
          }
          return expand;
        },
      }),
    );

    useEffect(() => {
      if (localStoreKey) {
        const l = localStorage.getItem(localStoreKey);

        if (l) {
          const params = JSON.parse(l);
          const newParams = {};
          // 处理时间时段
          Object.entries(params).forEach((item) => {
            const k = item[0];
            const v = item[1];
            if (v !== undefined) {
              if (k.startsWith(MOMENT_PARAMS_PFX)) {
                const nk = k.substring(MOMENT_PARAMS_PFX.length);
                if (v instanceof Array) {
                  const nv = v.map((item) => (item ? moment(item) : null));
                  newParams[nk] = nv;
                } else {
                  newParams[nk] = moment(v);
                }
              } else {
                newParams[k] = v;
              }
            }
          });
          thisForm.setFieldsValue(newParams);
        }
      }
    }, []);

    let hiddenCollapse = false; // 是否隐藏展开
    if (!queryFieldsProp || !onSearch || !onReset) {
      return null; // 所有都为空的时候放回空
    }

    const getFields = (fieldProp: Array<any>) => {
      // const count = expand || !collapsable ? fieldProp.length : 4; //
      const count = fieldProp.length; //

      const children = [];
      for (let i = 0; i < count; i += 1) {
        if (fieldProp[i]) {
          children.push(
            // 每一项6列，共放4项
            <Col
              // span={fieldProp[i].span ? fieldProp[i].span : 6}
              md={fieldProp[i].span ? fieldProp[i].span : 24}
              xs={24}
              sm={24}
              key={i}
              style={{ display: expand || !collapsable ? 'block' : i < inputDefault * 1 ? 'block' : 'none' }}
            >
              <Form.Item
                className={[
                  fieldProp[i].padd ? 'padding' : 'zxx_table_search_form_padding_left',
                  fieldProp[i].style,
                ].join(' ')}
                // labelCol={{ span: 10 }}
                // wrapperCol={{ span: 14 }}
                {...fieldProp[i].layout}
                name={fieldProp[i].name}
                label={fieldProp[i].label}
                labelCol={{ span: 10 }}
                initialValue={fieldProp[i].initValue}
                labelAlign="right"
                colon={fieldProp[i].colon}
              // labelCol={{ xl:{span: 10 }}}
              // labelCol={ fieldProp[i].label<=4 ? {span: 4} :  {span: 6} }
              // wrapperCol={{ span:14 }}
              >
                {fieldProp[i].components}
              </Form.Item>
            </Col>,
          );
        } else {
          break;
        }
      }
      if (fieldProp.length <= inputDefault * 1) {
        hiddenCollapse = false;
      } else {
        hiddenCollapse = true;
      }
      // console.log(fieldProp, 789);
      thisForm.resetFields();//查询后清除查询框内容
      return children;
    };

    // 获取自定义表单项，就是不要栅格布局，使输入框变窄
    const getCustomFields = (fieldProp: Array<any>) => {
      // const count = expand || !collapsable ? fieldProp.length : 4; //
      const count = fieldProp.length; //

      const children = [];
      for (let i = 0; i < count; i += 1) {
        if (fieldProp[i]) {
          children.push(
            // 每一项6列，共放4项
            // <Col span={6} key={i}>
            <Form.Item
              className="zxx_table_search_form_padding_left"
              style={{ display: expand || !collapsable ? 'block' : i < inputDefault * 1 ? 'block' : 'none' }}
              // labelCol={{ span: 10 }}
              // wrapperCol={{ span: 14 }}
              {...fieldProp[i].layout}
              name={fieldProp[i].name}
              label={fieldProp[i].label}
              initialValue={fieldProp[i].initValue}
              labelAlign="right"
              colon={fieldProp[i].colon}
            // labelCol={{ xl:{span: 10 }}}
            // labelCol={ fieldProp[i].label<=4 ? {span: 4} :  {span: 6} }
            // wrapperCol={{ span:14 }}
            >
              {fieldProp[i].components}
            </Form.Item>,
            // </Col>,
          );
        } else {
          break;
        }
      }
      if (fieldProp.length <= inputDefault * 1) {
        hiddenCollapse = false;
      } else {
        hiddenCollapse = true;
      }
      thisForm.resetFields();//查询后清除查询框内容
      return children;
    };

    window.onresize = () => {
      // history.refresh();
      setReload(true);
      setTimeout(() => {
        setReload(false);
      }, 100);
    };

    const handleMenuClick = ({ key }) => {
      if (localStoreKey) {
        if (key === '1') {
          const params = thisForm.getFieldsValue();
          if (params) {
            // 处理时间字段的存储
            const newParams = {};
            Object.entries(params).forEach((item) => {
              const k = item[0];
              const v = item[1];
              if (v !== undefined) {
                if (moment.isMoment(v)) {
                  newParams[`${MOMENT_PARAMS_PFX}${k}`] = v;
                } else if (v instanceof Array && v.length > 0) {
                  if (moment.isMoment(v[0])) {
                    newParams[`${MOMENT_PARAMS_PFX}${k}`] = v;
                  } else {
                    newParams[k] = v;
                  }
                } else {
                  newParams[k] = v;
                }
              }
            });

            localStorage.setItem(localStoreKey, JSON.stringify(newParams));
            message.success('默认值设置成功');
          }
        } else {
          localStorage.removeItem(localStoreKey);
          message.success('默认值清除成功');
          thisForm.resetFields();
        }
      }
    };

    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="1">设置为默认查询条件</Menu.Item>
        <Menu.Item key="2">清除默认查询条件</Menu.Item>
      </Menu>
    );

    // bk*记住标识
    const onSearchClick = (values) => {
      // 点击的时候保存页面数据
      setFromButtonClick(false);
      // 搜索
      onSearch(values);
    };

    return (
      <Card className="advanced-search-card" loading={reload} bordered={false}>
        <Form
          initialValues={initialValues}
          form={thisForm}
          name="advanced_search"
          className="ant-advanced-search-form"
          onFinish={onSearchClick}
        >
          {/* <div style={{ display: 'flex' }}> */}
          <Row>
            <Col flex={3.5}>
              <Row gutter={0}>
                {customFields != null && customFields == true
                  ? getCustomFields(queryFieldsProp)
                  : getFields(queryFieldsProp)}
              </Row>
            </Col>
            <Col flex={3.5}>
              <Row justify="end">
                <Col>
                  {localStoreKey ? (
                    <Dropdown.Button
                      className="mine-btn-overload"
                      overlay={menu}
                      type="primary"
                      htmlType="submit"
                    >
                      查询
                    </Dropdown.Button>
                  ) : (
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                  )}
                  <Button
                    style={{ margin: '0 10px' }}
                    onClick={async () => {
                      await thisForm.resetFields();
                      await thisForm.setFieldsValue({});
                      if (onReset) onReset();
                      setFromButtonClick(true);
                    }}
                  >
                    重置
                  </Button>
                  {
                    abreast && !!tData && tData.records && tData.records.length > 0 ?
                      <ExcelDownLoadButton
                        style={{ color: '#666', marginBottom: 10 }}
                        url="/api/wrapper/intfManDesc/output"
                        isloading={exceLoading}
                        // method = 'POST'
                        data={() => {
                          setExceLoading(true)
                          setTimeout(() => {
                            setExceLoading(false)
                          }, 5000)
                          let obj: any = {};
                          intCode.map(async (item: any) => {
                            if (item.intLvl == 1 && attrColumns.length > 0) {
                              obj.srvCode = item.intCode
                            }
                          })
                          console.log(obj);

                          return obj
                        }}
                      // type="dashed"
                      >
                        导出
                      </ExcelDownLoadButton>
                      :
                      null
                  }
                  {(hiddenCollapse || expand) && collapsable && (
                    <a
                      className="advanced-search-exbtn"
                      style={{ marginLeft: '10px' }}
                      onClick={() => {
                        setExpand(!expand);
                      }}
                    >
                      {expand ? ['收起', <UpOutlined />] : ['展开', <DownOutlined />]}
                    </a>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          {/* </div> */}
        </Form>
      </Card>
    );
  },
);
export { FieldProp, TableSearchFormInstance };
export default TableSearchForm;
