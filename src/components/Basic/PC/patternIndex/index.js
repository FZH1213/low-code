import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { observer } from '@formily/reactive-react';
export const Pattern = observer((props) => {
  const [value, setValue] = useState(props.value);

  const handleOk = (value) => {
    setValue(value);
    props.onChange(value);
    // console.log(new RegExp(value));
  };

  return (
    <>
      <Select
        style={{ width: '100%' }}
        onChange={(value) => {
          handleOk(value);
        }}
        value={value}
        options={[
          { value: false, label: '无' },
          { value: '^[0-9]*$', label: '数字格式' },
          { value: '^[0-9a-zA-Z_#]{6,16}$', label: '密码格式' },
          { value: '^(1[3-9][0-9]{9})$', label: '手机号格式' },
          { value: '^[\u4e00-\u9fa5]{0,}$', label: '中文格式' },
          { value: '[1-9]d{5}(?!d)', label: '邮编格式' },
          { value: '(^d{15}$)|(^d{18}$)|(^d{17}(d|X|x)$)', label: '身份证格式' },
          { value: '^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+', label: '邮箱格式' },
        ]}
      />
    </>
  );
});
