export const GLOBAL_VALUE: { [key: string]: any } = {
    // 表格页码
    TABLE_SHOWTOTAL: (total: any, range: any)=>{
        return `当前显示第 ${range[0]}-${range[1]} 条，共${total}条`;
    },
    // 输入框的字数限制
    INPUT_PROMPT: (name: any, num: any, isElse=false)=>{
        return `请填写${name} ${!isElse ? `，不能超过${num}字` : ''}`;
    },
    // 多行输入框最多输入字数
    TEXTAREA_MAX: 2000,
    // 用户管理新增抽屉的描述限制200字
    USER_TEXTAREA_MAX: 200,
    // 表格统一规格
    TABLE_SISE: 'small',
    // 表格id
    TABLE_KEY: 'id',
    // button的变量
    BUTTON: 'button'
};
export const codeMessage: { [status: number]: string } = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
  };