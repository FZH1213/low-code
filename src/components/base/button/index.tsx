import type { ButtonProps } from 'antd';
import { Button } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
export type ComponentProps = ButtonProps;

const FunctionComponent = Button;

export default FunctionComponent;

const ComponentsMap = { //组件映射
    PlusOutlined,
    DownloadOutlined
}
export function createButton(
    label: string,
    type?: any,
    onClick: any,
    icon: any
) {
    const Component = ComponentsMap[icon];
    return (
        <Button type={type} icon={<Component />} onClick={onClick}>
            {label}
        </Button>)
}