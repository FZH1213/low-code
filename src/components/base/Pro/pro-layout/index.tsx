import type {
  FooterProps,
  PageContainerProps,
  TopNavHeaderProps,
  BasicLayoutProps,
  RouteContextType,
  HeaderProps,
  SettingDrawerProps,
  SettingDrawerState,
  Settings,
  ProSettings,
  MenuDataItem,
} from '@ant-design/pro-layout';
import {
  BasicLayout,
  RouteContext,
  PageLoading,
  GridContent,
  DefaultHeader,
  TopNavHeader,
  DefaultFooter,
  SettingDrawer,
  getPageTitle,
  PageHeaderWrapper,
  getMenuData,
  PageContainer,
  FooterToolbar,
  WaterMark,
  ProPageHeader,
  ProBreadcrumb,
} from '@ant-design/pro-layout';

export type { Settings, ProSettings };
export type { MenuDataItem };

const MyPageContainer = (
  props: PageContainerProps & {
    children: React.ReactNode;
  },
) => (
  <PageContainer title={props.title ? props.title : false} {...props}>
    {props.children}
  </PageContainer>
);

export {
  BasicLayout,
  RouteContext,
  PageLoading,
  GridContent,
  DefaultHeader,
  TopNavHeader,
  DefaultFooter,
  SettingDrawer,
  getPageTitle,
  PageHeaderWrapper,
  getMenuData,
  MyPageContainer as PageContainer,
  FooterToolbar,
  WaterMark,
  ProPageHeader,
  ProBreadcrumb,
};
export type {
  FooterProps,
  PageContainerProps,
  TopNavHeaderProps,
  BasicLayoutProps,
  RouteContextType,
  HeaderProps,
  SettingDrawerProps,
  SettingDrawerState,
};
export default BasicLayout;
