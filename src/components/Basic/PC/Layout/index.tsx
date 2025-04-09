import { Layout } from '@/components/base';

/**
 * 
 *
 * @param {*} props
 * @param {*} props.layout 布局类型
 * @return {*}
 */
interface PcLayoutProps {
  layout: 'Layout' | 'Header' | 'Sider' | 'Content' | 'Footer'
}
const _com = {
  Layout,
  'Header': Layout.Header,
  'Sider': Layout.Sider,
  'Content': Layout.Content,
  'Footer': Layout.Footer,
}
export const PcLayout: React.FC<PcLayoutProps> = (props) => {
  const Component = _com[props.layout]
  return (
    <Component>
      {props.children}
    </Component>
  );
};
