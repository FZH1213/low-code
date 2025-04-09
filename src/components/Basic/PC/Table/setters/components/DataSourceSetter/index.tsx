import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import cls from 'classnames'
import { Modal, Button, Row, Col, Table, Input, Space, message, TreeSelect } from 'antd'
import { Form } from '@formily/core'
import { observable } from '@formily/reactive'
import { observer } from '@formily/reactive-react'
import { usePrefix, useTheme, TextWidget } from '@designable/react'
import { DataSettingPanel } from './DataSettingPanel'
import { TreePanel } from './TreePanel'
import { transformDataToValue, transformValueToData } from './shared'
import { IDataSourceItem, ITreeDataSource } from './types'
import './styles.less'
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil'

export interface IDataSourceSetterProps {
  className?: string
  style?: React.CSSProperties
  onChange: (dataSource: IDataSourceItem[]) => void
  value: IDataSourceItem[]
  allowTree?: boolean
  allowExtendOption?: boolean
  defaultOptionValue?: {
    label: string
    value: any
  }[]
  effects?: (form: Form<any>) => void
}

export const DataSourceSetter: React.FC<IDataSourceSetterProps> = observer(
  (props) => {
    const {
      className,
      value = [],
      onChange,
      allowTree = true,
      allowExtendOption = true,
      defaultOptionValue,
      effects = () => { },
    } = props
    const theme = useTheme()
    const prefix = usePrefix('data-source-setter')
    const [modalVisible, setModalVisible] = useState(false)
    const treeDataSource: ITreeDataSource = useMemo(
      () =>
        observable({
          dataSource: transformValueToData(value),
          selectedKey: '',
        }),
      [value, modalVisible]
    )
    const openModal = () => setModalVisible(true)
    const closeModal = () => setModalVisible(false)
    // 字段说明模块
    const [codeList, setCodeList] = useState([])
    const [code, setCode] = useState(undefined)
    const [tableData, setTableData] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    // 表格3列
    const columns = [
      {
        title: '字段名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '字段描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '字段类型',
        dataIndex: 'type',
        key: 'type',
      },
    ];
    const warning1 = () => {
      messageApi.open({
        type: 'warning',
        content: '请先选择接口编码',
      });
    };
    const warning2 = () => {
      messageApi.open({
        type: 'warning',
        content: '该接口未设置exposeJson',
      });
    };
    const getCodeList = async () => {
      const request = createRequest(`/api/bpm/bizDef/allList`, 'get');
      const data = await judgeSucessAndGetData(await request({}));
      setCodeList(data)
    }
    const saveCode = (value: any, label: any, extra: any) => {
      setCode(value)
    }
    const parseExpose = async () => {
      if (code) {
        const request = createRequest(`/api/bpm/bizDef/getExposeJson/${code}`, 'post');
        const data = await judgeSucessAndGetData(await request({}));
        data && data.length ? setTableData(data) : warning2()
      } else {
        warning1()
      }
    }
    useEffect(() => {
      setCode(undefined)
      getCodeList()
    }, [])
    return (
      <Fragment>
        <Button block onClick={openModal}>
          <TextWidget token="SettingComponents.DataSourceSetter.configureDataSource" />
        </Button>
        <Modal
          title={
            <TextWidget token="SettingComponents.DataSourceSetter.configureDataSource" />
          }
          width="65%"
          bodyStyle={{ padding: 10 }}
          transitionName=""
          maskTransitionName=""
          visible={modalVisible}
          onCancel={closeModal}
          onOk={() => {
            onChange(transformDataToValue(treeDataSource.dataSource))
            closeModal()
          }}
        >
          <div style={{ marginBottom: 10, display: 'flex' }}>
            {contextHolder}
            <div style={{ marginLeft: 'auto' }}>
              <Space direction="horizontal">
                <TreeSelect
                  // ref={inputRef}
                  dropdownMatchSelectWidth={400}
                  showSearch
                  treeNodeFilterProp="title"
                  style={{ width: 400 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择接口"
                  treeDefaultExpandAll
                  treeData={codeList}
                  onChange={saveCode}
                  allowClear
                >
                </TreeSelect>
                <Button style={{ width: 80 }} onClick={parseExpose}>获取字段</Button>
              </Space>
            </div>
          </div>
          {
            tableData.length ?
              <Table
                size="small"
                bordered={true}
                dataSource={tableData}
                columns={columns}
                pagination={{
                  size: 'small',
                  pageSize: 5,
                  showTotal: (total: any, range: any[]) =>
                    `第 ${range[0]} 项 - 第 ${range[1]} 项  /  共 ${total} 项`,
                }}
              />
              : null
          }
          <div
            className={`${cls(prefix, className)} ${prefix + '-' + theme} ${prefix + '-layout'
              }`}
          >
            <div className={`${prefix + '-layout-item left'}`}>
              <TreePanel
                defaultOptionValue={defaultOptionValue}
                allowTree={allowTree}
                treeDataSource={treeDataSource}
              ></TreePanel>
            </div>
            <div className={`${prefix + '-layout-item right'}`}>
              <DataSettingPanel
                allowExtendOption={allowExtendOption}
                treeDataSource={treeDataSource}
                effects={effects}
              ></DataSettingPanel>
            </div>
          </div>

        </Modal>
      </Fragment>
    )
  }
)
