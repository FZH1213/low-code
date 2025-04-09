import request from '@/utils/request';
export const judgeSucessAndGetData = async (promise: Promise<any>) => {
  const response = await promise;
  if (response && response.code === 0) {
    return response.data;
  }
  return null;
};

export const judgeSucessAndGetMessage = async (
  promise: Promise<any>,
): Promise<[boolean, string]> => {
  const response = await promise;

  if (response && response.code === 0) {
    return [true, response.message];
  }
  return [false, response.message];
};

export const judgeSucessAndGet = async (promise: Promise<any>) => {
  const response = await promise;
  if (response && response.code === 0) {
    return response;
  }
  return null;
};

// 对象转formdata格式
export const jsonToFormData = (json: Record<string, any>) => {
  const formData = new FormData();
  // 循环传入的值转换formData
  // console.log("json",json);
  Object.keys(json).forEach((key) => {
    if (!json[key]) {
      // console.log("json[key]==",key,json[key]);
      formData.append(key, json[key]);
    } else if (json[key]) {
      // console.log("json[key]====",key,json[key]);
      formData.append(key, json[key]);
    }
  });
  return formData;
};

// formdata转对象格式
export const formDataTojson = (formData: FormData) => {
  const jsonData: any = {};
  formData.forEach((value, key) => {
    if (value) {
      jsonData[key] = value;
    }
  });
  return jsonData;
};

export function createRequest(url: string, method: 'post' | 'get') {
  if (method == 'get')
    return async function (data?: any, options?: { [key: string]: any }) {
      return request(url, {
        method: 'get',
        params: data,
        ...(options || {}),
      });
    };
  //对应post，这里用if会彪红，所以不用先
  else
    return async function (data: any, options?: { [key: string]: any }) {
      if (data.file?.[0]?.originFileObj) {
        const formData = new FormData();
        formData.append('file', data.file[0].originFileObj);
        return request(url, {
          method: 'post',
          body: formData,
        });
      } else {
        return request(url, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data,
          ...(options || {}),
        });
      }
    };
}
