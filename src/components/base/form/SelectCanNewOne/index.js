import React, { useState, useRef } from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Select, Divider } from 'antd'

export default (props) => {
  const selectRef = useRef(null)
  const [name, setName] = useState("")
  const [perList, setPerList] = useState(props.list)

  const addItem = () => {
    let people = perList
    let obj = {}
    obj.custName = name
    // console.log([...people, obj]);
    setPerList([...people, obj])
    setName('')
  }

  return (
    <Select
      ref={selectRef}
      onChange={(e, index) => {
        props.onChange(e,index)
      }}
      showSearch={true} optionFilterProp="children"
      onSearch={(e) => setName(e)}
      style={{ width: "100%" }}
      placeholder="请选择"
      dropdownRender={menu => (
        <div>
          <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 4 }}>
            {/* <Input style={{ flex: 'auto' }} value={name} onChange={(e) => setName(e.target.value)} /> */}
            <a
              style={{ flex: 'none', padding: '4px', display: 'block', cursor: 'pointer' }}
              onClick={() => {
                addItem()
                selectRef.current.blur()
              }}
            >
              <PlusOutlined /> {props.text}
              </a>
          </div>
          <Divider style={{ margin: '4px 0' }} />
          {menu}
        </div>
      )}
    >
      {
        perList && perList.map((item, index) => {
          return <Option key={index} value={item[props.value]}>{item[props.title]}</Option>
        })
      }
    </Select>
  )
}