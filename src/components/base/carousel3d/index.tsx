import React, { useEffect, useRef, useState } from 'react';
import type { Carousel3dProps } from './index.d';
import { useIsMount } from '@/utils/globalMethod';
import './index.less';

const dpr = 0.5;
const Carousel3d = (props: Carousel3dProps) => {
    const { defaultCurrent = 0, childMaxLength = 6, dataSource = [], onChange } = props;
    const isMount = useIsMount();
    const [baseParams, setBaseParams] = useState<any>({
        tilt: '0',
        duration: '.45s',
        ease: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        blurIncrease: 8,
        opacityDecline: 0.1,
        opacityBasics: 0.5,
        moveRange: 3,
        perspective: 2800,
        z: 800,
        transition: 'none',
    }); // 基础参数

    // 更新基础参数
    const updataUseRef = (params: object) => {
        setBaseParams({
            ...baseParams,
            ...params,
        })
    }

    // 设置长度跟3d角度
    const setLengthAndAngle = () => {
        const data: any = {};
        data.length = dataSource.length > childMaxLength ? childMaxLength : dataSource.length;
        data.angle = 360 / data.length;
        updataUseRef(data);
    }

    // 移动开始
    const onTouchStart = (e: any) => {
        const { angle, length, rotate } = baseParams;
        if ((e.touches && e.touches.length > 1) || length <= 1) {
            return;
        }

        const data = {
            startX: e.pageX || e.touches[0].pageX,
            startRotate: Math.round(rotate / angle) * angle, // 偏移修复
        }
        updataUseRef(data);
    }

    // 移动中
    const onTouchMove = (e: any) => {
        const { length, startX, moveRange, startRotate, w, angle, rotate: paramRoutate } = baseParams;
        if ((e.touches && e.touches.length > 1) || length <= 1 || !startX) {
            return;
        };
        const x = e.pageX || e.touches[0].pageX;
        const differ = (x - startX) * moveRange; // 幅度加大；
        const rotate = startRotate + differ / w * angle;
        const r = (Math.abs(Math.ceil(paramRoutate / 360)) * 360 - rotate) % 360;
        const current = Math.round(r / angle) % length;
        const data = {
            rotate,
            current,
            transition: 'none',
        }
        updataUseRef(data);
        onChange?.({
            current,
            rotate,
            eventType: 'move',
        });
    }

    // 移动结束
    const onTouchEnd = (e: any, target?: boolean) => {
        const { length, startX, startRotate, w, angle, rotate: paramRoutate, duration, ease, current } = baseParams;
        if ((e.changedTouches && e.changedTouches.length > 1) || length <= 1 || !startX) {
            return;
        }
        const x = e.pageX || e.changedTouches[0].pageX;
        const differ = x - startX;
        const n = differ > 0 ? 1 : -1;
        const newRotate = startRotate + n * angle * Math.round(Math.abs((paramRoutate - startRotate) / angle));
        const data = {
            rotate: newRotate,
            transition: `transform ${duration} ${ease}`,
            startX: null
        }

        updataUseRef(data);
        onChange?.({
            current,
            rotate: newRotate,
            eventType: 'end',
        });
    }

    const getAnimStyle = (n: any, length: any) => {
        const { opacityBasics, opacityDecline, blurIncrease } = baseParams;
        const center = length / 2;
        const i = n > center ? center * 2 - n : n;
        let opacity = 1 - ((i - 1) * opacityDecline + opacityBasics * (n ? 1 : 0));
        opacity = opacity < 0.1 ? 0.1 : opacity;
        const d: any = {
            opacity,
        };
        if (blurIncrease) {
            d.filter = `blur(${i * blurIncrease}px)`;
        }
        return d;
    }

    const getChildrenToRender = () => {
        const { angle, z, rotate, transition, current = 0 } = baseParams;
        const zDpr = z * dpr;
        const length = dataSource.length;

        if ([angle, z, rotate, transition, current].includes(void 0)) {
            return null
        }
        return dataSource.map((item: any, index: number) => {
            if (index >= childMaxLength) {
                return null
            }
            const transform = `rotateY(${angle * index}deg) translateZ(${zDpr}px) rotateY(-${angle * index}deg) `;
            const animStyle = getAnimStyle(Math.abs(current - index), length > childMaxLength ? childMaxLength : length);
            const style = {
                transform,
                // opacity: animStyle.opacity, 留坑，preserve-3d 不可以与 opacity 同时使用，排查了一下午
            };

            return (
                <div
                    className="itemWrapper"
                    key={index.toString()}
                    style={style}
                >
                    <div
                        className="rotateLayer"
                        style={{
                            transform: `rotateY(${-rotate}deg)`,
                            transition: transition,
                        }}
                    >
                        <div
                            className="bgAndBlurLayer"
                            style={{ ...animStyle }}
                        >
                            <div className="contentLayer" style={{ opacity: current === index ? 1 : 0 }}>
                                <div
                                    key={index.toString()}
                                    className="img-wrapper"
                                    style={{
                                        backgroundImage: `url(${item})`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    }

    useEffect(() => {
        setLengthAndAngle();

        if (!isMount) {
            const { angle, duration, ease } = baseParams;
            const data = {
                current: defaultCurrent,
                rotate: -defaultCurrent * angle,
                transition: `transform ${duration} ${ease}`,
            };
            updataUseRef(data);
        }
    }, [dataSource]);

    useEffect(() => {
        const { angle } = baseParams;
        if (!angle) return;
        updataUseRef({ rotate: -defaultCurrent * angle, w: document.body.clientWidth, current: defaultCurrent });
    }, [baseParams.angle]);

    const { z, perspective, tilt, rotate, transition } = baseParams;
    const zDpr = z * dpr;
    const perspectiveDpr = perspective * dpr;
    const childrenToRender = getChildrenToRender();

    return (
        <div
            className="carousel-demo-wrapper"
            onTouchStart={onTouchStart}
            onMouseDown={onTouchStart}
            onTouchMove={onTouchMove}
            onMouseMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseUp={onTouchEnd}
        >
            <div className="carousel-wrapper">
                <div
                    className="carousel"
                    style={{
                        perspective: perspectiveDpr,
                        transform: `translateY(-${tilt}) scale(${(perspectiveDpr - zDpr) / perspectiveDpr})`,
                    }}
                >
                    <div
                        className="carouselContent"
                        style={{
                            transform: `translateY(${tilt}) rotateY(${rotate}deg)`,
                            transition: transition,
                        }}
                    >
                        {childrenToRender}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Carousel3d;