import { AUTHORITY_TYPE } from '@/constants/authority';

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser | undefined }) {
  const { currentUser = {} } = initialState || {};
  const { authorities = [] } = currentUser;
  return {
    canDo: (authorityCode: string) => {
      const find = authorities.find(
        (item: { authority: string }) => item.authority === authorityCode,
      );
      return find !== undefined ? true : false;
    },
    routeFilter: (route: any) => {
      // if (currentUser?.userId === '1') {
      //   return true;
      // }
      const authCode = AUTHORITY_TYPE.AUTHORITY_PREFIX_MENU + route.name;
      const find = authorities.find((item: { authority: string }) => item.authority === authCode);
      return find !== undefined ? true : false;
    },
  };
}
