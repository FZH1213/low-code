import { Message } from 'antd';

const duration = 1.5;

function toast(){
  let ret = {};
  ['success', 'warn', 'error'].forEach(method => {
    ret[method] = function(content, fn){
      Message[method]({
        content,
        duration
      });

      fn && setTimeout(fn, duration * 1000 - 500);
    }
  });

  return ret;
}

export default toast();
