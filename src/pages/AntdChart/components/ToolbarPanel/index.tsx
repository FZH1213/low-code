import React, { forwardRef, PropsWithChildren, useEffect, useImperativeHandle, useRef } from 'react'
import styles from './index.less';
import { Button, Divider, Tooltip } from '@/components/base';

interface ToolbarProps {

};

/**
 * 绑定工具栏事件
 * @param dom 工具栏dom
 * @param Toolbar 工具栏回调集
 */
export const handlerToolbar = (dom: any, Toolbar: any) => {
    dom.onclick = (e: PointerEvent & { path: Array<any> }) => {
        for (let i = 0; i < e.path.length; i++) {
            let command = e?.path[i]?.getAttribute?.('data-command');
            if (command) {
                Toolbar?.[command]?.();
                break;
            };
        };
    };
};
const Toolbar = forwardRef<ToolbarProps, PropsWithChildren<any>>((props, ref) => {
    const ToolbarPanelRef = useRef<any>({});

    useImperativeHandle(ref, () => (ToolbarPanelRef.current));

    return (
        <div className={styles.toolbar} ref={ToolbarPanelRef}>
            <div className={styles.command_view}>
                <Tooltip title="撤销">
                    <span className={styles.command} data-command="undo">
                        <span className={`${styles.iconfont} ${styles.icon_undo}`} />
                    </span>
                </Tooltip>
                <Tooltip title="前进">
                    <span className={styles.command} data-command="redo">
                        <span className={`${styles.iconfont} ${styles.icon_redo}`} />
                    </span>
                </Tooltip>
                <span className={styles.separator} />
                <Tooltip title="复制">
                    <span className={styles.command} data-command="copy">
                        <span className={`${styles.iconfont} ${styles.icon_copy_o}`} />
                    </span>
                </Tooltip>
                <Tooltip title="粘贴">
                    <span className={styles.command} data-command="paste">
                        <span className={`${styles.iconfont} ${styles.icon_paster_o}`} />
                    </span>
                </Tooltip>
                <Tooltip title="删除">
                    <span className={styles.command} data-command="delete">
                        <span className={`${styles.iconfont} ${styles.icon_delete_o}`} />
                    </span>
                </Tooltip>
                <span className={styles.separator} />
                <Tooltip title="放大">
                    <span className={styles.command} data-command="zoomOut">
                        <span className={`${styles.iconfont} ${styles.icon_zoom_out_o}`} />
                    </span>
                </Tooltip>
                <Tooltip title="缩小">
                    <span className={styles.command} data-command="zoomIn">
                        <span className={`${styles.iconfont} ${styles.icon_zoom_in_o}`} />
                    </span>
                </Tooltip>
                <Tooltip title="实际大小">
                    <span className={styles.command} data-command="realZoom">
                        <span className={`${styles.iconfont} ${styles.icon_actual_size_o}`} />
                    </span>
                </Tooltip>
                <Tooltip title="适应屏幕">
                    <span className={styles.command} data-command="autoZoom">
                        <span className={`${styles.iconfont} ${styles.icon_fit}`} />
                    </span>
                </Tooltip>
            </div>
            <div className={styles.button_view}>
                <Button>返回</Button>
                <Divider type="vertical" />
                <Button type="primary">保存</Button>
            </div>
        </div>
    )
});

export default Toolbar;