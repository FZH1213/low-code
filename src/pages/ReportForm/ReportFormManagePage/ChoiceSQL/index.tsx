import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Space, message } from 'antd';
// import '@/theme/default/common.less';
// import BottomAffix from '@/components/BottomAffix';
import { IndexModelState, ConnectRC, Loading, connect, history } from 'umi';
import SQLForm from './components/index';
import api from './service';
import { encryption, Decrypt } from '@/utils/stringUtil';
import BottomAffix from '@/components/BottomAffix';
// 新增，编辑SQL接口
interface PageProps {
  reportFormCreate: IndexModelState;
  loading: boolean;
}
const ChoiceSQL: ConnectRC<PageProps> = (props: any) => {
  const { sqlPageLevel, sqlData, tableColum } = props.reportFormCreate;

  const [tplTypId, setSqlId] = useState(props.location.query.tplTypId);
  const [tplTitle, setTplTitle] = useState(props.location.query.title);
  const [id, setId] = useState(props.location.query.id);
  const [loading, setLoading] = useState<any>(false) // 按钮加载状态
  useEffect(() => {

    // 根据模板id获取模板说明
    getRemarkByTplId({ tplId: tplTypId });
    return () => {
      props.dispatch({
        type: 'reportFormCreate/resetSqlPageLevel',
        payload: {
          sqlPageLevel: 1,
          tableColum: '',
          sqlData: [
            {
              rptName: '',
              intLvl: 1,
              intName: '',
              intType: '',
              intVal: '',
              intValEnc: '',
              intfIttrDescList: [],
              // tplId: 0
            },
          ],
        },
      });
    };
  }, []);
  const getRemarkByTplId = async (v: any) => {
    let res = await api.getRemarkByTplId(v);
    if (res.code === 0) {
      props.dispatch({
        type: 'reportFormCreate/setSqlPageLevel',
        payload: {
          remark: res.data,
        },
      });
    }
  };

  // 配置提交
  const save = async (status: string) => {
    // 按钮加载
    setLoading(true)
    let arr: any = [...sqlData];
    arr[0].tplId = tplTypId;
    arr[0].intSts = status;
    arr[0].id = id;
    if (!arr[0].rptName) {
      message.error('标题必填！');
      return;
    }
    let res: any
    for (let j = 0; j < arr.length; j++) {
      let arrSplitString = '';
      let arrSplit = arr[j].intVal.split('')
      for (let i = 0; i < 6; i++) {
        arrSplitString = arrSplitString + arrSplit[i]
      }
      if (arrSplitString == 'SELECT') {
        let a = arr[j].intVal
        arr[j].intVal = encryption('1234567890123456', a);
      }
    }

    let newArr = arr.map((item: any, index: any) => {
      let o = { ...item }
      let arr2 = item?.intfIttrDescList.map((it: any) => {
        let obj = { ...it }
        for (let key in obj) {
          const condition = ['isFilter', 'isDisabled', 'isId', 'isLinkTo'];
          if (condition.includes(key)) {
            if (obj[key] === '是') {
              obj[key] = '1'
            } else if (obj[key] === '否') {
              obj[key] = '0'
            }
          }
        }
        return obj;
      });
      o.intfIttrDescList = arr2
      return o;
    });


    res = await api.addOrUpdateList(newArr);
    if (res.code === 0) {
      // 取消按钮加载
      setLoading(false)
      message.success(res.message);
      // 提交成功跳转列表页
      history.push('/reportFormManagePage')
    } else {
      // 取消按钮加载
      setLoading(false)
      message.error(res.message || res.status);
    }
    // });
  };
  return (
    <div>
      <SQLForm query={{
        tplTypId: tplTypId,
        tplTitle: tplTitle,
        id,
      }} />
      <BottomAffix>
        <Space>
          <Button
            style={{ width: '10vw', borderRadius: 6, height: 32 }}
            onClick={async () => {
              if (sqlPageLevel === 1) {
                window.history.go(-1);
              } else {
                sqlData.length &&
                  (await sqlData.map((item: any, i: number) => {
                    item.intfIttrDescList.length &&
                      item.intfIttrDescList.map((ite: any) => {
                        if (ite.columId === tableColum) {
                          props.dispatch({
                            type: 'reportFormCreate/setSqlPageLevel',
                            payload: {
                              tableColum: sqlData[i].attrId,
                              sqlPageLevel: sqlPageLevel - 1,
                            },
                          });
                        }
                      });
                  }));
              }
            }}
          >
            返回
          </Button>

          <Button
            loading={loading}
            onClick={() => save('1')}
            type="primary"
            style={{ width: '10vw', borderRadius: 6, height: 32 }}
          >
            保存发布
          </Button>
        </Space>
      </BottomAffix>
    </div>
  );
};

export default connect(
  ({
    reportFormCreate,
    loading,
    user,
  }: {
    reportFormCreate: IndexModelState;
    loading: Loading;
    user: any;
  }) => ({
    reportFormCreate,
    loading: loading.models.reportFormCreate,
    user,
  }),
)(ChoiceSQL);
