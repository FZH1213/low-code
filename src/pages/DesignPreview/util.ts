import request from '@/utils/request';


/*****************配置调用方法 */
/**
 * 请求生成方法 ，后续继续抽离
 * @param url
 * @returns 
 */
export function createRequest(url: string) {
    return async function (body: any, options?: { [key: string]: any }) {
        console.info("body", body)
        return request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: body,
            ...(options || {}),
        });
    }
}
/**
 * 请求过滤方法
 * @param mapCol 
 * @returns 
 */
export function createMapData(mapCol: any) {
    return function (data: any) {
        let res = {}
        for (let key in mapCol) {
            res[key] = data[mapCol[key]]
        }
        return res
    }
}