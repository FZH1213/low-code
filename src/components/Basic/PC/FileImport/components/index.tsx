import { message, Upload } from '@/components/base';
import { downloadFile } from '@/utils/globalMethod';
import { UploadFile } from 'antd';

/**
 * 上传图片参数声明
 */
export interface UploadProps {
  node?: { props: any };
  params?: any;
}

/**
 * 上传前
 * @param type 组件名称
 * @param node 传入参数
 * @returns
 */
export const handlerBeforeUpload = (
  type: 'ButtonUpload' | 'ImagesUpload' | 'DraggerUpload',
  node: any,
) => {
  // 闭包 解决分类上传问题
  return (file: any) => {
    // 限制上传文件大小
    if (file.size > node.props?.fileMax * 1024 * 1024) {
      message.error(`${file.name} 文件不能超过${node.props?.fileMax}MB`);
      return Upload.LIST_IGNORE;
    }

    // 限制上传文件格式
    if (!RestrictedFormat(file, node)) {
      return Upload.LIST_IGNORE;
    }

    // 判断组件在上传前做拦截
    if (type === 'ButtonUpload') {
      console.log('%c测试', 'color: white; background: red;', node.props.accept, file);
    }
    return file;
  };
};

/**
 * 限制格式
 * @param file 文件信息
 * @param node 参数树
 * @returns
 */
const RestrictedFormat = (file: any, node: any) => {
  // word
  const isDoc = ['application/msword'];
  const isDocx = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  // pdf
  const isPdf = ['application/pdf'];
  // excel
  const isXls = ['application/vnd.ms-excel'];
  const isXlsx = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  // 图片
  const isJpg = ['image/jpeg'];
  const isPng = ['image/png'];
  // const isBmp = file.type === ['image/bmp'];
  const isGif = ['image/gif'];
  // const isWebp = file.type === ['image/webp'];
  // txt文本
  const isTxt = ['text/plain'];
  // 压缩文件
  const isZip = ['application/x-zip-compressed'];
  // 结构选中格式
  const accept = [...node.props.accept];
  let acceptFlag: any = [];
  accept.map((item: any) => {
    if (item === 'pdf') {
      acceptFlag = [...acceptFlag, ...isPdf];
    }
    if (item === 'excel') {
      acceptFlag = [...acceptFlag, ...isXls, ...isXlsx];
    }
    if (item === 'word') {
      acceptFlag = [...acceptFlag, ...isDoc, ...isDocx];
    }
    if (item === 'png') {
      acceptFlag = [...acceptFlag, ...isPng];
    }
    if (item === 'jpg') {
      acceptFlag = [...acceptFlag, ...isJpg];
    }
    if (item === 'gif') {
      acceptFlag = [...acceptFlag, ...isGif];
    }
    if (item === 'txt') {
      acceptFlag = [...acceptFlag, ...isTxt];
    }
    if (item === 'zip') {
      acceptFlag = [...acceptFlag, ...isZip];
    }
  });
  // 没有值可以上传任何文件
  if (accept?.length && !acceptFlag.includes(file.type)) {
    message.error(`上传格式不对，请上传${accept?.join() + '格式'}`);
    return false;
  }
  return true;
};

/**
 * 上传文件改变时
 * @param files 文件信息
 */
export const handlerChange = (files: any) => {
  // const { status, name } = files.file;
  // if (status === 'done') {
  //   message.success(`${name} file uploaded successfully.`);
  // } else if (status === 'error') {
  //   message.error(`${name} file upload failed.`);
  // }
  // console.log('%c测试', 'color: white; background: red;', files)
};

/**
 * 下载文件方法
 * @param file 
 */
export const handlerDownload = (file: UploadFile) => {
  if (file?.response?.code === 0) {
    downloadFile({ fileName: file.response.data.fileName, fileUrl: file.response.data.fileUrlView });
  } else if (file.url) {
    downloadFile({ fileName: file.fileName || file.name, fileUrl: file.url });
  };
};

export const handlerItemRender = (originNode: any, file: UploadFile, fileList: any) => {
  return (
    originNode
  )
};