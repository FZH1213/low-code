import React, { useState, useEffect } from 'react';
import { Form } from 'antd';
// import { Player } from 'video-react';

/**
 * 视频组件
 */
interface PcVideoProps {
  label: string;
  name: string;
  required: boolean;
  hidden: boolean;
  width: number;
  useScense: string;
  uploadUrl: string;
  loop: boolean;
  autoPlay: boolean;
  controls: boolean;
}
export const PcVideo: React.FC<PcVideoProps> = (props) => {
  const [srcId, setSrcId] = useState(undefined);
  useEffect(() => {
    console.log('进入页面');
    return () => {
      console.log('这步是干什么');
    };
  }, []);
  return (
    <>
      {props?.useScense === '普通使用' ? (
        <video
          width={props?.width}
          src={props?.uploadUrl}
          preload="auto"
          playsInline
          autoPlay={props?.autoPlay}
          loop={props?.loop}
          controls={props?.controls}
        ></video>
      ) : (
        <Form.Item
          label={props.label}
          name={props.name}
          hidden={props.hidden}
          getValueProps={(value: any) => setSrcId(value)}
        >
          {srcId ? (
            <video
              width={props?.width}
              src={`/api/file/fileDown/downloadFileById?fileId=${srcId}`}
              preload="auto"
              playsInline
              autoPlay={props?.autoPlay}
              loop={props?.loop}
              controls={props?.controls}
            ></video>
          ) : null}
          {/* <Player>
        <source src="http://192.168.30.123:8000/files/irm/BUSINESS_VIDEO/20230201/KkXH0LjWvrlBy5D.mp4" />
      </Player> */}
        </Form.Item>
      )}
    </>
  );
};
