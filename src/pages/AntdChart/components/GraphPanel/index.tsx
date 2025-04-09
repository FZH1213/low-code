import React, { useEffect, useRef, useState } from 'react';
import { G6 } from '@ant-design/charts';
import styles from './index.less';

interface graphPanelProps {

};
class graphPanel extends React.Component<graphPanelProps>{
    private graph;
    private readonly GraphRef: React.RefObject<any>;
    constructor(props) {
        super(props);
        this.GraphRef = React.createRef();
    };

    componentDidMount() {
        this.handlerTamp();
    };

    handlerTamp() {
        this.graph = new G6.Graph({
            plugins: [],
            container: this.GraphRef.current,
            modes: {
                default: ['drag-canvas', 'clickSelected'],
                view: [],
                edit: ['drag-canvas', 'hoverNodeActived', 'hoverAnchorActived', 'dragNode', 'dragEdge',
                    'dragPanelItemAddNode', 'clickSelected', 'deleteItem', 'itemAlign', 'dragPoint', 'brush-select'],
            },
            defaultEdge: {
                type: 'flow-polyline-round',
            },
        });
    };

    render() {
        return (
            <div ref={this.GraphRef} className={styles.main} />
        )
    }
};

export default graphPanel;