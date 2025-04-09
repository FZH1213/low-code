import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { ProFormCaptcha, ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import { authUrl } from '@/utils/constant';

import request from '@/utils/request';

import routes from '../../../../config/routes';

import { ACCESS_TOKEN_KEY } from '../../../content/index';

// import { request } from 'umi';

import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const flatTreeToMapByKey = (tree: any[], map: any, key: string, childrenKey: string) => {
  if (!tree || !(tree instanceof Array)) {
    return;
  }
  tree.forEach((item) => {
    map[item[key]] = item;
    if (item[childrenKey] && item[childrenKey] instanceof Array && item[childrenKey].length > 0) {
      flatTreeToMapByKey(item[childrenKey], map, key, childrenKey);
    }
  });
};

// 递归构造菜单数据
const buildMenuTreeRecu = (data: any, mMap: any): any => {
  if (!data || !(data instanceof Array) || data.length <= 0) {
    return undefined;
  }
  const ret = data
    .filter((item) => item.link && mMap[item.link])
    .map((item) => {
      const nItem = {
        ...mMap[item.link],
        name: item.title,
        id: item.value,
        pid: item.pid,
        children: buildMenuTreeRecu(item.children, mMap),
        routes: buildMenuTreeRecu(item.children, mMap),
        // routes: undefined,
      };
      return nItem;
    });
  // ret.push({
  //   component: './404',
  // });
  return ret;
};

const routesMap = {};
flatTreeToMapByKey(routes, routesMap, 'path', 'routes');

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const [settingData, setSettingData] = useState<any>({});
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  // 这里应该重写 方法，替换为 自己的获取用户消息接口
  const fetchUserInfo = async (token) => {
    // const userInfo = await initialState?.fetchUserInfo?.();
    // if (userInfo) {
    //   await setInitialState((s) => ({
    //     ...s,
    //     currentUser: userInfo,
    //   }));
    // }

    // debugger;

    const userRes = await request('/api/admin/current/user', {
      method: 'get',
      headers: {
        Authorization: token,
      },
    });

    // console.log('获取用户相关数据 =>', userRes);

    if (userRes.code === 0) {
      await setInitialState((s) => ({
        ...s,
        currentUser: {
          ...userRes.data,
          name: userRes.data.nickName,
          avatar:
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp03%2F1Z921104Z92S8-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644459042&t=372cef337fb31f48687e68a6ede7fabc',
        },
      }));
    }

    // 获取登录用户的权限菜单数据，储存于 initialState 中
    // console.log('获取用户权限菜单');

    const localAuthMenuRes = await request('/api/base/menu/getTreeByUserAuth', {
      method: 'get',
      headers: {
        Authorization: token,
      },
    });

    if (localAuthMenuRes.code === 0) {
      console.log('登录的时候，接口获取的权限菜单数据 =>', localAuthMenuRes);

      const menuTree = buildMenuTreeRecu(localAuthMenuRes.data, routesMap);

      console.log('routes =>', routes);

      // debugger;

      await setInitialState((s) => ({
        ...s,
        localAuthMenu: menuTree,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);

    try {
      // 登录
      // 这里应该替换成 自己 的登录接口
      // const msg = await login({ ...values, type });

      const loginRes = await request('/api/admin/login/token', {
        method: 'post',
        data: {
          username: values.username,
          password: values.password,
        },
        requestType: 'form',
      });

      // console.log('登录校验 res =>', loginRes);

      if (loginRes.code === 0) {
        // 在这里 往缓存里面 记录返回的 token 值
        await window.localStorage.setItem(
          // 'ACCESS_TOKEN_KEY',
          `${ACCESS_TOKEN_KEY}`,
          `${loginRes.data.access_token}`,
        );

        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);

        // 下面这里获取用户消息，且异步获取权限菜单数据，存在 initailState 中
        await fetchUserInfo(`Bearer ${loginRes.data.access_token}`);
        /** 此方法会跳转到 redirect 参数所在的位置 */

        // console.log('history =>', history);

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        // debugger;
        history.push(redirect || '/welcome');
        window.location.reload(); //todo 不刷新菜单加载会加载路由的，后续研究加载顺序问题
        return;
      } else {
        if (loginRes.message != null) {
          message.error(`${loginRes.message}`);
        } else {
          message.error('服务器繁忙，请稍后再试！');
        }
      }
      // console.log(msg);
      // 如果失败去设置用户错误信息
      // setUserLoginState(loginRes.data);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status, type: loginType } = userLoginState;
  const fetchSettings = async () => {
    //设置参数代码，写死规则配置
    const requestUrl = '/config/settings.json';
    const req = request(requestUrl);
    const data = await req;
    setSettingData(data);
  };
  useEffect(() => {
    fetchSettings();
  }, []);

  // 登陆页面初始化添加校验和保存token代码
  const checkToken = async (values) => {
    // 在这里 往缓存里面 记录返回的 token 值
    await window.localStorage.setItem(
      // 'ACCESS_TOKEN_KEY',
      `${ACCESS_TOKEN_KEY}`,
      `${values}`,
    );

    const defaultLoginSuccessMessage = intl.formatMessage({
      id: 'pages.login.success',
      defaultMessage: '登录成功！',
    });
    message.success(defaultLoginSuccessMessage);

    // 下面这里获取用户消息，且异步获取权限菜单数据，存在 initailState 中
    await fetchUserInfo(`Bearer ${values}`);
    /** 此方法会跳转到 redirect 参数所在的位置 */

    if (!history) return;
    const { query } = history.location;
    const { redirect } = query as { redirect: string };
    history.push(redirect || '/welcome');
    window.location.reload(); //todo 不刷新菜单加载会加载路由的，后续研究加载顺序问题
    return;
  };

  const getSearchParam = (e) => {
    const params = new Map(
      window.location.search
        .slice(1)
        .split('&')
        .map((param) => param.split('=')),
    );
    if (params.get(e)) {
      return params.get(e);
    } else {
      return null;
    }
  };

  useEffect(() => {
    const token = getSearchParam('token');
    // debugger;
    console.log('token=======', token);
    if (token) {
      checkToken(token);
    } else {
      if (LOCAL_DEV_APP != 'LOCAL') {
        // window.location.href = authUrl;
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src={settingData?.loginLogo} />}
          title={settingData?.title}
          // subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          initialValues={{
            autoLogin: true,
          }}
          // actions={[
          //   <FormattedMessage
          //     key="loginWith"
          //     id="pages.login.loginWith"
          //     defaultMessage="其他登录方式"
          //   />,
          //   <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
          //   <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
          //   <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
          // ]}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <div
            style={{
              height: '48px',
            }}
          ></div>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '请输入用户名',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '请输入密码！',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'pages.login.phoneNumber.placeholder',
                  defaultMessage: '手机号',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.required"
                        defaultMessage="请输入手机号！"
                      />
                    ),
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: (
                      <FormattedMessage
                        id="pages.login.phoneNumber.invalid"
                        defaultMessage="手机号格式错误！"
                      />
                    ),
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.captcha.placeholder',
                  defaultMessage: '请输入验证码',
                })}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} ${intl.formatMessage({
                      id: 'pages.getCaptchaSecondText',
                      defaultMessage: '获取验证码',
                    })}`;
                  }
                  return intl.formatMessage({
                    id: 'pages.login.phoneLogin.getVerificationCode',
                    defaultMessage: '获取验证码',
                  });
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.captcha.required"
                        defaultMessage="请输入验证码！"
                      />
                    ),
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });
                  if (result === false) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
            </a>
          </div>
        </LoginForm>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default Login;
