import { Settings as LayoutSettings } from '@ant-design/pro-layout';
import settingData from '../public/config/settings.json';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = settingData;

export default Settings;
