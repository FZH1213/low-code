import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer, ProBreadcrumb } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link, useModel } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const previewPath = '/page-preview';
import request from '@/utils/request';

import { ACCESS_TOKEN_KEY } from '../src/content/index';

import test from '../public/test.json';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
// 在这里从 缓存中获取 token 校验，如果校验失败，跳转到登录页面
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  currentMenu;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    // console.log('刷新前验证token是否存在 =>', window.localStorage.getItem(`${ACCESS_TOKEN_KEY}`));

    try {
      // const msg = await queryCurrentUser();
      // return msg.data;

      if (
        window.location.pathname === loginPath ||
        window.location.pathname === '/' ||
        window.location.pathname === previewPath
      ) {
        return undefined;
      }
      const userRes = await request('/api/admin/current/user', {
        method: 'get',
      });
      return {
        ...userRes.data,
        name: userRes.data.nickName,
        avatar:
          'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp03%2F1Z921104Z92S8-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644459042&t=372cef337fb31f48687e68a6ede7fabc',
      };
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 递归构造菜单数据
  const buildMenuTreeRecu = (data: any): any => {
    if (!data || !(data instanceof Array) || data.length <= 0) {
      return undefined;
    }
    const ret = data
      .filter((item) => item.link)
      .map((item) => {
        // 添加判断，开头是不是http，如果是，那么就跳转容器页面，且添加全屏参数
        if (item.link != null && item.link.length != null) {
          // console.log(item.link);
          if (item.link.slice(0, 4) === 'http') {
            // item.link = `/iframe-wrapper?link=${item.link}`;
            // debugger;

            let flagArr = item.link.split('/');
            let flagStr = flagArr[flagArr.length - 1];
            item.link = `/iframe-wrapper/${flagStr}?link=${item.link}`;
            // console.log('item.link', item.link);
          }
        }

        const nItem = {
          name: item.title,
          path: item.link,
          // icon: icon && IconMap[icon as string], todo 后面加字段
          routes: buildMenuTreeRecu(item.children),
          key: item.code,
          // parentKeys: [item.link]
        };
        return nItem;
      });
    return ret;
  };
  const fetchMenuInfo = async () => {
    const localAuthMenuRes = await request('/api/base/menu/getTreeByUserAuth', {
      method: 'get',
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem(`${ACCESS_TOKEN_KEY}`)}`,
      },
    });
    if (localAuthMenuRes.code === 0) {
      let menuTree = buildMenuTreeRecu(localAuthMenuRes.data);
      if (menuTree == null) {
        menuTree = [];
      }
      // debugger;
      return menuTree;
    }
  };
  const fetchSettings = async () => {
    //设置参数代码，写死规则配置
    const requestUrl = '/config/settings.json';
    const req = request(requestUrl);
    const data = await req;
    return data;
  };
  // 如果是登录页面，不执行
  if (
    history.location.pathname !== loginPath &&
    history.location.pathname !== previewPath &&
    history.location.pathname !== '/'
  ) {
    const currentUser = await fetchUserInfo();
    const currentMenu = await fetchMenuInfo();
    const settings = await fetchSettings();
    // debugger;
    return {
      fetchUserInfo,
      currentUser,
      settings: settings,
      currentMenu,
    };
  }
  return {
    fetchUserInfo,
    settings: {},
    currentMenu: [],
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => null,
    onPageChange: () => {
      // 路由发生改变的时候触发，在这里校验 token 是否存在
      const { location } = history;
      // console.info('onPageChangelocation', location);
      // 如果没有登录，重定向到 login
      if (
        !initialState?.currentUser &&
        location.pathname !== loginPath &&
        location.pathname !== previewPath
        // ||!window.localStorage.getItem(ACCESS_TOKEN_KEY)
      ) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {/* {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  currentMenu: preInitialState?.currentMenu,
                  settings,
                }));
              }}
            />
          )} */}
        </>
      );
    },
    route: () => { },
    menuDataRender: () => initialState?.currentMenu,
    // menuItemRender: (item, dom) => {

    //   console.info("item", item)
    //   console.info("dom", dom)
    //   return <Link to={item.path}>{dom} </Link>
    // },
    headerContentRender: () => {
      return <ProBreadcrumb />;
    },
    breadcrumbRender: (routers = []) => {
      //todo考虑通过menu计算

      // routers[0].path = routers[0].path + history.location.search
      // console.info("breadcrumbRender", routers)
      // console.info("history", history)
      return [
        {
          path: '/',
          breadcrumbName: '主页',
        },
        ...routers,
      ];
    },
    ...initialState?.settings,
  };
};

// export const qiankun = {
//   // 应用加载之前
//   async bootstrap(props: any) {
//     // console.log('antapp bootstrap', props);
//     if (props && !window.localStorage.getItem(ACCESS_TOKEN_KEY)) {
//       // isMenu = props.isMenu
//       const logins = async () => {
//         const loginRes = await request('/api/admin/login/token', {
//           method: 'post',
//           data: {
//             username: 'admin',
//             password: 'ABCabc123',
//           },
//           requestType: 'form',
//         });
//         await window.localStorage.setItem(
//           // 'ACCESS_TOKEN_KEY',
//           `${ACCESS_TOKEN_KEY}`,
//           `${loginRes.data.access_token}`,
//         );
//       };
//       logins();
//     }
//   },
//   // 应用 render 之前触发
//   async mount(props: any) {
//     // console.log('antapp mount', props);
//   },
//   // 应用卸载之后触发
//   async unmount(props: any) {
//     // console.log('antapp unmount', props);
//   },
// };
