// 历史状态保存方法
const formValName: any = 'Sinopec';

// 获取sessionStorage.getItem数据
let getItemValue = (name: any) => {
  let getFormValue: any = sessionStorage.getItem(formValName) || JSON.stringify({});
  // console.log('222',getFormValue);
  getFormValue = JSON.parse(getFormValue);
  // console.log('333',getFormValue);
  if(getFormValue){
    getFormValue = getFormValue[name];
  };
  return getFormValue;
};

// 保存缓存
let setItemValue = (name: any, data: any) => {
  let getFormValue: any = sessionStorage.getItem(formValName) || JSON.stringify({})
  // console.log(getFormValue);
  getFormValue = JSON.parse(getFormValue);
  if(getFormValue){
    getFormValue[name] = data; 
  };
  sessionStorage.setItem(formValName, JSON.stringify(getFormValue));
};


// bk.删除数据
const deleteKeepData = (name: any) => {
  let getFormValue: any = sessionStorage.getItem(formValName);
  if(getFormValue){
    getFormValue = JSON.parse(getFormValue);
    if(getFormValue[name]){
      delete getFormValue[name];
    };
    sessionStorage.setItem(formValName,  JSON.stringify(getFormValue));
  };
};

export const formListHistory: { [key: string]: any } = {
  setItemValue,
  deleteKeepData,
  getItemValue
}
