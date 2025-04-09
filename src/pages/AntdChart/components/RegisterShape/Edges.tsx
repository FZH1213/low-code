import G6 from '@antv/g6';
export default function () {
    // G6.registerEdge('flow-polyline-round', {
    //     options: {
    //         style: { stroke: '#A3B1BF', strokeOpacity: .92, lineWidth: 1, lineAppendWidth: 8, endArrow: true },
    //         stateStyles: {
    //             selected: {
    //                 lineWidth: 2,
    //             },
    //             hover: {
    //                 stroke: '#1890FF',
    //             }
    //         }
    //     },
    //     afterDraw: (cfg, group) => {
    //         console.log('%c测试', 'color: white; background: red;', group)
    //     },
    //     afterUpdate: (cfg, edge) => {
    //         console.log('%c测试', 'color: white; background: red;', cfg, edge)
    //     },

    //     setState: (name, value, edge: any) => {

    //         const group = edge.getContainer();
    //         const path = group.getChildByIndex(0);
    //         if (name === 'selected') {
    //             if (value) {
    //                 path.attr('lineWidth', 2);
    //                 path.attr('stroke', '#1890FF');
    //             } else {
    //                 path.attr('lineWidth', 2);
    //             }
    //         } else if (name === 'hover') {
    //             if (value)
    //                 path.attr('stroke', '#1890FF');
    //             else
    //                 path.attr('stroke', '#A3B1BF');
    //         }
    //     }
    // }, 'polyline');

    G6.registerEdge('flow-polyline-round', {
        draw(cfg: any, group: any) {
            const startPoint = cfg.startPoint
            const endPoint = cfg.endPoint
            let path: any = []
            if (startPoint.y.toFixed(2) === endPoint.y.toFixed(2)) {
                path = [
                    ['M', startPoint.x, startPoint.y],
                    ['L', endPoint.x, endPoint.y]
                ]
            } else {
                path = [
                    ['M', startPoint.x, startPoint.y],
                    ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, startPoint.y],
                    ['L', endPoint.x / 3 + 2 / 3 * startPoint.x, endPoint.y],
                    ['L', endPoint.x, endPoint.y]
                ]
            }
            const shape = group.addShape('path', {
                attrs: {
                    stroke: '#666',
                    path,
                }
            })
            return shape
        },
        setState(name, value, item: any) {
            const shape = item.get('keyShape');
            if (name === 'active') {
                if (value) {
                    shape.attr('stroke', 'red')
                    shape.attr('lineWidth', 3)
                } else {
                    shape.attr('stroke', '#666')
                    shape.attr('lineWidth', 1)
                }
            }
        }
    }, 'polyline')

}
