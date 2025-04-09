import React, { useState, useEffect } from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { ACCESS_TOKEN_KEY, FILE_REQUEST_BASE, REPLACE_FILE_PATH_STR } from '@/utils/constant';
import api from './service';
// 富文本组件
const RichText = (props: any) => {
  const [filePath, setFilePath] = useState<any>(''); //文件地址
  const [editorState, setEditorState] = useState<any>();
  useEffect(() => {
    getNewFilePath();
  }, []);
  // 获取最新端口.替换文件地址地址
  const getNewFilePath = async () => {
    let res0: any = await api.getNewFilePath();
    if (res0.response.code === 0 && !!res0.response.data) {
      if (!!props.values) {
        let arr = props.values
        // .replaceAll(REPLACE_FILE_PATH_STR, res0.response.data)
        setEditorState(BraftEditor.createEditorState(`${arr}`))
      } else {
        setEditorState(BraftEditor.createEditorState(null))
      }
    } else {
      setEditorState(BraftEditor.createEditorState(null))
    }
  }
  const myUploadFn = async (param: any) => {
    const serverURL = '/api/file/fileInfo/upload';
    const xhr = new XMLHttpRequest
    const fd = new FormData()
    const successFn = (response) => {
      let data = JSON.parse(xhr.responseText).data;  //服务端直接返回文件上传后的地址
      let url = `${FILE_REQUEST_BASE}?fileId=${data.fileId}`;
      // 上传成功后调用param.success并传入上传后的文件地址
      param.success({
        url,
        meta: {
          id: data.fileId,
          title: '',
          alt: '',
          src:url,
          loop: true, // 指定音视频是否循环播放
          autoPlay: true, // 指定音视频是否自动播放
          controls: true, // 指定音视频是否显示控制栏
          // poster: 'http://192.168.5.93:8190/img/smc_2021-02-04-20-16-38.png', // 指定视频播放器的封面
        }
      });
      setFilePath(data.domain)
    }
    const progressFn = (event: any) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }
    const errorFn = (response: any) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.'
      })
    }

    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)

    fd.append('btype', 'LIST_OF_COMPLIANCE') //set请求参数
    fd.append('file', param.file)


    xhr.open('POST', serverURL, true,)
    xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`) //请求header参数
    xhr.send(fd) //发送参数
  }
  const handleChange = (editorState: any) => {
    setEditorState(editorState.toRAW());
    if (!!filePath) {
      //替换文件地址
      let newStr = editorState.toRAW()
      // .replaceAll(filePath, REPLACE_FILE_PATH_STR);
      let newHtml =editorState.toHTML();
      props.getEditorValue(newStr, newHtml);
    } else {
      props.getEditorValue(editorState.toRAW(), editorState.toHTML());
    }
  }

  // // 点击触发预览
  // const preview = () => {
  //   if (window.previewWindow) {
  //     window.previewWindow.close()
  //   }
  //   window.previewWindow = window.open()
  //   window.previewWindow.document.write(buildPreviewHtml())
  //   window.previewWindow.document.close()
  // }
  // // 预览页面
  // const buildPreviewHtml = () => {
  //   return `
  //         <!Doctype html>
  //         <html>
  //           <head>
  //             <title>Preview Content</title>
  //             <style>
  //               html,body{
  //                 height: 100%;
  //                 margin: 0;
  //                 padding: 0;
  //                 overflow: auto;
  //                 background-color: #f1f2f3;
  //               }
  //               .container{
  //                 box-sizing: border-box;
  //                 width: 1000px;
  //                 max-width: 100%;
  //                 min-height: 100%;
  //                 margin: 0 auto;
  //                 padding: 30px 20px;
  //                 overflow: hidden;
  //                 background-color: #fff;
  //                 border-right: solid 1px #eee;
  //                 border-left: solid 1px #eee;
  //               }
  //               .container img,
  //               .container audio,
  //               .container video{
  //                 max-width: 100%;
  //                 height: auto;
  //               }
  //               .container p{
  //                 white-space: pre-wrap;
  //                 min-height: 1em;
  //               }
  //               .container pre{
  //                 padding: 15px;
  //                 background-color: #f1f1f1;
  //                 border-radius: 5px;
  //               }
  //               .container blockquote{
  //                 margin: 0;
  //                 padding: 15px;
  //                 background-color: #f1f1f1;
  //                 border-left: 3px solid #d1d1d1;
  //               }
  //             </style>
  //           </head>
  //           <body>
  //             <div class="container">${editorState.toHTML()}</div>
  //           </body>
  //         </html>
  //       `

  // }

  const controls = [
    'undo', 'redo', 'separator',
    'font-size', 'line-height', 'letter-spacing', 'separator',
    'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
    'superscript', 'subscript', 'remove-styles', 'emoji', 'separator', 'text-indent', 'text-align', 'separator',
    'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
    'link', 'separator', 'hr', 'separator',
    'media', 'separator',
    'clear',
    // {
    //     key: 'custom-button',
    //     type: 'button',
    //     text: '预览',
    //     onClick: () => preview()
    // },
  ];

  return (

    <div>
      <div className="editor-wrapper" style={{ border: '1px solid #d1d1d1', borderRadius: 5 }}>
        <BraftEditor
          readOnly={!!props.isreadOnly ? true : false}
          contentStyle={{ height: 300 }}
          value={editorState}
          controls={controls}
          onChange={handleChange}
          media={{
            // items: mediaItems,
            pasteImage: true, // 是否允许直接粘贴剪贴板图片（例如QQ截图等）到编辑器
            // 指定媒体库允许上传的媒体MIME类型
            accepts: {
              image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg', //可选取的图片文件类型，设置为false则禁止上传
              video: 'video/mp4',//指定可选取的视频文件类型，设置为false则禁止上传视频，上传视频需要指定uploadFn
              audio: 'audio/mp3/zip', //指定可选取的音频文件类型，设置为false则禁止上传音频，上传音频需要指定uploadFn
            },
            externals: {
              image: true, // 开启图片插入功能，默认为true
              video: true, // 允许插入外部视频,默认为true
              audio: true, // 允许插入外部音频,默认为true
              embed: true, // 允许插入嵌入式媒体，例如embed和iframe标签等，默认为true
            },
            uploadFn: myUploadFn,
          }}
        />
      </div>
    </div>
  )
}

export default RichText;


