import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Graph, Cell, Shape } from '@antv/x6';

import { Button, Modal, message } from 'antd';

import {
  getDataDdlTables,
  getDataDdlRelation,
  addDdlRelation,
  removeDdlRelationByIds,
} from './service';

const ErModal = (props) => {
  const [container, setcontainer] = useState(document.createElement('div'));

  const LINE_HEIGHT = 24;
  const NODE_WIDTH = 150;

  Graph.registerPortLayout(
    'erPortPosition',
    (portsPositionArgs) => {
      return portsPositionArgs.map((_, index) => {
        return {
          position: {
            x: 0,
            y: (index + 1) * LINE_HEIGHT,
          },
          angle: 0,
        };
      });
    },
    true,
  );

  Graph.registerNode(
    'er-rect',
    {
      inherit: 'rect',
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
      ],
      attrs: {
        rect: {
          strokeWidth: 1,
          stroke: '#5F95FF',
          fill: '#5F95FF',
        },
        label: {
          fontWeight: 'bold',
          fill: '#ffffff',
          fontSize: 12,
        },
      },
      ports: {
        groups: {
          list: {
            markup: [
              {
                tagName: 'rect',
                selector: 'portBody',
              },
              {
                tagName: 'text',
                selector: 'portNameLabel',
              },
              {
                tagName: 'text',
                selector: 'portTypeLabel',
              },
            ],
            attrs: {
              portBody: {
                width: NODE_WIDTH,
                height: LINE_HEIGHT,
                strokeWidth: 1,
                stroke: '#5F95FF',
                fill: '#EFF4FF',
                magnet: true,
              },
              portNameLabel: {
                ref: 'portBody',
                refX: 6,
                refY: 6,
                fontSize: 10,
              },
              portTypeLabel: {
                ref: 'portBody',
                refX: 95,
                refY: 6,
                fontSize: 10,
              },
            },
            position: 'erPortPosition',
          },
        },
      },
    },
    true,
  );

  // 获取container对象
  const refContainer = (container) => {
    setcontainer(container);
  };

  const [tables, setTables] = useState([]);

  const [relation, setRelation] = useState([]);

  useEffect(async () => {
    const params = {
      dataSourceId: props.id,
    };
    await getDataDdlTables(params).then((res) => {
      if (res.code === 0) {
        setTables(res.data);
      }
    });

    await getDataDdlRelation(params).then((res) => {
      if (res.code === 0) {
        // setRelation(res.data);
        let relationData = [];
        if (res.data.length > 0) {
          for (let index = 0; index < res.data.length; index++) {
            let obj = {
              id: 'arrow-' + res.data[index].id,
              shape: 'edge',
              source: {
                cell: res.data[index].sourceTableId,
                port: res.data[index].sourceColumnId,
              },
              target: {
                cell: res.data[index].targetTableId,
                port: res.data[index].targetColumnId,
              },
              attrs: {
                line: {
                  stroke: '#A2B1C3',
                  strokeWidth: 2,
                },
              },
              zIndex: 0,
            };
            relationData.push(obj);
          }
        }
        setRelation(relationData);
      }
    });
  }, [props.id]);

  useEffect(() => {
    const graph = new Graph({
      container: container,
      scroller: true,
      connecting: {
        allowBlank: false, // 是否允许连接到空白点
        router: {
          name: 'er',
          args: {
            offset: 25,
            direction: 'H',
          },
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#A2B1C3',
                strokeWidth: 2,
              },
            },
          });
        },
        // 当停止拖动边的时候根据 validateEdge 返回值来判断边是否生效，如果返回 false, 该边会被清除。
        validateEdge({ edge }) {
          const { source, target } = edge;
          return true;
        },
      },
    });

    const cells = [];
    const responseData = tables.concat(relation);
    // console.log('responseData',responseData)
    let data = [];

    let columnsLengthArr = [];
    for (let index = 0; index < responseData.length; index++) {
      let ports = [];
      if (responseData[index].columns) {
        if (responseData[index].columns.length > 0) {
          for (let i = 0; i < responseData[index].columns.length; i++) {
            let columnsObj = {
              id: responseData[index].columns[i].id,
              group: 'list',
              attrs: {
                portNameLabel: {
                  text: responseData[index].columns[i].columnName,
                },
                portTypeLabel: {
                  text: responseData[index].columns[i].columnType,
                },
              },
            };
            ports.push(columnsObj);
          }
        }
        columnsLengthArr.push(responseData[index].columns.length);
        let maxLength = Math.max(...columnsLengthArr);
        // 定位
        let x = getXNum(index + 1);
        let y = getYNum(index + 1);
        let obj = {
          id: responseData[index].id,
          shape: 'er-rect',
          label: responseData[index].tableName,
          width: 150,
          height: 24,
          position: {
            x: 220 * x,
            y: index > 4 ? y * (maxLength * 28) : 0,
          },
          ports: ports,
        };
        data.push(obj);
      } else {
        data.push(responseData[index]);
      }
    }
    // console.log('data', data);
    data.forEach((item) => {
      if (item.shape === 'edge') {
        cells.push(graph.createEdge(item));
      } else {
        cells.push(graph.createNode(item));
      }
    });
    graph.resetCells(cells);
    // graph.zoomToFit({
    //   padding: 10,
    //   maxScale: 1,
    // });

    graph.on('edge:mouseenter', ({ cell }) => {
      cell.addTools([
        {
          name: 'vertices',
        },
        {
          name: 'button-remove',
          args: {
            distance: 20,
            onClick({ view }) {
              // console.log('view', view);
              const edge = view.cell;
              const source = edge.getSource();
              const target = edge.getTarget();
              const params = {
                dataSourceId: props.id,
                sourceColumnId: source.port,
                sourceTableId: source.cell,
                targetColumnId: target.port,
                targetTableId: target.cell,
              };
              handleRemoveDdl(params).then((resolveCode) => {
                if (resolveCode === 0) {
                  graph.removeEdge(edge.id);
                }
              });
            },
          },
        },
      ]);
    });

    graph.on('edge:mouseleave', ({ cell }) => {
      if (cell.hasTool('button-remove')) {
        cell.removeTool('button-remove');
      }
    });

    graph.on('edge:mouseup', ({ e }) => {
      let keys = Object.keys(e.data);
      let key = keys[1];
      for (let k in e.data) {
        if (
          e.data[k] &&
          e.data[k].edgeView &&
          e.data[k].edgeView.cell &&
          e.data[k].edgeView.cell.store
        ) {
          const source = e.data[k].edgeView.cell.store.data.source;
          const target = e.data[k].edgeView.cell.store.data.target;
          // console.log('source', source);
          // console.log('target', target);
          const params = {
            dataSourceId: props.id,
            sourceColumnId: source.port,
            sourceTableId: source.cell,
            targetColumnId: target.port,
            targetTableId: target.cell,
          };
          if (target.cell) {
            handleaddDdl(params);
          } else {
            // message.error('未选中目标节点');
          }
          return;
        }
      }
    });
  }, [relation]);

  const getXNum = (index) => {
    let evaNum = 5;
    return index % evaNum;
  };

  const getYNum = (index) => {
    let evaNum = 5;
    if (index < evaNum) {
      return 1;
    } else {
      return Math.trunc(index / evaNum);
    }
  };

  const handleaddDdl = (data) => {
    const params = {
      ...data,
    };
    addDdlRelation(params).then((res) => {
      if (res.code === 0) {
        // // 刷新列表
        // props.refreshTable && props.refreshTable();
        // // 关闭弹框
        // props.onClose && props.onClose();
        message.success('添加成功');
      } else {
        message.error(res.message);
      }
    });
  };

  const handleRemoveDdl = (data) => {
    return new Promise((resolve, reject) => {
      const params = {
        ...data,
      };
      removeDdlRelationByIds(params).then((res) => {
        if (res.code === 0) {
          message.success('删除成功');
        } else {
          message.error(res.message);
        }
        resolve(res.code);
      });
    });
  };

  const handleSubmit = () => {};

  return (
    <Modal
      title="ER图"
      width={'85%'}
      open={props.visible}
      onCancel={props.onClose}
      footer={null}
      onOk={() => {
        handleSubmit();
      }}
    >
      <div
        id="container"
        ref={refContainer}
        style={{
          width: '100%',
          height: '100vh',
        }}
      ></div>
    </Modal>
  );
};

export default ErModal;
