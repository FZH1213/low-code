import type { TagProps, TagType } from 'antd';
import { Tag } from 'antd';
import { List } from 'antd-mobile';

export type ComponentProps = TagProps;
export type ComponentType = TagType;

const FunctionComponent = Tag;

export default FunctionComponent;


export function createTagFunction(tagMap) {
    return (text) => {
        return <Tag color={tagMap[text]['color']}>{tagMap[text]['value']}</Tag>;

    }
}