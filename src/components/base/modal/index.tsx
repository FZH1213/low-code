import type { ModalProps, ModalFuncProps } from 'antd';
import { Modal } from 'antd';

import { message } from '@/components/base';
import { PlusOutlined, DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { TableSearchFormInstance } from '@/components/TableSearchForm';
import { judgeSucessAndGetMessage } from '@/utils/requestUtil';
export type ComponentProps = ModalProps;
export type ComponentFuncProps = ModalFuncProps;

const FunctionComponent = Modal;

export default FunctionComponent;

const ComponentsMap = { //组件映射
    PlusOutlined,
    DownloadOutlined,
    ExclamationCircleOutlined
}
export function createConfirm(
    data: any,
    queryFormRef: TableSearchFormInstance | undefined,
    handleService: any
) {
    return (Modal.confirm({
        title: '确定删除吗？',
        icon: <ExclamationCircleOutlined />, //暂时写死吧
        onOk: async () => {
            if (data) {
                const [flag, msg] = await judgeSucessAndGetMessage(handleService(data));
                if (flag) {
                    message.success(msg || '操作成功');
                    queryFormRef.current?.onSearchExec();
                } else {
                    message.error(msg || '操作失败');
                }
            }
        },
    }))
}