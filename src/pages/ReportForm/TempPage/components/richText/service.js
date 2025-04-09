import request, { http_get, http_post } from '@/utils/request';
import { FILE_REQUEST_BASE} from '@/utils/constant';


// /file/fileInfo/getNewFilePath  获取最新端口
export async function getNewFilePath(){
    return http_get('/api/file/fileInfo/getNewFilePath')
}

// upload上传文件
export async function uploadFile(params) {
    return http_post('/api/file/fileInfo/upload', {
        headers: {
            Authorization: `Bearer ${params.token}`,
        },
        data: params.data,
    });
}

export default {
    getNewFilePath,
    uploadFile,
};
