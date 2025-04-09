import { Form, Input, Radio, Select, Tooltip } from '@/components/base';
import React, { forwardRef, useEffect, useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { GLOBAL_VALUE } from '@/utils/globalValue';
import { Row, Col } from '@/components/base';
import styles from './style/index.less';
export interface ComponentProps {
  /**
   * 操作类型编码
   * 1:新增
   * 2:编辑
   * 3:查看
   */
  operate?: number;
  /**
   * 用户数据
   */
  infoData?: any;

  ref?: any;
  company?: any;
  role?: any;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 22 },
};
const { Option } = Select;
const FunctionComponent: React.FC<ComponentProps> = forwardRef(
  ({ operate = 3, infoData, company, role }, ref) => {
    const [roleList, setRoleList] = useState<any>([]); // 角色名称列表
    const [companyName, setCompanyName] = useState<any>([]); // 公司名称
    const [status, setStatus] = useState<any>();
    useEffect(() => {
      userStatus(infoData);
      // getRole();
    }, []);

    const userStatus = (infoData: any) => {
      if (infoData.status == 1) {
        // infoData.status = '正常';
        setStatus('正常');
      } else if (infoData.status == 0) {
        // infoData.status = '禁用';
        setStatus('禁用');
      } else {
        // infoData.status = '锁定';
        setStatus('锁定');
      }
    };
    // 获取角色/公司
    // const getRole = () => {
    //   let userRole: any = [];
    //   let comName: any = [];
    //   role.map((item: any) => {
    //     infoData.roleList.map((item2: any) => {
    //       if (item2 == item.roleId) {
    //         let role: any = {};
    //         role.roleName = item.roleName;
    //         userRole.push(role);
    //         role = {};
    //       }
    //     });
    //   });
    //   setRoleList(userRole);
    //   company.map((item: any) => {
    //     if (item.id == infoData.companyId) {
    //       let companyName: any = {};
    //       companyName.comName = item.comName;
    //       comName.push(companyName);
    //       companyName = {};
    //     }
    //   });
    //   setCompanyName(comName);
    // };
    return (
      <div style={{ fontSize: '16px' }}>
        <Row>
          <Col span={6} style={{ textAlign: 'right', marginBottom: '10px' }}>
            昵称：
          </Col>
          <Col span={18}>{infoData.nickName}</Col>
        </Row>
        <Row>
          <Col span={6} style={{ textAlign: 'right', marginBottom: '10px' }}>
            登录名：
          </Col>
          <Col span={18}>{infoData.userName}</Col>
        </Row>
        <Row>
          <Col span={6} style={{ textAlign: 'right', marginBottom: '10px' }}>
            邮箱：
          </Col>
          <Col span={18}>{infoData.email}</Col>
        </Row>
        <Row>
          <Col span={6} style={{ textAlign: 'right', marginBottom: '10px' }}>
            手机号：
          </Col>
          <Col span={18}>{infoData.mobile}</Col>
        </Row>
        <Row>
          <Col span={6} style={{ textAlign: 'right', marginBottom: '10px' }}>
            状态：
          </Col>
          <Col span={18}>{status}</Col>
        </Row>
        <Row>
          <Col span={6} style={{ textAlign: 'right', marginBottom: '10px' }}>
            描述：
          </Col>
          <Col span={18}>{infoData.userDesc}</Col>
        </Row>
        {/* <Row>
          <Col span={6} style={{ textAlign: 'right', marginBottom: '10px' }}>
            公司：
          </Col>
          <Col span={18}>
            {companyName && companyName.length > 0 && companyName.map((item: any) => item.comName+' ')}
          </Col>
        </Row> */}
        <Row>
          <Col span={6} style={{ textAlign: 'right', marginBottom: '10px' }}>
            角色：
          </Col>
          <Col span={18}>
            {/* {roleList && roleList.length > 0 && roleList.map((item: any) => item.roleName+' ')} */}
            {infoData.roleList}
          </Col>
        </Row>
      </div>
    );
  },
);

export default FunctionComponent;
