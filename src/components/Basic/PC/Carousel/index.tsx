import { Carousel, Image } from '@/components/base';
import {} from 'module';
import styles from './index.less';
import React, { useEffect, useState, useRef } from 'react';
import { createRequest, judgeSucessAndGetData } from '@/utils/requestUtil';
import { history } from 'umi';
import { PAGE_CODE } from '@/utils/constant';
import request from '@/utils/request';

interface PcCarouselProps {
  autoPlay: boolean;
  height: string;
  isLinkToUrl: boolean;
  requestUrl: string;
  requestMethod: 'post' | 'get';
  dots: boolean;
  dotPosition: string;
  formName: string;
  _ref: any;
  queryType: string;
}
export const PcCarousel: React.FC<PcCarouselProps> = (props) => {
  const [carouselList, setCarouselList] = useState<any>([]);

  const renderHandle = async () => {
    if (props?.formName) {
      setTimeout(() => {
        props?._ref[PAGE_CODE._FORM_PREFIX + props?.formName].validateFields().then((formData) => {
          if (props?.queryType == '自定义查询条件') {
            getCarousel(formData);
          } else if (props?.queryType == '用户信息') {
            getCarouselByUser();
          } else {
            getCarousel({});
          }
        });
      });
    } else {
      getCarousel({});
    }
  };

  const getCarouselByUser = async () => {
    const userRes = await request('/api/admin/current/user', {
      method: 'get',
    });
    getCarousel({ userId: userRes.data.userId });
  };
  const getCarousel = async (params) => {
    const data = await judgeSucessAndGetData(
      await createRequest(props?.requestUrl, props?.requestMethod)(params),
    );
    if (!data) return;
    if (data.records) {
      setCarouselList(data.records);
    }
  };
  useEffect(() => {
    renderHandle();
  }, []);
  return (
    <>
      <Carousel
        autoplay={props?.autoPlay}
        style={{ textAlign: 'center' }}
        dots={props?.dots}
        dotPosition={props?.dotPosition}
      >
        {carouselList.map((item) => (
          <div
            style={{ cursor: props?.isLinkToUrl ? 'pointer !important' : 'default' }}
            onClick={() => {
              props?.isLinkToUrl && history.push(item.linkToUrl);
            }}
          >
            {item.fileId ? (
              <Image
                style={{
                  height: props?.height,
                  objectFit: 'scale-down',
                }}
                src={`/api/file/fileDown/downloadFileById?fileId=${item.fileId}`}
                preview={false}
              />
            ) : (
              <h3
                style={{
                  height: props?.height,
                  lineHeight: props?.height,
                  color: '#fff',
                  textAlign: 'center',
                  background: item.bgColor,
                  fontSize: '18px',
                }}
              >
                {item.title}
              </h3>
            )}
          </div>
        ))}
      </Carousel>
    </>
  );
};
