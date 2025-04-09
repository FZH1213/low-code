import { Form, Input, InputNumber, Radio, Select } from "antd";
import React from "react";


const { TextArea } = Input;
const { Option } = Select;
const CLS_READ_MODE = 'wb-field-mode-read';
const CLS_INPUT_BLANK_MODE = 'wb-input-mode-blank';

// props
//  1. name         <string>        字段名
//  2. label        <string>        字段显示的标题文本
//  3. rules        <object>        校验规则
function HiddenField(props){
  return (
    <Form.Item name={props.name}
               hidden
    >
      <Input hidden className={"wb-input-ws-fit"}
             onChange={props.onChange}
      />
    </Form.Item>
  )
}

// 文本域
// props
//  1. name         <string>        字段名
//  2. label        <string>        字段显示的标题文本
//  3. readonly     <boolean>       阅读状态
//  4. disabled     <boolean>       是否禁用
//  5. rules        <object>        校验规则
//  6. onChange     <function>      改变输入文本回调函数
//  7. mode         <>
function TextboxField(props){
  return (
    <Form.Item name={props.name}
               label={props.label}
               className={[props.className, props.readonly ? CLS_READ_MODE : null].join(' ')}
               rules={props.rules}
               style={props.itemStyle}
               extra={props.extra}
               initialValue={props.initialValue}
              //  className={styles.fieldstyle}
    >

    <Input className={["wb-input-ws-fit", props.mode && props.mode === 'text' && CLS_INPUT_BLANK_MODE].join(' ')}
           disabled={props.readonly}
           onChange={props.onChange}
           style={props.style}
           placeholder={props.placeholder}
           maxLength={props.maxLength}

    />

    </Form.Item>
  )
}

// 大文本域
function TextareaField(props){
  return (
    <Form.Item name={props.name}
               label={props.label}
               className={[props.className, props.readonly ? CLS_READ_MODE : null].join(' ')}
               rules={props.rules}
               extra={props.extra}
               initialValue={props.value}
               hidden={props.hidden}
              // 1月16日zmx将 style={props.style} 改为 style={props.itemStyle}
              // style={props.style}

              style={props.itemStyle}
    >
      <TextArea className={["wb-input-ws-fit", props.mode && props.mode === 'text' && CLS_INPUT_BLANK_MODE].join(' ')}
                disabled={props.readonly}
                showCount={props.showCount}
                // 1-29  将 autoSize={{ minRows: 4}} 改为 autoSize={{ minRows: props.minRows ? props.minRows : 4}}
                autoSize={{ minRows: props.minRows ? props.minRows : 4}}
                // autoSize={{ minRows: 4}}
                maxLength={props.maxLength}
                rows={props.rows}
                onChange={props.onChange}
                placeholder={props.placeholder}
                style={props.style}
                // 20-12-25添加composition事件
                onCompositionStart = {props.onCompositionStart}
                onCompositionEnd = {props.onCompositionEnd}
      />
    </Form.Item>
  )
}

// 数值域
// props
//  1. name         <string>        字段名
//  2. label        <string>        字段显示的标题文本
//  3. readonly     <boolean>       阅读状态
//  4. disabled     <boolean>       是否禁用
//  5. rules        <object>        校验规则
//  6. max          <number>        允许输入的最大值
//  6. min          <number>        允许输入的最小值
//  6. onChange     <function>      改变输入文本回调函数
function NumberField(props){
  return (
    <Form.Item name={props.name}
               label={props.label}
               className={[props.className, props.readonly ? CLS_READ_MODE : null].join(' ')}
               rules={props.rules}
               extra={props.extra}
               initialValue={props.value}
    >
      <InputNumber disabled={props.readonly}
                   min={props.min}
                   max={props.max}
                   style={props.style}
                   onChange={props.onChange}
      />
    </Form.Item>
  )
}

//单选域
function RadioGroupField(props){

  return (
    <Form.Item name={props.name}
               label={props.label}
               className={[props.readonly ? CLS_READ_MODE : null].join(' ')}
               rules={props.rules}
               initialValue={props.value}
    >
      <Radio.Group disabled={props.readonly}
      >
        {props.options.map(opt => <Radio value={opt.value} defaultChecked={opt.value === props.value}>{opt.text}</Radio>)}
      </Radio.Group>
    </Form.Item>
  );
}

//下拉选择
// props
//  1. name         <string>        字段名
//  2. label        <string>        字段显示的标题文本
//  3. defaultValue <string|number> 默认值
//  4. readonly     <boolean>       阅读状态
//  5. disabled     <boolean>       是否禁用
//  6. options      <array<object>> 可选列表
//        text      <string>        下拉选项显示的文本
//        value     <string>        下拉选项值
//        disabled  <string>        下拉选项显示的文本
//  7. ..... 其它属性与ant select组件一致
function SelectionField(props){

  return (
    <Form.Item name={props.name}
               label={props.label}
               className={[props.className, props.readonly ? CLS_READ_MODE : null].join(' ')}
               rules={props.rules}
               // 1月16日zmx添加 style={props.itemStyle}
               style={props.itemStyle}
    >
      <Select disabled={props.disabled} {...props}/>

    </Form.Item>
  );
}

// 自定义字段
function CustomField(props){
  return (
    <Form.Item
      {...props}
      className={[props.className, props.readonly ? CLS_READ_MODE : null].join(' ')}
      style={props.itemStyle}
    >
      <Input type="hidden"/>
      { props.children }
    </Form.Item>
  )
}

export {
  TextareaField,
  TextboxField,
  NumberField,
  RadioGroupField,
  HiddenField,
  SelectionField,
  CustomField
}
