import { green, red } from "chalk";

  // Col样式两列一行
  const colLayout1 = {
    
    xl: 12,
    md: 24,
  };
  // Col样式两列一行（文字，wrapper）
  const formItemLayout1 = {
    labelCol: {
      xl: 6,
      md: 4,
    },
    wrapperCol: {
      xl: 18,
      md: 20,
    },
  };  
  //协调与合作 新增资讯页面对齐问题
  const formItemLayout3 = {
    labelCol: {
      xl: 6.5,
      md: 4,
    },
    wrapperCol: {
      xl: 18,
      md: 20,
    },
  };  
  //单独的全占满布局，如主题部分
  const colLayout2 = {
    
    xl: 24,
    md: 24,
  };
  //item项占满一行后，label文字部分和wrapper输入部分的占比
  const formItemLayout2 = {
    labelCol: {
      xl: 3,
      md: 4,
    },
    wrapperCol: {
      xl: 21,
      md: 22,
    },
  }
  export { colLayout1, formItemLayout1,formItemLayout3, colLayout2, formItemLayout2}
